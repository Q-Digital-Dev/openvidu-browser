"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenViduLogger = void 0;
var jsnlog_1 = require("jsnlog");
var ConsoleLogger_1 = require("./ConsoleLogger");
var OpenViduLoggerConfiguration_1 = require("./OpenViduLoggerConfiguration");
var OpenViduLogger = /** @class */ (function () {
    function OpenViduLogger() {
        this.JSNLOG_URL = "/openvidu/elk/openvidu-browser-logs";
        this.MAX_JSNLOG_BATCH_LOG_MESSAGES = 100;
        this.MAX_MSECONDS_BATCH_MESSAGES = 5000;
        this.MAX_LENGTH_STRING_JSON = 1000;
        this.defaultConsoleLogger = new ConsoleLogger_1.ConsoleLogger(window.console);
        this.isProdMode = false;
        this.isJSNLogSetup = false;
    }
    /**
     * @hidden
     */
    OpenViduLogger.configureJSNLog = function (openVidu, token) {
        var _this = this;
        try {
            // If dev mode or...
            if ((window['LOG_JSNLOG_RESULTS']) ||
                // If instance is created and it is OpenVidu Pro
                (this.instance && openVidu.isAtLeastPro
                    // If logs are enabled
                    && this.instance.isOpenViduBrowserLogsDebugActive(openVidu)
                    // Only reconfigure it if session or finalUserId has changed
                    && this.instance.canConfigureJSNLog(openVidu, this.instance))) {
                // Check if app logs can be sent
                // and replace console.log function to send
                // logs of the application
                if (openVidu.sendBrowserLogs === OpenViduLoggerConfiguration_1.OpenViduLoggerConfiguration.debug_app) {
                    this.instance.replaceWindowConsole();
                }
                // isJSNLogSetup will not be true until completed setup
                this.instance.isJSNLogSetup = false;
                this.instance.info("Configuring JSNLogs.");
                var finalUserId_1 = openVidu.finalUserId;
                var sessionId_1 = openVidu.session.sessionId;
                var beforeSendCallback = function (xhr) {
                    // If 401 or 403 or 404 modify ready and status so JSNLog don't retry to send logs
                    // https://github.com/mperdeck/jsnlog.js/blob/v2.30.0/jsnlog.ts#L805-L818
                    var parentReadyStateFunction = xhr.onreadystatechange;
                    xhr.onreadystatechange = function () {
                        if (_this.isInvalidResponse(xhr)) {
                            Object.defineProperty(xhr, "readyState", { value: 4 });
                            Object.defineProperty(xhr, "status", { value: 200 });
                            // Disable JSNLog too to not send periodically errors
                            _this.instance.disableLogger();
                        }
                        parentReadyStateFunction();
                    };
                    // Headers to identify and authenticate logs
                    xhr.setRequestHeader('Authorization', "Basic " + btoa("".concat(finalUserId_1, "%/%").concat(sessionId_1) + ":" + token));
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    // Additional headers for OpenVidu
                    xhr.setRequestHeader('OV-Final-User-Id', finalUserId_1);
                    xhr.setRequestHeader('OV-Session-Id', sessionId_1);
                    xhr.setRequestHeader('OV-Token', token);
                };
                // Creation of the appender.
                this.instance.currentAppender = jsnlog_1.JL.createAjaxAppender("appender-".concat(finalUserId_1, "-").concat(sessionId_1));
                this.instance.currentAppender.setOptions({
                    beforeSend: beforeSendCallback,
                    maxBatchSize: 1000,
                    batchSize: this.instance.MAX_JSNLOG_BATCH_LOG_MESSAGES,
                    batchTimeout: this.instance.MAX_MSECONDS_BATCH_MESSAGES
                });
                // Avoid circular dependencies
                var logSerializer = function (obj) {
                    var getCircularReplacer = function () {
                        var seen = new WeakSet();
                        return function (key, value) {
                            if (typeof value === "object" && value != null) {
                                if (seen.has(value) || (HTMLElement && value instanceof HTMLElement)) {
                                    return;
                                }
                                seen.add(value);
                            }
                            return value;
                        };
                    };
                    // Cut long messages
                    var stringifyJson = JSON.stringify(obj, getCircularReplacer());
                    if (stringifyJson.length > _this.instance.MAX_LENGTH_STRING_JSON) {
                        stringifyJson = "".concat(stringifyJson.substring(0, _this.instance.MAX_LENGTH_STRING_JSON), "...");
                    }
                    if (window['LOG_JSNLOG_RESULTS']) {
                        console.log(stringifyJson);
                    }
                    return stringifyJson;
                };
                // Initialize JL to send logs
                jsnlog_1.JL.setOptions({
                    defaultAjaxUrl: openVidu.httpUri + this.instance.JSNLOG_URL,
                    serialize: logSerializer,
                    enabled: true
                });
                (0, jsnlog_1.JL)().setOptions({
                    appenders: [this.instance.currentAppender]
                });
                this.instance.isJSNLogSetup = true;
                this.instance.loggingSessionId = sessionId_1;
                this.instance.info("JSNLog configured.");
            }
        }
        catch (e) {
            // Print error
            console.error("Error configuring JSNLog: ");
            console.error(e);
            // Restore defaults values just in case any exception happen-
            this.instance.disableLogger();
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.getInstance = function () {
        if (!OpenViduLogger.instance) {
            OpenViduLogger.instance = new OpenViduLogger();
        }
        return OpenViduLogger.instance;
    };
    OpenViduLogger.isInvalidResponse = function (xhr) {
        return xhr.status == 401 || xhr.status == 403 || xhr.status == 404 || xhr.status == 0;
    };
    OpenViduLogger.prototype.canConfigureJSNLog = function (openVidu, logger) {
        return openVidu.session.sessionId != logger.loggingSessionId;
    };
    OpenViduLogger.prototype.isOpenViduBrowserLogsDebugActive = function (openVidu) {
        return openVidu.sendBrowserLogs === OpenViduLoggerConfiguration_1.OpenViduLoggerConfiguration.debug ||
            openVidu.sendBrowserLogs === OpenViduLoggerConfiguration_1.OpenViduLoggerConfiguration.debug_app;
    };
    // Return console functions with jsnlog integration
    OpenViduLogger.prototype.getConsoleWithJSNLog = function () {
        return function (openViduLogger) {
            return {
                log: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    openViduLogger.defaultConsoleLogger.log.apply(openViduLogger.defaultConsoleLogger.logger, arguments);
                    if (openViduLogger.isJSNLogSetup) {
                        (0, jsnlog_1.JL)().info(arguments);
                    }
                },
                info: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    openViduLogger.defaultConsoleLogger.info.apply(openViduLogger.defaultConsoleLogger.logger, arguments);
                    if (openViduLogger.isJSNLogSetup) {
                        (0, jsnlog_1.JL)().info(arguments);
                    }
                },
                debug: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    openViduLogger.defaultConsoleLogger.debug.apply(openViduLogger.defaultConsoleLogger.logger, arguments);
                },
                warn: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    openViduLogger.defaultConsoleLogger.warn.apply(openViduLogger.defaultConsoleLogger.logger, arguments);
                    if (openViduLogger.isJSNLogSetup) {
                        (0, jsnlog_1.JL)().warn(arguments);
                    }
                },
                error: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    openViduLogger.defaultConsoleLogger.error.apply(openViduLogger.defaultConsoleLogger.logger, arguments);
                    if (openViduLogger.isJSNLogSetup) {
                        (0, jsnlog_1.JL)().error(arguments);
                    }
                }
            };
        }(this);
    };
    OpenViduLogger.prototype.replaceWindowConsole = function () {
        window.console = this.defaultConsoleLogger.logger;
        window.console.log = this.getConsoleWithJSNLog().log;
        window.console.info = this.getConsoleWithJSNLog().info;
        window.console.debug = this.getConsoleWithJSNLog().debug;
        window.console.warn = this.getConsoleWithJSNLog().warn;
        window.console.error = this.getConsoleWithJSNLog().error;
    };
    OpenViduLogger.prototype.disableLogger = function () {
        jsnlog_1.JL.setOptions({ enabled: false });
        this.isJSNLogSetup = false;
        this.loggingSessionId = undefined;
        this.currentAppender = undefined;
        window.console = this.defaultConsoleLogger.logger;
        window.console.log = this.defaultConsoleLogger.log;
        window.console.info = this.defaultConsoleLogger.info;
        window.console.debug = this.defaultConsoleLogger.debug;
        window.console.warn = this.defaultConsoleLogger.warn;
        window.console.error = this.defaultConsoleLogger.error;
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.defaultConsoleLogger.log.apply(this.defaultConsoleLogger.logger, arguments);
        }
        if (this.isJSNLogSetup) {
            (0, jsnlog_1.JL)().info(arguments);
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.defaultConsoleLogger.debug.apply(this.defaultConsoleLogger.logger, arguments);
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.defaultConsoleLogger.info.apply(this.defaultConsoleLogger.logger, arguments);
        }
        if (this.isJSNLogSetup) {
            (0, jsnlog_1.JL)().info(arguments);
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.defaultConsoleLogger.warn.apply(this.defaultConsoleLogger.logger, arguments);
        if (this.isJSNLogSetup) {
            (0, jsnlog_1.JL)().warn(arguments);
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.defaultConsoleLogger.error.apply(this.defaultConsoleLogger.logger, arguments);
        if (this.isJSNLogSetup) {
            (0, jsnlog_1.JL)().error(arguments);
        }
    };
    /**
     * @hidden
     */
    OpenViduLogger.prototype.flush = function () {
        if (this.isJSNLogSetup && this.currentAppender != null) {
            this.currentAppender.sendBatch();
        }
    };
    OpenViduLogger.prototype.enableProdMode = function () {
        this.isProdMode = true;
    };
    return OpenViduLogger;
}());
exports.OpenViduLogger = OpenViduLogger;
//# sourceMappingURL=OpenViduLogger.js.map