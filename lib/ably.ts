import Ably from "ably";

export function createAblyClient(clientId: string, roomId: string) {
  const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;

  if (key) {
    return new Ably.Realtime({
      key,
      clientId,
      closeOnUnload: true
    });
  }

  return new Ably.Realtime({
    clientId,
    authUrl: `/api/ably-token?roomId=${encodeURIComponent(roomId)}&clientId=${encodeURIComponent(clientId)}`,
    closeOnUnload: true
  });
}

export type DriftSignal =
  | { type: "peer-ready"; from: string }
  | { type: "offer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "answer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "ice-candidate"; from: string; candidate: RTCIceCandidateInit }
  | { type: "intent-role"; from: string; role: "send" | "receive" };
