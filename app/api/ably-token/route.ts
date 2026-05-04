import Ably from "ably";
import { NextResponse } from "next/server";
import { isValidRoomId } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId") ?? "";
  const clientId = searchParams.get("clientId") ?? "";
  const apiKey = process.env.ABLY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ABLY_API_KEY is missing on the server." },
      { status: 500 }
    );
  }

  if (!isValidRoomId(roomId) || !clientId) {
    return NextResponse.json({ error: "Invalid room request." }, { status: 400 });
  }

  const ably = new Ably.Rest(apiKey);
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId,
    ttl: 24 * 60 * 60 * 1000,
    capability: {
      [`room:${roomId}`]: ["publish", "subscribe", "presence"]
    }
  });

  return NextResponse.json(tokenRequest);
}
