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
exports.Session = void 0;
var Connection_1 = require("./Connection");
var Filter_1 = require("./Filter");
var Subscriber_1 = require("./Subscriber");
var EventDispatcher_1 = require("./EventDispatcher");
var ConnectionEvent_1 = require("../OpenViduInternal/Events/ConnectionEvent");
var FilterEvent_1 = require("../OpenViduInternal/Events/FilterEvent");
var RecordingEvent_1 = require("../OpenViduInternal/Events/RecordingEvent");
var SessionDisconnectedEvent_1 = require("../OpenViduInternal/Events/SessionDisconnectedEvent");
var SignalEvent_1 = require("../OpenViduInternal/Events/SignalEvent");
var StreamEvent_1 = require("../OpenViduInternal/Events/StreamEvent");
var StreamPropertyChangedEvent_1 = require("../OpenViduInternal/Events/StreamPropertyChangedEvent");
var ConnectionPropertyChangedEvent_1 = require("../OpenViduInternal/Events/ConnectionPropertyChangedEvent");
var NetworkQualityLevelChangedEvent_1 = require("../OpenViduInternal/Events/NetworkQualityLevelChangedEvent");
var OpenViduError_1 = require("../OpenViduInternal/Enums/OpenViduError");
var VideoInsertMode_1 = require("../OpenViduInternal/Enums/VideoInsertMode");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
var Platform_1 = require("../OpenViduInternal/Utils/Platform");
/**
 * @hidden
 */
var semverMajor = require("semver/functions/major");
/**
 * @hidden
 */
var semverMinor = require("semver/functions/minor");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * @hidden
 */
var platform;
/**
 * Represents a video call. It can also be seen as a videoconference room where multiple users can connect.
 * Participants who publish their videos to a session can be seen by the rest of users connected to that specific session.
 * Initialized with [[OpenVidu.initSession]] method.
 *
 * See available event listeners at [[SessionEventMap]].
 */
