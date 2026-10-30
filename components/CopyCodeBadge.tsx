"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function CopyCodeBadge({
  code,
  locale,
}: {
  code: string;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={copyCode}
      title={locale === "ru" ? "Нажмите, чтобы скопировать код тура" : "Click to copy tour code"}
      className="group/code flex items-center gap-1.5 rounded-full bg-[#312F2F] px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-white shadow-xs border border-white/10 hover:border-[#C7FF32] transition-colors cursor-pointer"
    >
      <span className="text-[#C7FF32] text-[10px] uppercase font-bold tracking-wider">
        {locale === "ru" ? "Код тура" : locale === "hy" ? "Տուրի կոդ" : "Tour Code"}:
      </span>
      <span className="font-mono font-black text-white text-xs sm:text-sm">#{code}</span>
      <span className="text-[10px] text-white/60 group-hover/code:text-[#C7FF32] flex items-center">
        {copied ? (
          <span className="text-[#C7FF32] font-medium">{locale === "ru" ? "скопирован" : "copied"}</span>
        ) : (
          <svg className="w-3.5 h-3.5 text-white/70 group-hover/code:text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        )}
      </span>
    </button>
  );
}
