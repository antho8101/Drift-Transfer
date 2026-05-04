"use client";

import { languages } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      aria-label="Language selector"
      className="inline-flex rounded-full border border-white/10 bg-black/45 p-1 text-[11px] font-semibold text-mist shadow-2xl shadow-black/30 backdrop-blur-2xl"
    >
      {languages.map((option) => (
        <button
          className={`rounded-full px-2.5 py-1 transition ${
            language === option.code
              ? "bg-white/90 text-ink"
              : "hover:bg-white/10 hover:text-white"
          }`}
          key={option.code}
          onClick={() => setLanguage(option.code)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
