import { Connection } from './Connection';
import { Filter } from './Filter';
import { Session } from './Session';
import { StreamManager } from './StreamManager';
import { InboundStreamOptions } from '../OpenViduInternal/Interfaces/Private/InboundStreamOptions';
import { OutboundStreamOptions } from '../OpenViduInternal/Interfaces/Private/OutboundStreamOptions';
import { WebRtcPeer } from '../OpenViduInternal/WebRtcPeer/WebRtcPeer';
import { TypeOfVideo } from '../OpenViduInternal/Enums/TypeOfVideo';
/**
 * @hidden
 */
import EventEmitter = require('wolfy87-eventemitter');
/**
 * Represents each one of the media streams available in OpenVidu Server for certain session.
 * Each [[Publisher]] and [[Subscriber]] has an attribute of type Stream, as they give access
 * to one of them (sending and receiving it, respectively)
 */
export declare class Stream {
    /**
     * The Connection object that is publishing the stream
     */
    connection: Connection;
    /**
     * Frame rate of the video in frames per second. This property is only defined if the [[Publisher]] of
     * the stream was initialized passing a _frameRate_ property on [[OpenVidu.initPublisher]] method
     */
    frameRate?: number;
    /**
     * Whether the stream has a video track or not
     */
    hasVideo: boolean;
    /**
     * Whether the stream has an audio track or not
     */
    hasAudio: boolean;
    /**
     * Whether the stream has the video track muted or unmuted. If [[hasVideo]] is false, this property is undefined.
     *
     * This property may change if the Publisher publishing the stream calls [[Publisher.publishVideo]]. Whenever this happens a [[StreamPropertyChangedEvent]] will be dispatched
     * by the Session object as well as by the affected Subscriber/Publisher object
     */
    videoActive: boolean;
    /**
     * Whether the stream has the audio track muted or unmuted. If [[hasAudio]] is false, this property is undefined
     *
     * This property may change if the Publisher publishing the stream calls [[Publisher.publishAudio]]. Whenever this happens a [[StreamPropertyChangedEvent]] will be dispatched
     * by the Session object as well as by the affected Subscriber/Publisher object
     */
    audioActive: boolean;
    /**
     * Unique identifier of the stream. If the stream belongs to a...
     * - Subscriber object: property `streamId` is always defined
     * - Publisher object: property `streamId` is only defined after successful execution of [[Session.publish]]
     */
    streamId: string;
    /**
     * Time when this stream was created in OpenVidu Server (UTC milliseconds). Depending on the owner of this stream:
     * - Subscriber object: property `creationTime` is always defined
     * - Publisher object: property `creationTime` is only defined after successful execution of [[Session.publish]]
     */
    creationTime: number;
    /**
     * Can be:
     * - `"CAMERA"`: when the video source comes from a webcam.
     * - `"SCREEN"`: when the video source comes from screen-sharing.
     * - `"CUSTOM"`: when [[PublisherProperties.videoSource]] has been initialized in the Publisher side with a custom MediaStreamTrack when calling [[OpenVidu.initPublisher]]).
     * - `"IPCAM"`: when the video source comes from an IP camera participant instead of a regular participant (see [IP cameras](/en/stable/advanced-features/ip-cameras/)).
     *
     * If [[hasVideo]] is false, this property is undefined
     */
    typeOfVideo?: keyof typeof TypeOfVideo;
    /**
     * StreamManager object ([[Publisher]] or [[Subscriber]]) in charge of displaying this stream in the DOM
     */
    streamManager: StreamManager;
    /**
     * Width and height in pixels of the encoded video stream. If [[hasVideo]] is false, this property is undefined
     *
     * This property may change if the Publisher that is publishing:
     * - If it is a mobile device, whenever the user rotates the device.
     * - If it is screen-sharing, whenever the user changes the size of the captured window.
     *
     * Whenever this happens a [[StreamPropertyChangedEvent]] will be dispatched by the Session object as well as by the affected Subscriber/Publisher object
     */
    videoDimensions: {
        width: number;
        height: number;
    };
    /**
     * **WARNING**: experimental option. This interface may change in the near future
     *
     * Filter applied to the Stream. You can apply filters by calling [[Stream.applyFilter]], execute methods of the applied filter with
     * [[Filter.execMethod]] and remove it with [[Stream.removeFilter]]. Be aware that the client calling this methods must have the
     * necessary permissions: the token owned by the client must have been initialized with the appropriated `allowedFilters` array.
     */
    filter?: Filter;
    protected webRtcPeer: WebRtcPeer;
    protected mediaStream?: MediaStream;
    private webRtcStats;
    private isSubscribeToRemote;
    private virtualBackgroundSourceElements?;
    /**
     * @hidden
     */
    virtualBackgroundSinkElements?: {
        VB: any;
        video: HTMLVideoElement;
    };
    /**
     * @hidden
     */
    isLocalStreamReadyToPublish: boolean;
    /**
     * @hidden
     */
    isLocalStreamPublished: boolean;
    /**
     * @hidden
     */
    publishedOnce: boolean;
    /**
     * @hidden
     */
    session: Session;
    /**
     * @hidden
     */
    inboundStreamOpts: InboundStreamOptions;
    /**
     * @hidden
     */
    outboundStreamOpts: OutboundStreamOptions;
    /**
     * @hidden
     */
    speechEvent: any;
    /**
     * @hidden
     */
    harkSpeakingEnabled: boolean;
    /**
     * @hidden
     */
    harkSpeakingEnabledOnce: boolean;
    /**
     * @hidden
     */
    harkStoppedSpeakingEnabled: boolean;
    /**
     * @hidden
     */
    harkStoppedSpeakingEnabledOnce: boolean;
    /**
     * @hidden
     */
    harkVolumeChangeEnabled: boolean;
    /**
     * @hidden
     */
    harkVolumeChangeEnabledOnce: boolean;
    /**
     * @hidden
     */
    harkOptions: any;
    /**
     * @hidden
     */
    localMediaStreamWhenSubscribedToRemote?: MediaStream;
    /**
     * @hidden
     */
    ee: EventEmitter;
    /**
     * @hidden
     */
    reconnectionEventEmitter: EventEmitter | undefined;
    /**
     * @hidden
     */
    lastVideoTrackConstraints: MediaTrackConstraints | boolean | undefined;
    /**
     * @hidden
     */
    lastVBFilter?: Filter;
    /**
     * @hidden
     */
    constructor(session: Session, options: InboundStreamOptions | OutboundStreamOptions | {});
    /**
     * Recreates the media connection with the server. This entails the disposal of the previous RTCPeerConnection and the re-negotiation
     * of a new one, that will apply the same properties.
     *
     * This method can be useful in those situations were there the media connection breaks and OpenVidu is not able to recover on its own
     * for any kind of unanticipated reason (see [Automatic reconnection](/en/stable/advanced-features/automatic-reconnection/)).
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the reconnection operation was successful and rejected with an Error object if not
     */
    reconnect(): Promise<void>;
    /**
     * Applies an audio/video filter to the stream.
     *
     * @param type Type of filter applied. See [[Filter.type]]
     * @param options Parameters used to initialize the filter. See [[Filter.options]]
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved to the applied filter if success and rejected with an Error object if not
     */
    applyFilter(type: string, options: Object): Promise<Filter>;
    /**
     * Removes an audio/video filter previously applied.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the previously applied filter has been successfully removed and rejected with an Error object in other case
     */
    removeFilter(): Promise<void>;
    /**
     * Returns the internal RTCPeerConnection object associated to this stream (https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)
     *
     * @returns Native RTCPeerConnection Web API object
     */
    getRTCPeerConnection(): RTCPeerConnection;
    /**
     * Returns the internal MediaStream object associated to this stream (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
     *
     * @returns Native MediaStream Web API object
     */
    getMediaStream(): MediaStream;
    /**
     * @hidden
     */
    removeFilterAux(isDisposing: boolean): Promise<void>;
    /**
     * @hidden
     */
    setMediaStream(mediaStream: MediaStream): void;
    /**
     * @hidden
     */
    updateMediaStreamInVideos(): void;
    /**
     * @hidden
     */
    getWebRtcPeer(): WebRtcPeer;
    /**
     * @hidden
     */
    subscribeToMyRemote(value: boolean): void;
    /**
     * @hidden
     */
    setOutboundStreamOptions(outboundStreamOpts: OutboundStreamOptions): void;
    /**
     * @hidden
     */
    subscribe(): Promise<void>;
    /**
     * @hidden
     */
    publish(): Promise<void>;
    /**
     * @hidden
     */
    disposeWebRtcPeer(): void;
    /**
     * @hidden
     */
    disposeMediaStream(): Promise<void>;
    /**
     * @hidden
     */
    displayMyRemote(): boolean;
    /**
     * @hidden
     */
    isSendAudio(): boolean;
    /**
     * @hidden
     */
    isSendVideo(): boolean;
    /**
     * @hidden
     */
    isSendScreen(): boolean;
    /**
     * @hidden
     */
    enableHarkSpeakingEvent(): void;
    /**
     * @hidden
     */
    enableOnceHarkSpeakingEvent(): void;
    /**
     * @hidden
     */
    disableHarkSpeakingEvent(disabledByOnce: boolean): void;
    /**
     * @hidden
     */
    enableHarkStoppedSpeakingEvent(): void;
    /**
     * @hidden
     */
    enableOnceHarkStoppedSpeakingEvent(): void;
    /**
    * @hidden
    */
    disableHarkStoppedSpeakingEvent(disabledByOnce: boolean): void;
    /**
     * @hidden
     */
    enableHarkVolumeChangeEvent(force: boolean): void;
    /**
     * @hidden
     */
    enableOnceHarkVolumeChangeEvent(force: boolean): void;
    /**
     * @hidden
     */
    disableHarkVolumeChangeEvent(disabledByOnce: boolean): void;
    /**
     * @hidden
     */
    isLocal(): boolean;
    /**
     * @hidden
     */
    getSelectedIceCandidate(): Promise<any>;
    /**
     * @hidden
     */
    getRemoteIceCandidateList(): RTCIceCandidate[];
    /**
     * @hidden
     */
    getLocalIceCandidateList(): RTCIceCandidate[];
    /**
     * @hidden
     */
    streamIceConnectionStateBroken(): boolean;
    private setHarkListenerIfNotExists;
    /**
     * @hidden
     */
    setupReconnectionEventEmitter(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void): boolean;
    /**
     * @hidden
     */
    initWebRtcPeerSend(reconnect: boolean): Promise<void>;
    /**
     * @hidden
     */
    finalResolveForSubscription(reconnect: boolean, resolve: (value: void | PromiseLike<void>) => void): void;
    /**
     * @hidden
     */
    finalRejectForSubscription(reconnect: boolean, error: any, reject: (reason?: any) => void): void;
    /**
     * @hidden
     */
    initWebRtcPeerReceive(reconnect: boolean): Promise<void>;
    /**
     * @hidden
     */
    initWebRtcPeerReceiveFromClient(reconnect: boolean): Promise<void>;
    /**
     * @hidden
     */
    initWebRtcPeerReceiveFromServer(reconnect: boolean): Promise<void>;
    /**
     * @hidden
     */
    completeWebRtcPeerReceive(reconnect: boolean, forciblyReconnect: boolean, sdpOfferByServer?: string): Promise<any>;
    /**
     * @hidden
     */
    remotePeerSuccessfullyEstablished(reconnect: boolean): void;
    private initHarkEvents;
    private onIceConnectionStateExceptionHandler;
    private onIceConnectionFailed;
    private onIceConnectionDisconnected;
    private reconnectStreamAndLogResultingIceConnectionState;
    private reconnectStreamAndReturnIceConnectionState;
    private reconnectStream;
    private isWebsocketConnected;
    private awaitWebRtcPeerConnectionState;
    /**
     * @hidden
     */
    initWebRtcStats(): void;
    private stopWebRtcStats;
    private getIceServersConf;
    private gatherStatsForPeer;
    private isReportWanted;
}
