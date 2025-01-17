"use strict";
/*
 * (C) Copyright 2017-2022 OpenVidu (https://openvidu.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionDisconnectedEvent = void 0;
var Event_1 = require("./Event");
var OpenViduLogger_1 = require("../Logger/OpenViduLogger");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * Triggered by [[sessionDisconnected]]
 */
var SessionDisconnectedEvent = /** @class */ (function (_super) {
    __extends(SessionDisconnectedEvent, _super);
    /**
     * @hidden
     */
    function SessionDisconnectedEvent(target, reason) {
        var _this = _super.call(this, true, target, 'sessionDisconnected') || this;
        _this.reason = reason;
        return _this;
    }
    /**
     * @hidden
     */
    SessionDisconnectedEvent.prototype.callDefaultBehavior = function () {
        logger.info("Calling default behavior upon '" + this.type + "' event dispatched by 'Session'");
        var session = this.target;
        // Dispose and delete all remote Connections
        session.remoteConnections.forEach(function (remoteConnection) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var connectionId = remoteConnection.connectionId;
            if (!!((_a = session.remoteConnections.get(connectionId)) === null || _a === void 0 ? void 0 : _a.stream)) {
                (_b = session.remoteConnections.get(connectionId)) === null || _b === void 0 ? void 0 : _b.stream.disposeWebRtcPeer();
                (_c = session.remoteConnections.get(connectionId)) === null || _c === void 0 ? void 0 : _c.stream.disposeMediaStream();
                if ((_d = session.remoteConnections.get(connectionId)) === null || _d === void 0 ? void 0 : _d.stream.streamManager) {
                    (_e = session.remoteConnections.get(connectionId)) === null || _e === void 0 ? void 0 : _e.stream.streamManager.removeAllVideos();
                }
                var streamId = (_g = (_f = session.remoteConnections.get(connectionId)) === null || _f === void 0 ? void 0 : _f.stream) === null || _g === void 0 ? void 0 : _g.streamId;
                if (!!streamId) {
                    session.remoteStreamsCreated.delete(streamId);
                }
                (_h = session.remoteConnections.get(connectionId)) === null || _h === void 0 ? void 0 : _h.dispose();
            }
            session.remoteConnections.delete(connectionId);
        });
    };
    return SessionDisconnectedEvent;
}(Event_1.Event));
exports.SessionDisconnectedEvent = SessionDisconnectedEvent;
//# sourceMappingURL=SessionDisconnectedEvent.js.map