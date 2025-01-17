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
exports.Publisher = void 0;
var Session_1 = require("./Session");
var Stream_1 = require("./Stream");
var StreamManager_1 = require("./StreamManager");
var StreamEvent_1 = require("../OpenViduInternal/Events/StreamEvent");
var StreamPropertyChangedEvent_1 = require("../OpenViduInternal/Events/StreamPropertyChangedEvent");
var OpenViduError_1 = require("../OpenViduInternal/Enums/OpenViduError");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
var Platform_1 = require("../OpenViduInternal/Utils/Platform");
var TypeOfVideo_1 = require("../OpenViduInternal/Enums/TypeOfVideo");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * @hidden
 */
var platform;
/**
 * Packs local media streams. Participants can publish it to a session. Initialized with [[OpenVidu.initPublisher]] method.
 *
 * See available event listeners at [[PublisherEventMap]].
 */
var Publisher = /** @class */ (function (_super) {
    __extends(Publisher, _super);
    /**
     * @hidden
     */
    function Publisher(targEl, properties, openvidu) {
        var _this = _super.call(this, new Stream_1.Stream((!!openvidu.session) ? openvidu.session : new Session_1.Session(openvidu), { publisherProperties: properties, mediaConstraints: {} }), targEl) || this;
        /**
         * Whether the Publisher has been granted access to the requested input devices or not
         */
        _this.accessAllowed = false;
        /**
         * Whether you have called [[Publisher.subscribeToRemote]] with value `true` or `false` (*false* by default)
         */
        _this.isSubscribedToRemote = false;
        _this.accessDenied = false;
        platform = Platform_1.PlatformUtils.getInstance();
        _this.properties = properties;
        _this.openvidu = openvidu;
        _this.stream.ee.on('local-stream-destroyed', function (reason) {
            _this.stream.isLocalStreamPublished = false;
            var streamEvent = new StreamEvent_1.StreamEvent(true, _this, 'streamDestroyed', _this.stream, reason);
            _this.emitEvent('streamDestroyed', [streamEvent]);
            streamEvent.callDefaultBehavior();
        });
        return _this;
    }
    /**
     * Publish or unpublish the audio stream (if available). Calling this method twice in a row passing same `enabled` value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The [[Session]] object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The [[Publisher]] object of the local participant will also dispatch the exact same event
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The respective [[Subscriber]] object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See [[StreamPropertyChangedEvent]] to learn more.
     *
     * @param enabled `true` to publish the audio stream, `false` to unpublish it
     */
    Publisher.prototype.publishAudio = function (enabled) {
        var _this = this;
        if (this.stream.audioActive !== enabled) {
            var affectedMediaStream = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote : this.stream.getMediaStream();
            affectedMediaStream.getAudioTracks().forEach(function (track) {
                track.enabled = enabled;
            });
            if (!!this.session && !!this.stream.streamId) {
                this.session.openvidu.sendRequest('streamPropertyChanged', {
                    streamId: this.stream.streamId,
                    property: 'audioActive',
                    newValue: enabled,
                    reason: 'publishAudio'
                }, function (error, response) {
                    if (error) {
                        logger.error("Error sending 'streamPropertyChanged' event", error);
                    }
                    else {
                        _this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.session, _this.stream, 'audioActive', enabled, !enabled, 'publishAudio')]);
                        _this.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this, _this.stream, 'audioActive', enabled, !enabled, 'publishAudio')]);
                        _this.session.sendVideoData(_this.stream.streamManager);
                    }
                });
            }
            this.stream.audioActive = enabled;
            logger.info("'Publisher' has " + (enabled ? 'published' : 'unpublished') + ' its audio stream');
        }
    };
    /**
     * Publish or unpublish the video stream (if available). Calling this method twice in a row passing same `enabled` value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The [[Session]] object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The [[Publisher]] object of the local participant will also dispatch the exact same event
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The respective [[Subscriber]] object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See [[StreamPropertyChangedEvent]] to learn more.
     *
     * @param enabled `true` to publish the video stream, `false` to unpublish it
     * @param resource
     * - If parameter **`enabled`** is `false`, this optional parameter is of type boolean. It can be set to `true` to forcibly free the hardware resource associated to the video track, or can be set to `false` to keep the access to the hardware resource.
     * Not freeing the resource makes the operation much more efficient, but depending on the platform two side-effects can be introduced: the video device may not be accessible by other applications and the access light of
     * webcams may remain on. This is platform-dependent: some browsers will not present the side-effects even when not freeing the resource.</li>
     * - If parameter **`enabled`** is `true`, this optional parameter is of type [MediaStreamTrack](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack). It can be set to force the restoration of the video track with a custom track. This may be
     * useful if the Publisher was unpublished freeing the hardware resource, and openvidu-browser is not able to successfully re-create the video track as it was before unpublishing. In this way previous track settings will be ignored and this MediaStreamTrack
     * will be used instead.
     */
    Publisher.prototype.publishVideo = function (enabled, resource) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var affectedMediaStream_1, mustRestartMediaStream_1, oldVideoTrack, replaceVideoTrack, mediaStream, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.stream.videoActive !== enabled)) return [3 /*break*/, 9];
                        affectedMediaStream_1 = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote : this.stream.getMediaStream();
                        mustRestartMediaStream_1 = false;
                        affectedMediaStream_1.getVideoTracks().forEach(function (track) {
                            track.enabled = enabled;
                            if (!enabled && resource === true) {
                                track.stop();
                            }
                            else if (enabled && track.readyState === 'ended') {
                                // Resource was freed
                                mustRestartMediaStream_1 = true;
                            }
                        });
                        if (!(!enabled && resource === true && !!this.stream.filter && this.stream.filter.type.startsWith('VB:'))) return [3 /*break*/, 2];
                        this.stream.lastVBFilter = this.stream.filter; // Save the filter to be re-applied in case of unmute
                        return [4 /*yield*/, this.stream.removeFilterAux(true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!mustRestartMediaStream_1) return [3 /*break*/, 8];
                        oldVideoTrack = affectedMediaStream_1.getVideoTracks()[0];
                        affectedMediaStream_1.removeTrack(oldVideoTrack);
                        replaceVideoTrack = function (tr) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        affectedMediaStream_1.addTrack(tr);
                                        if (!this.stream.isLocalStreamPublished) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.replaceTrackInRtcRtpSender(tr)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (!!this.stream.lastVBFilter) {
                                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                var options, lastExecMethod;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            options = this.stream.lastVBFilter.options;
                                                            lastExecMethod = this.stream.lastVBFilter.lastExecMethod;
                                                            if (!!lastExecMethod && lastExecMethod.method === 'update') {
                                                                options = Object.assign({}, options, lastExecMethod.params);
                                                            }
                                                            return [4 /*yield*/, this.stream.applyFilter(this.stream.lastVBFilter.type, options)];
                                                        case 1:
                                                            _a.sent();
                                                            delete this.stream.lastVBFilter;
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }, 1);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!(!!resource && resource instanceof MediaStreamTrack)) return [3 /*break*/, 4];
                        return [4 /*yield*/, replaceVideoTrack(resource)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: false, video: this.stream.lastVideoTrackConstraints })];
                    case 5:
                        mediaStream = _a.sent();
                        return [4 /*yield*/, replaceVideoTrack(mediaStream.getVideoTracks()[0])];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        return [2 /*return*/, reject(error_1)];
                    case 8:
                        if (!!this.session && !!this.stream.streamId) {
                            this.session.openvidu.sendRequest('streamPropertyChanged', {
                                streamId: this.stream.streamId,
                                property: 'videoActive',
                                newValue: enabled,
                                reason: 'publishVideo'
                            }, function (error, response) {
                                if (error) {
                                    logger.error("Error sending 'streamPropertyChanged' event", error);
                                }
                                else {
                                    _this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this.session, _this.stream, 'videoActive', enabled, !enabled, 'publishVideo')]);
                                    _this.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this, _this.stream, 'videoActive', enabled, !enabled, 'publishVideo')]);
                                    _this.session.sendVideoData(_this.stream.streamManager);
                                }
                            });
                        }
                        this.stream.videoActive = enabled;
                        logger.info("'Publisher' has " + (enabled ? 'published' : 'unpublished') + ' its video stream');
                        return [2 /*return*/, resolve()];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Call this method before [[Session.publish]] if you prefer to subscribe to your Publisher's remote stream instead of using the local stream, as any other user would do.
     */
    Publisher.prototype.subscribeToRemote = function (value) {
        value = (value !== undefined) ? value : true;
        this.isSubscribedToRemote = value;
        this.stream.subscribeToMyRemote(value);
    };
    /**
     * See [[EventDispatcher.on]]
     */
    Publisher.prototype.on = function (type, handler) {
        var _this = this;
        _super.prototype.on.call(this, type, handler);
        if (type === 'streamCreated') {
            if (!!this.stream && this.stream.isLocalStreamPublished) {
                this.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, this, 'streamCreated', this.stream, '')]);
            }
            else {
                this.stream.ee.on('stream-created-by-publisher', function () {
                    _this.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, _this, 'streamCreated', _this.stream, '')]);
                });
            }
        }
        if (type === 'accessAllowed') {
            if (this.accessAllowed) {
                this.emitEvent('accessAllowed', []);
            }
        }
        if (type === 'accessDenied') {
            if (this.accessDenied) {
                this.emitEvent('accessDenied', []);
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.once]]
     */
    Publisher.prototype.once = function (type, handler) {
        var _this = this;
        _super.prototype.once.call(this, type, handler);
        if (type === 'streamCreated') {
            if (!!this.stream && this.stream.isLocalStreamPublished) {
                this.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, this, 'streamCreated', this.stream, '')]);
            }
            else {
                this.stream.ee.once('stream-created-by-publisher', function () {
                    _this.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, _this, 'streamCreated', _this.stream, '')]);
                });
            }
        }
        if (type === 'accessAllowed') {
            if (this.accessAllowed) {
                this.emitEvent('accessAllowed', []);
            }
        }
        if (type === 'accessDenied') {
            if (this.accessDenied) {
                this.emitEvent('accessDenied', []);
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.off]]
     */
    Publisher.prototype.off = function (type, handler) {
        _super.prototype.off.call(this, type, handler);
        return this;
    };
    /**
     * Replaces the current video or audio track with a different one. This allows you to replace an ongoing track with a different one
     * without having to renegotiate the whole WebRTC connection (that is, initializing a new Publisher, unpublishing the previous one
     * and publishing the new one).
     *
     * You can get this new MediaStreamTrack by using the native Web API or simply with [[OpenVidu.getUserMedia]] method.
     *
     * **WARNING: this method has been proven to work in the majority of cases, but there may be some combinations of published/replaced tracks that may be incompatible
     * between them and break the connection in OpenVidu Server. A complete renegotiation may be the only solution in this case.
     * Visit [RTCRtpSender.replaceTrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack) documentation for further details.**
     *
     * @param track The [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) object to replace the current one.
     * If it is an audio track, the current audio track will be the replaced one. If it is a video track, the current video track will be the replaced one.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the track was successfully replaced and rejected with an Error object in other case
     */
    Publisher.prototype.replaceTrack = function (track) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.replaceTrackAux(track, true)];
            });
        });
    };
    /* Hidden methods */
    /**
     * @hidden
     */
    Publisher.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var constraints = {};
            var constraintsAux = {};
            var timeForDialogEvent = 2000;
            var startTime;
            var errorCallback = function (openViduError) {
                _this.accessDenied = true;
                _this.accessAllowed = false;
                logger.error("Publisher initialization failed. ".concat(openViduError.name, ": ").concat(openViduError.message));
                return reject(openViduError);
            };
            var successCallback = function (mediaStream) {
                var _a, _b;
                _this.accessAllowed = true;
                _this.accessDenied = false;
                if (typeof MediaStreamTrack !== 'undefined' && _this.properties.audioSource instanceof MediaStreamTrack) {
                    mediaStream.removeTrack(mediaStream.getAudioTracks()[0]);
                    mediaStream.addTrack(_this.properties.audioSource);
                }
                if (typeof MediaStreamTrack !== 'undefined' && _this.properties.videoSource instanceof MediaStreamTrack) {
                    mediaStream.removeTrack(mediaStream.getVideoTracks()[0]);
                    mediaStream.addTrack(_this.properties.videoSource);
                }
                // Apply PublisherProperties.publishAudio and PublisherProperties.publishVideo
                if (!!mediaStream.getAudioTracks()[0]) {
                    var enabled = (_this.stream.audioActive !== undefined && _this.stream.audioActive !== null) ? _this.stream.audioActive : !!_this.stream.outboundStreamOpts.publisherProperties.publishAudio;
                    mediaStream.getAudioTracks()[0].enabled = enabled;
                }
                if (!!mediaStream.getVideoTracks()[0]) {
                    var enabled = (_this.stream.videoActive !== undefined && _this.stream.videoActive !== null) ? _this.stream.videoActive : !!_this.stream.outboundStreamOpts.publisherProperties.publishVideo;
                    mediaStream.getVideoTracks()[0].enabled = enabled;
                }
                // Set Content Hint on all MediaStreamTracks
                for (var _i = 0, _c = mediaStream.getAudioTracks(); _i < _c.length; _i++) {
                    var track = _c[_i];
                    if (!((_a = track.contentHint) === null || _a === void 0 ? void 0 : _a.length)) {
                        // contentHint for audio: "", "speech", "speech-recognition", "music".
                        // https://w3c.github.io/mst-content-hint/#audio-content-hints
                        track.contentHint = '';
                        logger.info("Audio track Content Hint set: '".concat(track.contentHint, "'"));
                    }
                }
                for (var _d = 0, _e = mediaStream.getVideoTracks(); _d < _e.length; _d++) {
                    var track = _e[_d];
                    if (!((_b = track.contentHint) === null || _b === void 0 ? void 0 : _b.length)) {
                        // contentHint for video: "", "motion", "detail", "text".
                        // https://w3c.github.io/mst-content-hint/#video-content-hints
                        switch (_this.stream.typeOfVideo) {
                            case TypeOfVideo_1.TypeOfVideo.SCREEN:
                                track.contentHint = "detail";
                                break;
                            case TypeOfVideo_1.TypeOfVideo.CUSTOM:
                                logger.warn("CUSTOM type video track was provided without Content Hint!");
                                track.contentHint = "motion";
                                break;
                            case TypeOfVideo_1.TypeOfVideo.CAMERA:
                            case TypeOfVideo_1.TypeOfVideo.IPCAM:
                            default:
                                track.contentHint = "motion";
                                break;
                        }
                        logger.info("Video track Content Hint set: '".concat(track.contentHint, "'"));
                    }
                }
                _this.initializeVideoReference(mediaStream);
                if (!_this.stream.displayMyRemote()) {
                    // When we are subscribed to our remote we don't still set the MediaStream object in the video elements to
                    // avoid early 'streamPlaying' event
                    _this.stream.updateMediaStreamInVideos();
                }
                delete _this.firstVideoElement;
                if (_this.stream.isSendVideo()) {
                    // Has video track
                    _this.getVideoDimensions().then(function (dimensions) {
                        _this.stream.videoDimensions = {
                            width: dimensions.width,
                            height: dimensions.height
                        };
                        if (_this.stream.isSendScreen()) {
                            // Set interval to listen for screen resize events
                            _this.screenShareResizeInterval = setInterval(function () {
                                var settings = mediaStream.getVideoTracks()[0].getSettings();
                                var newWidth = settings.width;
                                var newHeight = settings.height;
                                var widthChanged = newWidth != null && newWidth !== _this.stream.videoDimensions.width;
                                var heightChanged = newHeight != null && newHeight !== _this.stream.videoDimensions.height;
                                if (_this.stream.isLocalStreamPublished && (widthChanged || heightChanged)) {
                                    _this.openvidu.sendVideoDimensionsChangedEvent(_this, 'screenResized', _this.stream.videoDimensions.width, _this.stream.videoDimensions.height, newWidth || 0, newHeight || 0);
                                }
                            }, 650);
                        }
                        _this.stream.isLocalStreamReadyToPublish = true;
                        _this.stream.ee.emitEvent('stream-ready-to-publish', []);
                    });
                }
                else {
                    // Only audio track (no videoDimensions)
                    _this.stream.isLocalStreamReadyToPublish = true;
                    _this.stream.ee.emitEvent('stream-ready-to-publish', []);
                }
                return resolve();
            };
            var getMediaSuccess = function (mediaStream, definedAudioConstraint) {
                _this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                if (_this.stream.isSendScreen() && _this.stream.isSendAudio()) {
                    // When getting desktop as user media audio constraint must be false. Now we can ask for it if required
                    constraintsAux.audio = definedAudioConstraint;
                    constraintsAux.video = false;
                    startTime = Date.now();
                    _this.setPermissionDialogTimer(timeForDialogEvent);
                    navigator.mediaDevices.getUserMedia(constraintsAux)
                        .then(function (audioOnlyStream) {
                        _this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                        mediaStream.addTrack(audioOnlyStream.getAudioTracks()[0]);
                        successCallback(mediaStream);
                    })
                        .catch(function (error) {
                        _this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                        mediaStream.getAudioTracks().forEach(function (track) {
                            track.stop();
                        });
                        mediaStream.getVideoTracks().forEach(function (track) {
                            track.stop();
                        });
                        errorCallback(_this.openvidu.generateAudioDeviceError(error, constraints));
                        return;
                    });
                }
                else {
                    successCallback(mediaStream);
                }
            };
            var getMediaError = function (error) {
                logger.error("getMediaError: ".concat(error.toString()));
                _this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                if (error.name === 'Error') {
                    // Safari OverConstrainedError has as name property 'Error' instead of 'OverConstrainedError'
                    error.name = error.constructor.name;
                }
                var errorName, errorMessage;
                switch (error.name.toLowerCase()) {
                    case 'notfounderror':
                        navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: constraints.video
                        })
                            .then(function (mediaStream) {
                            mediaStream.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                            errorName = OpenViduError_1.OpenViduErrorName.INPUT_AUDIO_DEVICE_NOT_FOUND;
                            errorMessage = error.toString();
                            errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        }).catch(function (e) {
                            errorName = OpenViduError_1.OpenViduErrorName.INPUT_VIDEO_DEVICE_NOT_FOUND;
                            errorMessage = error.toString();
                            errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        });
                        break;
                    case 'notallowederror':
                        errorName = _this.stream.isSendScreen() ? OpenViduError_1.OpenViduErrorName.SCREEN_CAPTURE_DENIED : OpenViduError_1.OpenViduErrorName.DEVICE_ACCESS_DENIED;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        break;
                    case 'overconstrainederror':
                        navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: constraints.video
                        })
                            .then(function (mediaStream) {
                            mediaStream.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                            if (error.constraint.toLowerCase() === 'deviceid') {
                                errorName = OpenViduError_1.OpenViduErrorName.INPUT_AUDIO_DEVICE_NOT_FOUND;
                                errorMessage = "Audio input device with deviceId '" + constraints.audio.deviceId.exact + "' not found";
                            }
                            else {
                                errorName = OpenViduError_1.OpenViduErrorName.PUBLISHER_PROPERTIES_ERROR;
                                errorMessage = "Audio input device doesn't support the value passed for constraint '" + error.constraint + "'";
                            }
                            errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        }).catch(function (e) {
                            if (error.constraint.toLowerCase() === 'deviceid') {
                                errorName = OpenViduError_1.OpenViduErrorName.INPUT_VIDEO_DEVICE_NOT_FOUND;
                                errorMessage = "Video input device with deviceId '" + constraints.video.deviceId.exact + "' not found";
                            }
                            else {
                                errorName = OpenViduError_1.OpenViduErrorName.PUBLISHER_PROPERTIES_ERROR;
                                errorMessage = "Video input device doesn't support the value passed for constraint '" + error.constraint + "'";
                            }
                            errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        });
                        break;
                    case 'aborterror':
                    case 'notreadableerror':
                        errorName = OpenViduError_1.OpenViduErrorName.DEVICE_ALREADY_IN_USE;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        break;
                    default:
                        errorName = OpenViduError_1.OpenViduErrorName.GENERIC_ERROR;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError_1.OpenViduError(errorName, errorMessage));
                        break;
                }
            };
            _this.openvidu.generateMediaConstraints(_this.properties)
                .then(function (myConstraints) {
                var _a, _b;
                if (!!myConstraints.videoTrack && !!myConstraints.audioTrack ||
                    !!myConstraints.audioTrack && ((_a = myConstraints.constraints) === null || _a === void 0 ? void 0 : _a.video) === false ||
                    !!myConstraints.videoTrack && ((_b = myConstraints.constraints) === null || _b === void 0 ? void 0 : _b.audio) === false) {
                    // No need to call getUserMedia at all. MediaStreamTracks already provided
                    successCallback(_this.openvidu.addAlreadyProvidedTracks(myConstraints, new MediaStream(), _this.stream));
                    // Return as we do not need to process further
                    return;
                }
                constraints = myConstraints.constraints;
                var outboundStreamOptions = {
                    mediaConstraints: constraints,
                    publisherProperties: _this.properties
                };
                _this.stream.setOutboundStreamOptions(outboundStreamOptions);
                var definedAudioConstraint = ((constraints.audio === undefined) ? true : constraints.audio);
                constraintsAux.audio = _this.stream.isSendScreen() ? false : definedAudioConstraint;
                constraintsAux.video = constraints.video;
                startTime = Date.now();
                _this.setPermissionDialogTimer(timeForDialogEvent);
                if (_this.stream.isSendScreen() && navigator.mediaDevices['getDisplayMedia'] && !platform.isElectron()) {
                    navigator.mediaDevices['getDisplayMedia']({ video: true })
                        .then(function (mediaStream) {
                        _this.openvidu.addAlreadyProvidedTracks(myConstraints, mediaStream);
                        getMediaSuccess(mediaStream, definedAudioConstraint);
                    })
                        .catch(function (error) {
                        getMediaError(error);
                    });
                }
                else {
                    _this.stream.lastVideoTrackConstraints = constraintsAux.video;
                    navigator.mediaDevices.getUserMedia(constraintsAux)
                        .then(function (mediaStream) {
                        _this.openvidu.addAlreadyProvidedTracks(myConstraints, mediaStream, _this.stream);
                        getMediaSuccess(mediaStream, definedAudioConstraint);
                    })
                        .catch(function (error) {
                        getMediaError(error);
                    });
                }
            })
                .catch(function (error) {
                errorCallback(error);
            });
        });
    };
    /**
     * @hidden
     */
    Publisher.prototype.replaceTrackAux = function (track, updateLastConstraints) {
        return __awaiter(this, void 0, void 0, function () {
            var trackOriginalEnabledValue, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        trackOriginalEnabledValue = track.enabled;
                        if (track.kind === 'video') {
                            track.enabled = this.stream.videoActive;
                        }
                        else if (track.kind === 'audio') {
                            track.enabled = this.stream.audioActive;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        if (!this.stream.isLocalStreamPublished) return [3 /*break*/, 4];
                        // Only if the Publisher has been published is necessary to call native Web API RTCRtpSender.replaceTrack
                        // If it has not been published yet, replacing it on the MediaStream object is enough
                        return [4 /*yield*/, this.replaceTrackInMediaStream(track, updateLastConstraints)];
                    case 2:
                        // Only if the Publisher has been published is necessary to call native Web API RTCRtpSender.replaceTrack
                        // If it has not been published yet, replacing it on the MediaStream object is enough
                        _a.sent();
                        return [4 /*yield*/, this.replaceTrackInRtcRtpSender(track)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this.replaceTrackInMediaStream(track, updateLastConstraints)];
                    case 5: 
                    // Publisher not published. Simply replace the track on the local MediaStream
                    return [2 /*return*/, _a.sent()];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        track.enabled = trackOriginalEnabledValue;
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @hidden
     *
     * To obtain the videoDimensions we wait for the video reference to have enough metadata
     * and then try to use MediaStreamTrack.getSettingsMethod(). If not available, then we
     * use the HTMLVideoElement properties videoWidth and videoHeight
     */
    Publisher.prototype.getVideoDimensions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Ionic iOS and Safari iOS supposedly require the video element to actually exist inside the DOM
            var requiresDomInsertion = platform.isIonicIos() || platform.isIOSWithSafari();
            var loadedmetadataListener;
            var resolveDimensions = function () {
                var width;
                var height;
                if (typeof _this.stream.getMediaStream().getVideoTracks()[0].getSettings === 'function') {
                    var settings = _this.stream.getMediaStream().getVideoTracks()[0].getSettings();
                    width = settings.width || _this.videoReference.videoWidth;
                    height = settings.height || _this.videoReference.videoHeight;
                }
                else {
                    logger.warn('MediaStreamTrack does not have getSettings method on ' + platform.getDescription());
                    width = _this.videoReference.videoWidth;
                    height = _this.videoReference.videoHeight;
                }
                if (loadedmetadataListener != null) {
                    _this.videoReference.removeEventListener('loadedmetadata', loadedmetadataListener);
                }
                if (requiresDomInsertion) {
                    document.body.removeChild(_this.videoReference);
                }
                return resolve({ width: width, height: height });
            };
            if (_this.videoReference.readyState >= 1) {
                // The video already has metadata available
                // No need of loadedmetadata event
                resolveDimensions();
            }
            else {
                // The video does not have metadata available yet
                // Must listen to loadedmetadata event
                loadedmetadataListener = function () {
                    if (!_this.videoReference.videoWidth) {
                        var interval_1 = setInterval(function () {
                            if (!!_this.videoReference.videoWidth) {
                                clearInterval(interval_1);
                                resolveDimensions();
                            }
                        }, 40);
                    }
                    else {
                        resolveDimensions();
                    }
                };
                _this.videoReference.addEventListener('loadedmetadata', loadedmetadataListener);
                if (requiresDomInsertion) {
                    document.body.appendChild(_this.videoReference);
                }
            }
        });
    };
    /**
     * @hidden
     */
    Publisher.prototype.reestablishStreamPlayingEvent = function () {
        if (this.ee.getListeners('streamPlaying').length > 0) {
            this.addPlayEventToFirstVideo();
        }
    };
    /**
     * @hidden
     */
    Publisher.prototype.initializeVideoReference = function (mediaStream) {
        this.videoReference = document.createElement('video');
        this.videoReference.setAttribute('muted', 'true');
        this.videoReference.style.display = 'none';
        if (platform.isSafariBrowser() || (platform.isIPhoneOrIPad() && (platform.isChromeMobileBrowser() || platform.isEdgeMobileBrowser() || platform.isOperaMobileBrowser() || platform.isFirefoxMobileBrowser()))) {
            this.videoReference.setAttribute('playsinline', 'true');
        }
        this.stream.setMediaStream(mediaStream);
        if (!!this.firstVideoElement) {
            this.createVideoElement(this.firstVideoElement.targetElement, this.properties.insertMode);
        }
        this.videoReference.srcObject = mediaStream;
    };
    /**
     * @hidden
     */
    Publisher.prototype.replaceTrackInMediaStream = function (track, updateLastConstraints) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaStream, removedTrack;
            return __generator(this, function (_a) {
                mediaStream = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote : this.stream.getMediaStream();
                if (track.kind === 'video') {
                    removedTrack = mediaStream.getVideoTracks()[0];
                    if (updateLastConstraints) {
                        this.stream.lastVideoTrackConstraints = track.getConstraints();
                    }
                }
                else {
                    removedTrack = mediaStream.getAudioTracks()[0];
                }
                mediaStream.removeTrack(removedTrack);
                removedTrack.stop();
                mediaStream.addTrack(track);
                if (track.kind === 'video' && this.stream.isLocalStreamPublished && updateLastConstraints) {
                    this.openvidu.sendNewVideoDimensionsIfRequired(this, 'trackReplaced', 50, 30);
                    this.session.sendVideoData(this.stream.streamManager, 5, true, 5);
                }
                return [2 /*return*/];
            });
        });
    };
    /* Private methods */
    Publisher.prototype.setPermissionDialogTimer = function (waitTime) {
        var _this = this;
        this.permissionDialogTimeout = setTimeout(function () {
            _this.emitEvent('accessDialogOpened', []);
        }, waitTime);
    };
    Publisher.prototype.clearPermissionDialogTimer = function (startTime, waitTime) {
        clearTimeout(this.permissionDialogTimeout);
        if ((Date.now() - startTime) > waitTime) {
            // Permission dialog was shown and now is closed
            this.emitEvent('accessDialogClosed', []);
        }
    };
    Publisher.prototype.replaceTrackInRtcRtpSender = function (track) {
        return __awaiter(this, void 0, void 0, function () {
            var senders, sender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        senders = this.stream.getRTCPeerConnection().getSenders();
                        if (track.kind === 'video') {
                            sender = senders.find(function (s) { return !!s.track && s.track.kind === 'video'; });
                            if (!sender) {
                                throw new Error('There\'s no replaceable track for that kind of MediaStreamTrack in this Publisher object');
                            }
                        }
                        else if (track.kind === 'audio') {
                            sender = senders.find(function (s) { return !!s.track && s.track.kind === 'audio'; });
                            if (!sender) {
                                throw new Error('There\'s no replaceable track for that kind of MediaStreamTrack in this Publisher object');
                            }
                        }
                        else {
                            throw new Error('Unknown track kind ' + track.kind);
                        }
                        return [4 /*yield*/, sender.replaceTrack(track)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Publisher;
}(StreamManager_1.StreamManager));
exports.Publisher = Publisher;
//# sourceMappingURL=Publisher.js.map