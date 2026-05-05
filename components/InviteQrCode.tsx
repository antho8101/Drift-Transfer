"use client";

/* eslint-disable @next/next/no-img-element */
import { RiQrCodeLine } from "@remixicon/react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useTranslations } from "@/components/LanguageProvider";

type InviteQrCodeProps = {
  className?: string;
  value: string;
};

export function InviteQrCode({ className = "", value }: InviteQrCodeProps) {
  const t = useTranslations();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!value || !isOpen) {
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
  }, [isOpen, value]);

  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.035] p-4 ${className}`}>
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-left"
        disabled={!value}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-mist">
            <RiQrCodeLine aria-hidden className="h-[22px] w-[22px]" />
            <span>{t.qr.title}</span>
          </span>
          <span className="mt-1 block text-sm text-white">
            {t.qr.description}
          </span>
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-mist transition group-hover:text-white">
          {isOpen ? t.qr.hide : t.qr.show}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-4">
          {qrCodeUrl ? (
            <div className="mx-auto w-fit rounded-2xl bg-white p-3">
              <img
                alt={t.qr.alt}
                className="h-36 w-36"
                src={qrCodeUrl}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-mist">
              {t.qr.loading}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
