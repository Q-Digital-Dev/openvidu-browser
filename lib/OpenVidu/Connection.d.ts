import { Session } from './Session';
import { Stream } from './Stream';
import { LocalConnectionOptions } from '../OpenViduInternal/Interfaces/Private/LocalConnectionOptions';
import { RemoteConnectionOptions } from '../OpenViduInternal/Interfaces/Private/RemoteConnectionOptions';
import { StreamOptionsServer } from '../OpenViduInternal/Interfaces/Private/StreamOptionsServer';
/**
 * Represents each one of the user's connection to the session (the local one and other user's connections).
 * Therefore each [[Session]] and [[Stream]] object has an attribute of type Connection
 */
export declare class Connection {
    private session;
    /**
     * Unique identifier of the connection
     */
    connectionId: string;
    /**
     * Time when this connection was created in OpenVidu Server (UTC milliseconds)
     */
    creationTime: number;
    /**
     * Data associated to this connection (and therefore to certain user). This is an important field:
     * it allows you to broadcast all the information you want for each user (a username, for example)
     */
    data: string;
    /**
     * Role of the connection.
     * - `SUBSCRIBER`: can subscribe to published Streams of other users by calling [[Session.subscribe]]
     * - `PUBLISHER`: SUBSCRIBER permissions + can publish their own Streams by calling [[Session.publish]]
     * - `MODERATOR`: SUBSCRIBER + PUBLISHER permissions + can force the unpublishing or disconnection over a third-party Stream or Connection by call [[Session.forceUnpublish]] and [[Session.forceDisconnect]]
     *
     * **Only defined for the local connection. In remote connections will be `undefined`**
     */
    role: string;
    /**
     * Whether the streams published by this Connection will be recorded or not. This only affects [INDIVIDUAL recording](/en/stable/advanced-features/recording/#individual-recording-selection) <a href="https://docs.openvidu.io/en/stable/openvidu-pro/" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin-right: 5px; border-radius: 3px; font-size: 13px; line-height:21px; font-family: Montserrat, sans-serif">PRO</a>
     *
     * **Only defined for the local connection. In remote connections will be `undefined`**
     */
    record: boolean;
    /**
     * @hidden
     */
    stream?: Stream;
    /**
     * @hidden
     */
    localOptions: LocalConnectionOptions | undefined;
    /**
     * @hidden
     */
    remoteOptions: RemoteConnectionOptions | undefined;
    /**
     * @hidden
     */
    disposed: boolean;
    /**
     * @hidden
     */
    rpcSessionId: string;
    /**
     * @hidden
     */
    constructor(session: Session, connectionOptions: LocalConnectionOptions | RemoteConnectionOptions);
    /**
     * @hidden
     */
    sendIceCandidate(candidate: RTCIceCandidate): void;
    /**
     * @hidden
     */
    initRemoteStreams(options: StreamOptionsServer[]): void;
    /**
     * @hidden
     */
    addStream(stream: Stream): void;
    /**
     * @hidden
     */
    removeStream(streamId: string): void;
    /**
     * @hidden
     */
    dispose(): void;
}