var Session = /** @class */ (function (_super) {
    __extends(Session, _super);
    /**
     * @hidden
     */
    function Session(openvidu) {
        var _this = _super.call(this) || this;
        /**
         * Collection of all StreamManagers of this Session ([[Publisher]] and [[Subscriber]])
         */
        _this.streamManagers = [];
        // This map is only used to avoid race condition between 'joinRoom' response and 'onParticipantPublished' notification
        /**
         * @hidden
         */
        _this.remoteStreamsCreated = new Map();
        /**
         * @hidden
         */
        _this.remoteConnections = new Map();
        platform = Platform_1.PlatformUtils.getInstance();
        _this.openvidu = openvidu;
        return _this;
    }
    /**
     * Connects to the session using `token`. Parameter `metadata` allows you to pass extra data to share with other users when
     * they receive `streamCreated` event. The structure of `metadata` string is up to you (maybe some standardized format
     * as JSON or XML is a good idea).
     *
     * This metadata is not considered secure, as it is generated in the client side. To pass secure data, add it as a parameter in the
     * token generation operation (through the API REST, openvidu-java-client or openvidu-node-client).
     *
     * Only after the returned Promise is successfully resolved [[Session.connection]] object will be available and properly defined.
     *
     * #### Events dispatched
     *
     * The [[Session]] object of the local participant will first dispatch one or more `connectionCreated` events upon successful termination of this method:
     * - First one for your own local Connection object, so you can retrieve [[Session.connection]] property.
     * - Then one for each remote Connection previously connected to the Session, if any. Any other remote user connecting to the Session after you have
     * successfully connected will also dispatch a `connectionCreated` event when they do so.
     *
     * The [[Session]] object of the local participant will also dispatch a `streamCreated` event for each remote active [[Publisher]] that was already streaming
     * when connecting, just after dispatching all remote `connectionCreated` events.
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `connectionCreated` event.
     *
     * See [[ConnectionEvent]] and [[StreamEvent]] to learn more.
     *
     * @returns A Promise to which you must subscribe that is resolved if the the connection to the Session was successful and rejected with an Error object if not
     *
     */
    Session.prototype.connect = function (token, metadata) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.processToken(token);
            if (_this.openvidu.checkSystemRequirements()) {
                // Early configuration to deactivate automatic subscription to streams
                _this.options = {
                    sessionId: _this.sessionId,
                    participantId: token,
                    metadata: !!metadata ? _this.stringClientMetadata(metadata) : ''
                };
                _this.connectAux(token)
                    .then(function () { return resolve(); })
                    .catch(function (error) { return reject(error); });
            }
            else {
                return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.BROWSER_NOT_SUPPORTED, 'Browser ' + platform.getName() + ' (version ' + platform.getVersion() + ') for ' + platform.getFamily() + ' is not supported in OpenVidu'));
            }
        });
    };
    /**
     * Leaves the session, destroying all streams and deleting the user as a participant.
     *
     * #### Events dispatched
     *
     * The [[Session]] object of the local participant will dispatch a `sessionDisconnected` event.
     * This event will automatically unsubscribe the leaving participant from every Subscriber object of the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to each Subscriber (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, each Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `sessionDisconnected` to avoid this behavior and take care of disposing and cleaning all the Subscriber objects yourself.
     * See [[SessionDisconnectedEvent]] and [[VideoElementEvent]] to learn more to learn more.
     *
     * The [[Publisher]] object of the local participant will dispatch a `streamDestroyed` event if there is a [[Publisher]] object publishing to the session.
     * This event will automatically stop all media tracks and delete any HTML video element associated to it (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Publisher object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` if you want to clean the Publisher object on your own or re-publish it in a different Session (to do so it is a mandatory requirement to call `Session.unpublish()`
     * or/and `Session.disconnect()` in the previous session). See [[StreamEvent]] and [[VideoElementEvent]] to learn more.
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamDestroyed` event if the disconnected participant was publishing.
     * This event will automatically unsubscribe the Subscriber object from the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to that Subscriber (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` to avoid this default behavior and take care of disposing and cleaning the Subscriber object yourself.
     * See [[StreamEvent]] and [[VideoElementEvent]] to learn more.
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `connectionDestroyed` event in any case. See [[ConnectionEvent]] to learn more.
     */
    Session.prototype.disconnect = function () {
        this.leave(false, 'disconnect');
    };
    /**
     * Subscribes to a `stream`, adding a new HTML video element to DOM with `subscriberProperties` settings. This method is usually called in the callback of `streamCreated` event.
     *
     * #### Events dispatched
     *
     * The [[Subscriber]] object will dispatch a `videoElementCreated` event once the HTML video element has been added to DOM (only if you
     * [let OpenVidu take care of the video players](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)). See [[VideoElementEvent]] to learn more.
     *
     * The [[Subscriber]] object will dispatch a `streamPlaying` event once the remote stream starts playing. See [[StreamManagerEvent]] to learn more.
     *
     * @param stream Stream object to subscribe to
     * @param targetElement HTML DOM element (or its `id` attribute) in which the video element of the Subscriber will be inserted (see [[SubscriberProperties.insertMode]]). If *null* or *undefined* no default video will be created for this Subscriber.
     * You can always call method [[Subscriber.addVideoElement]] or [[Subscriber.createVideoElement]] to manage the video elements on your own (see [Manage video players](/en/stable/cheatsheet/manage-videos) section)
     * @param completionHandler `error` parameter is null if `subscribe` succeeds, and is defined if it fails.
     */
    Session.prototype.subscribe = function (stream, targetElement, param3, param4) {
        var properties = {};
        if (!!param3 && typeof param3 !== 'function') {
            properties = {
                insertMode: (typeof param3.insertMode !== 'undefined') ? ((typeof param3.insertMode === 'string') ? VideoInsertMode_1.VideoInsertMode[param3.insertMode] : properties.insertMode) : VideoInsertMode_1.VideoInsertMode.APPEND,
                subscribeToAudio: (typeof param3.subscribeToAudio !== 'undefined') ? param3.subscribeToAudio : true,
                subscribeToVideo: (typeof param3.subscribeToVideo !== 'undefined') ? param3.subscribeToVideo : true
            };
        }
        else {
            properties = {
                insertMode: VideoInsertMode_1.VideoInsertMode.APPEND,
                subscribeToAudio: true,
                subscribeToVideo: true
            };
        }
        var completionHandler = undefined;
        if (!!param3 && (typeof param3 === 'function')) {
            completionHandler = param3;
        }
        else if (!!param4) {
            completionHandler = param4;
        }
        if (!this.sessionConnected()) {
            if (completionHandler !== undefined) {
                completionHandler(this.notConnectedError());
            }
            throw this.notConnectedError();
        }
        logger.info('Subscribing to ' + stream.connection.connectionId);
        stream.subscribe()
            .then(function () {
            logger.info('Subscribed correctly to ' + stream.connection.connectionId);
            if (completionHandler !== undefined) {
                completionHandler(undefined);
            }
        })
            .catch(function (error) {
            if (completionHandler !== undefined) {
                completionHandler(error);
            }
        });
        var subscriber = new Subscriber_1.Subscriber(stream, targetElement, properties);
        if (!!subscriber.targetElement) {
            stream.streamManager.createVideoElement(subscriber.targetElement, properties.insertMode);
        }
        return subscriber;
    };
    Session.prototype.subscribeAsync = function (stream, targetElement, properties) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            var subscriber;
            var callback = function (error) {
                if (!!error) {
                    return reject(error);
                }
                else {
                    return resolve(subscriber);
                }
            };
            if (!!properties) {
                subscriber = _this.subscribe(stream, targetElement, properties, callback);
            }
            else {
                subscriber = _this.subscribe(stream, targetElement, callback);
            }
        });
    };
    /**
     * Unsubscribes from `subscriber`, automatically removing its associated HTML video elements.
     *
     * #### Events dispatched
     *
     * The [[Subscriber]] object will dispatch a `videoElementDestroyed` event for each video associated to it that was removed from DOM.
     * Only videos [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)) will be automatically removed
     *
     * See [[VideoElementEvent]] to learn more
     */
    Session.prototype.unsubscribe = function (subscriber) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            else {
                var connectionId_1 = subscriber.stream.connection.connectionId;
                logger.info('Unsubscribing from ' + connectionId_1);
                _this.openvidu.sendRequest('unsubscribeFromVideo', { sender: subscriber.stream.connection.connectionId }, function (error, response) {
                    if (error) {
                        logger.error('Error unsubscribing from ' + connectionId_1);
                        return reject(error);
                    }
                    else {
                        logger.info('Unsubscribed correctly from ' + connectionId_1);
                        subscriber.stream.streamManager.removeAllVideos();
                        subscriber.stream.disposeWebRtcPeer();
                        subscriber.stream.disposeMediaStream();
                        return resolve();
                    }
                });
            }
        });
    };
    /**
     * Publishes to the Session the Publisher object
     *
     * #### Events dispatched
     *
     * The local [[Publisher]] object will dispatch a `streamCreated` event upon successful termination of this method. See [[StreamEvent]] to learn more.
     *
     * The local [[Publisher]] object will dispatch a `streamPlaying` once the media stream starts playing. See [[StreamManagerEvent]] to learn more.
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamCreated` event so they can subscribe to it. See [[StreamEvent]] to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the publisher was successfully published and rejected with an Error object if not
     */
    Session.prototype.publish = function (publisher) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            publisher.session = _this;
            publisher.stream.session = _this;
            if (!publisher.stream.publishedOnce) {
                // 'Session.unpublish(Publisher)' has NOT been called
                _this.connection.addStream(publisher.stream);
                publisher.stream.publish()
                    .then(function () {
                    _this.sendVideoData(publisher, 8, true, 5);
                    return resolve();
                })
                    .catch(function (error) { return reject(error); });
            }
            else {
                // 'Session.unpublish(Publisher)' has been called. Must initialize again Publisher
                publisher.initialize()
                    .then(function () {
                    _this.connection.addStream(publisher.stream);
                    publisher.reestablishStreamPlayingEvent();
                    publisher.stream.publish()
                        .then(function () {
                        _this.sendVideoData(publisher, 8, true, 5);
                        return resolve();
                    })
                        .catch(function (error) { return reject(error); });
                }).catch(function (error) { return reject(error); });
            }
        });
    };
    /**
     * Unpublishes from the Session the Publisher object.
     *
     * #### Events dispatched
     *
     * The [[Publisher]] object of the local participant will dispatch a `streamDestroyed` event.
     * This event will automatically stop all media tracks and delete any HTML video element associated to this Publisher
     * (only those videos [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Publisher object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` if you want to clean the Publisher object on your own or re-publish it in a different Session.
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamDestroyed` event.
     * This event will automatically unsubscribe the Subscriber object from the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks) and
     * delete any HTML video element associated to it (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` to avoid this default behavior and take care of disposing and cleaning the Subscriber object on your own.
     *
     * See [[StreamEvent]] and [[VideoElementEvent]] to learn more.
     */
    Session.prototype.unpublish = function (publisher) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                throw _this.notConnectedError();
            }
            var stream = publisher.stream;
            if (!stream.connection) {
                return reject(new Error('The associated Connection object of this Publisher is null'));
            }
            else if (stream.connection !== _this.connection) {
                return reject(new Error('The associated Connection object of this Publisher is not your local Connection.' +
                    "Only moderators can force unpublish on remote Streams via 'forceUnpublish' method"));
            }
            else {
                logger.info('Unpublishing local media (' + stream.connection.connectionId + ')');
                _this.openvidu.sendRequest('unpublishVideo', function (error, response) {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        logger.info('Media unpublished correctly');
                        stream.disposeWebRtcPeer();
                        if (stream.connection.stream == stream) {
                            // The Connection.stream may have changed if Session.publish was called with other Publisher
                            delete stream.connection.stream;
                        }
                        var streamEvent = new StreamEvent_1.StreamEvent(true, publisher, 'streamDestroyed', publisher.stream, 'unpublish');
                        publisher.emitEvent('streamDestroyed', [streamEvent]);
                        streamEvent.callDefaultBehavior();
                        return resolve();
                    }
                });
            }
        });
    };
    /**
     * Forces some user to leave the session
     *
     * #### Events dispatched
     *
     * The behavior is the same as when some user calls [[Session.disconnect]], but `reason` property in all events will be `"forceDisconnectByUser"`.
     *
     * The [[Session]] object of every participant will dispatch a `streamDestroyed` event if the evicted user was publishing a stream, with property `reason` set to `"forceDisconnectByUser"`.
     * The [[Session]] object of every participant except the evicted one will dispatch a `connectionDestroyed` event for the evicted user, with property `reason` set to `"forceDisconnectByUser"`.
     *
     * If any, the [[Publisher]] object of the evicted participant will also dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`.
     * The [[Session]] object of the evicted participant will dispatch a `sessionDisconnected` event with property `reason` set to `"forceDisconnectByUser"`.
     *
     * See [[StreamEvent]], [[ConnectionEvent]] and [[SessionDisconnectedEvent]] to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the participant has been successfully evicted from the session and rejected with an Error object if not
     */
    Session.prototype.forceDisconnect = function (connection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            logger.info('Forcing disconnect for connection ' + connection.connectionId);
            _this.openvidu.sendRequest('forceDisconnect', { connectionId: connection.connectionId }, function (error, response) {
                if (error) {
                    logger.error('Error forcing disconnect for Connection ' + connection.connectionId, error);
                    if (error.code === 401) {
                        return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_PERMISSION_DENIED, "You don't have permissions to force a disconnection"));
                    }
                    else {
                        return reject(error);
                    }
                }
                else {
                    logger.info('Forcing disconnect correctly for Connection ' + connection.connectionId);
                    return resolve();
                }
            });
        });
    };
    /**
     * Forces some user to unpublish a Stream
     *
     * #### Events dispatched
     *
     * The behavior is the same as when some user calls [[Session.unpublish]], but `reason` property in all events will be `"forceUnpublishByUser"`
     *
     * The [[Session]] object of every participant will dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`
     *
     * The [[Publisher]] object of the affected participant will also dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`
     *
     * See [[StreamEvent]] to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the remote Stream has been successfully unpublished from the session and rejected with an Error object if not
     */
    Session.prototype.forceUnpublish = function (stream) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            logger.info('Forcing unpublish for stream ' + stream.streamId);
            _this.openvidu.sendRequest('forceUnpublish', { streamId: stream.streamId }, function (error, response) {
                if (error) {
                    logger.error('Error forcing unpublish for Stream ' + stream.streamId, error);
                    if (error.code === 401) {
                        return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_PERMISSION_DENIED, "You don't have permissions to force an unpublishing"));
                    }
                    else {
                        return reject(error);
                    }
                }
                else {
                    logger.info('Forcing unpublish correctly for Stream ' + stream.streamId);
                    return resolve();
                }
            });
        });
    };
    /**
     * Sends one signal. `signal` object has the following optional properties:
     * ```json
     * {data:string, to:Connection[], type:string}
     * ```
     * All users subscribed to that signal (`session.on('signal:type', ...)` or `session.on('signal', ...)` for all signals) and whose Connection objects are in `to` array will receive it. Their local
     * Session objects will dispatch a `signal` or `signal:type` event. See [[SignalEvent]] to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the message successfully reached openvidu-server and rejected with an Error object if not. _This doesn't
     * mean that openvidu-server could resend the message to all the listed receivers._
     */
    /* tslint:disable:no-string-literal */
    Session.prototype.signal = function (signal) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.sessionConnected()) {
                return reject(_this.notConnectedError());
            }
            var signalMessage = {};
            if (signal.to && signal.to.length > 0) {
                var connectionIds_1 = [];
                signal.to.forEach(function (connection) {
                    if (!!connection.connectionId) {
                        connectionIds_1.push(connection.connectionId);
                    }
                });
                signalMessage['to'] = connectionIds_1;
            }
            else {
                signalMessage['to'] = [];
            }
            signalMessage['data'] = signal.data ? signal.data : '';
            var typeAux = signal.type ? signal.type : 'signal';
            if (!!typeAux) {
                if (typeAux.substring(0, 7) !== 'signal:') {
                    typeAux = 'signal:' + typeAux;
                }
            }
            signalMessage['type'] = typeAux;
            _this.openvidu.sendRequest('sendMessage', {
                message: JSON.stringify(signalMessage)
            }, function (error, response) {
                if (!!error) {
                    return reject(error);
                }
                else {
                    return resolve();
                }
            });
        });
    };
    /* tslint:enable:no-string-literal */
    /**
     * See [[EventDispatcher.on]]
     */
    Session.prototype.on = function (type, handler) {
        var _a, _b, _c, _d;
        _super.prototype.onAux.call(this, type, "Event '" + type + "' triggered by 'Session'", handler);
        if (type === 'publisherStartSpeaking') {
            // If there are already available remote streams with audio, enable hark 'speaking' event in all of them
            this.remoteConnections.forEach(function (remoteConnection) {
                var _a;
                if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.hasAudio)) {
                    remoteConnection.stream.enableHarkSpeakingEvent();
                }
            });
            if (!!((_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.hasAudio)) {
                // If connected to the Session and publishing with audio, also enable hark 'speaking' event for the Publisher
                this.connection.stream.enableHarkSpeakingEvent();
            }
        }
        if (type === 'publisherStopSpeaking') {
            // If there are already available remote streams with audio, enable hark 'stopped_speaking' event in all of them
            this.remoteConnections.forEach(function (remoteConnection) {
                var _a;
                if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.hasAudio)) {
                    remoteConnection.stream.enableHarkStoppedSpeakingEvent();
                }
            });
            if (!!((_d = (_c = this.connection) === null || _c === void 0 ? void 0 : _c.stream) === null || _d === void 0 ? void 0 : _d.hasAudio)) {
                // If connected to the Session and publishing with audio, also enable hark 'stopped_speaking' event for the Publisher
                this.connection.stream.enableHarkStoppedSpeakingEvent();
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.once]]
     */
    Session.prototype.once = function (type, handler) {
        var _a, _b, _c, _d;
        _super.prototype.onceAux.call(this, type, "Event '" + type + "' triggered once by 'Session'", handler);
        if (type === 'publisherStartSpeaking') {
            // If there are already available remote streams with audio, enable hark 'speaking' event (once) in all of them once
            this.remoteConnections.forEach(function (remoteConnection) {
                var _a;
                if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.hasAudio)) {
                    remoteConnection.stream.enableOnceHarkSpeakingEvent();
                }
            });
            if (!!((_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.hasAudio)) {
                // If connected to the Session and publishing with audio, also enable hark 'speaking' event (once) for the Publisher
                this.connection.stream.enableOnceHarkSpeakingEvent();
            }
        }
        if (type === 'publisherStopSpeaking') {
            // If there are already available remote streams with audio, enable hark 'stopped_speaking' event (once) in all of them once
            this.remoteConnections.forEach(function (remoteConnection) {
                var _a;
                if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.hasAudio)) {
                    remoteConnection.stream.enableOnceHarkStoppedSpeakingEvent();
                }
            });
            if (!!((_d = (_c = this.connection) === null || _c === void 0 ? void 0 : _c.stream) === null || _d === void 0 ? void 0 : _d.hasAudio)) {
                // If connected to the Session and publishing with audio, also enable hark 'stopped_speaking' event (once) for the Publisher
                this.connection.stream.enableOnceHarkStoppedSpeakingEvent();
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.off]]
     */
    Session.prototype.off = function (type, handler) {
        var _this = this;
        var _a, _b, _c, _d;
        _super.prototype.offAux.call(this, type, handler);
        if (type === 'publisherStartSpeaking') {
            // Check if Session object still has some listener for the event
            if (!this.anySpeechEventListenerEnabled('publisherStartSpeaking', false)) {
                this.remoteConnections.forEach(function (remoteConnection) {
                    var _a;
                    if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.streamManager)) {
                        // Check if Subscriber object still has some listener for the event
                        if (!_this.anySpeechEventListenerEnabled('publisherStartSpeaking', false, remoteConnection.stream.streamManager)) {
                            remoteConnection.stream.disableHarkSpeakingEvent(false);
                        }
                    }
                });
                if (!!((_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.streamManager)) {
                    // Check if Publisher object still has some listener for the event
                    if (!this.anySpeechEventListenerEnabled('publisherStartSpeaking', false, this.connection.stream.streamManager)) {
                        this.connection.stream.disableHarkSpeakingEvent(false);
                    }
                }
            }
        }
        if (type === 'publisherStopSpeaking') {
            // Check if Session object still has some listener for the event
            if (!this.anySpeechEventListenerEnabled('publisherStopSpeaking', false)) {
                this.remoteConnections.forEach(function (remoteConnection) {
                    var _a;
                    if (!!((_a = remoteConnection.stream) === null || _a === void 0 ? void 0 : _a.streamManager)) {
                        // Check if Subscriber object still has some listener for the event
                        if (!_this.anySpeechEventListenerEnabled('publisherStopSpeaking', false, remoteConnection.stream.streamManager)) {
                            remoteConnection.stream.disableHarkStoppedSpeakingEvent(false);
                        }
                    }
                });
                if (!!((_d = (_c = this.connection) === null || _c === void 0 ? void 0 : _c.stream) === null || _d === void 0 ? void 0 : _d.streamManager)) {
                    // Check if Publisher object still has some listener for the event
                    if (!this.anySpeechEventListenerEnabled('publisherStopSpeaking', false, this.connection.stream.streamManager)) {
                        this.connection.stream.disableHarkStoppedSpeakingEvent(false);
                    }
                }
            }
        }
        return this;
    };
    /* Hidden methods */
    /**
     * @hidden
     */
    Session.prototype.onParticipantJoined = function (event) {
        var _this = this;
        // Connection shouldn't exist
        this.getConnection(event.id, '')
            .then(function (connection) {
            logger.warn('Connection ' + connection.connectionId + ' already exists in connections list');
        })
            .catch(function (openViduError) {
            var connection = new Connection_1.Connection(_this, event);
            _this.remoteConnections.set(event.id, connection);
            _this.ee.emitEvent('connectionCreated', [new ConnectionEvent_1.ConnectionEvent(false, _this, 'connectionCreated', connection, '')]);
        });
    };
    /**
     * @hidden
     */
    Session.prototype.onParticipantLeft = function (event) {
        var _this = this;
        this.getRemoteConnection(event.connectionId, 'onParticipantLeft').then(function (connection) {
            if (!!connection.stream) {
                var stream = connection.stream;
                var streamEvent = new StreamEvent_1.StreamEvent(true, _this, 'streamDestroyed', stream, event.reason);
                _this.ee.emitEvent('streamDestroyed', [streamEvent]);
                streamEvent.callDefaultBehavior();
                _this.remoteStreamsCreated.delete(stream.streamId);
            }
            _this.remoteConnections.delete(connection.connectionId);
            _this.ee.emitEvent('connectionDestroyed', [new ConnectionEvent_1.ConnectionEvent(false, _this, 'connectionDestroyed', connection, event.reason)]);
        })
            .catch(function (openViduError) {
            logger.error(openViduError);
        });
    };
    /**
     * @hidden
     */
    Session.prototype.onParticipantPublished = function (event) {
        var _this = this;
        var afterConnectionFound = function (connection) {
            _this.remoteConnections.set(connection.connectionId, connection);
            if (!_this.remoteStreamsCreated.get(connection.stream.streamId)) {
                // Avoid race condition between stream.subscribe() in "onParticipantPublished" and in "joinRoom" rpc callback
                // This condition is false if openvidu-server sends "participantPublished" event to a subscriber participant that has
                // already subscribed to certain stream in the callback of "joinRoom" method
                _this.ee.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, _this, 'streamCreated', connection.stream, '')]);
            }
            _this.remoteStreamsCreated.set(connection.stream.streamId, true);
        };
        // Get the existing Connection created on 'onParticipantJoined' for
        // existing participants or create a new one for new participants
        var connection;
        this.getRemoteConnection(event.id, 'onParticipantPublished')
            .then(function (con) {
            // Update existing Connection
            connection = con;
            event.metadata = con.data;
            connection.remoteOptions = event;
            connection.initRemoteStreams(event.streams);
            afterConnectionFound(connection);
        })
            .catch(function (openViduError) {
            // Create new Connection
            connection = new Connection_1.Connection(_this, event);
            afterConnectionFound(connection);
        });
    };
    /**
     * @hidden
     */
    Session.prototype.onParticipantUnpublished = function (event) {
        var _this = this;
        if (event.connectionId === this.connection.connectionId) {
            // Your stream has been forcedly unpublished from the session
            this.stopPublisherStream(event.reason);
        }
        else {
            this.getRemoteConnection(event.connectionId, 'onParticipantUnpublished')
                .then(function (connection) {
                var streamEvent = new StreamEvent_1.StreamEvent(true, _this, 'streamDestroyed', connection.stream, event.reason);
                _this.ee.emitEvent('streamDestroyed', [streamEvent]);
                streamEvent.callDefaultBehavior();
                // Deleting the remote stream
                var streamId = connection.stream.streamId;
                _this.remoteStreamsCreated.delete(streamId);
                connection.removeStream(streamId);
            })
                .catch(function (openViduError) {
                logger.error(openViduError);
            });
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onParticipantEvicted = function (event) {
        if (event.connectionId === this.connection.connectionId) {
            // You have been evicted from the session
            if (!!this.sessionId && !this.connection.disposed) {
                this.leave(true, event.reason);
            }
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onNewMessage = function (event) {
        var _this = this;
        logger.info('New signal: ' + JSON.stringify(event));
        var strippedType = !!event.type ? event.type.replace(/^(signal:)/, '') : undefined;
        if (!!event.from) {
            // Signal sent by other client
            this.getConnection(event.from, "Connection '" + event.from + "' unknown when 'onNewMessage'. Existing remote connections: "
                + JSON.stringify(this.remoteConnections.keys()) + '. Existing local connection: ' + this.connection.connectionId)
                .then(function (connection) {
                _this.ee.emitEvent('signal', [new SignalEvent_1.SignalEvent(_this, strippedType, event.data, connection)]);
                if (!!event.type && event.type !== 'signal') {
                    _this.ee.emitEvent(event.type, [new SignalEvent_1.SignalEvent(_this, strippedType, event.data, connection)]);
                }
            })
                .catch(function (openViduError) {
                logger.error(openViduError);
            });
        }
        else {
            // Signal sent by server
            this.ee.emitEvent('signal', [new SignalEvent_1.SignalEvent(this, strippedType, event.data, undefined)]);
            if (!!event.type && event.type !== 'signal') {
                this.ee.emitEvent(event.type, [new SignalEvent_1.SignalEvent(this, strippedType, event.data, undefined)]);
            }
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onStreamPropertyChanged = function (event) {
        var _this = this;
        var callback = function (connection) {
            if (!!connection.stream && connection.stream.streamId === event.streamId) {
                var stream = connection.stream;
                var oldValue = void 0;
                switch (event.property) {
                    case 'audioActive':
                        oldValue = stream.audioActive;
                        event.newValue = event.newValue === 'true';
                        stream.audioActive = event.newValue;
                        break;
                    case 'videoActive':
                        oldValue = stream.videoActive;
                        event.newValue = event.newValue === 'true';
                        stream.videoActive = event.newValue;
                        break;
                    case 'videoDimensions':
                        oldValue = stream.videoDimensions;
                        event.newValue = JSON.parse(JSON.parse(event.newValue));
                        stream.videoDimensions = event.newValue;
                        break;
                    case 'filter':
                        oldValue = stream.filter;
                        event.newValue = (Object.keys(event.newValue).length > 0) ? event.newValue : undefined;
                        if (event.newValue !== undefined) {
                            stream.filter = new Filter_1.Filter(event.newValue.type, event.newValue.options);
                            stream.filter.stream = stream;
                            if (event.newValue.lastExecMethod) {
                                stream.filter.lastExecMethod = event.newValue.lastExecMethod;
                            }
                        }
                        else {
                            delete stream.filter;
                        }
                        event.newValue = stream.filter;
                        break;
                }
                _this.ee.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(_this, stream, event.property, event.newValue, oldValue, event.reason)]);
                if (!!stream.streamManager) {
                    stream.streamManager.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent_1.StreamPropertyChangedEvent(stream.streamManager, stream, event.property, event.newValue, oldValue, event.reason)]);
                }
            }
            else {
                logger.error("No stream with streamId '" + event.streamId + "' found for connection '" + event.connectionId + "' on 'streamPropertyChanged' event");
            }
        };
        if (event.connectionId === this.connection.connectionId) {
            // Your stream has been forcedly changed (filter feature)
            callback(this.connection);
        }
        else {
            this.getRemoteConnection(event.connectionId, 'onStreamPropertyChanged')
                .then(function (connection) {
                callback(connection);
            })
                .catch(function (openViduError) {
                logger.error(openViduError);
            });
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onConnectionPropertyChanged = function (event) {
        var oldValue;
        switch (event.property) {
            case 'role':
                oldValue = this.connection.role.slice();
                this.connection.role = event.newValue;
                this.connection.localOptions.role = event.newValue;
                break;
            case 'record':
                oldValue = this.connection.record;
                event.newValue = event.newValue === 'true';
                this.connection.record = event.newValue;
                this.connection.localOptions.record = event.newValue;
                break;
        }
        this.ee.emitEvent('connectionPropertyChanged', [new ConnectionPropertyChangedEvent_1.ConnectionPropertyChangedEvent(this, this.connection, event.property, event.newValue, oldValue)]);
    };
    /**
     * @hidden
     */
    Session.prototype.onNetworkQualityLevelChangedChanged = function (event) {
        var _this = this;
        if (event.connectionId === this.connection.connectionId) {
            this.ee.emitEvent('networkQualityLevelChanged', [new NetworkQualityLevelChangedEvent_1.NetworkQualityLevelChangedEvent(this, event.newValue, event.oldValue, this.connection)]);
        }
        else {
            this.getConnection(event.connectionId, 'Connection not found for connectionId ' + event.connectionId)
                .then(function (connection) {
                _this.ee.emitEvent('networkQualityLevelChanged', [new NetworkQualityLevelChangedEvent_1.NetworkQualityLevelChangedEvent(_this, event.newValue, event.oldValue, connection)]);
            })
                .catch(function (openViduError) {
                logger.error(openViduError);
            });
        }
    };
    /**
     * @hidden
     */
    Session.prototype.recvIceCandidate = function (event) {
        // The event contains fields that can be used to obtain a proper candidate,
        // using the RTCIceCandidate constructor:
        // https://w3c.github.io/webrtc-pc/#dom-rtcicecandidate-constructor
        var candidateInit = {
            candidate: event.candidate,
            sdpMLineIndex: event.sdpMLineIndex,
            sdpMid: event.sdpMid,
        };
        var iceCandidate = new RTCIceCandidate(candidateInit);
        this.getConnection(event.senderConnectionId, 'Connection not found for connectionId ' + event.senderConnectionId + ' owning endpoint ' + event.endpointName + '. Ice candidate will be ignored: ' + iceCandidate)
            .then(function (connection) {
            var stream = connection.stream;
            stream.getWebRtcPeer().addIceCandidate(iceCandidate).catch(function (error) {
                logger.error('Error adding candidate for ' + stream.streamId
                    + ' stream of endpoint ' + event.endpointName + ': ' + error);
            });
        })
            .catch(function (openViduError) {
            logger.error(openViduError);
        });
    };
    /**
     * @hidden
     */
    Session.prototype.onSessionClosed = function (msg) {
        logger.info('Session closed: ' + JSON.stringify(msg));
        var s = msg.sessionId;
        if (s !== undefined) {
            this.ee.emitEvent('session-closed', [{
                    session: s
                }]);
        }
        else {
            logger.warn('Session undefined on session closed', msg);
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onLostConnection = function (reason) {
        logger.warn('Lost connection in Session ' + this.sessionId);
        if (!!this.sessionId && !!this.connection && !this.connection.disposed) {
            this.leave(true, reason);
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onRecoveredConnection = function () {
        logger.info('Recovered connection in Session ' + this.sessionId);
        this.reconnectBrokenStreams();
        this.ee.emitEvent('reconnected', []);
    };
    /**
     * @hidden
     */
    Session.prototype.onMediaError = function (event) {
        logger.error('Media error: ' + JSON.stringify(event));
        var err = event.error;
        if (err) {
            this.ee.emitEvent('error-media', [{
                    error: err
                }]);
        }
        else {
            logger.warn('Received undefined media error:', event);
        }
    };
    /**
     * @hidden
     */
    Session.prototype.onRecordingStarted = function (event) {
        this.ee.emitEvent('recordingStarted', [new RecordingEvent_1.RecordingEvent(this, 'recordingStarted', event.id, event.name)]);
    };
    /**
     * @hidden
     */
    Session.prototype.onRecordingStopped = function (event) {
        this.ee.emitEvent('recordingStopped', [new RecordingEvent_1.RecordingEvent(this, 'recordingStopped', event.id, event.name, event.reason)]);
    };
    /**
     * @hidden
     */
    Session.prototype.onFilterEventDispatched = function (event) {
        var _this = this;
        var connectionId = event.connectionId;
        this.getConnection(connectionId, 'No connection found for connectionId ' + connectionId)
            .then(function (connection) {
            logger.info("Filter event of type \"".concat(event.eventType, "\" dispatched"));
            var stream = connection.stream;
            if (!stream || !stream.filter) {
                return logger.error("Filter event of type \"".concat(event.eventType, "\" dispatched for stream ").concat(stream.streamId, " but there is no ").concat(!stream ? 'stream' : 'filter', " defined"));
            }
            var eventHandler = stream.filter.handlers.get(event.eventType);
            if (!eventHandler || typeof eventHandler !== 'function') {
                var actualHandlers = Array.from(stream.filter.handlers.keys());
                return logger.error("Filter event of type \"".concat(event.eventType, "\" not handled or not a function! Active filter events: ").concat(actualHandlers.join(',')));
            }
            else {
                eventHandler.call(_this, new FilterEvent_1.FilterEvent(stream.filter, event.eventType, event.data));
            }
        });
    };
    /**
     * @hidden
     */
    Session.prototype.onForciblyReconnectSubscriber = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getRemoteConnection(event.connectionId, 'onForciblyReconnectSubscriber')
                .then(function (connection) {
                if (!!connection.stream && connection.stream.streamId === event.streamId) {
                    var stream_1 = connection.stream;
                    if (stream_1.setupReconnectionEventEmitter(resolve, reject)) {
                        // Ongoing reconnection
                        // Wait for the event emitter to be free (with success or error) and call the method again
                        if (stream_1.reconnectionEventEmitter['onForciblyReconnectSubscriberLastEvent'] != null) {
                            // Two or more onForciblyReconnectSubscriber events were received while a reconnection process
                            // of the subscriber was already taking place. Always use the last one to retry the re-subscription
                            // process, as that SDP offer will be the only one available at the server side. Ignore previous ones
                            stream_1.reconnectionEventEmitter['onForciblyReconnectSubscriberLastEvent'] = event;
                            return reject('Ongoing forced subscriber reconnection');
                        }
                        else {
                            // One onForciblyReconnectSubscriber even has been received while a reconnection process
                            // of the subscriber was already taking place. Set up a listener to wait for it to retry the
                            // forced reconnection process
                            stream_1.reconnectionEventEmitter['onForciblyReconnectSubscriberLastEvent'] = event;
                            var callback_1 = function () {
                                var eventAux = stream_1.reconnectionEventEmitter['onForciblyReconnectSubscriberLastEvent'];
                                delete stream_1.reconnectionEventEmitter['onForciblyReconnectSubscriberLastEvent'];
                                _this.onForciblyReconnectSubscriber(eventAux);
                            };
                            stream_1.reconnectionEventEmitter.once('success', function () {
                                callback_1();
                            });
                            stream_1.reconnectionEventEmitter.once('error', function () {
                                callback_1();
                            });
                        }
                        return;
                    }
                    stream_1.completeWebRtcPeerReceive(true, true, event.sdpOffer)
                        .then(function () { return stream_1.finalResolveForSubscription(true, resolve); })
                        .catch(function (error) { return stream_1.finalRejectForSubscription(true, "Error while forcibly reconnecting remote stream ".concat(event.streamId, ": ").concat(error.toString()), reject); });
                }
                else {
                    var errMsg = "No stream with streamId '" + event.streamId + "' found for connection '" + event.connectionId + "' on 'streamPropertyChanged' event";
                    logger.error(errMsg);
                    return reject(errMsg);
                }
            })
                .catch(function (openViduError) {
                logger.error(openViduError);
                return reject(openViduError);
            });
        });
    };
    /**
     * @hidden
     */
    Session.prototype.reconnectBrokenStreams = function () {
        logger.info('Re-establishing media connections...');
        var someReconnection = false;
        // Re-establish Publisher stream
        if (!!this.connection.stream && this.connection.stream.streamIceConnectionStateBroken()) {
            logger.warn('Re-establishing Publisher ' + this.connection.stream.streamId);
            this.connection.stream.initWebRtcPeerSend(true);
            someReconnection = true;
        }
        // Re-establish Subscriber streams
        this.remoteConnections.forEach(function (remoteConnection) {
            if (!!remoteConnection.stream && remoteConnection.stream.streamIceConnectionStateBroken()) {
                logger.warn('Re-establishing Subscriber ' + remoteConnection.stream.streamId);
                remoteConnection.stream.initWebRtcPeerReceive(true);
                someReconnection = true;
            }
        });
        if (!someReconnection) {
            logger.info('There were no media streams in need of a reconnection');
        }
    };
    /**
     * @hidden
     */
    Session.prototype.emitEvent = function (type, eventArray) {
        this.ee.emitEvent(type, eventArray);
    };
    /**
     * @hidden
     */
    Session.prototype.leave = function (forced, reason) {
        var _this = this;
        forced = !!forced;
        logger.info('Leaving Session (forced=' + forced + ')');
        this.stopVideoDataIntervals();
        if (!!this.connection) {
            if (!this.connection.disposed && !forced) {
                this.openvidu.sendRequest('leaveRoom', function (error, response) {
                    if (error) {
                        logger.error("leaveRoom error: ".concat(JSON.stringify(error)));
                    }
                    _this.openvidu.closeWs();
                });
            }
            else {
                this.openvidu.closeWs();
            }
            this.stopPublisherStream(reason);
            if (!this.connection.disposed) {
                // Make Session object dispatch 'sessionDisconnected' event (if it is not already disposed)
                var sessionDisconnectEvent = new SessionDisconnectedEvent_1.SessionDisconnectedEvent(this, reason);
                this.ee.emitEvent('sessionDisconnected', [sessionDisconnectEvent]);
                sessionDisconnectEvent.callDefaultBehavior();
            }
        }
        else {
            logger.warn('You were not connected to the session ' + this.sessionId);
        }
        logger.flush();
    };
    /**
     * @hidden
     */
    Session.prototype.initializeParams = function (token) {
        var joinParams = {
            token: (!!token) ? token : '',
            session: this.sessionId,
            platform: !!platform.getDescription() ? platform.getDescription() : 'unknown',
            sdkVersion: this.openvidu.libraryVersion,
            metadata: !!this.options.metadata ? this.options.metadata : '',
            secret: this.openvidu.getSecret(),
            recorder: this.openvidu.getRecorder()
        };
        return joinParams;
    };
    /**
     * @hidden
     */
    Session.prototype.sendVideoData = function (streamManager, intervalSeconds, doInterval, maxLoops) {
        var _this = this;
        var _a, _b;
        if (intervalSeconds === void 0) { intervalSeconds = 1; }
        if (doInterval === void 0) { doInterval = false; }
        if (maxLoops === void 0) { maxLoops = 1; }
        if (platform.isChromeBrowser() || platform.isChromeMobileBrowser() || platform.isOperaBrowser() ||
            platform.isOperaMobileBrowser() || platform.isEdgeBrowser() || platform.isEdgeMobileBrowser() || platform.isElectron() ||
            (platform.isSafariBrowser() && !platform.isIonicIos()) || platform.isAndroidBrowser() ||
            platform.isSamsungBrowser() || platform.isIonicAndroid() || platform.isIOSWithSafari()) {
            var obtainAndSendVideo_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                var pc, statsMap, arr_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pc = streamManager.stream.getRTCPeerConnection();
                            if (!(pc.connectionState === 'connected')) return [3 /*break*/, 2];
                            return [4 /*yield*/, pc.getStats()];
                        case 1:
                            statsMap = _a.sent();
                            arr_1 = [];
                            statsMap.forEach(function (stats) {
                                if (("frameWidth" in stats) && ("frameHeight" in stats) && (arr_1.length === 0)) {
                                    arr_1.push(stats);
                                }
                            });
                            if (arr_1.length > 0) {
                                this.openvidu.sendRequest('videoData', {
                                    height: arr_1[0].frameHeight,
                                    width: arr_1[0].frameWidth,
                                    videoActive: streamManager.stream.videoActive != null ? streamManager.stream.videoActive : false,
                                    audioActive: streamManager.stream.audioActive != null ? streamManager.stream.audioActive : false
                                }, function (error, response) {
                                    if (error) {
                                        logger.error("Error sending 'videoData' event", error);
                                    }
                                });
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            if (doInterval) {
                var loops_1 = 1;
                this.videoDataInterval = setInterval(function () {
                    if (loops_1 < maxLoops) {
                        loops_1++;
                        obtainAndSendVideo_1();
                    }
                    else {
                        clearInterval(_this.videoDataInterval);
                    }
                }, intervalSeconds * 1000);
            }
            else {
                this.videoDataTimeout = setTimeout(obtainAndSendVideo_1, intervalSeconds * 1000);
            }
        }
        else if (platform.isFirefoxBrowser() || platform.isFirefoxMobileBrowser() || platform.isIonicIos() || platform.isReactNative()) {
            // Basic version for Firefox and Ionic iOS. They do not support stats
            this.openvidu.sendRequest('videoData', {
                height: ((_a = streamManager.stream.videoDimensions) === null || _a === void 0 ? void 0 : _a.height) || 0,
                width: ((_b = streamManager.stream.videoDimensions) === null || _b === void 0 ? void 0 : _b.width) || 0,
                videoActive: streamManager.stream.videoActive != null ? streamManager.stream.videoActive : false,
                audioActive: streamManager.stream.audioActive != null ? streamManager.stream.audioActive : false
            }, function (error, response) {
                if (error) {
                    logger.error("Error sending 'videoData' event", error);
                }
            });
        }
        else {
            logger.error('Browser ' + platform.getName() + ' (version ' + platform.getVersion() + ') for ' + platform.getFamily() + ' is not supported in OpenVidu for Network Quality');
        }
    };
    /**
     * @hidden
     */
    Session.prototype.sessionConnected = function () {
        return this.connection != null;
    };
    /**
     * @hidden
     */
    Session.prototype.notConnectedError = function () {
        return new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.OPENVIDU_NOT_CONNECTED, "There is no connection to the session. Method 'Session.connect' must be successfully completed first");
    };
    /**
     * @hidden
     */
    Session.prototype.anySpeechEventListenerEnabled = function (event, onlyOnce, streamManager) {
        var handlersInSession = this.ee.getListeners(event);
        if (onlyOnce) {
            handlersInSession = handlersInSession.filter(function (h) { return h.once; });
        }
        var listenersInSession = handlersInSession.length;
        if (listenersInSession > 0)
            return true;
        var listenersInStreamManager = 0;
        if (!!streamManager) {
            var handlersInStreamManager = streamManager.ee.getListeners(event);
            if (onlyOnce) {
                handlersInStreamManager = handlersInStreamManager.filter(function (h) { return h.once; });
            }
            listenersInStreamManager = handlersInStreamManager.length;
        }
        return listenersInStreamManager > 0;
    };
    /**
     * @hidden
     */
    Session.prototype.getTokenParams = function (token) {
        var match = token.match(/^(wss?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        if (!!match) {
            var url = {
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            };
            var params = token.split('?');
            var queryParams = decodeURI(params[1])
                .split('&')
                .map(function (param) { return param.split('='); })
                .reduce(function (values, _a) {
                var key = _a[0], value = _a[1];
                values[key] = value;
                return values;
            }, {});
            return {
                sessionId: queryParams['sessionId'],
                secret: queryParams['secret'],
                recorder: queryParams['recorder'],
                webrtcStatsInterval: queryParams['webrtcStatsInterval'],
                sendBrowserLogs: queryParams['sendBrowserLogs'],
                edition: queryParams['edition'],
                wsUri: 'wss://' + url.host + '/openvidu',
                httpUri: 'https://' + url.host
            };
        }
        else {
            throw new Error("Token not valid: \"".concat(token, "\""));
        }
    };
    /* Private methods */
    Session.prototype.connectAux = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.openvidu.startWs(function (error) {
                if (!!error) {
                    return reject(error);
                }
                else {
                    var joinParams = _this.initializeParams(token);
                    _this.openvidu.sendRequest('joinRoom', joinParams, function (error, response) {
                        if (!!error) {
                            return reject(error);
                        }
                        else {
                            // Process join room response
                            _this.processJoinRoomResponse(response, token);
                            // Initialize local Connection object with values returned by openvidu-server
                            _this.connection = new Connection_1.Connection(_this, response);
                            // Initialize remote Connections with value returned by openvidu-server
                            var events_1 = {
                                connections: new Array(),
                                streams: new Array()
                            };
                            var existingParticipants = response.value;
                            existingParticipants.forEach(function (remoteConnectionOptions) {
                                var connection = new Connection_1.Connection(_this, remoteConnectionOptions);
                                _this.remoteConnections.set(connection.connectionId, connection);
                                events_1.connections.push(connection);
                                if (!!connection.stream) {
                                    _this.remoteStreamsCreated.set(connection.stream.streamId, true);
                                    events_1.streams.push(connection.stream);
                                }
                            });
                            // Own 'connectionCreated' event
                            _this.ee.emitEvent('connectionCreated', [new ConnectionEvent_1.ConnectionEvent(false, _this, 'connectionCreated', _this.connection, '')]);
                            // One 'connectionCreated' event for each existing connection in the session
                            events_1.connections.forEach(function (connection) {
                                _this.ee.emitEvent('connectionCreated', [new ConnectionEvent_1.ConnectionEvent(false, _this, 'connectionCreated', connection, '')]);
                            });
                            // One 'streamCreated' event for each active stream in the session
                            events_1.streams.forEach(function (stream) {
                                _this.ee.emitEvent('streamCreated', [new StreamEvent_1.StreamEvent(false, _this, 'streamCreated', stream, '')]);
                            });
                            return resolve();
                        }
                    });
                }
            });
        });
    };
    Session.prototype.stopPublisherStream = function (reason) {
        if (!!this.connection.stream) {
            // Dispose Publisher's  local stream
            this.connection.stream.disposeWebRtcPeer();
            if (this.connection.stream.isLocalStreamPublished) {
                // Make Publisher object dispatch 'streamDestroyed' event if the Stream was published
                this.connection.stream.ee.emitEvent('local-stream-destroyed', [reason]);
            }
        }
    };
    Session.prototype.stopVideoDataIntervals = function () {
        clearInterval(this.videoDataInterval);
        clearTimeout(this.videoDataTimeout);
    };
    Session.prototype.stringClientMetadata = function (metadata) {
        if (typeof metadata !== 'string') {
            return JSON.stringify(metadata);
        }
        else {
            return metadata;
        }
    };
    Session.prototype.getConnection = function (connectionId, errorMessage) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connection = _this.remoteConnections.get(connectionId);
            if (!!connection) {
                // Resolve remote connection
                return resolve(connection);
            }
            else {
                if (_this.connection.connectionId === connectionId) {
                    // Resolve local connection
                    return resolve(_this.connection);
                }
                else {
                    // Connection not found. Reject with OpenViduError
                    return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.GENERIC_ERROR, errorMessage));
                }
            }
        });
    };
    Session.prototype.getRemoteConnection = function (connectionId, operation) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connection = _this.remoteConnections.get(connectionId);
            if (!!connection) {
                // Resolve remote connection
                return resolve(connection);
            }
            else {
                // Remote connection not found. Reject with OpenViduError
                var errorMessage = 'Remote connection ' + connectionId + " unknown when '" + operation + "'. " +
                    'Existing remote connections: ' + JSON.stringify(_this.remoteConnections.keys());
                return reject(new OpenViduError_1.OpenViduError(OpenViduError_1.OpenViduErrorName.GENERIC_ERROR, errorMessage));
            }
        });
    };
    Session.prototype.processToken = function (token) {
        var tokenParams = this.getTokenParams(token);
        this.sessionId = tokenParams.sessionId;
        if (!!tokenParams.secret) {
            this.openvidu.secret = tokenParams.secret;
        }
        if (!!tokenParams.recorder) {
            this.openvidu.recorder = true;
        }
        if (!!tokenParams.webrtcStatsInterval) {
            this.openvidu.webrtcStatsInterval = tokenParams.webrtcStatsInterval;
        }
        if (!!tokenParams.sendBrowserLogs) {
            this.openvidu.sendBrowserLogs = tokenParams.sendBrowserLogs;
        }
        this.openvidu.isAtLeastPro = tokenParams.edition === 'pro' || tokenParams.edition === 'enterprise';
        this.openvidu.isEnterprise = tokenParams.edition === 'enterprise';
        this.openvidu.wsUri = tokenParams.wsUri;
        this.openvidu.httpUri = tokenParams.httpUri;
    };
    Session.prototype.processJoinRoomResponse = function (opts, token) {
        this.sessionId = opts.session;
        if (opts.customIceServers != null && opts.customIceServers.length > 0) {
            this.openvidu.iceServers = [];
            for (var _i = 0, _a = opts.customIceServers; _i < _a.length; _i++) {
                var iceServer = _a[_i];
                var rtcIceServer = {
                    urls: [iceServer.url]
                };
                logger.log("STUN/TURN server IP: " + iceServer.url);
                if (iceServer.username != null && iceServer.credential != null) {
                    rtcIceServer.username = iceServer.username;
                    rtcIceServer.credential = iceServer.credential;
                    logger.log('TURN credentials [' + iceServer.username + ':' + iceServer.credential + ']');
                }
                this.openvidu.iceServers.push(rtcIceServer);
            }
        }
        else if (opts.coturnIp != null && opts.coturnPort != null && opts.turnUsername != null && opts.turnCredential != null) {
            var turnUrl1 = 'turn:' + opts.coturnIp + ':' + opts.coturnPort;
            this.openvidu.iceServers = [
                { urls: [turnUrl1], username: opts.turnUsername, credential: opts.turnCredential }
            ];
            logger.log("STUN/TURN server IP: " + opts.coturnIp);
            logger.log('TURN temp credentials [' + opts.turnUsername + ':' + opts.turnCredential + ']');
        }
        this.openvidu.role = opts.role;
        this.openvidu.finalUserId = opts.finalUserId;
        this.openvidu.mediaServer = opts.mediaServer;
        this.openvidu.videoSimulcast = opts.videoSimulcast;
        this.capabilities = {
            subscribe: true,
            publish: this.openvidu.role !== 'SUBSCRIBER',
            forceUnpublish: this.openvidu.role === 'MODERATOR',
            forceDisconnect: this.openvidu.role === 'MODERATOR'
        };
        logger.info("openvidu-server version: " + opts.version);
        if (opts.life != null) {
            this.openvidu.life = opts.life;
        }
        var minorDifference = semverMinor(opts.version) - semverMinor(this.openvidu.libraryVersion);
        if ((semverMajor(opts.version) !== semverMajor(this.openvidu.libraryVersion)) || !(minorDifference == 0 || minorDifference == 1)) {
            logger.error("openvidu-browser (".concat(this.openvidu.libraryVersion, ") and openvidu-server (").concat(opts.version, ") versions are incompatible. ")
                + 'Errors are likely to occur. openvidu-browser SDK is only compatible with the same version or the immediately following minor version of an OpenVidu deployment');
        }
        else if (minorDifference == 1) {
            logger.warn("openvidu-browser version ".concat(this.openvidu.libraryVersion, " does not match openvidu-server version ").concat(opts.version, ". ")
                + "These versions are still compatible with each other, but openvidu-browser version must be updated as soon as possible to ".concat(semverMajor(opts.version), ".").concat(semverMinor(opts.version), ".x. ")
                + "This client using openvidu-browser ".concat(this.openvidu.libraryVersion, " will become incompatible with the next release of openvidu-server"));
        }
        // Configure JSNLogs
        OpenViduLogger_1.OpenViduLogger.configureJSNLog(this.openvidu, token);
        // Store token
        this.token = token;
    };
    return Session;
}(EventDispatcher_1.EventDispatcher));
exports.Session = Session;
//# sourceMappingURL=Session.js.map