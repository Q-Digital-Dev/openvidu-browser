import { TypeOfVideo } from '../Enums/TypeOfVideo';
import { ExceptionEventName } from '../Events/ExceptionEvent';
export interface WebRtcPeerConfiguration {
    mediaConstraints: {
        audio: boolean;
        video: boolean;
    };
    simulcast: boolean;
    mediaServer: string;
    onIceCandidate: (event: RTCIceCandidate) => void;
    onIceConnectionStateException: (exceptionName: ExceptionEventName, message: string, data?: any) => void;
    iceServers?: RTCIceServer[];
    mediaStream?: MediaStream | null;
    mode?: 'sendonly' | 'recvonly' | 'sendrecv';
    id?: string;
    typeOfVideo: TypeOfVideo | undefined;
}
export declare class WebRtcPeer {
    pc: RTCPeerConnection;
    remoteCandidatesQueue: RTCIceCandidate[];
    localCandidatesQueue: RTCIceCandidate[];
    protected configuration: Required<WebRtcPeerConfiguration>;
    private iceCandidateList;
    private candidategatheringdone;
    constructor(configuration: WebRtcPeerConfiguration);
    getId(): string;
    /**
     * This method frees the resources used by WebRtcPeer
     */
    dispose(): void;
    private createOfferLegacy;
    /**
     * Creates an SDP offer from the local RTCPeerConnection to send to the other peer.
     * Only if the negotiation was initiated by this peer.
     */
    createOffer(): Promise<RTCSessionDescriptionInit>;
    deprecatedPeerConnectionTrackApi(): void;
    /**
     * Creates an SDP answer from the local RTCPeerConnection to send to the other peer
     * Only if the negotiation was initiated by the other peer
     */
    createAnswer(): Promise<RTCSessionDescriptionInit>;
    /**
     * This peer initiated negotiation. Step 1/4 of SDP offer-answer protocol
     */
    processLocalOffer(offer: RTCSessionDescriptionInit): Promise<void>;
    /**
     * Other peer initiated negotiation. Step 2/4 of SDP offer-answer protocol
     */
    processRemoteOffer(sdpOffer: string): Promise<void>;
    /**
     * Other peer initiated negotiation. Step 3/4 of SDP offer-answer protocol
     */
    processLocalAnswer(answer: RTCSessionDescriptionInit): Promise<void>;
    /**
     * This peer initiated negotiation. Step 4/4 of SDP offer-answer protocol
     */
    processRemoteAnswer(sdpAnswer: string): Promise<void>;
    /**
     * @hidden
     */
    setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void>;
    /**
     * Callback function invoked when an ICE candidate is received
     */
    addIceCandidate(iceCandidate: RTCIceCandidate): Promise<void>;
    addIceConnectionStateChangeListener(otherId: string): void;
    /**
     * @hidden
     */
    generateUniqueId(): string;
}
export declare class WebRtcPeerRecvonly extends WebRtcPeer {
    constructor(configuration: WebRtcPeerConfiguration);
}
export declare class WebRtcPeerSendonly extends WebRtcPeer {
    constructor(configuration: WebRtcPeerConfiguration);
}
export declare class WebRtcPeerSendrecv extends WebRtcPeer {
    constructor(configuration: WebRtcPeerConfiguration);
}
