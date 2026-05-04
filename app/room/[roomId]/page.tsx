import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RoomClient } from "@/components/RoomClient";
import { isValidRoomId } from "@/lib/utils";

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

  if (!isValidRoomId(roomId)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <RoomClient roomId={roomId} />
    </Suspense>
  );
}
