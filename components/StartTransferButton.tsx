"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRoomId } from "@/lib/utils";

export function StartTransferButton() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  function handleStart() {
    setIsStarting(true);
    router.push(`/room/${createRoomId()}`);
  }

  return (
    <button
      className="group relative overflow-hidden rounded-full bg-white px-7 py-4 text-sm font-semibold text-ink shadow-2xl shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-sky-500/30 disabled:cursor-wait disabled:opacity-70"
      disabled={isStarting}
      onClick={handleStart}
      type="button"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-driftBlue/25 to-transparent transition duration-700 group-hover:translate-x-full" />
      <span className="relative">
        {isStarting ? "Opening room..." : "Start transfer"}
      </span>
    </button>
  );
}
