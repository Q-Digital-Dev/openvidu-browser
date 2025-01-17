"use strict";
var OpenViduLogger = require('../../../../Logger/OpenViduLogger').OpenViduLogger;
var Logger = OpenViduLogger.getInstance();
var MAX_RETRIES = 10;
var RETRY_TIME_MS = 3000;
var CONNECTING = 0;
var OPEN = 1;
var CLOSING = 2;
var CLOSED = 3;
function WebSocketWithReconnection(config) {
    var reconnectionTimeout = undefined;
    var closing = false;
    var registerMessageHandler;
    var wsUri = config.uri;
    var reconnecting = false;
    var ws = new WebSocket(wsUri);
    ws.onopen = function () {
        Logger.debug("WebSocket connected to " + wsUri);
        if (config.onconnected) {
            config.onconnected();
        }
    };
    ws.onerror = function (error) {
        Logger.error("Could not connect to " + wsUri + " (invoking onerror if defined)", error);
        if (config.onerror) {
            config.onerror(error);
        }
    };
    var reconnectionOnClose = function () {
        if (ws.readyState === CLOSED) {
            if (closing) {
                Logger.debug("Connection closed by user");
            }
            else {
                if (config.ismasternodecrashed()) {
                    Logger.error("Master Node has crashed. Stopping reconnection process");
                }
                else {
                    Logger.debug("Connection closed unexpectedly. Reconnecting...");
                    reconnect(MAX_RETRIES, 1);
                }
            }
        }
        else {
            Logger.debug("Close callback from previous websocket. Ignoring it");
        }
    };
    ws.onclose = reconnectionOnClose;
    function reconnect(maxRetries, numRetries) {
        Logger.debug("reconnect (attempt #" + numRetries + ", max=" + maxRetries + ")");
        if (numRetries === 1) {
            if (reconnecting) {
                Logger.warn("Trying to reconnect when already reconnecting... Ignoring this reconnection.");
                return;
            }
            else {
                reconnecting = true;
            }
            if (config.onreconnecting) {
                config.onreconnecting();
            }
        }
        reconnectAux(maxRetries, numRetries);
    }
    function addReconnectionQueryParamsIfMissing(uriString) {
        var searchParams = new URLSearchParams((new URL(uriString)).search);
        if (!searchParams.has("reconnect")) {
            uriString = (Array.from(searchParams).length > 0) ? (uriString + '&reconnect=true') : (uriString + '?reconnect=true');
        }
        return uriString;
    }
    function reconnectAux(maxRetries, numRetries) {
        Logger.debug("Reconnection attempt #" + numRetries);
        ws.close(4104, 'Connection closed for reconnection');
        wsUri = addReconnectionQueryParamsIfMissing(wsUri);
        ws = new WebSocket(wsUri);
        ws.onopen = function () {
            Logger.debug("Reconnected to " + wsUri + " after " + numRetries + " attempts...");
            reconnecting = false;
            registerMessageHandler();
            if (config.onreconnected()) {
                config.onreconnected();
            }
            ws.onclose = reconnectionOnClose;
        };
        ws.onerror = function (error) {
            Logger.warn("Reconnection error: ", error);
            if (numRetries === maxRetries) {
                if (config.ondisconnect) {
                    config.ondisconnect();
                }
            }
            else {
                reconnectionTimeout = setTimeout(function () {
                    reconnect(maxRetries, numRetries + 1);
                }, RETRY_TIME_MS);
            }
        };
    }
    this.close = function (code, reason) {
        closing = true;
        clearTimeout(reconnectionTimeout);
        ws.close(code, reason);
    };
    this.reconnectWs = function () {
        Logger.debug("reconnectWs");
        reconnect(MAX_RETRIES, 1);
    };
    this.send = function (message) {
        ws.send(message);
    };
    this.addEventListener = function (type, callback) {
        registerMessageHandler = function () {
            ws.addEventListener(type, callback);
        };
        registerMessageHandler();
    };
    this.getReadyState = function () {
        return ws.readyState;
    };
}
module.exports = WebSocketWithReconnection;
//# sourceMappingURL=webSocketWithReconnection.js.map