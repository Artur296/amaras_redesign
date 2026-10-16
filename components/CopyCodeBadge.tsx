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
      <span className="text-[10px] text-white/60 group-hover/code:text-[#C7FF32]">
        {copied ? (locale === "ru" ? "✓ скопирован" : "✓ copied") : "📋"}
      </span>
    </button>
  );
}
