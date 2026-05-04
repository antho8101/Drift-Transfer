export const DATA_CHANNEL_NAME = "file-transfer";

const DEFAULT_STUN_URLS = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:global.stun.twilio.com:3478"
];

export type PeerHandlers = {
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onDataChannel?: (channel: RTCDataChannel) => void;
};

function parseIceUrls(value?: string) {
  return value
    ?.split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function createPeerConnection(handlers: PeerHandlers) {
  const stunUrls =
    parseIceUrls(process.env.NEXT_PUBLIC_STUN_URLS) ??
    parseIceUrls(process.env.NEXT_PUBLIC_STUN_URL) ??
    DEFAULT_STUN_URLS;
  const iceServers: RTCIceServer[] = [
    { urls: stunUrls }
  ];
  const turnUrls = parseIceUrls(process.env.NEXT_PUBLIC_TURN_URL);

  if (turnUrls?.length) {
    iceServers.push({
      urls: turnUrls,
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL
    });
  }

  const peer = new RTCPeerConnection({
    iceCandidatePoolSize: 8,
    iceServers
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      handlers.onIceCandidate(event.candidate.toJSON());
    }
  };

  peer.onconnectionstatechange = () => {
    handlers.onConnectionStateChange(peer.connectionState);
  };

  peer.ondatachannel = (event) => {
    handlers.onDataChannel?.(event.channel);
  };

  return peer;
}

export async function createOffer(peer: RTCPeerConnection) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(
  peer: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
) {
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
}

export async function acceptAnswer(
  peer: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) {
  if (peer.signalingState !== "stable") {
    await peer.setRemoteDescription(answer);
  }
}

export async function addIceCandidate(
  peer: RTCPeerConnection,
  candidate: RTCIceCandidateInit
) {
  await peer.addIceCandidate(candidate);
}
