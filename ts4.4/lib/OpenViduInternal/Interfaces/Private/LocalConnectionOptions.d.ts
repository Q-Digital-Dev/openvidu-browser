import { RemoteConnectionOptions } from './RemoteConnectionOptions';
import { IceServerProperties } from './IceServerProperties';
export interface LocalConnectionOptions {
    id: string;
    finalUserId: string;
    createdAt: number;
    metadata: string;
    value: RemoteConnectionOptions[];
    session: string;
    sessionId: string;
    role: string;
    record: boolean;
    coturnIp: string;
    coturnPort: number;
    turnUsername: string;
    turnCredential: string;
    version: string;
    mediaServer: string;
    videoSimulcast: boolean;
    life: number;
    customIceServers?: IceServerProperties[];
}
