"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = exports.ExceptionEventName = exports.ExceptionEvent = exports.NetworkQualityLevelChangedEvent = exports.FilterEvent = exports.ConnectionPropertyChangedEvent = exports.StreamPropertyChangedEvent = exports.VideoElementEvent = exports.StreamManagerEvent = exports.StreamEvent = exports.SignalEvent = exports.SessionDisconnectedEvent = exports.RecordingEvent = exports.PublisherSpeakingEvent = exports.ConnectionEvent = exports.Event = exports.VideoInsertMode = exports.TypeOfVideo = exports.OpenViduErrorName = exports.OpenViduError = exports.LocalRecorderState = exports.Filter = exports.LocalRecorder = exports.Connection = exports.Stream = exports.StreamManager = exports.Subscriber = exports.Publisher = exports.Session = exports.OpenVidu = void 0;
var jsnlog_1 = require("jsnlog");
var OpenVidu_1 = require("./OpenVidu/OpenVidu");
Object.defineProperty(exports, "OpenVidu", { enumerable: true, get: function () { return OpenVidu_1.OpenVidu; } });
var Session_1 = require("./OpenVidu/Session");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return Session_1.Session; } });
var Publisher_1 = require("./OpenVidu/Publisher");
Object.defineProperty(exports, "Publisher", { enumerable: true, get: function () { return Publisher_1.Publisher; } });
var Subscriber_1 = require("./OpenVidu/Subscriber");
Object.defineProperty(exports, "Subscriber", { enumerable: true, get: function () { return Subscriber_1.Subscriber; } });
var StreamManager_1 = require("./OpenVidu/StreamManager");
Object.defineProperty(exports, "StreamManager", { enumerable: true, get: function () { return StreamManager_1.StreamManager; } });
var Stream_1 = require("./OpenVidu/Stream");
Object.defineProperty(exports, "Stream", { enumerable: true, get: function () { return Stream_1.Stream; } });
var Connection_1 = require("./OpenVidu/Connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return Connection_1.Connection; } });
var LocalRecorder_1 = require("./OpenVidu/LocalRecorder");
Object.defineProperty(exports, "LocalRecorder", { enumerable: true, get: function () { return LocalRecorder_1.LocalRecorder; } });
var Filter_1 = require("./OpenVidu/Filter");
Object.defineProperty(exports, "Filter", { enumerable: true, get: function () { return Filter_1.Filter; } });
var LocalRecorderState_1 = require("./OpenViduInternal/Enums/LocalRecorderState");
Object.defineProperty(exports, "LocalRecorderState", { enumerable: true, get: function () { return LocalRecorderState_1.LocalRecorderState; } });
var OpenViduError_1 = require("./OpenViduInternal/Enums/OpenViduError");
Object.defineProperty(exports, "OpenViduError", { enumerable: true, get: function () { return OpenViduError_1.OpenViduError; } });
Object.defineProperty(exports, "OpenViduErrorName", { enumerable: true, get: function () { return OpenViduError_1.OpenViduErrorName; } });
var TypeOfVideo_1 = require("./OpenViduInternal/Enums/TypeOfVideo");
Object.defineProperty(exports, "TypeOfVideo", { enumerable: true, get: function () { return TypeOfVideo_1.TypeOfVideo; } });
var VideoInsertMode_1 = require("./OpenViduInternal/Enums/VideoInsertMode");
Object.defineProperty(exports, "VideoInsertMode", { enumerable: true, get: function () { return VideoInsertMode_1.VideoInsertMode; } });
var Event_1 = require("./OpenViduInternal/Events/Event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return Event_1.Event; } });
var ConnectionEvent_1 = require("./OpenViduInternal/Events/ConnectionEvent");
Object.defineProperty(exports, "ConnectionEvent", { enumerable: true, get: function () { return ConnectionEvent_1.ConnectionEvent; } });
var PublisherSpeakingEvent_1 = require("./OpenViduInternal/Events/PublisherSpeakingEvent");
Object.defineProperty(exports, "PublisherSpeakingEvent", { enumerable: true, get: function () { return PublisherSpeakingEvent_1.PublisherSpeakingEvent; } });
var RecordingEvent_1 = require("./OpenViduInternal/Events/RecordingEvent");
Object.defineProperty(exports, "RecordingEvent", { enumerable: true, get: function () { return RecordingEvent_1.RecordingEvent; } });
var SessionDisconnectedEvent_1 = require("./OpenViduInternal/Events/SessionDisconnectedEvent");
Object.defineProperty(exports, "SessionDisconnectedEvent", { enumerable: true, get: function () { return SessionDisconnectedEvent_1.SessionDisconnectedEvent; } });
var SignalEvent_1 = require("./OpenViduInternal/Events/SignalEvent");
Object.defineProperty(exports, "SignalEvent", { enumerable: true, get: function () { return SignalEvent_1.SignalEvent; } });
var StreamEvent_1 = require("./OpenViduInternal/Events/StreamEvent");
Object.defineProperty(exports, "StreamEvent", { enumerable: true, get: function () { return StreamEvent_1.StreamEvent; } });
var StreamManagerEvent_1 = require("./OpenViduInternal/Events/StreamManagerEvent");
Object.defineProperty(exports, "StreamManagerEvent", { enumerable: true, get: function () { return StreamManagerEvent_1.StreamManagerEvent; } });
var VideoElementEvent_1 = require("./OpenViduInternal/Events/VideoElementEvent");
Object.defineProperty(exports, "VideoElementEvent", { enumerable: true, get: function () { return VideoElementEvent_1.VideoElementEvent; } });
var StreamPropertyChangedEvent_1 = require("./OpenViduInternal/Events/StreamPropertyChangedEvent");
Object.defineProperty(exports, "StreamPropertyChangedEvent", { enumerable: true, get: function () { return StreamPropertyChangedEvent_1.StreamPropertyChangedEvent; } });
var ConnectionPropertyChangedEvent_1 = require("./OpenViduInternal/Events/ConnectionPropertyChangedEvent");
Object.defineProperty(exports, "ConnectionPropertyChangedEvent", { enumerable: true, get: function () { return ConnectionPropertyChangedEvent_1.ConnectionPropertyChangedEvent; } });
var FilterEvent_1 = require("./OpenViduInternal/Events/FilterEvent");
Object.defineProperty(exports, "FilterEvent", { enumerable: true, get: function () { return FilterEvent_1.FilterEvent; } });
var NetworkQualityLevelChangedEvent_1 = require("./OpenViduInternal/Events/NetworkQualityLevelChangedEvent");
Object.defineProperty(exports, "NetworkQualityLevelChangedEvent", { enumerable: true, get: function () { return NetworkQualityLevelChangedEvent_1.NetworkQualityLevelChangedEvent; } });
var ExceptionEvent_1 = require("./OpenViduInternal/Events/ExceptionEvent");
Object.defineProperty(exports, "ExceptionEvent", { enumerable: true, get: function () { return ExceptionEvent_1.ExceptionEvent; } });
Object.defineProperty(exports, "ExceptionEventName", { enumerable: true, get: function () { return ExceptionEvent_1.ExceptionEventName; } });
var EventDispatcher_1 = require("./OpenVidu/EventDispatcher");
Object.defineProperty(exports, "EventDispatcher", { enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } });
// Disable jsnlog when library is loaded
jsnlog_1.JL.setOptions({ enabled: false });
//# sourceMappingURL=index.js.map