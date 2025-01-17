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
exports.EventDispatcher = void 0;
var EventEmitter = require("wolfy87-eventemitter");
var OpenViduLogger_1 = require("../OpenViduInternal/Logger/OpenViduLogger");
/**
 * @hidden
 */
var logger = OpenViduLogger_1.OpenViduLogger.getInstance();
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        /**
         * @hidden
         */
        this.userHandlerArrowHandler = new WeakMap();
        /**
         * @hidden
         */
        this.ee = new EventEmitter();
    }
    /**
     * @hidden
     */
    EventDispatcher.prototype.onAux = function (type, message, handler) {
        var arrowHandler = function (event) {
            if (event) {
                logger.info(message, event);
            }
            else {
                logger.info(message);
            }
            handler(event);
        };
        this.userHandlerArrowHandler.set(handler, arrowHandler);
        this.ee.on(type, arrowHandler);
        return this;
    };
    /**
     * @hidden
     */
    EventDispatcher.prototype.onceAux = function (type, message, handler) {
        var _this = this;
        var arrowHandler = function (event) {
            if (event) {
                logger.info(message, event);
            }
            else {
                logger.info(message);
            }
            handler(event);
            // Remove handler from map after first and only execution
            _this.userHandlerArrowHandler.delete(handler);
        };
        this.userHandlerArrowHandler.set(handler, arrowHandler);
        this.ee.once(type, arrowHandler);
        return this;
    };
    /**
     * @hidden
     */
    EventDispatcher.prototype.offAux = function (type, handler) {
        if (!handler) {
            this.ee.removeAllListeners(type);
        }
        else {
            // Must remove internal arrow function handler paired with user handler
            var arrowHandler = this.userHandlerArrowHandler.get(handler);
            if (!!arrowHandler) {
                this.ee.off(type, arrowHandler);
            }
            this.userHandlerArrowHandler.delete(handler);
        }
        return this;
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=EventDispatcher.js.map