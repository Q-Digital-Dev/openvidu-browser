import { OpenVidu } from "../../OpenVidu/OpenVidu";
export declare class OpenViduLogger {
    private static instance;
    private JSNLOG_URL;
    private MAX_JSNLOG_BATCH_LOG_MESSAGES;
    private MAX_MSECONDS_BATCH_MESSAGES;
    private MAX_LENGTH_STRING_JSON;
    private defaultConsoleLogger;
    private currentAppender;
    private isProdMode;
    private isJSNLogSetup;
    private loggingSessionId;
    /**
     * @hidden
     */
    static configureJSNLog(openVidu: OpenVidu, token: string): void;
    /**
     * @hidden
     */
    static getInstance(): OpenViduLogger;
    private static isInvalidResponse;
    private canConfigureJSNLog;
    private isOpenViduBrowserLogsDebugActive;
    private getConsoleWithJSNLog;
    private replaceWindowConsole;
    private disableLogger;
    /**
     * @hidden
     */
    log(...args: any[]): void;
    /**
     * @hidden
     */
    debug(...args: any[]): void;
    /**
     * @hidden
     */
    info(...args: any[]): void;
    /**
     * @hidden
     */
    warn(...args: any[]): void;
    /**
     * @hidden
     */
    error(...args: any[]): void;
    /**
     * @hidden
     */
    flush(): void;
    enableProdMode(): void;
}
