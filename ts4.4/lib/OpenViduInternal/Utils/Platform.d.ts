export declare class PlatformUtils {
    protected static instance: PlatformUtils;
    constructor();
    static getInstance(): PlatformUtils;
    isChromeBrowser(): boolean;
    /**
     * @hidden
     */
    isSafariBrowser(): boolean;
    /**
     * @hidden
     */
    isChromeMobileBrowser(): boolean;
    /**
     * @hidden
     */
    isFirefoxBrowser(): boolean;
    /**
     * @hidden
     */
    isFirefoxMobileBrowser(): boolean;
    /**
     * @hidden
     */
    isOperaBrowser(): boolean;
    /**
     * @hidden
     */
    isOperaMobileBrowser(): boolean;
    /**
     * @hidden
     */
    isEdgeBrowser(): boolean;
    /**
     * @hidden
     */
    isEdgeMobileBrowser(): boolean;
    /**
     * @hidden
     */
    isAndroidBrowser(): boolean;
    /**
     * @hidden
     */
    isElectron(): boolean;
    /**
     * @hidden
     */
    isSamsungBrowser(): boolean;
    /**
     * @hidden
     */
    isIPhoneOrIPad(): boolean;
    /**
     * @hidden
     */
    isIOSWithSafari(): boolean;
    /**
     * @hidden
     */
    isIonicIos(): boolean;
    /**
     * @hidden
     */
    isIonicAndroid(): boolean;
    /**
     * @hidden
     */
    isMobileDevice(): boolean;
    /**
     * @hidden
     */
    isReactNative(): boolean;
    /**
     * @hidden
     */
    isChromium(): boolean;
    /**
     * @hidden
     */
    canScreenShare(): boolean;
    /**
     * @hidden
     */
    getName(): string;
    /**
     * @hidden
     */
    getVersion(): string;
    /**
     * @hidden
     */
    getFamily(): string;
    /**
     * @hidden
     */
    getDescription(): string;
}
