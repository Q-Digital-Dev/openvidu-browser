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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.WebRtcPeerSendrecv = exports.WebRtcPeerSendonly = exports.WebRtcPeerRecvonly = exports.WebRtcPeer = void 0;
var freeice = require("freeice");
var uuid_1 = require("uuid");
var ExceptionEvent_1 = require("../Events/ExceptionEvent");
var OpenViduLogger_1 = require("../Logger/OpenViduLogger");
var Platform_1 = require("../Utils/Platform");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * @hidden
 */
var platform;
var WebRtcPeer = /** @class */ (function () {
    function WebRtcPeer(configuration) {
        var _this = this;
        this.remoteCandidatesQueue = [];
        this.localCandidatesQueue = [];
        this.iceCandidateList = [];
        this.candidategatheringdone = false;
        platform = Platform_1.PlatformUtils.getInstance();
        this.configuration = __assign(__assign({}, configuration), { iceServers: !!configuration.iceServers &&
                configuration.iceServers.length > 0
                ? configuration.iceServers
                : freeice(), mediaStream: configuration.mediaStream !== undefined
                ? configuration.mediaStream
                : null, mode: !!configuration.mode ? configuration.mode : "sendrecv", id: !!configuration.id ? configuration.id : this.generateUniqueId() });
        // prettier-ignore
        logger.debug("[WebRtcPeer] configuration:\n".concat(JSON.stringify(this.configuration, null, 2)));
        this.pc = new RTCPeerConnection({ iceServers: this.configuration.iceServers });
        this.pc.addEventListener("icecandidate", function (event) {
            if (event.candidate !== null) {
                // `RTCPeerConnectionIceEvent.candidate` is supposed to be an RTCIceCandidate:
                // https://w3c.github.io/webrtc-pc/#dom-rtcpeerconnectioniceevent-candidate
                //
                // But in practice, it is actually an RTCIceCandidateInit that can be used to
                // obtain a proper candidate, using the RTCIceCandidate constructor:
                // https://w3c.github.io/webrtc-pc/#dom-rtcicecandidate-constructor
                var candidateInit = event.candidate;
                var iceCandidate = new RTCIceCandidate(candidateInit);
                _this.configuration.onIceCandidate(iceCandidate);
                if (iceCandidate.candidate !== '') {
                    _this.localCandidatesQueue.push(iceCandidate);
                }
            }
        });
        this.pc.addEventListener('signalingstatechange', function () {
            if (_this.pc.signalingState === 'stable') {
                // SDP Offer/Answer finished. Add stored remote candidates.
                while (_this.iceCandidateList.length > 0) {
                    var candidate = _this.iceCandidateList.shift();
                    _this.pc.addIceCandidate(candidate);
                }
            }
        });
    }
    WebRtcPeer.prototype.getId = function () {
        return this.configuration.id;
    };
    /**
     * This method frees the resources used by WebRtcPeer
     */
    WebRtcPeer.prototype.dispose = function () {
        logger.debug('Disposing WebRtcPeer');
        if (this.pc) {
            if (this.pc.signalingState === 'closed') {
                return;
            }
            this.pc.close();
            this.remoteCandidatesQueue = [];
            this.localCandidatesQueue = [];
        }
    };
    // DEPRECATED LEGACY METHOD: Old WebRTC versions don't implement
    // Transceivers, and instead depend on the deprecated
    // "offerToReceiveAudio" and "offerToReceiveVideo".
    WebRtcPeer.prototype.createOfferLegacy = function () {
        if (!!this.configuration.mediaStream) {
            this.deprecatedPeerConnectionTrackApi();
        }
        var hasAudio = this.configuration.mediaConstraints.audio;
        var hasVideo = this.configuration.mediaConstraints.video;
        var options = {
            offerToReceiveAudio: this.configuration.mode !== "sendonly" && hasAudio,
            offerToReceiveVideo: this.configuration.mode !== "sendonly" && hasVideo,
        };
        logger.debug("[createOfferLegacy] RTCPeerConnection.createOffer() options:", JSON.stringify(options));
        return this.pc.createOffer(options);
    };
    /**
     * Creates an SDP offer from the local RTCPeerConnection to send to the other peer.
     * Only if the negotiation was initiated by this peer.
     */
    WebRtcPeer.prototype.createOffer = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var _i, _j, track, tcInit, trackSettings, trackConsts, trackWidth, trackHeight, trackPixels, maxLayers, l, layerDiv, encoding, tc, sendParams, needSetParams, error_1, message, _k, _l, kind, sdpOffer, error_2, message;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        // TODO: Delete this conditional when all supported browsers are
                        // modern enough to implement the Transceiver methods.
                        if (!("addTransceiver" in this.pc)) {
                            logger.warn("[createOffer] Method RTCPeerConnection.addTransceiver() is NOT available; using LEGACY offerToReceive{Audio,Video}");
                            return [2 /*return*/, this.createOfferLegacy()];
                        }
                        else {
                            logger.debug("[createOffer] Method RTCPeerConnection.addTransceiver() is available; using it");
                        }
                        if (!(this.configuration.mode !== "recvonly")) return [3 /*break*/, 7];
                        // To send media, assume that all desired media tracks have been
                        // already added by higher level code to our MediaStream.
                        if (!this.configuration.mediaStream) {
                            throw new Error("[WebRtcPeer.createOffer] Direction is '".concat(this.configuration.mode, "', but no stream was configured to be sent"));
                        }
                        _i = 0, _j = this.configuration.mediaStream.getTracks();
                        _m.label = 1;
                    case 1:
                        if (!(_i < _j.length)) return [3 /*break*/, 6];
                        track = _j[_i];
                        tcInit = {
                            direction: this.configuration.mode,
                            streams: [this.configuration.mediaStream],
                        };
                        if (track.kind === "video" && this.configuration.simulcast) {
                            trackSettings = track.getSettings();
                            trackConsts = track.getConstraints();
                            trackWidth = (_c = (_b = (_a = trackSettings.width) !== null && _a !== void 0 ? _a : trackConsts.width.ideal) !== null && _b !== void 0 ? _b : trackConsts.width) !== null && _c !== void 0 ? _c : 0;
                            trackHeight = (_f = (_e = (_d = trackSettings.height) !== null && _d !== void 0 ? _d : trackConsts.height.ideal) !== null && _e !== void 0 ? _e : trackConsts.height) !== null && _f !== void 0 ? _f : 0;
                            logger.info("[createOffer] Video track dimensions: ".concat(trackWidth, "x").concat(trackHeight));
                            trackPixels = trackWidth * trackHeight;
                            maxLayers = 0;
                            if (trackPixels >= 960 * 540) {
                                maxLayers = 3;
                            }
                            else if (trackPixels >= 480 * 270) {
                                maxLayers = 2;
                            }
                            else {
                                maxLayers = 1;
                            }
                            tcInit.sendEncodings = [];
                            for (l = 0; l < maxLayers; l++) {
                                layerDiv = Math.pow(2, (maxLayers - l - 1));
                                encoding = {
                                    rid: "rdiv" + layerDiv.toString(),
                                    // @ts-ignore -- Property missing from DOM types.
                                    scalabilityMode: "L1T1",
                                };
                                if (["detail", "text"].includes(track.contentHint)) {
                                    // Prioritize best resolution, for maximum picture detail.
                                    encoding.scaleResolutionDownBy = 1.0;
                                    // @ts-ignore -- Property missing from DOM types.
                                    encoding.maxFramerate = Math.floor(30 / layerDiv);
                                }
                                else {
                                    encoding.scaleResolutionDownBy = layerDiv;
                                }
                                tcInit.sendEncodings.push(encoding);
                            }
                        }
                        tc = this.pc.addTransceiver(track, tcInit);
                        if (!(track.kind === "video")) return [3 /*break*/, 5];
                        sendParams = tc.sender.getParameters();
                        needSetParams = false;
                        if (!((_g = sendParams.degradationPreference) === null || _g === void 0 ? void 0 : _g.length)) {
                            // degradationPreference for video: "balanced", "maintain-framerate", "maintain-resolution".
                            // https://www.w3.org/TR/2018/CR-webrtc-20180927/#dom-rtcdegradationpreference
                            if (["detail", "text"].includes(track.contentHint)) {
                                sendParams.degradationPreference = "maintain-resolution";
                            }
                            else {
                                sendParams.degradationPreference = "balanced";
                            }
                            logger.info("[createOffer] Video sender Degradation Preference set: ".concat(sendParams.degradationPreference));
                            // FIXME: Firefox implements degradationPreference on each individual encoding!
                            // (set it on every element of the sendParams.encodings array)
                            needSetParams = true;
                        }
                        // FIXME: Check that the simulcast encodings were applied.
                        // Firefox doesn't implement `RTCRtpTransceiverInit.sendEncodings`
                        // so the only way to enable simulcast is with `RTCRtpSender.setParameters()`.
                        //
                        // This next block can be deleted when Firefox fixes bug #1396918:
                        // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
                        //
                        // NOTE: This is done in a way that is compatible with all browsers, to save on
                        // browser-conditional code. The idea comes from WebRTC Adapter.js:
                        // * https://github.com/webrtcHacks/adapter/issues/998
                        // * https://github.com/webrtcHacks/adapter/blob/v7.7.0/src/js/firefox/firefox_shim.js#L231-L255
                        if (this.configuration.simulcast) {
                            if (((_h = sendParams.encodings) === null || _h === void 0 ? void 0 : _h.length) !== tcInit.sendEncodings.length) {
                                sendParams.encodings = tcInit.sendEncodings;
                                needSetParams = true;
                            }
                        }
                        if (!needSetParams) return [3 /*break*/, 5];
                        logger.debug("[createOffer] Setting new RTCRtpSendParameters to video sender");
                        _m.label = 2;
                    case 2:
                        _m.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, tc.sender.setParameters(sendParams)];
                    case 3:
                        _m.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _m.sent();
                        message = "[WebRtcPeer.createOffer] Cannot set RTCRtpSendParameters to video sender";
                        if (error_1 instanceof Error) {
                            message += ": ".concat(error_1.message);
                        }
                        throw new Error(message);
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        // To just receive media, create new recvonly transceivers.
                        for (_k = 0, _l = ["audio", "video"]; _k < _l.length; _k++) {
                            kind = _l[_k];
                            // Check if the media kind should be used.
                            if (!this.configuration.mediaConstraints[kind]) {
                                continue;
                            }
                            this.configuration.mediaStream = new MediaStream();
                            this.pc.addTransceiver(kind, {
                                direction: this.configuration.mode,
                                streams: [this.configuration.mediaStream],
                            });
                        }
                        _m.label = 8;
                    case 8:
                        _m.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.pc.createOffer()];
                    case 9:
                        sdpOffer = _m.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _m.sent();
                        message = "[WebRtcPeer.createOffer] Browser failed creating an SDP Offer";
                        if (error_2 instanceof Error) {
                            message += ": ".concat(error_2.message);
                        }
                        throw new Error(message);
                    case 11: return [2 /*return*/, sdpOffer];
                }
            });
        });
    };
    WebRtcPeer.prototype.deprecatedPeerConnectionTrackApi = function () {
        for (var _i = 0, _a = this.configuration.mediaStream.getTracks(); _i < _a.length; _i++) {
            var track = _a[_i];
            this.pc.addTrack(track, this.configuration.mediaStream);
        }
    };
    /**
     * Creates an SDP answer from the local RTCPeerConnection to send to the other peer
     * Only if the negotiation was initiated by the other peer
     */
    WebRtcPeer.prototype.createAnswer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // TODO: Delete this conditional when all supported browsers are
            // modern enough to implement the Transceiver methods.
            if ("getTransceivers" in _this.pc) {
                logger.debug("[createAnswer] Method RTCPeerConnection.getTransceivers() is available; using it");
                var _loop_1 = function (kind) {
                    // Check if the media kind should be used.
                    if (!_this.configuration.mediaConstraints[kind]) {
                        return "continue";
                    }
                    var tc = _this.pc
                        .getTransceivers()
                        .find(function (tc) { return tc.receiver.track.kind === kind; });
                    if (tc) {
                        // Enforce our desired direction.
                        tc.direction = _this.configuration.mode;
                    }
                    else {
                        return { value: reject(new Error("".concat(kind, " requested, but no transceiver was created from remote description"))) };
                    }
                };
                // Ensure that the PeerConnection already contains one Transceiver
                // for each kind of media.
                // The Transceivers should have been already created internally by
                // the PC itself, when `pc.setRemoteDescription(sdpOffer)` was called.
                for (var _i = 0, _a = ["audio", "video"]; _i < _a.length; _i++) {
                    var kind = _a[_i];
                    var state_1 = _loop_1(kind);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                _this.pc
                    .createAnswer()
                    .then(function (sdpAnswer) { return resolve(sdpAnswer); })
                    .catch(function (error) { return reject(error); });
            }
            else {
                // TODO: Delete else branch when all supported browsers are
                // modern enough to implement the Transceiver methods
                var offerAudio = void 0, offerVideo = true;
                if (!!_this.configuration.mediaConstraints) {
                    offerAudio = (typeof _this.configuration.mediaConstraints.audio === 'boolean') ?
                        _this.configuration.mediaConstraints.audio : true;
                    offerVideo = (typeof _this.configuration.mediaConstraints.video === 'boolean') ?
                        _this.configuration.mediaConstraints.video : true;
                    var constraints = {
                        offerToReceiveAudio: offerAudio,
                        offerToReceiveVideo: offerVideo
                    };
                    _this.pc.createAnswer(constraints)
                        .then(function (sdpAnswer) { return resolve(sdpAnswer); })
                        .catch(function (error) { return reject(error); });
                }
            }
            // else, there is nothing to do; the legacy createAnswer() options do
            // not offer any control over which tracks are included in the answer.
        });
    };
    /**
     * This peer initiated negotiation. Step 1/4 of SDP offer-answer protocol
     */
    WebRtcPeer.prototype.processLocalOffer = function (offer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pc.setLocalDescription(offer)
                .then(function () {
                var localDescription = _this.pc.localDescription;
                if (!!localDescription) {
                    logger.debug('Local description set', localDescription.sdp);
                    return resolve();
                }
                else {
                    return reject('Local description is not defined');
                }
            })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * Other peer initiated negotiation. Step 2/4 of SDP offer-answer protocol
     */
    WebRtcPeer.prototype.processRemoteOffer = function (sdpOffer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var offer = {
                type: 'offer',
                sdp: sdpOffer
            };
            logger.debug('SDP offer received, setting remote description', offer);
            if (_this.pc.signalingState === 'closed') {
                return reject('RTCPeerConnection is closed when trying to set remote description');
            }
            _this.setRemoteDescription(offer)
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * Other peer initiated negotiation. Step 3/4 of SDP offer-answer protocol
     */
    WebRtcPeer.prototype.processLocalAnswer = function (answer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            logger.debug('SDP answer created, setting local description');
            if (_this.pc.signalingState === 'closed') {
                return reject('RTCPeerConnection is closed when trying to set local description');
            }
            _this.pc.setLocalDescription(answer)
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * This peer initiated negotiation. Step 4/4 of SDP offer-answer protocol
     */
    WebRtcPeer.prototype.processRemoteAnswer = function (sdpAnswer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var answer = {
                type: 'answer',
                sdp: sdpAnswer
            };
            logger.debug('SDP answer received, setting remote description');
            if (_this.pc.signalingState === 'closed') {
                return reject('RTCPeerConnection is closed when trying to set remote description');
            }
            _this.setRemoteDescription(answer)
                .then(function () {
                // DEBUG: Uncomment for details.
                // {
                //     const tc = this.pc.getTransceivers().find((tc) => tc.sender.track?.kind === "video");
                //     // prettier-ignore
                //     logger.debug(`[processRemoteAnswer] Transceiver send parameters (effective):\n${JSON.stringify(tc?.sender.getParameters(), null, 2)}`);
                // }
                resolve();
            })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * @hidden
     */
    WebRtcPeer.prototype.setRemoteDescription = function (sdp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pc.setRemoteDescription(sdp)];
            });
        });
    };
    /**
     * Callback function invoked when an ICE candidate is received
     */
    WebRtcPeer.prototype.addIceCandidate = function (iceCandidate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            logger.debug('Remote ICE candidate received', iceCandidate);
            _this.remoteCandidatesQueue.push(iceCandidate);
            switch (_this.pc.signalingState) {
                case 'closed':
                    reject(new Error('PeerConnection object is closed'));
                    break;
                case 'stable':
                    if (!!_this.pc.remoteDescription) {
                        _this.pc.addIceCandidate(iceCandidate).then(function () { return resolve(); }).catch(function (error) { return reject(error); });
                    }
                    else {
                        _this.iceCandidateList.push(iceCandidate);
                        resolve();
                    }
                    break;
                default:
                    _this.iceCandidateList.push(iceCandidate);
                    resolve();
            }
        });
    };
    WebRtcPeer.prototype.addIceConnectionStateChangeListener = function (otherId) {
        var _this = this;
        this.pc.addEventListener('iceconnectionstatechange', function () {
            var iceConnectionState = _this.pc.iceConnectionState;
            switch (iceConnectionState) {
                case 'disconnected':
                    // Possible network disconnection
                    var msg1 = 'IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "disconnected". Possible network disconnection';
                    logger.warn(msg1);
                    _this.configuration.onIceConnectionStateException(ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_DISCONNECTED, msg1);
                    break;
                case 'failed':
                    var msg2 = 'IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') to "failed"';
                    logger.error(msg2);
                    _this.configuration.onIceConnectionStateException(ExceptionEvent_1.ExceptionEventName.ICE_CONNECTION_FAILED, msg2);
                    break;
                case 'closed':
                    logger.log('IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "closed"');
                    break;
                case 'new':
                    logger.log('IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "new"');
                    break;
                case 'checking':
                    logger.log('IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "checking"');
                    break;
                case 'connected':
                    logger.log('IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "connected"');
                    break;
                case 'completed':
                    logger.log('IceConnectionState of RTCPeerConnection ' + _this.configuration.id + ' (' + otherId + ') change to "completed"');
                    break;
            }
        });
    };
    /**
     * @hidden
     */
    WebRtcPeer.prototype.generateUniqueId = function () {
        return (0, uuid_1.v4)();
    };
    return WebRtcPeer;
}());
exports.WebRtcPeer = WebRtcPeer;
var WebRtcPeerRecvonly = /** @class */ (function (_super) {
    __extends(WebRtcPeerRecvonly, _super);
    function WebRtcPeerRecvonly(configuration) {
        var _this = this;
        configuration.mode = 'recvonly';
        _this = _super.call(this, configuration) || this;
        return _this;
    }
    return WebRtcPeerRecvonly;
}(WebRtcPeer));
exports.WebRtcPeerRecvonly = WebRtcPeerRecvonly;
var WebRtcPeerSendonly = /** @class */ (function (_super) {
    __extends(WebRtcPeerSendonly, _super);
    function WebRtcPeerSendonly(configuration) {
        var _this = this;
        configuration.mode = 'sendonly';
        _this = _super.call(this, configuration) || this;
        return _this;
    }
    return WebRtcPeerSendonly;
}(WebRtcPeer));
exports.WebRtcPeerSendonly = WebRtcPeerSendonly;
var WebRtcPeerSendrecv = /** @class */ (function (_super) {
    __extends(WebRtcPeerSendrecv, _super);
    function WebRtcPeerSendrecv(configuration) {
        var _this = this;
        configuration.mode = 'sendrecv';
        _this = _super.call(this, configuration) || this;
        return _this;
    }
    return WebRtcPeerSendrecv;
}(WebRtcPeer));
exports.WebRtcPeerSendrecv = WebRtcPeerSendrecv;
//# sourceMappingURL=WebRtcPeer.js.map