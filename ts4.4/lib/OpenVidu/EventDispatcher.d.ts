import { Event as Event } from '../OpenViduInternal/Events/Event';
import { EventMap } from '../OpenViduInternal/Events/EventMap/EventMap';
import EventEmitter = require('wolfy87-eventemitter');
export declare abstract class EventDispatcher {
    /**
     * @hidden
     */
    userHandlerArrowHandler: WeakMap<(event: Event) => void, (event: Event) => void>;
    /**
     * @hidden
     */
    ee: EventEmitter;
    /**
     * Adds function `handler` to handle event `type`
     *
     * @returns The EventDispatcher object
     */
    abstract on<K extends keyof (EventMap)>(type: K, handler: (event: (EventMap)[K]) => void): this;
    /**
     * Adds function `handler` to handle event `type` just once. The handler will be automatically removed after first execution
     *
     * @returns The object that dispatched the event
     */
    abstract once<K extends keyof (EventMap)>(type: K, handler: (event: (EventMap)[K]) => void): this;
    /**
     * Removes a `handler` from event `type`. If no handler is provided, all handlers will be removed from the event
     *
     * @returns The object that dispatched the event
     */
    abstract off<K extends keyof (EventMap)>(type: K, handler?: (event: (EventMap)[K]) => void): this;
    /**
     * @hidden
     */
    onAux(type: string, message: string, handler: (event: Event) => void): EventDispatcher;
    /**
     * @hidden
     */
    onceAux(type: string, message: string, handler: (event: Event) => void): EventDispatcher;
    /**
     * @hidden
     */
    offAux(type: string, handler?: (event: Event) => void): EventDispatcher;
}
