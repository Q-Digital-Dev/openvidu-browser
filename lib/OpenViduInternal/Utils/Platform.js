"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformUtils = void 0;
var platform = require("platform");
var PlatformUtils = /** @class */ (function () {
    function PlatformUtils() {
    }
    PlatformUtils.getInstance = function () {
        if (!this.instance) {
            this.instance = new PlatformUtils();
        }
        return PlatformUtils.instance;
    };
    PlatformUtils.prototype.isChromeBrowser = function () {
        return platform.name === "Chrome";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isSafariBrowser = function () {
        return platform.name === "Safari";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isChromeMobileBrowser = function () {
        return platform.name === "Chrome Mobile";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isFirefoxBrowser = function () {
        return platform.name === "Firefox";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isFirefoxMobileBrowser = function () {
        return platform.name === "Firefox Mobile" || platform.name === "Firefox for iOS";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isOperaBrowser = function () {
        return platform.name === "Opera";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isOperaMobileBrowser = function () {
        return platform.name === "Opera Mobile";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isEdgeBrowser = function () {
        var version = (platform === null || platform === void 0 ? void 0 : platform.version) ? parseFloat(platform.version) : -1;
        return platform.name === "Microsoft Edge" && version >= 80;
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isEdgeMobileBrowser = function () {
        var _a, _b;
        var version = (platform === null || platform === void 0 ? void 0 : platform.version) ? parseFloat(platform.version) : -1;
        return platform.name === "Microsoft Edge" && (((_a = platform.os) === null || _a === void 0 ? void 0 : _a.family) === 'Android' || ((_b = platform.os) === null || _b === void 0 ? void 0 : _b.family) === 'iOS') && version > 45;
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isAndroidBrowser = function () {
        return platform.name === "Android Browser";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isElectron = function () {
        return platform.name === "Electron";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isSamsungBrowser = function () {
        return (platform.name === "Samsung Internet Mobile" ||
            platform.name === "Samsung Internet");
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isIPhoneOrIPad = function () {
        var userAgent = !!platform.ua ? platform.ua : navigator.userAgent;
        var isTouchable = "ontouchend" in document;
        var isIPad = /\b(\w*Macintosh\w*)\b/.test(userAgent) && isTouchable;
        var isIPhone = /\b(\w*iPhone\w*)\b/.test(userAgent) &&
            /\b(\w*Mobile\w*)\b/.test(userAgent) &&
            isTouchable;
        return isIPad || isIPhone;
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isIOSWithSafari = function () {
        var userAgent = !!platform.ua ? platform.ua : navigator.userAgent;
        return this.isIPhoneOrIPad() && (/\b(\w*Apple\w*)\b/.test(navigator.vendor) &&
            /\b(\w*Safari\w*)\b/.test(userAgent) &&
            !/\b(\w*CriOS\w*)\b/.test(userAgent) &&
            !/\b(\w*FxiOS\w*)\b/.test(userAgent));
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isIonicIos = function () {
        return this.isIPhoneOrIPad() && platform.ua.indexOf("Safari") === -1;
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isIonicAndroid = function () {
        return (platform.os.family === "Android" && platform.name == "Android Browser");
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isMobileDevice = function () {
        return platform.os.family === "iOS" || platform.os.family === "Android";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isReactNative = function () {
        return false;
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.isChromium = function () {
        return this.isChromeBrowser() || this.isChromeMobileBrowser() ||
            this.isOperaBrowser() || this.isOperaMobileBrowser() ||
            this.isEdgeBrowser() || this.isEdgeMobileBrowser() ||
            this.isSamsungBrowser() ||
            this.isIonicAndroid() || this.isIonicIos() ||
            this.isElectron();
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.canScreenShare = function () {
        var version = (platform === null || platform === void 0 ? void 0 : platform.version) ? parseFloat(platform.version) : -1;
        // Reject mobile devices
        if (this.isMobileDevice()) {
            return false;
        }
        return (this.isChromeBrowser() ||
            this.isFirefoxBrowser() ||
            this.isOperaBrowser() ||
            this.isElectron() ||
            this.isEdgeBrowser() ||
            (this.isSafariBrowser() && version >= 13));
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.getName = function () {
        return platform.name || "";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.getVersion = function () {
        return platform.version || "";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.getFamily = function () {
        return platform.os.family || "";
    };
    /**
     * @hidden
     */
    PlatformUtils.prototype.getDescription = function () {
        return platform.description || "";
    };
    return PlatformUtils;
}());
exports.PlatformUtils = PlatformUtils;
//# sourceMappingURL=Platform.js.map