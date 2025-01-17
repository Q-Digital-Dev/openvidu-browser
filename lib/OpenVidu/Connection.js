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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
var Stream_1 = require("./Stream");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
var ExceptionEvent_1 = require("../OpenViduInternal/Events/ExceptionEvent");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * Represents each one of the user's connection to the session (the local one and other user's connections).
 * Therefore each [[Session]] and [[Stream]] object has an attribute of type Connection
 */
var Connection = /** @class */ (function () {
    /**
     * @hidden
     */
    function Connection(session, connectionOptions) {
        this.session = session;
        /**
         * @hidden
         */
        this.disposed = false;
        var msg = "'Connection' created ";
        if (!!connectionOptions.role) {
            // Connection is local
            this.localOptions = connectionOptions;
            this.connectionId = this.localOptions.id;
            this.creationTime = this.localOptions.createdAt;
            this.data = this.localOptions.metadata;
            this.rpcSessionId = this.localOptions.sessionId;
            this.role = this.localOptions.role;
            this.record = this.localOptions.record;
            msg += '(local)';
        }
        else {
            // Connection is remote
            this.remoteOptions = connectionOptions;
            this.connectionId = this.remoteOptions.id;
            this.creationTime = this.remoteOptions.createdAt;
            if (this.remoteOptions.metadata) {
                this.data = this.remoteOptions.metadata;
            }
            if (this.remoteOptions.streams) {
                this.initRemoteStreams(this.remoteOptions.streams);
            }
            msg += "(remote) with 'connectionId' [" + this.remoteOptions.id + ']';
        }
        logger.info(msg);
    }
    /* Hidden methods */
    /**
     * @hidden
     */
    Connection.prototype.sendIceCandidate = function (candidate) {
        var _this = this;
        logger.debug((!!this.stream.outboundStreamOpts ? 'Local' : 'Remote') + 'candidate for' +
            this.connectionId, candidate);
        this.session.openvidu.sendRequest('onIceCandidate', {
            endpointName: this.connectionId,
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
        }, function (error, response) {
            if (error) {
                logger.error('Error sending ICE candidate: ' + JSON.stringify(error));
                _this.session.emitEvent('exception', [new ExceptionEvent_1.ExceptionEvent(_this.session, ExceptionEvent_1.ExceptionEventName.ICE_CANDIDATE_ERROR, _this.session, "There was an unexpected error on the server-side processing an ICE candidate generated and sent by the client-side", error)]);
            }
        });
    };
    /**
     * @hidden
     */
    Connection.prototype.initRemoteStreams = function (options) {
        var _this = this;
        // This is ready for supporting multiple streams per Connection object. Right now the loop will always run just once
        // this.stream should also be replaced by a collection of streams to support multiple streams per Connection
        options.forEach(function (opts) {
            var streamOptions = {
                id: opts.id,
                createdAt: opts.createdAt,
                connection: _this,
                hasAudio: opts.hasAudio,
                hasVideo: opts.hasVideo,
                audioActive: opts.audioActive,
                videoActive: opts.videoActive,
                typeOfVideo: opts.typeOfVideo,
                frameRate: opts.frameRate,
                videoDimensions: !!opts.videoDimensions ? JSON.parse(opts.videoDimensions) : undefined,
                filter: !!opts.filter ? opts.filter : undefined
            };
            var stream = new Stream_1.Stream(_this.session, streamOptions);
            _this.addStream(stream);
        });
        logger.info("Remote 'Connection' with 'connectionId' [" + this.connectionId + '] is now configured for receiving Streams with options: ', this.stream.inboundStreamOpts);
    };
    /**
     * @hidden
     */
    Connection.prototype.addStream = function (stream) {
        stream.connection = this;
        this.stream = stream;
    };
    /**
     * @hidden
     */
    Connection.prototype.removeStream = function (streamId) {
        delete this.stream;
    };
    /**
     * @hidden
     */
    Connection.prototype.dispose = function () {
        if (!!this.stream) {
            delete this.stream;
        }
        this.disposed = true;
    };
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map