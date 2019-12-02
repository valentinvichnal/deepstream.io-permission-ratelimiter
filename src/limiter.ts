import { DeepstreamServices, DeepstreamPermission, PermissionCallback, SocketWrapper, ValveConfig, DeepstreamConfig } from '@deepstream/types'
import { Message } from '@deepstream/protobuf/dist/types/messages';
import { ConfigPermission } from '@deepstream/server/dist/src/services/permission/valve/config-permission.js';
//import { EVENT } from '@deepstream/types'
//import { JSONObject } from '@deepstream/protobuf/dist/types/all';


export default class RateLimiter extends ConfigPermission implements DeepstreamPermission {
  public description = 'Valve Permission with Rate Limiter';
  //private logger = this.services.logger.getNameSpace('RATE_LIMITER')

  constructor(private optionsLimiter: ValveConfig, private servicesLimiter: Readonly<DeepstreamServices>, private configLimiter: Readonly<DeepstreamConfig>) {
    super(optionsLimiter, servicesLimiter, configLimiter)
    //this.logger.error('debug', 'constructor')
  }


  canPerformAction(socketWrapper: SocketWrapper, message: Message, callback: PermissionCallback, passItOn: any): void {
    //this.logger.error('canPerformAction', socketWrapper.userId)

    if (message.name) {
      callback(socketWrapper, message, passItOn, null, true)
      return
    }

    callback(socketWrapper, message, passItOn, "Error", false)
  }
}
