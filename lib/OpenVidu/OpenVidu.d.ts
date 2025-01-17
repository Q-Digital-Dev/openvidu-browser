import { LocalRecorder } from './LocalRecorder';
import { Publisher } from './Publisher';
import { Session } from './Session';
import { Stream } from './Stream';
import { Device } from '../OpenViduInternal/Interfaces/Public/Device';
import { OpenViduAdvancedConfiguration } from '../OpenViduInternal/Interfaces/Public/OpenViduAdvancedConfiguration';
import { PublisherProperties } from '../OpenViduInternal/Interfaces/Public/PublisherProperties';
import { CustomMediaStreamConstraints } from '../OpenViduInternal/Interfaces/Private/CustomMediaStreamConstraints';
import { OpenViduError } from '../OpenViduInternal/Enums/OpenViduError';
import { OpenViduLoggerConfiguration } from "../OpenViduInternal/Logger/OpenViduLoggerConfiguration";
/**
 * @hidden
 */
import EventEmitter = require('wolfy87-eventemitter');
/**
 * Entrypoint of OpenVidu Browser library.
 * Use it to initialize objects of type [[Session]], [[Publisher]] and [[LocalRecorder]]
 */
export declare class OpenVidu {
    private jsonRpcClient;
    private masterNodeHasCrashed;
    /**
     * @hidden
     */
    session: Session;
    /**
     * @hidden
     */
    publishers: Publisher[];
    /**
     * @hidden
     */
    wsUri: string;
    /**
     * @hidden
     */
    httpUri: string;
    /**
     * @hidden
     */
    secret: string;
    /**
     * @hidden
     */
    recorder: boolean;
    /**
     * @hidden
     */
    iceServers: RTCIceServer[];
    /**
     * @hidden
     */
    role: string;
    /**
     * @hidden
     */
    finalUserId: string;
    /**
     * @hidden
     */
    mediaServer: string;
    /**
     * @hidden
     */
    videoSimulcast: boolean;
    /**
     * @hidden
     */
    life: number;
    /**
     * @hidden
     */
    advancedConfiguration: OpenViduAdvancedConfiguration;
    /**
     * @hidden
     */
    webrtcStatsInterval: number;
    /**
     * @hidden
     */
    sendBrowserLogs: OpenViduLoggerConfiguration;
    /**
     * @hidden
     */
    isAtLeastPro: boolean;
    /**
     * @hidden
     */
    isEnterprise: boolean;
    /**
     * @hidden
     */
    libraryVersion: string;
    /**
     * @hidden
     */
    ee: EventEmitter;
    constructor();
    /**
     * Returns new session
     */
    initSession(): Session;
    initPublisher(targetElement: string | HTMLElement): Publisher;
    initPublisher(targetElement: string | HTMLElement, properties: PublisherProperties): Publisher;
    initPublisher(targetElement: string | HTMLElement, completionHandler: (error: Error | undefined) => void): Publisher;
    initPublisher(targetElement: string | HTMLElement, properties: PublisherProperties, completionHandler: (error: Error | undefined) => void): Publisher;
    /**
     * Promisified version of [[OpenVidu.initPublisher]]
     *
     * > WARNING: events `accessDialogOpened` and `accessDialogClosed` will not be dispatched if using this method instead of [[OpenVidu.initPublisher]]
     */
    initPublisherAsync(targetElement: string | HTMLElement): Promise<Publisher>;
    initPublisherAsync(targetElement: string | HTMLElement, properties: PublisherProperties): Promise<Publisher>;
    /**
     * Returns a new local recorder for recording streams straight away from the browser
     * @param stream  Stream to record
     */
    initLocalRecorder(stream: Stream): LocalRecorder;
    /**
     * Checks if the browser supports OpenVidu
     * @returns 1 if the browser supports OpenVidu, 0 otherwise
     */
    checkSystemRequirements(): number;
    /**
     * Checks if the browser supports screen-sharing. Desktop Chrome, Firefox and Opera support screen-sharing
     * @returns 1 if the browser supports screen-sharing, 0 otherwise
     */
    checkScreenSharingCapabilities(): boolean;
    /**
     * Collects information about the media input devices available on the system. You can pass property `deviceId` of a [[Device]] object as value of `audioSource` or `videoSource` properties in [[initPublisher]] method
     */
    getDevices(): Promise<Device[]>;
    /**
     * Get a MediaStream object that you can customize before calling [[initPublisher]] (pass _MediaStreamTrack_ property of the _MediaStream_ value resolved by the Promise as `audioSource` or `videoSource` properties in [[initPublisher]])
     *
     * Parameter `options` is the same as in [[initPublisher]] second parameter (of type [[PublisherProperties]]), but only the following properties will be applied: `audioSource`, `videoSource`, `frameRate`, `resolution`
     *
     * To customize the Publisher's video, the API for HTMLCanvasElement is very useful. For example, to get a black-and-white video at 10 fps and HD resolution with no sound:
     * ```
     * var OV = new OpenVidu();
     * var FRAME_RATE = 10;
     *
     * OV.getUserMedia({
     *    audioSource: false,
     *    videoSource: undefined,
     *    resolution: '1280x720',
     *    frameRate: FRAME_RATE
     * })
     * .then(mediaStream => {
     *
     *    var videoTrack = mediaStream.getVideoTracks()[0];
     *    var video = document.createElement('video');
     *    video.srcObject = new MediaStream([videoTrack]);
     *
     *    var canvas = document.createElement('canvas');
     *    var ctx = canvas.getContext('2d');
     *    ctx.filter = 'grayscale(100%)';
     *
     *    video.addEventListener('play', () => {
     *      var loop = () => {
     *        if (!video.paused && !video.ended) {
     *          ctx.drawImage(video, 0, 0, 300, 170);
     *          setTimeout(loop, 1000/ FRAME_RATE); // Drawing at 10 fps
     *        }
     *      };
     *      loop();
     *    });
     *    video.play();
     *
     *    var grayVideoTrack = canvas.captureStream(FRAME_RATE).getVideoTracks()[0];
     *    var publisher = this.OV.initPublisher(
     *      myHtmlTarget,
     *      {
     *        audioSource: false,
     *        videoSource: grayVideoTrack
     *      });
     * });
     * ```
     */
    getUserMedia(options: PublisherProperties): Promise<MediaStream>;
    /**
     * Disable all logging except error level
     */
    enableProdMode(): void;
    /**
     * Set OpenVidu advanced configuration options. `configuration` is an object of type [[OpenViduAdvancedConfiguration]]. Call this method to override previous values at any moment.
     */
    setAdvancedConfiguration(configuration: OpenViduAdvancedConfiguration): void;
    /**
     * @hidden
     */
    onOrientationChanged(handler: any): void;
    /**
     * @hidden
     */
    sendNewVideoDimensionsIfRequired(publisher: Publisher, reason: string, WAIT_INTERVAL: number, MAX_ATTEMPTS: number): void;
    /**
     * @hidden
     */
    sendVideoDimensionsChangedEvent(publisher: Publisher, reason: string, oldWidth: number, oldHeight: number, newWidth: number, newHeight: number): void;
    /**
     * @hidden
     */
    generateMediaConstraints(publisherProperties: PublisherProperties): Promise<CustomMediaStreamConstraints>;
    /**
     * @hidden
     */
    startWs(onConnectSucces: (error: Error) => void): void;
    /**
     * @hidden
     */
    onMasterNodeCrashedNotification(response: any): void;
    /**
     * @hidden
     */
    getWsReadyState(): number;
    /**
     * @hidden
     */
    closeWs(): void;
    /**
     * @hidden
     */
    sendRequest(method: string, params: any, callback?: any): void;
    /**
     * @hidden
     */
    getWsUri(): string;
    /**
     * @hidden
     */
    getSecret(): string;
    /**
     * @hidden
     */
    getRecorder(): boolean;
    /**
     * @hidden
     */
    generateAudioDeviceError(error: any, constraints: MediaStreamConstraints): OpenViduError;
    /**
     * @hidden
     */
    addAlreadyProvidedTracks(myConstraints: CustomMediaStreamConstraints, mediaStream: MediaStream, stream?: Stream): MediaStream;
    /**
     * @hidden
     */
    protected configureDeviceIdOrScreensharing(myConstraints: CustomMediaStreamConstraints, publisherProperties: PublisherProperties, resolve: any, reject: any): any;
    /**
     * @hidden
     */
    protected setVideoSource(myConstraints: CustomMediaStreamConstraints, videoSource: string): void;
    private disconnectCallback;
    private reconnectingCallback;
    private reconnectWebsocketThroughRpcConnectMethod;
    private reconnectedCallback;
    private isMasterNodeCrashed;
    private isRoomAvailable;
    private isScreenShare;
}
