import { Event } from './Event';
import { Session } from '../../OpenVidu/Session';
import { Connection } from '../../OpenVidu/Connection';
/**
 * Triggered by [[networkQualityLevelChanged]]
 */
export declare class NetworkQualityLevelChangedEvent extends Event {
    /**
     * New value of the network quality level
     */
    newValue: number;
    /**
     * Old value of the network quality level
     */
    oldValue: number;
    /**
     * Connection for whom the network quality level changed
     */
    connection: Connection;
    /**
     * @hidden
     */
    constructor(target: Session, newValue: number, oldValue: number, connection: Connection);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
