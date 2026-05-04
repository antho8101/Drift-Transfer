"use client";

/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";
import { useEffect, useState } from "react";

type InviteQrCodeProps = {
  value: string;
};

export function InviteQrCode({ value }: InviteQrCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (!value) {
      return;
    }

    let cancelled = false;

    void QRCode.toDataURL(value, {
      margin: 1,
      width: 220,
      color: {
        dark: "#05060a",
        light: "#ffffff"
      }
    }).then((url) => {
      if (!cancelled) {
        setQrCodeUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!qrCodeUrl) {
    return null;
  }

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-mist">
        📱 Scan invite
      </p>
      <div className="mx-auto w-fit rounded-2xl bg-white p-3">
        <img
          alt="QR code for the invite link"
          className="h-36 w-36"
          src={qrCodeUrl}
        />
      </div>
    </div>
  );
}
