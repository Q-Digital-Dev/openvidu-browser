import { Event } from './Event';
import { StreamManager } from '../../OpenVidu/StreamManager';
/**
 * Triggered by:
 * - [[streamPlaying]]
 * - [[streamAudioVolumeChange]]
 */
export declare class StreamManagerEvent extends Event {
    /**
     * For `streamAudioVolumeChange` event:
     * - `{newValue: number, oldValue: number}`: new and old audio volume values. These values are between -100 (silence) and 0 (loudest possible volume).
     * They are not exact and depend on how the browser is managing the audio track, but -100 and 0 can be taken as limit values.
     *
     * For `streamPlaying` event undefined
     */
    value: Object | undefined;
    /**
     * @hidden
     */
    constructor(target: StreamManager, type: string, value: Object | undefined);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
