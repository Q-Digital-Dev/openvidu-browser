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
exports.ConnectionPropertyChangedEvent = void 0;
var Event_1 = require("./Event");
/**
 * **This feature is part of OpenVidu Pro tier** <a href="https://docs.openvidu.io/en/stable/openvidu-pro/" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin-right: 5px; border-radius: 3px; font-size: 13px; line-height:21px; font-family: Montserrat, sans-serif">PRO</a>
 *
 * Triggered by [[connectionPropertyChanged]]
 */
var ConnectionPropertyChangedEvent = /** @class */ (function (_super) {
    __extends(ConnectionPropertyChangedEvent, _super);
    /**
     * @hidden
     */
    function ConnectionPropertyChangedEvent(target, connection, changedProperty, newValue, oldValue) {
        var _this = _super.call(this, false, target, 'connectionPropertyChanged') || this;
        _this.connection = connection;
        _this.changedProperty = changedProperty;
        _this.newValue = newValue;
        _this.oldValue = oldValue;
        return _this;
    }
    /**
     * @hidden
     */
    // tslint:disable-next-line:no-empty
    ConnectionPropertyChangedEvent.prototype.callDefaultBehavior = function () { };
    return ConnectionPropertyChangedEvent;
}(Event_1.Event));
exports.ConnectionPropertyChangedEvent = ConnectionPropertyChangedEvent;
//# sourceMappingURL=ConnectionPropertyChangedEvent.js.map