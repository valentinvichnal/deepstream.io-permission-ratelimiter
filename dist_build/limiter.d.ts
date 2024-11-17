import { DeepstreamServices, DeepstreamPermission, PermissionCallback, SocketWrapper, ValveConfig, DeepstreamConfig } from '@deepstream/types';
import { Message } from '@deepstream/protobuf/dist/types/messages';
import { ConfigPermission } from '@deepstream/server/dist/src/services/permission/valve/config-permission.js';
export default class RateLimiter extends ConfigPermission implements DeepstreamPermission {
    private optionsLimiter;
    private servicesLimiter;
    private configLimiter;
    description: string;
    private log;
    constructor(optionsLimiter: ValveConfig, servicesLimiter: Readonly<DeepstreamServices>, configLimiter: Readonly<DeepstreamConfig>);
    init(): void;
    whenReady(): Promise<void>;
    close(): Promise<void>;
    setRecordHandler(recordHandler: any): void;
    canPerformAction(socketWrapper: SocketWrapper, message: Message, callback: PermissionCallback, passItOn: any): void;
}
