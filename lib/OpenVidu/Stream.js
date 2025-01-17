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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
var Filter_1 = require("./Filter");
var Subscriber_1 = require("./Subscriber");
var WebRtcPeer_1 = require("../OpenViduInternal/WebRtcPeer/WebRtcPeer");
var WebRtcStats_1 = require("../OpenViduInternal/WebRtcStats/WebRtcStats");
var ExceptionEvent_1 = require("../OpenViduInternal/Events/ExceptionEvent");
var PublisherSpeakingEvent_1 = require("../OpenViduInternal/Events/PublisherSpeakingEvent");
var StreamManagerEvent_1 = require("../OpenViduInternal/Events/StreamManagerEvent");
var StreamPropertyChangedEvent_1 = require("../OpenViduInternal/Events/StreamPropertyChangedEvent");
var OpenViduError_1 = require("../OpenViduInternal/Enums/OpenViduError");
var TypeOfVideo_1 = require("../OpenViduInternal/Enums/TypeOfVideo");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
var Platform_1 = require("../OpenViduInternal/Utils/Platform");
var uuid_1 = require("uuid");
/**
 * @hidden
 */
var hark = require("hark");
/**
 * @hidden
 */
var EventEmitter = require("wolfy87-eventemitter");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * @hidden
 */
var platform;
/**
 * Represents each one of the media streams available in OpenVidu Server for certain session.
 * Each [[Publisher]] and [[Subscriber]] has an attribute of type Stream, as they give access
 * to one of them (sending and receiving it, respectively)
 */
