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
exports.StreamManager = void 0;
var EventDispatcher_1 = require("./EventDispatcher");
var StreamManagerEvent_1 = require("../OpenViduInternal/Events/StreamManagerEvent");
var VideoElementEvent_1 = require("../OpenViduInternal/Events/VideoElementEvent");
var ExceptionEvent_1 = require("../OpenViduInternal/Events/ExceptionEvent");
var VideoInsertMode_1 = require("../OpenViduInternal/Enums/VideoInsertMode");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
var Platform_1 = require("../OpenViduInternal/Utils/Platform");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
/**
 * @hidden
 */
var platform;
/**
 * Interface in charge of displaying the media streams in the HTML DOM. This wraps any [[Publisher]] and [[Subscriber]] object.
 * You can insert as many video players fo the same Stream as you want by calling [[StreamManager.addVideoElement]] or
 * [[StreamManager.createVideoElement]].
 * The use of StreamManager wrapper is particularly useful when you don't need to differentiate between Publisher or Subscriber streams or just
 * want to directly manage your own video elements (even more than one video element per Stream). This scenario is pretty common in
 * declarative, MVC frontend frameworks such as Angular, React or Vue.js
 *
 * See available event listeners at [[StreamManagerEventMap]].
 */
var StreamManager = /** @class */ (function (_super) {
    __extends(StreamManager, _super);
    /**
     * @hidden
     */
    function StreamManager(stream, targetElement) {
        var _this = _super.call(this) || this;
        /**
         * All the videos displaying the Stream of this Publisher/Subscriber
         */
        _this.videos = [];
        /**
         * @hidden
         */
        _this.lazyLaunchVideoElementCreatedEvent = false;
        platform = Platform_1.PlatformUtils.getInstance();
        _this.stream = stream;
        _this.stream.streamManager = _this;
        _this.remote = !_this.stream.isLocal();
        if (!!targetElement) {
            var targEl = void 0;
            if (typeof targetElement === 'string') {
                targEl = document.getElementById(targetElement);
            }
            else if (targetElement instanceof HTMLElement) {
                targEl = targetElement;
            }
            if (!!targEl) {
                _this.firstVideoElement = {
                    targetElement: targEl,
                    video: document.createElement('video'),
                    id: '',
                    canplayListenerAdded: false
                };
                if (platform.isSafariBrowser() || (platform.isIPhoneOrIPad() && (platform.isChromeMobileBrowser() || platform.isEdgeMobileBrowser() || platform.isOperaMobileBrowser() || platform.isFirefoxMobileBrowser()))) {
                    _this.firstVideoElement.video.setAttribute('playsinline', 'true');
                }
                _this.targetElement = targEl;
                _this.element = targEl;
            }
        }
        _this.canPlayListener = function () {
            _this.deactivateStreamPlayingEventExceptionTimeout();
            _this.ee.emitEvent('streamPlaying', [new StreamManagerEvent_1.StreamManagerEvent(_this, 'streamPlaying', undefined)]);
        };
        return _this;
    }
    /**
     * See [[EventDispatcher.on]]
     */
    StreamManager.prototype.on = function (type, handler) {
        _super.prototype.onAux.call(this, type, "Event '" + type + "' triggered by '" + (this.remote ? 'Subscriber' : 'Publisher') + "'", handler);
        if (type === 'videoElementCreated') {
            if (!!this.stream && this.lazyLaunchVideoElementCreatedEvent) {
                this.ee.emitEvent('videoElementCreated', [new VideoElementEvent_1.VideoElementEvent(this.videos[0].video, this, 'videoElementCreated')]);
                this.lazyLaunchVideoElementCreatedEvent = false;
            }
        }
        if (type === 'streamPlaying') {
            if (this.videos[0] && this.videos[0].video &&
                this.videos[0].video.currentTime > 0 &&
                this.videos[0].video.paused === false &&
                this.videos[0].video.ended === false &&
                this.videos[0].video.readyState === 4) {
                this.ee.emitEvent('streamPlaying', [new StreamManagerEvent_1.StreamManagerEvent(this, 'streamPlaying', undefined)]);
            }
        }
        if (this.stream.hasAudio) {
            if (type === 'publisherStartSpeaking') {
                this.stream.enableHarkSpeakingEvent();
            }
            if (type === 'publisherStopSpeaking') {
                this.stream.enableHarkStoppedSpeakingEvent();
            }
            if (type === 'streamAudioVolumeChange') {
                this.stream.enableHarkVolumeChangeEvent(false);
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.once]]
     */
    StreamManager.prototype.once = function (type, handler) {
        _super.prototype.onceAux.call(this, type, "Event '" + type + "' triggered once by '" + (this.remote ? 'Subscriber' : 'Publisher') + "'", handler);
        if (type === 'videoElementCreated') {
            if (!!this.stream && this.lazyLaunchVideoElementCreatedEvent) {
                this.ee.emitEvent('videoElementCreated', [new VideoElementEvent_1.VideoElementEvent(this.videos[0].video, this, 'videoElementCreated')]);
            }
        }
        if (type === 'streamPlaying') {
            if (this.videos[0] && this.videos[0].video &&
                this.videos[0].video.currentTime > 0 &&
                this.videos[0].video.paused === false &&
                this.videos[0].video.ended === false &&
                this.videos[0].video.readyState === 4) {
                this.ee.emitEvent('streamPlaying', [new StreamManagerEvent_1.StreamManagerEvent(this, 'streamPlaying', undefined)]);
            }
        }
        if (this.stream.hasAudio) {
            if (type === 'publisherStartSpeaking') {
                this.stream.enableOnceHarkSpeakingEvent();
            }
            if (type === 'publisherStopSpeaking') {
                this.stream.enableOnceHarkStoppedSpeakingEvent();
            }
            if (type === 'streamAudioVolumeChange') {
                this.stream.enableOnceHarkVolumeChangeEvent(false);
            }
        }
        return this;
    };
    /**
     * See [[EventDispatcher.off]]
     */
    StreamManager.prototype.off = function (type, handler) {
        _super.prototype.offAux.call(this, type, handler);
        if (type === 'publisherStartSpeaking') {
            // Both StreamManager and Session can have "publisherStartSpeaking" event listeners
            var remainingStartSpeakingEventListeners = this.ee.getListeners(type).length + this.stream.session.ee.getListeners(type).length;
            if (remainingStartSpeakingEventListeners === 0) {
                this.stream.disableHarkSpeakingEvent(false);
            }
        }
        if (type === 'publisherStopSpeaking') {
            // Both StreamManager and Session can have "publisherStopSpeaking" event listeners
            var remainingStopSpeakingEventListeners = this.ee.getListeners(type).length + this.stream.session.ee.getListeners(type).length;
            if (remainingStopSpeakingEventListeners === 0) {
                this.stream.disableHarkStoppedSpeakingEvent(false);
            }
        }
        if (type === 'streamAudioVolumeChange') {
            // Only StreamManager can have "streamAudioVolumeChange" event listeners
            var remainingVolumeEventListeners = this.ee.getListeners(type).length;
            if (remainingVolumeEventListeners === 0) {
                this.stream.disableHarkVolumeChangeEvent(false);
            }
        }
        return this;
    };
    /**
     * Makes `video` element parameter display this [[stream]]. This is useful when you are
     * [managing the video elements on your own](/en/stable/cheatsheet/manage-videos/#you-take-care-of-the-video-players)
     *
     * Calling this method with a video already added to other Publisher/Subscriber will cause the video element to be
     * disassociated from that previous Publisher/Subscriber and to be associated to this one.
     *
     * @returns 1 if the video wasn't associated to any other Publisher/Subscriber and has been successfully added to this one.
     * 0 if the video was already added to this Publisher/Subscriber. -1 if the video was previously associated to any other
     * Publisher/Subscriber and has been successfully disassociated from that one and properly added to this one.
     */
    StreamManager.prototype.addVideoElement = function (video) {
        this.initializeVideoProperties(video);
        if (!this.remote && this.stream.displayMyRemote()) {
            if (video.srcObject !== this.stream.getMediaStream()) {
                video.srcObject = this.stream.getMediaStream();
            }
        }
        // If the video element is already part of this StreamManager do nothing
        for (var _i = 0, _a = this.videos; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.video === video) {
                return 0;
            }
        }
        var returnNumber = 1;
        for (var _b = 0, _c = this.stream.session.streamManagers; _b < _c.length; _b++) {
            var streamManager = _c[_b];
            if (streamManager.disassociateVideo(video)) {
                returnNumber = -1;
                break;
            }
        }
        this.stream.session.streamManagers.forEach(function (streamManager) {
            streamManager.disassociateVideo(video);
        });
        this.pushNewStreamManagerVideo({
            video: video,
            id: video.id,
            canplayListenerAdded: false
        });
        logger.info('New video element associated to ', this);
        return returnNumber;
    };
    /**
     * Creates a new video element displaying this [[stream]]. This allows you to have multiple video elements displaying the same media stream.
     *
     * #### Events dispatched
     *
     * The Publisher/Subscriber object will dispatch a `videoElementCreated` event once the HTML video element has been added to DOM. See [[VideoElementEvent]]
     *
     * @param targetElement HTML DOM element (or its `id` attribute) in which the video element of the Publisher/Subscriber will be inserted
     * @param insertMode How the video element will be inserted accordingly to `targetElemet`
     *
     * @returns The created HTMLVideoElement
     */
    StreamManager.prototype.createVideoElement = function (targetElement, insertMode) {
        var targEl;
        if (typeof targetElement === 'string') {
            targEl = document.getElementById(targetElement);
            if (!targEl) {
                throw new Error("The provided 'targetElement' couldn't be resolved to any HTML element: " + targetElement);
            }
        }
        else if (targetElement instanceof HTMLElement) {
            targEl = targetElement;
        }
        else {
            throw new Error("The provided 'targetElement' couldn't be resolved to any HTML element: " + targetElement);
        }
        var video = this.createVideo();
        this.initializeVideoProperties(video);
        var insMode = !!insertMode ? insertMode : VideoInsertMode_1.VideoInsertMode.APPEND;
        switch (insMode) {
            case VideoInsertMode_1.VideoInsertMode.AFTER:
                targEl.parentNode.insertBefore(video, targEl.nextSibling);
                break;
            case VideoInsertMode_1.VideoInsertMode.APPEND:
                targEl.appendChild(video);
                break;
            case VideoInsertMode_1.VideoInsertMode.BEFORE:
                targEl.parentNode.insertBefore(video, targEl);
                break;
            case VideoInsertMode_1.VideoInsertMode.PREPEND:
                targEl.insertBefore(video, targEl.childNodes[0]);
                break;
            case VideoInsertMode_1.VideoInsertMode.REPLACE:
                targEl.parentNode.replaceChild(video, targEl);
                break;
            default:
                insMode = VideoInsertMode_1.VideoInsertMode.APPEND;
                targEl.appendChild(video);
                break;
        }
        var v = {
            targetElement: targEl,
            video: video,
            insertMode: insMode,
            id: video.id,
            canplayListenerAdded: false
        };
        this.pushNewStreamManagerVideo(v);
        this.ee.emitEvent('videoElementCreated', [new VideoElementEvent_1.VideoElementEvent(v.video, this, 'videoElementCreated')]);
        this.lazyLaunchVideoElementCreatedEvent = !!this.firstVideoElement;
        return video;
    };
    /**
     * Updates the current configuration for the [[PublisherSpeakingEvent]] feature and the [StreamManagerEvent.streamAudioVolumeChange](/en/stable/api/openvidu-browser/classes/StreamManagerEvent.html) feature for this specific
     * StreamManager audio stream, overriding the global options set with [[OpenVidu.setAdvancedConfiguration]]. This way you can customize the audio events options
     * for each specific StreamManager and change them dynamically.
     *
     * @param publisherSpeakingEventsOptions New options to be applied to this StreamManager's audio stream. It is an object which includes the following optional properties:
     * - `interval`: (number) how frequently the analyser polls the audio stream to check if speaking has started/stopped or audio volume has changed. Default **100** (ms)
     * - `threshold`: (number) the volume at which _publisherStartSpeaking_, _publisherStopSpeaking_ events will be fired. Default **-50** (dB)
     */
    StreamManager.prototype.updatePublisherSpeakingEventsOptions = function (publisherSpeakingEventsOptions) {
        var currentHarkOptions = !!this.stream.harkOptions ? this.stream.harkOptions : (this.stream.session.openvidu.advancedConfiguration.publisherSpeakingEventsOptions || {});
        var newInterval = (typeof publisherSpeakingEventsOptions.interval === 'number') ?
            publisherSpeakingEventsOptions.interval : ((typeof currentHarkOptions.interval === 'number') ? currentHarkOptions.interval : 100);
        var newThreshold = (typeof publisherSpeakingEventsOptions.threshold === 'number') ?
            publisherSpeakingEventsOptions.threshold : ((typeof currentHarkOptions.threshold === 'number') ? currentHarkOptions.threshold : -50);
        this.stream.harkOptions = {
            interval: newInterval,
            threshold: newThreshold
        };
        if (!!this.stream.speechEvent) {
            this.stream.speechEvent.setInterval(newInterval);
            this.stream.speechEvent.setThreshold(newThreshold);
        }
    };
    /* Hidden methods */
    /**
     * @hidden
     */
    StreamManager.prototype.initializeVideoProperties = function (video) {
        if (!(!this.remote && this.stream.displayMyRemote())) {
            // Avoid setting the MediaStream into the srcObject if remote subscription before publishing
            if (video.srcObject !== this.stream.getMediaStream()) {
                // If srcObject already set don't do it again
                video.srcObject = this.stream.getMediaStream();
            }
        }
        video.autoplay = true;
        video.controls = false;
        if (platform.isSafariBrowser() || (platform.isIPhoneOrIPad() && (platform.isChromeMobileBrowser() || platform.isEdgeMobileBrowser() || platform.isOperaMobileBrowser() || platform.isFirefoxMobileBrowser()))) {
            video.setAttribute('playsinline', 'true');
        }
        if (!video.id) {
            video.id = (this.remote ? 'remote-' : 'local-') + 'video-' + this.stream.streamId;
            // DEPRECATED property: assign once the property id if the user provided a valid targetElement
            if (!this.id && !!this.targetElement) {
                this.id = video.id;
            }
        }
        if (this.remote && this.isMirroredVideo(video)) {
            // Subscriber video associated to a previously mirrored video element
            this.removeMirrorVideo(video);
        }
        else if (!this.remote && !this.stream.displayMyRemote()) {
            // Publisher video
            video.muted = true;
            if (this.isMirroredVideo(video) && !this.stream.outboundStreamOpts.publisherProperties.mirror) {
                // If the video was already rotated and now is set to not mirror
                this.removeMirrorVideo(video);
            }
            else if (this.stream.outboundStreamOpts.publisherProperties.mirror && !this.stream.isSendScreen()) {
                // If the video is now set to mirror and is not screen share
                this.mirrorVideo(video);
            }
        }
    };
    /**
     * @hidden
     */
    StreamManager.prototype.removeAllVideos = function () {
        var _this = this;
        for (var i = this.stream.session.streamManagers.length - 1; i >= 0; --i) {
            if (this.stream.session.streamManagers[i] === this) {
                this.stream.session.streamManagers.splice(i, 1);
            }
        }
        this.videos.forEach(function (streamManagerVideo) {
            // Remove oncanplay event listener (only OpenVidu browser listener, not the user ones)
            if (!!streamManagerVideo.video && !!streamManagerVideo.video.removeEventListener) {
                streamManagerVideo.video.removeEventListener('canplay', _this.canPlayListener);
            }
            streamManagerVideo.canplayListenerAdded = false;
            if (!!streamManagerVideo.targetElement) {
                // Only remove from DOM videos created by OpenVidu Browser (those generated by passing a valid targetElement in OpenVidu.initPublisher
                // and Session.subscribe or those created by StreamManager.createVideoElement). All this videos triggered a videoElementCreated event
                streamManagerVideo.video.parentNode.removeChild(streamManagerVideo.video);
                _this.ee.emitEvent('videoElementDestroyed', [new VideoElementEvent_1.VideoElementEvent(streamManagerVideo.video, _this, 'videoElementDestroyed')]);
            }
            // Remove srcObject from the video
            _this.removeSrcObject(streamManagerVideo);
            // Remove from collection of videos every video managed by OpenVidu Browser
            _this.videos.filter(function (v) { return !v.targetElement; });
        });
    };
    /**
     * @hidden
     */
    StreamManager.prototype.disassociateVideo = function (video) {
        var disassociated = false;
        for (var i = 0; i < this.videos.length; i++) {
            if (this.videos[i].video === video) {
                this.videos[i].video.removeEventListener('canplay', this.canPlayListener);
                this.videos.splice(i, 1);
                disassociated = true;
                logger.info('Video element disassociated from ', this);
                break;
            }
        }
        return disassociated;
    };
    /**
     * @hidden
     */
    StreamManager.prototype.addPlayEventToFirstVideo = function () {
        if ((!!this.videos[0]) && (!!this.videos[0].video) && (!this.videos[0].canplayListenerAdded)) {
            this.activateStreamPlayingEventExceptionTimeout();
            this.videos[0].video.addEventListener('canplay', this.canPlayListener);
            this.videos[0].canplayListenerAdded = true;
        }
    };
    /**
     * @hidden
     */
    StreamManager.prototype.updateMediaStream = function (mediaStream) {
        this.videos.forEach(function (streamManagerVideo) {
            streamManagerVideo.video.srcObject = mediaStream;
            if (platform.isIonicIos()) {
                // iOS Ionic. LIMITATION: must reinsert the video in the DOM for
                // the media stream to be updated
                var vParent = streamManagerVideo.video.parentElement;
                var newVideo = streamManagerVideo.video;
                vParent.replaceChild(newVideo, streamManagerVideo.video);
                streamManagerVideo.video = newVideo;
            }
        });
    };
    /**
     * @hidden
     */
    StreamManager.prototype.emitEvent = function (type, eventArray) {
        this.ee.emitEvent(type, eventArray);
    };
    /**
    * @hidden
    */
    StreamManager.prototype.createVideo = function () {
        return document.createElement('video');
    };
    /**
     * @hidden
     */
    StreamManager.prototype.removeSrcObject = function (streamManagerVideo) {
        streamManagerVideo.video.srcObject = null;
        this.deactivateStreamPlayingEventExceptionTimeout();
    };
    /* Private methods */
    StreamManager.prototype.pushNewStreamManagerVideo = function (streamManagerVideo) {
        this.videos.push(streamManagerVideo);
        this.addPlayEventToFirstVideo();
        if (this.stream.session.streamManagers.indexOf(this) === -1) {
            this.stream.session.streamManagers.push(this);
        }
    };
    StreamManager.prototype.mirrorVideo = function (video) {
        if (!platform.isIonicIos()) {
            video.style.transform = 'rotateY(180deg)';
            video.style.webkitTransform = 'rotateY(180deg)';
        }
    };
    StreamManager.prototype.removeMirrorVideo = function (video) {
        video.style.transform = 'unset';
        video.style.webkitTransform = 'unset';
    };
    StreamManager.prototype.isMirroredVideo = function (video) {
        return video.style.transform === 'rotateY(180deg)' || video.style.webkitTransform === 'rotateY(180deg)';
    };
    StreamManager.prototype.activateStreamPlayingEventExceptionTimeout = function () {
        var _this = this;
        if (!this.remote) {
            // ExceptionEvent NO_STREAM_PLAYING_EVENT is only for subscribers
            return;
        }
        if (this.streamPlayingEventExceptionTimeout != null) {
            // The timeout is already activated
            return;
        }
        // Trigger ExceptionEvent NO_STREAM_PLAYING_EVENT if after timeout there is no 'canplay' event
        var msTimeout = this.stream.session.openvidu.advancedConfiguration.noStreamPlayingEventExceptionTimeout || 4000;
        this.streamPlayingEventExceptionTimeout = setTimeout(function () {
            var msg = 'StreamManager of Stream ' + _this.stream.streamId + ' (' + (_this.remote ? 'Subscriber' : 'Publisher') + ') did not trigger "streamPlaying" event in ' + msTimeout + ' ms';
            logger.warn(msg);
            _this.stream.session.emitEvent('exception', [new ExceptionEvent_1.ExceptionEvent(_this.stream.session, ExceptionEvent_1.ExceptionEventName.NO_STREAM_PLAYING_EVENT, _this, msg)]);
            delete _this.streamPlayingEventExceptionTimeout;
        }, msTimeout);
    };
    StreamManager.prototype.deactivateStreamPlayingEventExceptionTimeout = function () {
        clearTimeout(this.streamPlayingEventExceptionTimeout);
        delete this.streamPlayingEventExceptionTimeout;
    };
    return StreamManager;
}(EventDispatcher_1.EventDispatcher));
exports.StreamManager = StreamManager;
//# sourceMappingURL=StreamManager.js.map