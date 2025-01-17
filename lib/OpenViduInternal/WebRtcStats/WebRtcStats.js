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
exports.WebRtcStats = void 0;
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
;
var WebRtcStats = /** @class */ (function () {
    function WebRtcStats(stream) {
        this.stream = stream;
        this.STATS_ITEM_NAME = 'webrtc-stats-config';
        this.webRtcStatsEnabled = false;
        this.statsInterval = 1;
        platform = Platform_1.PlatformUtils.getInstance();
    }
    WebRtcStats.prototype.isEnabled = function () {
        return this.webRtcStatsEnabled;
    };
    WebRtcStats.prototype.initWebRtcStats = function () {
        var _this = this;
        var webrtcObj = localStorage.getItem(this.STATS_ITEM_NAME);
        if (!!webrtcObj) {
            this.webRtcStatsEnabled = true;
            var webrtcStatsConfig = JSON.parse(webrtcObj);
            // webrtc object found in local storage
            logger.warn('WebRtc stats enabled for stream ' + this.stream.streamId + ' of connection ' + this.stream.connection.connectionId);
            logger.warn('localStorage item: ' + JSON.stringify(webrtcStatsConfig));
            this.POST_URL = webrtcStatsConfig.httpEndpoint;
            this.statsInterval = webrtcStatsConfig.interval; // Interval in seconds
            this.webRtcStatsIntervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sendStatsToHttpEndpoint()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, this.statsInterval * 1000);
        }
        else {
            logger.debug('WebRtc stats not enabled');
        }
    };
    // {
    // "localCandidate": {
    //     "id": "RTCIceCandidate_/r4P1y2Q",
    //     "timestamp": 1616080155617,
    //     "type": "local-candidate",
    //     "transportId": "RTCTransport_0_1",
    //     "isRemote": false,
    //     "networkType": "wifi",
    //     "ip": "123.45.67.89",
    //     "port": 63340,
    //     "protocol": "udp",
    //     "candidateType": "srflx",
    //     "priority": 1686052607,
    //     "deleted": false,
    //     "raw": [
    //     "candidate:3345412921 1 udp 1686052607 123.45.67.89 63340 typ srflx raddr 192.168.1.31 rport 63340 generation 0 ufrag 0ZtT network-id 1 network-cost 10",
    //     "candidate:58094482 1 udp 41885695 98.76.54.32 44431 typ relay raddr 123.45.67.89 rport 63340 generation 0 ufrag 0ZtT network-id 1 network-cost 10"
    //     ]
    // },
    // "remoteCandidate": {
    //     "id": "RTCIceCandidate_1YO18gph",
    //     "timestamp": 1616080155617,
    //     "type": "remote-candidate",
    //     "transportId": "RTCTransport_0_1",
    //     "isRemote": true,
    //     "ip": "12.34.56.78",
    //     "port": 64989,
    //     "protocol": "udp",
    //     "candidateType": "srflx",
    //     "priority": 1679819263,
    //     "deleted": false,
    //     "raw": [
    //     "candidate:16 1 UDP 1679819263 12.34.56.78 64989 typ srflx raddr 172.19.0.1 rport 64989",
    //     "candidate:16 1 UDP 1679819263 12.34.56.78 64989 typ srflx raddr 172.19.0.1 rport 64989"
    //     ]
    // }
    // }
    // Have been tested in:
    //   - Linux Desktop:
    //       - Chrome 89.0.4389.90
    //       - Opera 74.0.3911.218
    //       - Firefox 86
    //       - Microsoft Edge 91.0.825.0
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - Windows Desktop:
    //       - Chrome 89.0.4389.90
    //       - Opera 74.0.3911.232
    //       - Firefox 86.0.1
    //       - Microsoft Edge 89.0.774.54
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - MacOS Desktop:
    //       - Chrome 89.0.4389.90
    //       - Firefox 87.0
    //       - Opera 75.0.3969.93
    //       - Microsoft Edge 89.0.774.57
    //       - Safari 14.0 (14610.1.28.1.9)
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - Android:
    //       - Chrome Mobile 89.0.4389.90
    //       - Opera 62.3.3146.57763
    //       - Firefox Mobile 86.6.1
    //       - Microsoft Edge Mobile 46.02.4.5147
    //       - Ionic 5
    //       - React Native 0.64
    //   - iOS:
    //       - Safari Mobile
    //       - ¿Ionic?
    //       - ¿React Native?
    WebRtcStats.prototype.getSelectedIceCandidateInfo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var statsReport, transportStat, candidatePairs, localCandidates, remoteCandidates, selectedCandidatePair, selectedCandidatePairId, length_1, iterator, i, candidatePair, localCandidateId, remoteCandidateId, finalLocalCandidate, candList, cand, _i, cand_1, c, finalRemoteCandidate, candList, cand, _a, cand_2, c;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stream.getRTCPeerConnection().getStats()];
                    case 1:
                        statsReport = _b.sent();
                        candidatePairs = new Map();
                        localCandidates = new Map();
                        remoteCandidates = new Map();
                        statsReport.forEach(function (stat) {
                            if (stat.type === 'transport' && (platform.isChromium() || platform.isSafariBrowser() || platform.isReactNative())) {
                                transportStat = stat;
                            }
                            switch (stat.type) {
                                case 'candidate-pair':
                                    candidatePairs.set(stat.id, stat);
                                    break;
                                case 'local-candidate':
                                    localCandidates.set(stat.id, stat);
                                    break;
                                case 'remote-candidate':
                                    remoteCandidates.set(stat.id, stat);
                                    break;
                            }
                        });
                        if (transportStat != null) {
                            selectedCandidatePairId = transportStat.selectedCandidatePairId;
                            selectedCandidatePair = candidatePairs.get(selectedCandidatePairId);
                        }
                        else {
                            length_1 = candidatePairs.size;
                            iterator = candidatePairs.values();
                            for (i = 0; i < length_1; i++) {
                                candidatePair = iterator.next().value;
                                if (candidatePair['selected']) {
                                    selectedCandidatePair = candidatePair;
                                    break;
                                }
                            }
                        }
                        localCandidateId = selectedCandidatePair.localCandidateId;
                        remoteCandidateId = selectedCandidatePair.remoteCandidateId;
                        finalLocalCandidate = localCandidates.get(localCandidateId);
                        if (!!finalLocalCandidate) {
                            candList = this.stream.getLocalIceCandidateList();
                            cand = candList.filter(function (c) {
                                return (!!c.candidate &&
                                    (c.candidate.indexOf(finalLocalCandidate.ip) >= 0 || c.candidate.indexOf(finalLocalCandidate.address) >= 0) &&
                                    c.candidate.indexOf(finalLocalCandidate.port) >= 0);
                            });
                            finalLocalCandidate.raw = [];
                            for (_i = 0, cand_1 = cand; _i < cand_1.length; _i++) {
                                c = cand_1[_i];
                                finalLocalCandidate.raw.push(c.candidate);
                            }
                        }
                        else {
                            finalLocalCandidate = 'ERROR: No active local ICE candidate. Probably ICE-TCP is being used';
                        }
                        finalRemoteCandidate = remoteCandidates.get(remoteCandidateId);
                        if (!!finalRemoteCandidate) {
                            candList = this.stream.getRemoteIceCandidateList();
                            cand = candList.filter(function (c) {
                                return (!!c.candidate &&
                                    (c.candidate.indexOf(finalRemoteCandidate.ip) >= 0 || c.candidate.indexOf(finalRemoteCandidate.address) >= 0) &&
                                    c.candidate.indexOf(finalRemoteCandidate.port) >= 0);
                            });
                            finalRemoteCandidate.raw = [];
                            for (_a = 0, cand_2 = cand; _a < cand_2.length; _a++) {
                                c = cand_2[_a];
                                finalRemoteCandidate.raw.push(c.candidate);
                            }
                        }
                        else {
                            finalRemoteCandidate = 'ERROR: No active remote ICE candidate. Probably ICE-TCP is being used';
                        }
                        return [2 /*return*/, resolve({
                                localCandidate: finalLocalCandidate,
                                remoteCandidate: finalRemoteCandidate
                            })];
                }
            });
        }); });
    };
    WebRtcStats.prototype.stopWebRtcStats = function () {
        if (this.webRtcStatsEnabled) {
            clearInterval(this.webRtcStatsIntervalId);
            logger.warn('WebRtc stats stopped for disposed stream ' + this.stream.streamId + ' of connection ' + this.stream.connection.connectionId);
        }
    };
    WebRtcStats.prototype.sendStats = function (url, response) {
        return __awaiter(this, void 0, void 0, function () {
            var configuration, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        configuration = {
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(response),
                            method: 'POST',
                        };
                        return [4 /*yield*/, fetch(url, configuration)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger.error("sendStats error: ".concat(JSON.stringify(error_1)));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WebRtcStats.prototype.sendStatsToHttpEndpoint = function () {
        return __awaiter(this, void 0, void 0, function () {
            var webrtcStats, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCommonStats()];
                    case 1:
                        webrtcStats = _a.sent();
                        response = this.generateJSONStatsResponse(webrtcStats);
                        return [4 /*yield*/, this.sendStats(this.POST_URL, response)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        logger.log(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Have been tested in:
    //   - Linux Desktop:
    //       - Chrome 89.0.4389.90
    //       - Opera 74.0.3911.218
    //       - Firefox 86
    //       - Microsoft Edge 91.0.825.0
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - Windows Desktop:
    //       - Chrome 89.0.4389.90
    //       - Opera 74.0.3911.232
    //       - Firefox 86.0.1
    //       - Microsoft Edge 89.0.774.54
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - MacOS Desktop:
    //       - Chrome 89.0.4389.90
    //       - Opera 75.0.3969.93
    //       - Firefox 87.0
    //       - Microsoft Edge 89.0.774.57
    //       - Safari 14.0 (14610.1.28.1.9)
    //       - Electron 11.3.0 (Chromium 87.0.4280.141)
    //   - Android:
    //       - Chrome Mobile 89.0.4389.90
    //       - Opera 62.3.3146.57763
    //       - Firefox Mobile 86.6.1
    //       - Microsoft Edge Mobile 46.02.4.5147
    //       - Ionic 5
    //       - React Native 0.64
    //   - iOS:
    //       - Safari Mobile
    //       - ¿Ionic?
    //       - ¿React Native?
    WebRtcStats.prototype.getCommonStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var statsReport, response_1, videoTrackStats_1, candidatePairStats_1, error_3;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.stream.getRTCPeerConnection().getStats()];
                                case 1:
                                    statsReport = _a.sent();
                                    response_1 = this.getWebRtcStatsResponseOutline();
                                    videoTrackStats_1 = ['framesReceived', 'framesDropped', 'framesSent', 'frameHeight', 'frameWidth'];
                                    candidatePairStats_1 = ['availableOutgoingBitrate', 'currentRoundTripTime'];
                                    statsReport.forEach(function (stat) {
                                        var mediaType = stat.mediaType != null ? stat.mediaType : stat.kind;
                                        var addStat = function (direction, key) {
                                            if (stat[key] != null && response_1[direction] != null) {
                                                if (!mediaType && (videoTrackStats_1.indexOf(key) > -1)) {
                                                    mediaType = 'video';
                                                }
                                                if (direction != null && mediaType != null && key != null && response_1[direction][mediaType] != null) {
                                                    response_1[direction][mediaType][key] = Number(stat[key]);
                                                }
                                                else if (direction != null && key != null && candidatePairStats_1.includes(key)) {
                                                    // candidate-pair-stats
                                                    response_1[direction][key] = Number(stat[key]);
                                                }
                                            }
                                        };
                                        switch (stat.type) {
                                            case "outbound-rtp":
                                                addStat('outbound', 'bytesSent');
                                                addStat('outbound', 'packetsSent');
                                                addStat('outbound', 'framesEncoded');
                                                addStat('outbound', 'nackCount');
                                                addStat('outbound', 'firCount');
                                                addStat('outbound', 'pliCount');
                                                addStat('outbound', 'qpSum');
                                                break;
                                            case "inbound-rtp":
                                                addStat('inbound', 'bytesReceived');
                                                addStat('inbound', 'packetsReceived');
                                                addStat('inbound', 'packetsLost');
                                                addStat('inbound', 'jitter');
                                                addStat('inbound', 'framesDecoded');
                                                addStat('inbound', 'nackCount');
                                                addStat('inbound', 'firCount');
                                                addStat('inbound', 'pliCount');
                                                break;
                                            case 'track':
                                                addStat('inbound', 'jitterBufferDelay');
                                                addStat('inbound', 'framesReceived');
                                                addStat('outbound', 'framesDropped');
                                                addStat('outbound', 'framesSent');
                                                addStat(_this.stream.isLocal() ? 'outbound' : 'inbound', 'frameHeight');
                                                addStat(_this.stream.isLocal() ? 'outbound' : 'inbound', 'frameWidth');
                                                break;
                                            case 'candidate-pair':
                                                addStat('candidatepair', 'currentRoundTripTime');
                                                addStat('candidatepair', 'availableOutgoingBitrate');
                                                break;
                                        }
                                    });
                                    // Delete candidatepair from response if null
                                    if (!(response_1 === null || response_1 === void 0 ? void 0 : response_1.candidatepair) || Object.keys(response_1.candidatepair).length === 0) {
                                        delete response_1.candidatepair;
                                    }
                                    return [2 /*return*/, resolve(response_1)];
                                case 2:
                                    error_3 = _a.sent();
                                    logger.error('Error getting common stats: ', error_3);
                                    return [2 /*return*/, reject(error_3)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    WebRtcStats.prototype.generateJSONStatsResponse = function (stats) {
        return {
            '@timestamp': new Date().toISOString(),
            participant_id: this.stream.connection.data,
            session_id: this.stream.session.sessionId,
            platform: platform.getName(),
            platform_description: platform.getDescription(),
            stream: 'webRTC',
            webrtc_stats: stats
        };
    };
    WebRtcStats.prototype.getWebRtcStatsResponseOutline = function () {
        if (this.stream.isLocal()) {
            return {
                outbound: {
                    audio: {},
                    video: {}
                },
                candidatepair: {}
            };
        }
        else {
            return {
                inbound: {
                    audio: {},
                    video: {}
                }
            };
        }
    };
    return WebRtcStats;
}());
exports.WebRtcStats = WebRtcStats;
//# sourceMappingURL=WebRtcStats.js.map