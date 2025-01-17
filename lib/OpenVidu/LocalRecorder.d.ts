import { Stream } from './Stream';
import { LocalRecorderState } from '../OpenViduInternal/Enums/LocalRecorderState';
/**
 * Easy recording of [[Stream]] objects straightaway from the browser. Initialized with [[OpenVidu.initLocalRecorder]] method
 */
export declare class LocalRecorder {
    private stream;
    state: LocalRecorderState;
    private connectionId;
    private mediaRecorder;
    private chunks;
    private blob?;
    private id;
    private videoPreviewSrc;
    private videoPreview;
    /**
     * @hidden
     */
    constructor(stream: Stream);
    /**
     * Starts the recording of the Stream. [[state]] property must be `READY`. After method succeeds is set to `RECORDING`
     *
     * @param options The [MediaRecorder.options](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#parameters) to be used to record this Stream.
     * For example:
     *
     * ```javascript
     * var OV = new OpenVidu();
     * var publisher = await OV.initPublisherAsync();
     * var localRecorder = OV.initLocalRecorder(publisher.stream);
     * var options = {
     *      mimeType: 'video/webm;codecs=vp8',
     *      audioBitsPerSecond:128000,
     *      videoBitsPerSecond:2500000
     * };
     * localRecorder.record(options);
     * ```
     *
     * If not specified, the default options preferred by the platform will be used.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the recording successfully started and rejected with an Error object if not
     */
    record(options?: any): Promise<void>;
    /**
     * Ends the recording of the Stream. [[state]] property must be `RECORDING` or `PAUSED`. After method succeeds is set to `FINISHED`
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the recording successfully stopped and rejected with an Error object if not
     */
    stop(): Promise<void>;
    /**
     * Pauses the recording of the Stream. [[state]] property must be `RECORDING`. After method succeeds is set to `PAUSED`
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the recording was successfully paused and rejected with an Error object if not
     */
    pause(): Promise<void>;
    /**
     * Resumes the recording of the Stream. [[state]] property must be `PAUSED`. After method succeeds is set to `RECORDING`
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the recording was successfully resumed and rejected with an Error object if not
     */
    resume(): Promise<void>;
    /**
     * Previews the recording, appending a new HTMLVideoElement to element with id `parentId`. [[state]] property must be `FINISHED`
     */
    preview(parentElement: any): HTMLVideoElement;
    /**
     * Gracefully stops and cleans the current recording (WARNING: it is completely dismissed). Sets [[state]] to `READY` so the recording can start again
     */
    clean(): void;
    /**
     * Downloads the recorded video through the browser. [[state]] property must be `FINISHED`
     */
    download(): void;
    /**
     * Gets the raw Blob file. Methods preview, download, uploadAsBinary and uploadAsMultipartfile use this same file to perform their specific actions. [[state]] property must be `FINISHED`
     */
    getBlob(): Blob;
    /**
     * Uploads the recorded video as a binary file performing an HTTP/POST operation to URL `endpoint`. [[state]] property must be `FINISHED`. Optional HTTP headers can be passed as second parameter. For example:
     * ```
     * var headers = {
     *  "Cookie": "$Version=1; Skin=new;",
     *  "Authorization":"Basic QWxhZGpbjpuIHNlctZQ=="
     * }
     * ```
     * @returns A Promise (to which you can optionally subscribe to) that is resolved with the `http.responseText` from server if the operation was successful and rejected with the failed `http.status` if not
     */
    uploadAsBinary(endpoint: string, headers?: any): Promise<any>;
    /**
     * Uploads the recorded video as a multipart file performing an HTTP/POST operation to URL `endpoint`. [[state]] property must be `FINISHED`. Optional HTTP headers can be passed as second parameter. For example:
     * ```
     * var headers = {
     *  "Cookie": "$Version=1; Skin=new;",
     *  "Authorization":"Basic QWxhZGpbjpuIHNlctZQ=="
     * }
     * ```
     * @returns A Promise (to which you can optionally subscribe to) that is resolved with the `http.responseText` from server if the operation was successful and rejected with the failed `http.status` if not:
     */
    uploadAsMultipartfile(endpoint: string, headers?: any): Promise<any>;
    private onStopDefault;
}
