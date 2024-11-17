"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@deepstream/types");
const config_permission_js_1 = require("@deepstream/server/dist/src/services/permission/valve/config-permission.js");
const general_1 = require("@deepstream/protobuf/dist/types/general");
const rpc_1 = require("@deepstream/protobuf/dist/types/rpc");
//import { JSONObject } from '@deepstream/protobuf/dist/types/all';
// config
const config_1 = require("../config/config");
let limits = { 'temp': 1 };
let cycle;
function isRPCReq(message) {
    return message.topic === general_1.TOPIC.RPC && message.action === rpc_1.RPC_ACTION.REQUEST;
}
class RateLimiter extends config_permission_js_1.ConfigPermission {
    constructor(optionsLimiter, servicesLimiter, configLimiter) {
        super(optionsLimiter, servicesLimiter, configLimiter);
        this.optionsLimiter = optionsLimiter;
        this.servicesLimiter = servicesLimiter;
        this.configLimiter = configLimiter;
        this.description = 'Valve Permission with Rate Limiter';
        this.log = this.servicesLimiter.logger.getNameSpace('RATE_LIMITER');
        this.log.info(types_1.EVENT.INFO, 'started');
    }
    init() {
        this.log.info(types_1.EVENT.INFO, 'initialized');
    }
    async whenReady() {
        // INTERVAL - Limiter setup
        cycle = setInterval(() => {
            this.log.info('LIMITS', JSON.stringify(limits));
            limits = { 'temp': 1 };
        }, config_1.FREQUENCY);
    }
    async close() {
        clearInterval(cycle);
        super.close();
    }
    setRecordHandler(recordHandler) {
        super.setRecordHandler(recordHandler);
    }
    // TODO - Disable limit reached log messages
    canPerformAction(socketWrapper, message, callback, passItOn) {
        // RPC caller's data
        const { userId, serverData } = socketWrapper;
        const userRole = serverData ? serverData.role : '';
        /*
        const userIP = serverData.ip || '';
        */
        // Exlude Servers from the rate limiting
        if (userRole !== 'S') {
            if (isRPCReq(message) && !limits[userId]) {
                limits[userId] = 1;
            }
            else if (isRPCReq(message) && limits[userId]) {
                const cost = config_1.LIMITS[message.name] || config_1.LIMITS.default;
                if ((limits[userId] + cost) > config_1.LIMIT) {
                    //this.log.info('reject', 'limit would have reached')
                    callback(socketWrapper, message, passItOn, "Limit reached", false);
                    return;
                }
                else if (limits[userId] < config_1.LIMIT) {
                    limits[userId] += cost;
                }
                else {
                    //this.log.info('reject', 'limit reached');
                    callback(socketWrapper, message, passItOn, "Limit reached", false);
                    return;
                }
            }
        }
        //callback(socketWrapper, message, passItOn, null, true);
        return super.canPerformAction(socketWrapper, message, callback, passItOn);
    }
}
exports.default = RateLimiter;
//# sourceMappingURL=limiter.js.map