var Stream = /** @class */ (function () {
    /**
     * @hidden
     */
    function Stream(session, options) {
        var _this = this;
        this.isSubscribeToRemote = false;
        /**
         * @hidden
         */
        this.isLocalStreamReadyToPublish = false;
        /**
         * @hidden
         */
        this.isLocalStreamPublished = false;
        /**
         * @hidden
         */
        this.publishedOnce = false;
        /**
         * @hidden
         */
        this.harkSpeakingEnabled = false;
        /**
         * @hidden
         */
        this.harkSpeakingEnabledOnce = false;
        /**
         * @hidden
         */
        this.harkStoppedSpeakingEnabled = false;
        /**
         * @hidden
         */
        this.harkStoppedSpeakingEnabledOnce = false;
        /**
         * @hidden
         */
        this.harkVolumeChangeEnabled = false;
        /**
         * @hidden
         */
        this.harkVolumeChangeEnabledOnce = false;
        /**
         * @hidden
         */
        this.ee = new EventEmitter();
        platform = Platform_1.PlatformUtils.getInstance();
        this.session = session;
        if (options.hasOwnProperty('id')) {
            // InboundStreamOptions: stream belongs to a Subscriber
            this.inboundStreamOpts = options;
            this.streamId = this.inboundStreamOpts.id;
            this.creationTime = this.inboundStreamOpts.createdAt;
            this.hasAudio = this.inboundStreamOpts.hasAudio;
            this.hasVideo = this.inboundStreamOpts.hasVideo;
            if (this.hasAudio) {
                this.audioActive = this.inboundStreamOpts.audioActive;
            }
            if (this.hasVideo) {
                this.videoActive = this.inboundStreamOpts.videoActive;
                this.typeOfVideo = (!this.inboundStreamOpts.typeOfVideo) ? undefined : this.inboundStreamOpts.typeOfVideo;
                this.frameRate = (this.inboundStreamOpts.frameRate === -1) ? undefined : this.inboundStreamOpts.frameRate;
                this.videoDimensions = this.inboundStreamOpts.videoDimensions;
            }
            if (!!this.inboundStreamOpts.filter && (Object.keys(this.inboundStreamOpts.filter).length > 0)) {
                if (!!this.inboundStreamOpts.filter.lastExecMethod && Object.keys(this.inboundStreamOpts.filter.lastExecMethod).length === 0) {
                    delete this.inboundStreamOpts.filter.lastExecMethod;
                }
                this.filter = this.inboundStreamOpts.filter;
            }
        }
        else {
            // OutboundStreamOptions: stream belongs to a Publisher
            this.outboundStreamOpts = options;
            this.hasAudio = this.isSendAudio();
            this.hasVideo = this.isSendVideo();
            if (this.hasAudio) {
                this.audioActive = !!this.outboundStreamOpts.publisherProperties.publishAudio;
            }
            if (this.hasVideo) {
                this.videoActive = !!this.outboundStreamOpts.publisherProperties.publishVideo;
                this.frameRate = this.outboundStreamOpts.publisherProperties.frameRate;
                if (typeof MediaStreamTrack !== 'undefined' && this.outboundStreamOpts.publisherProperties.videoSource instanceof MediaStreamTrack) {
                    this.typeOfVideo = TypeOfVideo_1.TypeOfVideo.CUSTOM;
                }
                else {
                    this.typeOfVideo = this.isSendScreen() ? TypeOfVideo_1.TypeOfVideo.SCREEN : TypeOfVideo_1.TypeOfVideo.CAMERA;
                }
            }
            if (!!this.outboundStreamOpts.publisherProperties.filter) {
                this.filter = this.outboundStreamOpts.publisherProperties.filter;
            }
        }
        this.ee.on('mediastream-updated', function () {
            var _a;
            _this.streamManager.updateMediaStream(_this.mediaStream);
            logger.debug('Video srcObject [' + ((_a = _this.mediaStream) === null || _a === void 0 ? void 0 : _a.id) + '] updated in stream [' + _this.streamId + ']');
        });
    }
    /**
     * Recreates the media connection with the server. This entails the disposal of the previous RTCPeerConnection and the re-negotiation
     * of a new one, that will apply the same properties.
     *
     * This method can be useful in those situations were there the media connection breaks and OpenVidu is not able to recover on its own
     * for any kind of unanticipated reason (see [Automatic reconnection](/en/stable/advanced-features/automatic-reconnection/)).
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the reconnection operation was successful and rejected with an Error object if not
     */
    Stream.prototype.reconnect = function () {
        return this.reconnectStream('API');
    };
    /**
     * Applies an audio/video filter to the stream.
     *
     * @param type Type of filter applied. See [[Filter.type]]
     * @param options Parameters used to initialize the filter. See [[Filter.options]]
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved to the applied filter if success and rejected with an Error object if not
     */
    Stream.prototype.applyFilter = function (type, options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var resolveApplyFilter, openviduToken_1, tokenParams_1, afterScriptLoaded_1, script, optionsString;
            var _this = this;
            return __generator(this, function (_a) {
                if (!!this.filter) {
                    return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.GENERIC_ERROR, 'There is already a filter applied to Stream ' + this.streamId))];
                }
                resolveApplyFilter = function (error, triggerEvent) {
                    if (error) {
                        logger.error('Error applying filter for Stream ' + _this.streamId, error);
                        if (error.code === 401) {
                            return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_PERMISSION_DENIED, "You don't have permissions to apply a filter"));
                        }
                        else {
                            return reject(error);
                        }
                    }
                    else {
                        logger.info('Filter successfully applied on Stream ' + _this.streamId);
                        var oldValue = _this.filter;
                        _this.filter = new Filter_1.Filter(type, options);
                        _this.filter.stream = _this;
                        if (triggerEvent) {
                            _this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.session, _this, 'filter', _this.filter, oldValue, 'applyFilter')]);
                            _this.streamManager.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.streamManager, _this, 'filter', _this.filter, oldValue, 'applyFilter')]);
                        }
                        return resolve(_this.filter);
                    }
                };
                if (type.startsWith('VB:')) {
                    // Client filters
                    if (!this.hasVideo) {
                        return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR, 'The Virtual Background filter requires a video track to be applied'))];
                    }
                    if (!this.mediaStream || this.streamManager.videos.length === 0) {
                        return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR, 'The StreamManager requires some video element to be attached to it in order to apply a Virtual Background filter'))];
                    }
                    if (!!this.session.token) {
                        openviduToken_1 = this.session.token;
                    }
                    else {
                        openviduToken_1 = options['token'];
                    }
                    if (!openviduToken_1) {
                        return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR, 'Virtual Background requires the client to be connected to a Session or to have a "token" property available in "options" parameter with a valid OpenVidu token'))];
                    }
                    tokenParams_1 = this.session.getTokenParams(openviduToken_1);
                    if (tokenParams_1.edition !== 'pro' && tokenParams_1.edition !== 'enterprise') {
                        return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR, 'OpenVidu Virtual Background API is available from OpenVidu Pro edition onwards'))];
                    }
                    openviduToken_1 = encodeURIComponent(btoa(openviduToken_1));
                    logger.info('Applying Virtual Background to stream ' + this.streamId);
                    afterScriptLoaded_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                        var id, mediaStreamClone, videoClone, VB, filteredVideo, _a, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 8, , 9]);
                                    id = this.streamId + '_' + (0, uuid_1.v4)();
                                    mediaStreamClone = this.mediaStream.clone();
                                    videoClone = this.streamManager.videos[0].video.cloneNode(false);
                                    // @ts-ignore
                                    videoClone.id = VirtualBackground.VirtualBackground.SOURCE_VIDEO_PREFIX + id;
                                    videoClone.srcObject = mediaStreamClone;
                                    videoClone.muted = true;
                                    this.virtualBackgroundSourceElements = { videoClone: videoClone, mediaStreamClone: mediaStreamClone };
                                    // @ts-ignore
                                    VirtualBackground.VirtualBackground.hideHtmlElement(videoClone, false);
                                    // @ts-ignore
                                    VirtualBackground.VirtualBackground.appendHtmlElementToHiddenContainer(videoClone, id);
                                    return [4 /*yield*/, videoClone.play()];
                                case 1:
                                    _b.sent();
                                    VB = new VirtualBackground.VirtualBackground({
                                        id: id,
                                        openviduServerUrl: new URL(tokenParams_1.httpUri),
                                        openviduToken: openviduToken_1,
                                        inputVideo: videoClone,
                                        inputResolution: '160x96',
                                        outputFramerate: 24
                                    });
                                    filteredVideo = void 0;
                                    _a = type;
                                    switch (_a) {
                                        case 'VB:blur': return [3 /*break*/, 2];
                                        case 'VB:image': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 6];
                                case 2: return [4 /*yield*/, VB.backgroundBlur(options)];
                                case 3:
                                    filteredVideo = _b.sent();
                                    return [3 /*break*/, 7];
                                case 4: return [4 /*yield*/, VB.backgroundImage(options)];
                                case 5:
                                    filteredVideo = _b.sent();
                                    return [3 /*break*/, 7];
                                case 6: throw new Error('Unknown Virtual Background filter: ' + type);
                                case 7:
                                    this.virtualBackgroundSinkElements = { VB: VB, video: filteredVideo };
                                    videoClone.style.display = 'none';
                                    if (this.streamManager.remote) {
                                        this.streamManager.replaceTrackInMediaStream(this.virtualBackgroundSinkElements.video.srcObject.getVideoTracks()[0], false);
                                    }
                                    else {
                                        this.streamManager.replaceTrackAux(this.virtualBackgroundSinkElements.video.srcObject.getVideoTracks()[0], false);
                                    }
                                    resolveApplyFilter(undefined, false);
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_1 = _b.sent();
                                    if (error_1.name === OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR) {
                                        resolveApplyFilter(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.VIRTUAL_BACKGROUND_ERROR, error_1.message), false);
                                    }
                                    else {
                                        resolveApplyFilter(error_1, false);
                                    }
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); };
                    // @ts-ignore
                    if (typeof VirtualBackground === "undefined") {
                        script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = tokenParams_1.httpUri + '/openvidu/virtual-background/openvidu-virtual-background.js?token=' + openviduToken_1;
                        script.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, afterScriptLoaded_1()];
                                    case 1:
                                        _a.sent();
                                        resolve(new Filter_1.Filter(type, options));
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_2 = _a.sent();
                                        reject(error_2);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        document.body.appendChild(script);
                    }
                    else {
                        afterScriptLoaded_1()
                            .then(function () { return resolve(new Filter_1.Filter(type, options)); })
                            .catch(function (error) { return reject(error); });
                    }
                }
                else {
                    // Server filters
                    if (!this.session.sessionConnected()) {
                        return [2 /*return*/, reject(this.session.notConnectedError())];
                    }
                    logger.info('Applying server filter to stream ' + this.streamId);
                    options = options != null ? options : {};
                    optionsString = options;
                    if (typeof optionsString !== 'string') {
                        optionsString = JSON.stringify(optionsString);
                    }
                    this.session.openvidu.sendRequest('applyFilter', { streamId: this.streamId, type: type, options: optionsString }, function (error, response) {
                        resolveApplyFilter(error, true);
                    });
                }
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * Removes an audio/video filter previously applied.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the previously applied filter has been successfully removed and rejected with an Error object in other case
     */
    Stream.prototype.removeFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.removeFilterAux(false)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns the internal RTCPeerConnection object associated to this stream (https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)
     *
     * @returns Native RTCPeerConnection Web API object
     */
    Stream.prototype.getRTCPeerConnection = function () {
        return this.webRtcPeer.pc;
    };
    /**
     * Returns the internal MediaStream object associated to this stream (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
     *
     * @returns Native MediaStream Web API object
     */
    Stream.prototype.getMediaStream = function () {
        return this.mediaStream;
    };
    /* Hidden methods */
    /**
     * @hidden
     */
    Stream.prototype.removeFilterAux = function (isDisposing) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var resolveRemoveFilter, mediaStreamClone, error_3;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resolveRemoveFilter = function (error, triggerEvent) {
                            if (error) {
                                delete _this.filter;
                                logger.error('Error removing filter for Stream ' + _this.streamId, error);
                                if (error.code === 401) {
                                    return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_PERMISSION_DENIED, "You don't have permissions to remove a filter"));
                                }
                                else {
                                    return reject(error);
                                }
                            }
                            else {
                                logger.info('Filter successfully removed from Stream ' + _this.streamId);
                                var oldValue = _this.filter;
                                delete _this.filter;
                                if (triggerEvent) {
                                    _this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.session, _this, 'filter', _this.filter, oldValue, 'applyFilter')]);
                                    _this.streamManager.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.streamManager, _this, 'filter', _this.filter, oldValue, 'applyFilter')]);
                                }
                                return resolve();
                            }
                        };
                        if (!!!this.filter) return [3 /*break*/, 12];
                        if (!((_a = this.filter) === null || _a === void 0 ? void 0 : _a.type.startsWith('VB:'))) return [3 /*break*/, 10];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        mediaStreamClone = this.virtualBackgroundSourceElements.mediaStreamClone;
                        if (!!isDisposing) return [3 /*break*/, 6];
                        if (!this.streamManager.remote) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.streamManager.replaceTrackInMediaStream(mediaStreamClone.getVideoTracks()[0], false)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.streamManager.replaceTrackAux(mediaStreamClone.getVideoTracks()[0], false)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        mediaStreamClone.getTracks().forEach(function (track) { return track.stop(); });
                        _b.label = 7;
                    case 7:
                        this.virtualBackgroundSinkElements.VB.cleanUp();
                        delete this.virtualBackgroundSinkElements;
                        delete this.virtualBackgroundSourceElements;
                        return [2 /*return*/, resolveRemoveFilter(undefined, false)];
                    case 8:
                        error_3 = _b.sent();
                        return [2 /*return*/, resolveRemoveFilter(error_3, false)];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        // Server filters
                        if (!this.session.sessionConnected()) {
                            return [2 /*return*/, reject(this.session.notConnectedError())];
                        }
                        logger.info('Removing filter of stream ' + this.streamId);
                        this.session.openvidu.sendRequest('removeFilter', { streamId: this.streamId }, function (error, response) {
                            return resolveRemoveFilter(error, true);
                        });
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12: 
                    // There is no filter applied
                    return [2 /*return*/, reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.GENERIC_ERROR, "Stream " + this.streamId + " has no filter applied"))];
                    case 13: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @hidden
     */
    Stream.prototype.setMediaStream = function (mediaStream) {
        this.mediaStream = mediaStream;
    };
    /**
     * @hidden
     */
    Stream.prototype.updateMediaStreamInVideos = function () {
        this.ee.emitEvent('mediastream-updated', []);
    };
    /**
     * @hidden
     */
    Stream.prototype.getWebRtcPeer = function () {
        return this.webRtcPeer;
    };
    /**
     * @hidden
     */
    Stream.prototype.subscribeToMyRemote = function (value) {
        this.isSubscribeToRemote = value;
    };
    /**
     * @hidden
     */
    Stream.prototype.setOutboundStreamOptions = function (outboundStreamOpts) {
        this.outboundStreamOpts = outboundStreamOpts;
    };
    /**
     * @hidden
     */
    Stream.prototype.subscribe = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.initWebRtcPeerReceive(false)
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.publish = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isLocalStreamReadyToPublish) {
                _this.initWebRtcPeerSend(false)
                    .then(function () { return resolve(); })
                    .catch(function (error) { return reject(error); });
            }
            else {
                _this.ee.once('stream-ready-to-publish', function () {
                    _this.publish()
                        .then(function () { return resolve(); })
                        .catch(function (error) { return reject(error); });
                });
            }
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.disposeWebRtcPeer = function () {
        var webrtcId;
        if (!!this.webRtcPeer) {
            this.webRtcPeer.dispose();
            webrtcId = this.webRtcPeer.getId();
        }
        this.stopWebRtcStats();
        logger.info((!!this.outboundStreamOpts ? 'Outbound ' : 'Inbound ') + "RTCPeerConnection with id [" + webrtcId + "] from 'Stream' with id [" + this.streamId + '] is now closed');
    };
    /**
     * @hidden
     */
    Stream.prototype.disposeMediaStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!!this.filter && this.filter.type.startsWith('VB:'))) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.removeFilterAux(true)];
                    case 2:
                        _a.sent();
                        console.debug("Success removing Virtual Background filter for stream ".concat(this.streamId));
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error removing Virtual Background filter for stream ".concat(this.streamId), error_4);
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.mediaStream) {
                            this.mediaStream.getAudioTracks().forEach(function (track) {
                                track.stop();
                            });
                            this.mediaStream.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                            delete this.mediaStream;
                        }
                        // If subscribeToRemote local MediaStream must be stopped
                        if (this.localMediaStreamWhenSubscribedToRemote) {
                            this.localMediaStreamWhenSubscribedToRemote.getAudioTracks().forEach(function (track) {
                                track.stop();
                            });
                            this.localMediaStreamWhenSubscribedToRemote.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                            delete this.localMediaStreamWhenSubscribedToRemote;
                        }
                        if (!!this.speechEvent) {
                            if (!!this.speechEvent.stop) {
                                this.speechEvent.stop();
                            }
                            delete this.speechEvent;
                        }
                        logger.info((!!this.outboundStreamOpts ? 'Local ' : 'Remote ') + "MediaStream from 'Stream' with id [" + this.streamId + '] is now disposed');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.displayMyRemote = function () {
        return this.isSubscribeToRemote;
    };
    /**
     * @hidden
     */
    Stream.prototype.isSendAudio = function () {
        return (!!this.outboundStreamOpts &&
            this.outboundStreamOpts.publisherProperties.audioSource !== null &&
            this.outboundStreamOpts.publisherProperties.audioSource !== false);
    };
    /**
     * @hidden
     */
    Stream.prototype.isSendVideo = function () {
        return (!!this.outboundStreamOpts &&
            this.outboundStreamOpts.publisherProperties.videoSource !== null &&
            this.outboundStreamOpts.publisherProperties.videoSource !== false);
    };
    /**
     * @hidden
     */
    Stream.prototype.isSendScreen = function () {
        var screen = this.outboundStreamOpts.publisherProperties.videoSource === 'screen';
        if (platform.isElectron()) {
            screen = typeof this.outboundStreamOpts.publisherProperties.videoSource === 'string' &&
                this.outboundStreamOpts.publisherProperties.videoSource.startsWith('screen:');
        }
        return !!this.outboundStreamOpts && screen;
    };
    /**
     * @hidden
     */
    Stream.prototype.enableHarkSpeakingEvent = function () {
        var _this = this;
        this.setHarkListenerIfNotExists();
        if (!this.harkSpeakingEnabled && !!this.speechEvent) {
            this.harkSpeakingEnabled = true;
            this.speechEvent.on('speaking', function () {
                _this.session.emitEvent('publisherStartSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.session, 'publisherStartSpeaking', _this.connection, _this.streamId)]);
                _this.streamManager.emitEvent('publisherStartSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.streamManager, 'publisherStartSpeaking', _this.connection, _this.streamId)]);
                _this.harkSpeakingEnabledOnce = false; // Disable 'once' version if 'on' version was triggered
            });
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.enableOnceHarkSpeakingEvent = function () {
        var _this = this;
        this.setHarkListenerIfNotExists();
        if (!this.harkSpeakingEnabledOnce && !!this.speechEvent) {
            this.harkSpeakingEnabledOnce = true;
            this.speechEvent.once('speaking', function () {
                if (_this.harkSpeakingEnabledOnce) {
                    // If the listener has been disabled in the meantime (for example by the 'on' version) do not trigger the event
                    _this.session.emitEvent('publisherStartSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.session, 'publisherStartSpeaking', _this.connection, _this.streamId)]);
                    _this.streamManager.emitEvent('publisherStartSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.streamManager, 'publisherStartSpeaking', _this.connection, _this.streamId)]);
                }
                _this.disableHarkSpeakingEvent(true);
            });
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.disableHarkSpeakingEvent = function (disabledByOnce) {
        if (!!this.speechEvent) {
            this.harkSpeakingEnabledOnce = false;
            if (disabledByOnce) {
                if (this.harkSpeakingEnabled) {
                    // The 'on' version of this same event is enabled too. Do not remove the hark listener
                    return;
                }
            }
            else {
                this.harkSpeakingEnabled = false;
            }
            // Shutting down the hark event
            if (this.harkVolumeChangeEnabled ||
                this.harkVolumeChangeEnabledOnce ||
                this.harkStoppedSpeakingEnabled ||
                this.harkStoppedSpeakingEnabledOnce) {
                // Some other hark event is enabled. Cannot stop the hark process, just remove the specific listener
                this.speechEvent.off('speaking');
            }
            else {
                // No other hark event is enabled. We can get entirely rid of it
                this.speechEvent.stop();
                delete this.speechEvent;
            }
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.enableHarkStoppedSpeakingEvent = function () {
        var _this = this;
        this.setHarkListenerIfNotExists();
        if (!this.harkStoppedSpeakingEnabled && !!this.speechEvent) {
            this.harkStoppedSpeakingEnabled = true;
            this.speechEvent.on('stopped_speaking', function () {
                _this.session.emitEvent('publisherStopSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.session, 'publisherStopSpeaking', _this.connection, _this.streamId)]);
                _this.streamManager.emitEvent('publisherStopSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.streamManager, 'publisherStopSpeaking', _this.connection, _this.streamId)]);
                _this.harkStoppedSpeakingEnabledOnce = false; // Disable 'once' version if 'on' version was triggered
            });
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.enableOnceHarkStoppedSpeakingEvent = function () {
        var _this = this;
        this.setHarkListenerIfNotExists();
        if (!this.harkStoppedSpeakingEnabledOnce && !!this.speechEvent) {
            this.harkStoppedSpeakingEnabledOnce = true;
            this.speechEvent.once('stopped_speaking', function () {
                if (_this.harkStoppedSpeakingEnabledOnce) {
                    // If the listener has been disabled in the meantime (for example by the 'on' version) do not trigger the event
                    _this.session.emitEvent('publisherStopSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.session, 'publisherStopSpeaking', _this.connection, _this.streamId)]);
                    _this.streamManager.emitEvent('publisherStopSpeaking', [new PublisherSpeakingEvent_1.PublisherSpeakingEvent(_this.streamManager, 'publisherStopSpeaking', _this.connection, _this.streamId)]);
                }
                _this.disableHarkStoppedSpeakingEvent(true);
            });
        }
    };
    /**
    * @hidden
    */
    Stream.prototype.disableHarkStoppedSpeakingEvent = function (disabledByOnce) {
        if (!!this.speechEvent) {
            this.harkStoppedSpeakingEnabledOnce = false;
            if (disabledByOnce) {
                if (this.harkStoppedSpeakingEnabled) {
                    // We are cancelling the 'once' listener for this event, but the 'on' version
                    // of this same event is enabled too. Do not remove the hark listener
                    return;
                }
            }
            else {
                this.harkStoppedSpeakingEnabled = false;
            }
            // Shutting down the hark event
            if (this.harkVolumeChangeEnabled ||
                this.harkVolumeChangeEnabledOnce ||
                this.harkSpeakingEnabled ||
                this.harkSpeakingEnabledOnce) {
                // Some other hark event is enabled. Cannot stop the hark process, just remove the specific listener
                this.speechEvent.off('stopped_speaking');
            }
            else {
                // No other hark event is enabled. We can get entirely rid of it
                this.speechEvent.stop();
                delete this.speechEvent;
            }
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.enableHarkVolumeChangeEvent = function (force) {
        var _this = this;
        if (this.setHarkListenerIfNotExists()) {
            if (!this.harkVolumeChangeEnabled || force) {
                this.harkVolumeChangeEnabled = true;
                this.speechEvent.on('volume_change', function (harkEvent) {
                    var oldValue = _this.speechEvent.oldVolumeValue;
                    var value = { newValue: harkEvent, oldValue: oldValue };
                    _this.speechEvent.oldVolumeValue = harkEvent;
                    _this.streamManager.emitEvent('streamAudioVolumeChange', [new StreamManagerEvent_1.StreamManagerEvent(_this.streamManager, 'streamAudioVolumeChange', value)]);
                });
            }
        }
        else {
            // This way whenever the MediaStream object is available, the event listener will be automatically added
            this.harkVolumeChangeEnabled = true;
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.enableOnceHarkVolumeChangeEvent = function (force) {
        var _this = this;
        if (this.setHarkListenerIfNotExists()) {
            if (!this.harkVolumeChangeEnabledOnce || force) {
                this.harkVolumeChangeEnabledOnce = true;
                this.speechEvent.once('volume_change', function (harkEvent) {
                    var oldValue = _this.speechEvent.oldVolumeValue;
                    var value = { newValue: harkEvent, oldValue: oldValue };
                    _this.speechEvent.oldVolumeValue = harkEvent;
                    _this.disableHarkVolumeChangeEvent(true);
                    _this.streamManager.emitEvent('streamAudioVolumeChange', [new StreamManagerEvent_1.StreamManagerEvent(_this.streamManager, 'streamAudioVolumeChange', value)]);
                });
            }
        }
        else {
            // This way whenever the MediaStream object is available, the event listener will be automatically added
            this.harkVolumeChangeEnabledOnce = true;
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.disableHarkVolumeChangeEvent = function (disabledByOnce) {
        if (!!this.speechEvent) {
            this.harkVolumeChangeEnabledOnce = false;
            if (disabledByOnce) {
                if (this.harkVolumeChangeEnabled) {
                    // We are cancelling the 'once' listener for this event, but the 'on' version
                    // of this same event is enabled too. Do not remove the hark listener
                    return;
                }
            }
            else {
                this.harkVolumeChangeEnabled = false;
            }
            // Shutting down the hark event
            if (this.harkSpeakingEnabled ||
                this.harkSpeakingEnabledOnce ||
                this.harkStoppedSpeakingEnabled ||
                this.harkStoppedSpeakingEnabledOnce) {
                // Some other hark event is enabled. Cannot stop the hark process, just remove the specific listener
                this.speechEvent.off('volume_change');
            }
            else {
                // No other hark event is enabled. We can get entirely rid of it
                this.speechEvent.stop();
                delete this.speechEvent;
            }
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.isLocal = function () {
        // inbound options undefined and outbound options defined
        return (!this.inboundStreamOpts && !!this.outboundStreamOpts);
    };
    /**
     * @hidden
     */
    Stream.prototype.getSelectedIceCandidate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.webRtcStats.getSelectedIceCandidateInfo()
                .then(function (report) { return resolve(report); })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.getRemoteIceCandidateList = function () {
        return this.webRtcPeer.remoteCandidatesQueue;
    };
    /**
     * @hidden
     */
    Stream.prototype.getLocalIceCandidateList = function () {
        return this.webRtcPeer.localCandidatesQueue;
    };
    /**
     * @hidden
     */
    Stream.prototype.streamIceConnectionStateBroken = function () {
        if (!this.getWebRtcPeer() || !this.getRTCPeerConnection()) {
            return false;
        }
        if (this.isLocal() && !!this.session.openvidu.advancedConfiguration.forceMediaReconnectionAfterNetworkDrop) {
            logger.warn("OpenVidu Browser advanced configuration option \"forceMediaReconnectionAfterNetworkDrop\" is enabled. Stream ".concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") will force a reconnection"));
            return true;
        }
        var iceConnectionState = this.getRTCPeerConnection().iceConnectionState;
        return iceConnectionState !== 'connected' && iceConnectionState !== 'completed';
    };
    /* Private methods */
    Stream.prototype.setHarkListenerIfNotExists = function () {
        if (!!this.mediaStream) {
            if (!this.speechEvent) {
                var harkOptions = !!this.harkOptions ? this.harkOptions : (this.session.openvidu.advancedConfiguration.publisherSpeakingEventsOptions || {});
                harkOptions.interval = (typeof harkOptions.interval === 'number') ? harkOptions.interval : 100;
                harkOptions.threshold = (typeof harkOptions.threshold === 'number') ? harkOptions.threshold : -50;
                this.speechEvent = hark(this.mediaStream, harkOptions);
            }
            return true;
        }
        return false;
    };
    /**
     * @hidden
     */
    Stream.prototype.setupReconnectionEventEmitter = function (resolve, reject) {
        if (this.reconnectionEventEmitter == undefined) {
            // There is no ongoing reconnection
            this.reconnectionEventEmitter = new EventEmitter();
            return false;
        }
        else {
            // Ongoing reconnection
            console.warn("Trying to reconnect stream ".concat(this.streamId, " (").concat(this.isLocal() ? 'Publisher' : 'Subscriber', ") but an ongoing reconnection process is active. Waiting for response..."));
            this.reconnectionEventEmitter.once('success', function () { return resolve(); });
            this.reconnectionEventEmitter.once('error', function (error) { return reject(error); });
            return true;
        }
    };
    /**
     * @hidden
     */
    Stream.prototype.initWebRtcPeerSend = function (reconnect) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            if (reconnect) {
                if (_this.setupReconnectionEventEmitter(resolve, reject)) {
                    // Ongoing reconnection
                    return;
                }
            }
            else {
                // MediaStream will already have hark events for reconnected streams
                _this.initHarkEvents(); // Init hark events for the local stream
            }
            var finalResolve = function () {
                var _a;
                if (reconnect) {
                    (_a = _this.reconnectionEventEmitter) === null || _a === void 0 ? void 0 : _a.emitEvent('success');
                    delete _this.reconnectionEventEmitter;
                }
                return resolve();
            };
            var finalReject = function (error) {
                var _a;
                if (reconnect) {
                    (_a = _this.reconnectionEventEmitter) === null || _a === void 0 ? void 0 : _a.emitEvent('error', [error]);
                    delete _this.reconnectionEventEmitter;
                }
                return reject(error);
            };
            var successOfferCallback = function (sdpOfferParam) {
                logger.debug('Sending SDP offer to publish as '
                    + _this.streamId, sdpOfferParam);
                var method = reconnect ? 'reconnectStream' : 'publishVideo';
                var params;
                if (reconnect) {
                    params = {
                        stream: _this.streamId,
                        sdpString: sdpOfferParam
                    };
                }
                else {
                    var typeOfVideo = void 0;
                    if (_this.isSendVideo()) {
                        typeOfVideo = (typeof MediaStreamTrack !== 'undefined' && _this.outboundStreamOpts.publisherProperties.videoSource instanceof MediaStreamTrack) ? TypeOfVideo_1.TypeOfVideo.CUSTOM : (_this.isSendScreen() ? TypeOfVideo_1.TypeOfVideo.SCREEN : TypeOfVideo_1.TypeOfVideo.CAMERA);
                    }
                    params = {
                        doLoopback: _this.displayMyRemote() || false,
                        hasAudio: _this.isSendAudio(),
                        hasVideo: _this.isSendVideo(),
                        audioActive: _this.audioActive,
                        videoActive: _this.videoActive,
                        typeOfVideo: typeOfVideo,
                        frameRate: !!_this.frameRate ? _this.frameRate : -1,
                        videoDimensions: JSON.stringify(_this.videoDimensions),
                        filter: _this.outboundStreamOpts.publisherProperties.filter,
                        sdpOffer: sdpOfferParam
                    };
                }
                _this.session.openvidu.sendRequest(method, params, function (error, response) {
                    if (error) {
                        if (error.code === 401) {
                            finalReject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_PERMISSION_DENIED, "You don't have permissions to publish"));
                        }
                        else {
                            finalReject('Error on publishVideo: ' + JSON.stringify(error));
                        }
                    }
                    else {
                        _this.webRtcPeer.processRemoteAnswer(response.sdpAnswer)
                            .then(function () {
                            _this.streamId = response.id;
                            _this.creationTime = response.createdAt;
                            _this.isLocalStreamPublished = true;
                            _this.publishedOnce = true;
                            if (_this.displayMyRemote()) {
                                _this.localMediaStreamWhenSubscribedToRemote = _this.mediaStream;
                                _this.remotePeerSuccessfullyEstablished(reconnect);
                            }
                            if (reconnect) {
                                _this.ee.emitEvent('stream-reconnected-by-publisher', []);
                            }
                            else {
                                _this.ee.emitEvent('stream-created-by-publisher', []);
                            }
                            _this.initWebRtcStats();
                            logger.info("'Publisher' (" + _this.streamId + ") successfully " + (reconnect ? "reconnected" : "published") + " to session");
                            finalResolve();
                        })
                            .catch(function (error) {
                            finalReject(error);
                        });
                    }
                });
            };
            var config = {
                mediaConstraints: {
                    audio: _this.hasAudio,
                    video: _this.hasVideo,
                },
                simulcast: (_a = _this.outboundStreamOpts.publisherProperties.videoSimulcast) !== null && _a !== void 0 ? _a : _this.session.openvidu.videoSimulcast,
                onIceCandidate: _this.connection.sendIceCandidate.bind(_this.connection),
                onIceConnectionStateException: function (exceptionName, message, data) { _this.session.emitEvent('exception', [new ExceptionEvent_1.ExceptionEvent(_this.session, exceptionName, _this, message, data)]); },
                iceServers: _this.getIceServersConf(),
                mediaStream: _this.mediaStream,
                mediaServer: _this.session.openvidu.mediaServer,
                typeOfVideo: _this.typeOfVideo ? TypeOfVideo_1.TypeOfVideo[_this.typeOfVideo] : undefined,
            };
            if (_this.session.openvidu.mediaServer !== 'mediasoup') {
                // Simulcast is only supported by mediasoup
                config.simulcast = false;
            }
            if (reconnect) {
                _this.disposeWebRtcPeer();
            }
            if (_this.displayMyRemote()) {
                _this.webRtcPeer = new WebRtcPeer_1.WebRtcPeerSendrecv(config);
            }
            else {
                _this.webRtcPeer = new WebRtcPeer_1.WebRtcPeerSendonly(config);
            }
            _this.webRtcPeer.addIceConnectionStateChangeListener('publisher of ' + _this.connection.connectionId);
            _this.webRtcPeer.createOffer().then(function (sdpOffer) {
                _this.webRtcPeer.processLocalOffer(sdpOffer)
                    .then(function () {
                    successOfferCallback(sdpOffer.sdp);
                }).catch(function (error) {
                    finalReject(new Error('(publish) SDP process local offer error: ' + JSON.stringify(error)));
                });
            }).catch(function (error) {
                finalReject(new Error('(publish) SDP create offer error: ' + JSON.stringify(error)));
            });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.finalResolveForSubscription = function (reconnect, resolve) {
        var _a;
        logger.info("'Subscriber' (" + this.streamId + ") successfully " + (reconnect ? "reconnected" : "subscribed"));
        this.remotePeerSuccessfullyEstablished(reconnect);
        this.initWebRtcStats();
        if (reconnect) {
            (_a = this.reconnectionEventEmitter) === null || _a === void 0 ? void 0 : _a.emitEvent('success');
            delete this.reconnectionEventEmitter;
        }
        return resolve();
    };
    /**
     * @hidden
     */
    Stream.prototype.finalRejectForSubscription = function (reconnect, error, reject) {
        var _a;
        logger.error("Error for 'Subscriber' (" + this.streamId + ") while trying to " + (reconnect ? "reconnect" : "subscribe") + ": " + error.toString());
        if (reconnect) {
            (_a = this.reconnectionEventEmitter) === null || _a === void 0 ? void 0 : _a.emitEvent('error', [error]);
            delete this.reconnectionEventEmitter;
        }
        return reject(error);
    };
    /**
     * @hidden
     */
    Stream.prototype.initWebRtcPeerReceive = function (reconnect) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (reconnect) {
                if (_this.setupReconnectionEventEmitter(resolve, reject)) {
                    // Ongoing reconnection
                    return;
                }
            }
            if (_this.session.openvidu.mediaServer === 'mediasoup') {
                // Server initiates negotiation
                _this.initWebRtcPeerReceiveFromServer(reconnect)
                    .then(function () { return _this.finalResolveForSubscription(reconnect, resolve); })
                    .catch(function (error) { return _this.finalRejectForSubscription(reconnect, error, reject); });
            }
            else {
                // Client initiates negotiation
                _this.initWebRtcPeerReceiveFromClient(reconnect)
                    .then(function () { return _this.finalResolveForSubscription(reconnect, resolve); })
                    .catch(function (error) { return _this.finalRejectForSubscription(reconnect, error, reject); });
            }
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.initWebRtcPeerReceiveFromClient = function (reconnect) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.completeWebRtcPeerReceive(reconnect, false)
                .then(function (response) {
                _this.webRtcPeer.processRemoteAnswer(response.sdpAnswer)
                    .then(function () { return resolve(); })
                    .catch(function (error) { return reject(error); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.initWebRtcPeerReceiveFromServer = function (reconnect) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Server initiates negotiation
            _this.session.openvidu.sendRequest('prepareReceiveVideoFrom', { sender: _this.streamId, reconnect: reconnect }, function (error, response) {
                if (error) {
                    return reject(new Error('Error on prepareReceiveVideoFrom: ' + JSON.stringify(error)));
                }
                else {
                    _this.completeWebRtcPeerReceive(reconnect, false, response.sdpOffer)
                        .then(function () { return resolve(); })
                        .catch(function (error) { return reject(error); });
                }
            });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.completeWebRtcPeerReceive = function (reconnect, forciblyReconnect, sdpOfferByServer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            logger.debug("'Session.subscribe(Stream)' called");
            var sendSdpToServer = function (sdpString) {
                logger.debug("Sending local SDP ".concat((!!sdpOfferByServer ? 'answer' : 'offer'), " to subscribe to ").concat(_this.streamId), sdpString);
                var method = reconnect ? 'reconnectStream' : 'receiveVideoFrom';
                var params = {};
                params[reconnect ? 'stream' : 'sender'] = _this.streamId;
                if (!!sdpOfferByServer) {
                    params[reconnect ? 'sdpString' : 'sdpAnswer'] = sdpString;
                }
                else {
                    params['sdpOffer'] = sdpString;
                }
                if (reconnect) {
                    params['forciblyReconnect'] = forciblyReconnect;
                }
                _this.session.openvidu.sendRequest(method, params, function (error, response) {
                    if (error) {
                        return reject(new Error('Error on ' + method + ' : ' + JSON.stringify(error)));
                    }
                    else {
                        return resolve(response);
                    }
                });
            };
            var config = {
                mediaConstraints: {
                    audio: _this.hasAudio,
                    video: _this.hasVideo,
                },
                simulcast: false,
                onIceCandidate: _this.connection.sendIceCandidate.bind(_this.connection),
                onIceConnectionStateException: function (exceptionName, message, data) { _this.session.emitEvent('exception', [new ExceptionEvent_1.ExceptionEvent(_this.session, exceptionName, _this, message, data)]); },
                iceServers: _this.getIceServersConf(),
                mediaServer: _this.session.openvidu.mediaServer,
                typeOfVideo: _this.typeOfVideo ? TypeOfVideo_1.TypeOfVideo[_this.typeOfVideo] : undefined,
            };
            if (reconnect) {
                _this.disposeWebRtcPeer();
            }
            _this.webRtcPeer = new WebRtcPeer_1.WebRtcPeerRecvonly(config);
            _this.webRtcPeer.addIceConnectionStateChangeListener(_this.streamId);
            if (!!sdpOfferByServer) {
                _this.webRtcPeer.processRemoteOffer(sdpOfferByServer).then(function () {
                    _this.webRtcPeer.createAnswer().then(function (sdpAnswer) {
                        _this.webRtcPeer.processLocalAnswer(sdpAnswer).then(function () {
                            sendSdpToServer(sdpAnswer.sdp);
                        }).catch(function (error) {
                            return reject(new Error('(subscribe) SDP process local answer error: ' + JSON.stringify(error)));
                        });
                    }).catch(function (error) {
                        return reject(new Error('(subscribe) SDP create answer error: ' + JSON.stringify(error)));
                    });
                }).catch(function (error) {
                    return reject(new Error('(subscribe) SDP process remote offer error: ' + JSON.stringify(error)));
                });
            }
            else {
                _this.webRtcPeer.createOffer().then(function (sdpOffer) {
                    _this.webRtcPeer.processLocalOffer(sdpOffer).then(function () {
                        sendSdpToServer(sdpOffer.sdp);
                    }).catch(function (error) {
                        return reject(new Error('(subscribe) SDP process local offer error: ' + JSON.stringify(error)));
                    });
                }).catch(function (error) {
                    return reject(new Error('(subscribe) SDP create offer error: ' + JSON.stringify(error)));
                });
            }
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.remotePeerSuccessfullyEstablished = function (reconnect) {
        if (reconnect && this.mediaStream != null) {
            // Now we can destroy the existing MediaStream
            this.disposeMediaStream();
        }
        this.mediaStream = new MediaStream();
        var receiver;
        for (var _i = 0, _a = this.webRtcPeer.pc.getReceivers(); _i < _a.length; _i++) {
            receiver = _a[_i];
            if (!!receiver.track) {
                this.mediaStream.addTrack(receiver.track);
            }
        }
        logger.debug('Peer remote stream', this.mediaStream);
        if (!!this.mediaStream) {
            if (this.streamManager instanceof Subscriber_1.Subscriber) {
                // Apply SubscriberProperties.subscribeToAudio and SubscriberProperties.subscribeToVideo
                if (!!this.mediaStream.getAudioTracks()[0]) {
                    var enabled = reconnect ? this.audioActive : !!(this.streamManager.properties.subscribeToAudio);
                    this.mediaStream.getAudioTracks()[0].enabled = enabled;
                }
                if (!!this.mediaStream.getVideoTracks()[0]) {
                    var enabled = reconnect ? this.videoActive : !!(this.streamManager.properties.subscribeToVideo);
                    this.mediaStream.getVideoTracks()[0].enabled = enabled;
                }
            }
            this.updateMediaStreamInVideos();
            this.initHarkEvents(); // Init hark events for the remote stream
        }
    };
    Stream.prototype.initHarkEvents = function () {
        if (!!this.mediaStream.getAudioTracks()[0]) {
            // Hark events can only be set if audio track is available
            if (this.session.anySpeechEventListenerEnabled('publisherStartSpeaking', true, this.streamManager)) {
                this.enableOnceHarkSpeakingEvent();
            }
            if (this.session.anySpeechEventListenerEnabled('publisherStartSpeaking', false, this.streamManager)) {
                this.enableHarkSpeakingEvent();
            }
            if (this.session.anySpeechEventListenerEnabled('publisherStopSpeaking', true, this.streamManager)) {
                this.enableOnceHarkStoppedSpeakingEvent();
            }
            if (this.session.anySpeechEventListenerEnabled('publisherStopSpeaking', false, this.streamManager)) {
                this.enableHarkStoppedSpeakingEvent();
            }
            if (this.harkVolumeChangeEnabledOnce) {
                this.enableOnceHarkVolumeChangeEvent(true);
            }
            if (this.harkVolumeChangeEnabled) {
                this.enableHarkVolumeChangeEvent(true);
            }
        }
    };
    Stream.prototype.onIceConnectionStateExceptionHandler = function (exceptionName, message, data) {
        switch (exceptionName) {
            case ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_FAILED:
                this.onIceConnectionFailed();
                break;
            case ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_DISCONNECTED:
                this.onIceConnectionDisconnected();
                break;
        }
        this.session.emitEvent('exception', [new ExceptionEvent_1.ExceptionEvent(this.session, exceptionName, this, message, data)]);
    };
    Stream.prototype.onIceConnectionFailed = function () {
        // Immediately reconnect, as this is a terminal error
        logger.log("[ICE_CONNECTION_FAILED] Handling ICE_CONNECTION_FAILED event. Reconnecting stream ".concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ")"));
        this.reconnectStreamAndLogResultingIceConnectionState(ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_FAILED);
    };
    Stream.prototype.onIceConnectionDisconnected = function () {
        var _this = this;
        // Wait to see if the ICE connection is able to reconnect
        logger.log("[ICE_CONNECTION_DISCONNECTED] Handling ICE_CONNECTION_DISCONNECTED event. Waiting for ICE to be restored and reconnect stream ".concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") if not possible"));
        var timeout = this.session.openvidu.advancedConfiguration.iceConnectionDisconnectedExceptionTimeout || 4000;
        this.awaitWebRtcPeerConnectionState(timeout).then(function (state) {
            switch (state) {
                case 'failed':
                    // Do nothing, as an ICE_CONNECTION_FAILED event will have already raised
                    logger.warn("[ICE_CONNECTION_DISCONNECTED] ICE connection of stream ".concat(_this.streamId, " (").concat((_this.isLocal() ? 'Publisher' : 'Subscriber'), ") is now failed after ICE_CONNECTION_DISCONNECTED"));
                    break;
                case 'connected':
                case 'completed':
                    logger.log("[ICE_CONNECTION_DISCONNECTED] ICE connection of stream ".concat(_this.streamId, " (").concat((_this.isLocal() ? 'Publisher' : 'Subscriber'), ") automatically restored after ICE_CONNECTION_DISCONNECTED. Current ICE connection state: ").concat(state));
                    break;
                case 'closed':
                case 'checking':
                case 'new':
                case 'disconnected':
                    // Rest of states
                    logger.warn("[ICE_CONNECTION_DISCONNECTED] ICE connection of stream ".concat(_this.streamId, " (").concat((_this.isLocal() ? 'Publisher' : 'Subscriber'), ") couldn't be restored after ICE_CONNECTION_DISCONNECTED event. Current ICE connection state after ").concat(timeout, " ms: ").concat(state));
                    _this.reconnectStreamAndLogResultingIceConnectionState(ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_DISCONNECTED);
                    break;
            }
        });
    };
    Stream.prototype.reconnectStreamAndLogResultingIceConnectionState = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var finalIceStateAfterReconnection, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reconnectStreamAndReturnIceConnectionState(event)];
                    case 1:
                        finalIceStateAfterReconnection = _a.sent();
                        switch (finalIceStateAfterReconnection) {
                            case 'connected':
                            case 'completed':
                                logger.log("[".concat(event, "] Stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") successfully reconnected after ").concat(event, ". Current ICE connection state: ").concat(finalIceStateAfterReconnection));
                                break;
                            default:
                                logger.error("[".concat(event, "] Stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") failed to reconnect after ").concat(event, ". Current ICE connection state: ").concat(finalIceStateAfterReconnection));
                                break;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        logger.error("[".concat(event, "] Error reconnecting stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") after ").concat(event, ": ").concat(error_5));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Stream.prototype.reconnectStreamAndReturnIceConnectionState = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.log("[".concat(event, "] Reconnecting stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") after event ").concat(event));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.reconnectStream(event)];
                    case 2:
                        _a.sent();
                        timeout = this.session.openvidu.advancedConfiguration.iceConnectionDisconnectedExceptionTimeout || 4000;
                        return [2 /*return*/, this.awaitWebRtcPeerConnectionState(timeout)];
                    case 3:
                        error_6 = _a.sent();
                        logger.warn("[".concat(event, "] Error reconnecting stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), "). Reason: ").concat(error_6));
                        return [2 /*return*/, this.awaitWebRtcPeerConnectionState(1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Stream.prototype.reconnectStream = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var isWsConnected, errorMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isWebsocketConnected(event, 3000)];
                    case 1:
                        isWsConnected = _a.sent();
                        if (isWsConnected) {
                            // There is connection to openvidu-server. The RTCPeerConnection is the only one broken
                            logger.log("[".concat(event, "] Trying to reconnect stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") and the websocket is opened"));
                            if (this.isLocal()) {
                                return [2 /*return*/, this.initWebRtcPeerSend(true)];
                            }
                            else {
                                return [2 /*return*/, this.initWebRtcPeerReceive(true)];
                            }
                        }
                        else {
                            errorMsg = "[".concat(event, "] Trying to reconnect stream ").concat(this.streamId, " (").concat((this.isLocal() ? 'Publisher' : 'Subscriber'), ") but the websocket wasn't opened");
                            logger.error(errorMsg);
                            throw Error(errorMsg);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Stream.prototype.isWebsocketConnected = function (event, msResponseTimeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var wsReadyState = _this.session.openvidu.getWsReadyState();
            if (wsReadyState === 1) {
                var responseTimeout_1 = setTimeout(function () {
                    console.warn("[".concat(event, "] Websocket timeout of ").concat(msResponseTimeout, "ms"));
                    return resolve(false);
                }, msResponseTimeout);
                _this.session.openvidu.sendRequest('echo', {}, function (error, response) {
                    clearTimeout(responseTimeout_1);
                    if (!!error) {
                        console.warn("[".concat(event, "] Websocket 'echo' returned error: ").concat(error));
                        return resolve(false);
                    }
                    else {
                        return resolve(true);
                    }
                });
            }
            else {
                console.warn("[".concat(event, "] Websocket readyState is ").concat(wsReadyState));
                return resolve(false);
            }
        });
    };
    Stream.prototype.awaitWebRtcPeerConnectionState = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var state, interval, intervals, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.getRTCPeerConnection().iceConnectionState;
                        interval = 150;
                        intervals = Math.ceil(timeout / interval);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < intervals)) return [3 /*break*/, 4];
                        state = this.getRTCPeerConnection().iceConnectionState;
                        if (state === 'connected' || state === 'completed') {
                            return [3 /*break*/, 4];
                        }
                        // Sleep
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, interval); })];
                    case 2:
                        // Sleep
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, state];
                }
            });
        });
    };
    /**
     * @hidden
     */
    Stream.prototype.initWebRtcStats = function () {
        this.webRtcStats = new WebRtcStats_1.WebRtcStats(this);
        this.webRtcStats.initWebRtcStats();
        //TODO: send common webrtc stats from client to openvidu-server
        /*if (this.session.openvidu.webrtcStatsInterval > 0) {
            setInterval(() => {
                this.gatherStatsForPeer().then(jsonStats => {
                    const body = {
                        sessionId: this.session.sessionId,
                        participantPrivateId: this.connection.rpcSessionId,
                        stats: jsonStats
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', this.session.openvidu.httpUri + '/elasticsearch/webrtc-stats', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(body));
                })
            }, this.session.openvidu.webrtcStatsInterval * 1000);
        }*/
    };
    Stream.prototype.stopWebRtcStats = function () {
        if (!!this.webRtcStats && this.webRtcStats.isEnabled()) {
            this.webRtcStats.stopWebRtcStats();
        }
    };
    Stream.prototype.getIceServersConf = function () {
        var returnValue;
        if (!!this.session.openvidu.advancedConfiguration.iceServers) {
            returnValue = this.session.openvidu.advancedConfiguration.iceServers === 'freeice' ?
                undefined :
                this.session.openvidu.advancedConfiguration.iceServers;
        }
        else if (this.session.openvidu.iceServers) {
            returnValue = this.session.openvidu.iceServers;
        }
        else {
            returnValue = undefined;
        }
        return returnValue;
    };
    Stream.prototype.gatherStatsForPeer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isLocal()) {
                // Publisher stream stats
                _this.getRTCPeerConnection().getSenders().forEach(function (sender) { return sender.getStats()
                    .then(function (response) {
                    response.forEach(function (report) {
                        if (_this.isReportWanted(report)) {
                            var finalReport = {};
                            finalReport['type'] = report.type;
                            finalReport['timestamp'] = report.timestamp;
                            finalReport['id'] = report.id;
                            // Common to Chrome, Firefox and Safari
                            if (report.type === 'outbound-rtp') {
                                finalReport['ssrc'] = report.ssrc;
                                finalReport['firCount'] = report.firCount;
                                finalReport['pliCount'] = report.pliCount;
                                finalReport['nackCount'] = report.nackCount;
                                finalReport['qpSum'] = report.qpSum;
                                // Set media type
                                if (!!report.kind) {
                                    finalReport['mediaType'] = report.kind;
                                }
                                else if (!!report.mediaType) {
                                    finalReport['mediaType'] = report.mediaType;
                                }
                                else {
                                    // Safari does not have 'mediaType' defined for inbound-rtp. Must be inferred from 'id' field
                                    finalReport['mediaType'] = (report.id.indexOf('VideoStream') !== -1) ? 'video' : 'audio';
                                }
                                if (finalReport['mediaType'] === 'video') {
                                    finalReport['framesEncoded'] = report.framesEncoded;
                                }
                                finalReport['packetsSent'] = report.packetsSent;
                                finalReport['bytesSent'] = report.bytesSent;
                            }
                            // Only for Chrome and Safari
                            if (report.type === 'candidate-pair' && report.totalRoundTripTime !== undefined) {
                                // This is the final selected candidate pair
                                finalReport['availableOutgoingBitrate'] = report.availableOutgoingBitrate;
                                finalReport['rtt'] = report.currentRoundTripTime;
                                finalReport['averageRtt'] = report.totalRoundTripTime / report.responsesReceived;
                            }
                            // Only for Firefox >= 66.0
                            if (report.type === 'remote-inbound-rtp' || report.type === 'remote-outbound-rtp') {
                            }
                            logger.log(finalReport);
                        }
                    });
                }); });
            }
            else {
                // Subscriber stream stats
                _this.getRTCPeerConnection().getReceivers().forEach(function (receiver) { return receiver.getStats()
                    .then(function (response) {
                    response.forEach(function (report) {
                        if (_this.isReportWanted(report)) {
                            var finalReport = {};
                            finalReport['type'] = report.type;
                            finalReport['timestamp'] = report.timestamp;
                            finalReport['id'] = report.id;
                            // Common to Chrome, Firefox and Safari
                            if (report.type === 'inbound-rtp') {
                                finalReport['ssrc'] = report.ssrc;
                                finalReport['firCount'] = report.firCount;
                                finalReport['pliCount'] = report.pliCount;
                                finalReport['nackCount'] = report.nackCount;
                                finalReport['qpSum'] = report.qpSum;
                                // Set media type
                                if (!!report.kind) {
                                    finalReport['mediaType'] = report.kind;
                                }
                                else if (!!report.mediaType) {
                                    finalReport['mediaType'] = report.mediaType;
                                }
                                else {
                                    // Safari does not have 'mediaType' defined for inbound-rtp. Must be inferred from 'id' field
                                    finalReport['mediaType'] = (report.id.indexOf('VideoStream') !== -1) ? 'video' : 'audio';
                                }
                                if (finalReport['mediaType'] === 'video') {
                                    finalReport['framesDecoded'] = report.framesDecoded;
                                }
                                finalReport['packetsReceived'] = report.packetsReceived;
                                finalReport['packetsLost'] = report.packetsLost;
                                finalReport['jitter'] = report.jitter;
                                finalReport['bytesReceived'] = report.bytesReceived;
                            }
                            // Only for Chrome and Safari
                            if (report.type === 'candidate-pair' && report.totalRoundTripTime !== undefined) {
                                // This is the final selected candidate pair
                                finalReport['availableIncomingBitrate'] = report.availableIncomingBitrate;
                                finalReport['rtt'] = report.currentRoundTripTime;
                                finalReport['averageRtt'] = report.totalRoundTripTime / report.responsesReceived;
                            }
                            // Only for Firefox >= 66.0
                            if (report.type === 'remote-inbound-rtp' || report.type === 'remote-outbound-rtp') {
                            }
                            logger.log(finalReport);
                        }
                    });
                }); });
            }
        });
    };
    Stream.prototype.isReportWanted = function (report) {
        return report.type === 'inbound-rtp' && !this.isLocal() ||
            report.type === 'outbound-rtp' && this.isLocal() ||
            (report.type === 'candidate-pair' && report.nominated && report.bytesSent > 0);
    };
    return Stream;
}());
exports.Stream = Stream;
//# sourceMappingURL=Stream.js.map