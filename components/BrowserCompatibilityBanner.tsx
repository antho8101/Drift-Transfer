"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "@/components/LanguageProvider";

const CHROME_DOWNLOAD_URL = "https://www.google.com/chrome/";

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    brands?: Array<{ brand: string; version: string }>;
  };
};

function isOperaLikeBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  const brands = (navigator as NavigatorWithUserAgentData).userAgentData?.brands ?? [];
  const hasOperaBrand = brands.some(({ brand }) =>
    brand.toLowerCase().includes("opera")
  );

  return (
    hasOperaBrand ||
    userAgent.includes("opr/") ||
    userAgent.includes("opera") ||
    userAgent.includes("oprgx")
  );
}

export function BrowserCompatibilityBanner() {
  const t = useTranslations();
  const shouldShow = useSyncExternalStore(
    () => () => undefined,
    isOperaLikeBrowser,
    () => false
  );

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="reveal-now rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50 backdrop-blur-2xl">
      <span>{t.common.operaGxWarningBeforeChrome}</span>{" "}
      <a
        className="font-semibold text-white underline decoration-amber-200/60 underline-offset-4 transition hover:text-amber-100"
        href={CHROME_DOWNLOAD_URL}
        rel="noreferrer"
        target="_blank"
      >
        {t.common.chrome}
      </a>{" "}
      <span>{t.common.operaGxWarningAfterChrome}</span>
    </div>
  );
}
