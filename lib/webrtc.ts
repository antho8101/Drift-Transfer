export const DATA_CHANNEL_NAME = "file-transfer";

export type PeerHandlers = {
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onDataChannel?: (channel: RTCDataChannel) => void;
};

export function createPeerConnection(handlers: PeerHandlers) {
  const iceServers: RTCIceServer[] = [
    { urls: process.env.NEXT_PUBLIC_STUN_URL || "stun:stun.l.google.com:19302" }
  ];
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;

  if (turnUrl) {
    iceServers.push({
      urls: turnUrl,
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL
    });
  }

  const peer = new RTCPeerConnection({
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
