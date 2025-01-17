declare type ConsoleFunction = (...data: any) => void;
export declare class ConsoleLogger {
    /**
     * @hidden
     */
    logger: Console;
    /**
     * @hidden
     */
    log: ConsoleFunction;
    /**
     * @hidden
     */
    info: ConsoleFunction;
    /**
     * @hidden
     */
    debug: ConsoleFunction;
    /**
     * @hidden
     */
    warn: ConsoleFunction;
    /**
     * @hidden
     */
    error: ConsoleFunction;
    constructor(console: Console);
}
export {};
