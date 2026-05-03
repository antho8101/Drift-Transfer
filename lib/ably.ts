import Ably from "ably";

export function createAblyClient(clientId: string) {
  const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;

  if (!key) {
    throw new Error("NEXT_PUBLIC_ABLY_API_KEY is missing.");
  }

  return new Ably.Realtime({
    key,
    clientId,
    closeOnUnload: true
  });
}

export type DriftSignal =
  | { type: "peer-ready"; from: string }
  | { type: "offer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "answer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "ice-candidate"; from: string; candidate: RTCIceCandidateInit };
