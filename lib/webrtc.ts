export const DATA_CHANNEL_NAME = "file-transfer";

export type PeerHandlers = {
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onDataChannel?: (channel: RTCDataChannel) => void;
};

export function createPeerConnection(handlers: PeerHandlers) {
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
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
