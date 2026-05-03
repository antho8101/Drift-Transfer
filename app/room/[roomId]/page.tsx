import type { Metadata } from "next";
import { RoomClient } from "@/components/RoomClient";

export const metadata: Metadata = {
  title: "Private Transfer Room",
  description:
    "A temporary Drift Transfer room for browser-to-browser file transfer.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return <RoomClient roomId={roomId} />;
}
