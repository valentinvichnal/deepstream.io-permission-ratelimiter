import { DeepstreamServices, DeepstreamPermission, PermissionCallback, SocketWrapper, ValveConfig, DeepstreamConfig, EVENT } from '@deepstream/types'
import { Message } from '@deepstream/protobuf/dist/types/messages';
import { ConfigPermission } from '@deepstream/server/dist/src/services/permission/valve/config-permission.js';
import { TOPIC } from '@deepstream/protobuf/dist/types/general';
import { RPC_ACTION } from '@deepstream/protobuf/dist/types/rpc';
//import { JSONObject } from '@deepstream/protobuf/dist/types/all';

// config
import { FREQUENCY, LIMIT, LIMITS } from '../config/config';


// interface
interface Limits {
  [key: string]: number;
}


let limits: Limits = { 'temp': 1 };
let cycle: NodeJS.Timeout;


function isRPCReq(message: Message) {
  return message.topic === TOPIC.RPC && message.action === RPC_ACTION.REQUEST;
}


export default class RateLimiter extends ConfigPermission implements DeepstreamPermission {
  public description = 'Valve Permission with Rate Limiter';
  private log = this.servicesLimiter.logger.getNameSpace('RATE_LIMITER')

  constructor(private optionsLimiter: ValveConfig, private servicesLimiter: Readonly<DeepstreamServices>, private configLimiter: Readonly<DeepstreamConfig>) {
    super(optionsLimiter, servicesLimiter, configLimiter)
    this.log.info(EVENT.INFO, 'started')
  }

  init() {
    this.log.info(EVENT.INFO, 'initialized')
  }

  public async whenReady(): Promise<void> {
    // INTERVAL - Limiter setup
    cycle = setInterval(() => {
      this.log.info('LIMITS', JSON.stringify(limits))
      limits = { 'temp': 1 };
    }, FREQUENCY);
  }

  public async close() {
    clearInterval(cycle)

    super.close()
  }

  public setRecordHandler(recordHandler: any): void {
    super.setRecordHandler(recordHandler)
  }

  public canPerformAction(socketWrapper: SocketWrapper, message: Message, callback: PermissionCallback, passItOn: any): void {
    // RPC caller's data
    const userId = socketWrapper.userId;
    const userRole = socketWrapper.serverData ? socketWrapper.serverData.role : '';
    /*
    const userIP = socketWrapper.serverData.ip || '';
    */

    // Exlude Servers from the rate limiting
    if (userRole !== 'S') {

      if (isRPCReq(message) && !limits[userId]) {
        limits[userId] = 1;
      }
      else if (isRPCReq(message) && limits[userId]) {
        const cost = LIMITS[message.name] || LIMITS.default;

        if ((limits[userId] + cost) > LIMIT) {
          //this.log.info('reject', 'limit would have reached')
          callback(socketWrapper, message, passItOn, "Limit reached", false)
          return
        }
        else if (limits[userId] < LIMIT) {
          limits[userId] += cost;
        }
        else {
          //this.log.info('reject', 'limit reached')
          callback(socketWrapper, message, passItOn, "Limit reached", false)
          return
        }
      }

    }

    //callback(socketWrapper, message, passItOn, null, true)
    return super.canPerformAction(socketWrapper, message, callback, passItOn)
  }
}
