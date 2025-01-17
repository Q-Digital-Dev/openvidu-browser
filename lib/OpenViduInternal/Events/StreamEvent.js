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
exports.StreamEvent = void 0;
var Event_1 = require("./Event");
var Publisher_1 = require("../../OpenVidu/Publisher");
var Session_1 = require("../../OpenVidu/Session");
var OpenViduLogger_1 = require("../Logger/OpenViduLogger");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * Triggered by:
 * - `streamCreated` (available for [Session](/en/stable/api/openvidu-browser/interfaces/SessionEventMap.html#streamCreated) and [Publisher](/en/stable/api/openvidu-browser/interfaces/PublisherEventMap.html#streamCreated) objects)
 * - `streamDestroyed]` (available for [Session](/en/stable/api/openvidu-browser/interfaces/SessionEventMap.html#streamDestroyed) and [Publisher](/en/stable/api/openvidu-browser/interfaces/PublisherEventMap.html#streamDestroyed) objects)
 */
var StreamEvent = /** @class */ (function (_super) {
    __extends(StreamEvent, _super);
    /**
     * @hidden
     */
    function StreamEvent(cancelable, target, type, stream, reason) {
        var _this = _super.call(this, cancelable, target, type) || this;
        _this.stream = stream;
        _this.reason = reason;
        return _this;
    }
    /**
     * @hidden
     */
    StreamEvent.prototype.callDefaultBehavior = function () {
        if (this.type === 'streamDestroyed') {
            if (this.target instanceof Session_1.Session) {
                // Remote Stream
                logger.info("Calling default behavior upon '" + this.type + "' event dispatched by 'Session'");
                this.stream.disposeWebRtcPeer();
            }
            else if (this.target instanceof Publisher_1.Publisher) {
                // Local Stream
                logger.info("Calling default behavior upon '" + this.type + "' event dispatched by 'Publisher'");
                clearInterval(this.target.screenShareResizeInterval);
                this.stream.isLocalStreamReadyToPublish = false;
                // Delete Publisher object from OpenVidu publishers array
                var openviduPublishers = this.target.openvidu.publishers;
                for (var i = 0; i < openviduPublishers.length; i++) {
                    if (openviduPublishers[i] === this.target) {
                        openviduPublishers.splice(i, 1);
                        break;
                    }
                }
            }
            // Dispose the MediaStream local object
            this.stream.disposeMediaStream();
            // Remove from DOM all video elements associated to this Stream, if there's a StreamManager defined
            // (method Session.subscribe must have been called)
            if (this.stream.streamManager)
                this.stream.streamManager.removeAllVideos();
            // Delete stream from Session.remoteStreamsCreated map
            this.stream.session.remoteStreamsCreated.delete(this.stream.streamId);
            // Delete StreamOptionsServer from remote Connection
            var remoteConnection = this.stream.session.remoteConnections.get(this.stream.connection.connectionId);
            if (!!remoteConnection && !!remoteConnection.remoteOptions) {
                var streamOptionsServer = remoteConnection.remoteOptions.streams;
                for (var i = streamOptionsServer.length - 1; i >= 0; --i) {
                    if (streamOptionsServer[i].id === this.stream.streamId) {
                        streamOptionsServer.splice(i, 1);
                    }
                }
            }
        }
    };
    return StreamEvent;
}(Event_1.Event));
exports.StreamEvent = StreamEvent;
//# sourceMappingURL=StreamEvent.js.map