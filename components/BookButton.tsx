"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingModal from "@/components/BookingModal";
import type { Locale } from "@/lib/i18n";

export default function BookButton({
  label,
  message,
  tourTitle,
  variant = "primary",
  size = "md",
  className = "",
}: {
  label: string;
  message?: string;
  tourTitle?: string;
  variant?: "primary" | "accent" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const rawLocale = params?.locale;
  const locale = (typeof rawLocale === "string" && ["ru", "hy", "en"].includes(rawLocale)
    ? rawLocale
    : "ru") as Locale;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract a sensible default tour title if not explicitly passed
  const derivedTitle =
    tourTitle ||
    (message && message.includes("«") && message.includes("»")
      ? message.slice(message.indexOf("«") + 1, message.lastIndexOf("»"))
      : message && message.includes('"')
      ? message.slice(message.indexOf('"') + 1, message.lastIndexOf('"'))
      : message || (locale === "ru" ? "Индивидуальный тур" : locale === "hy" ? "Անհատական տուր" : "Tour Booking"));

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs sm:text-sm",
    md: "px-5 py-2.5 text-sm sm:text-base",
    lg: "px-7 py-3.5 text-base sm:text-lg",
  }[size];

  const variantClasses = {
    primary:
      "bg-[#586EFF] text-white hover:bg-[#475be6] shadow-[0_2px_10px_rgba(88,110,255,0.3)] hover:shadow-[0_4px_16px_rgba(88,110,255,0.45)]",
    accent:
      "bg-[#C7FF32] text-[#312F2F] hover:bg-[#b8f226] font-black shadow-[0_2px_10px_rgba(199,255,50,0.25)] hover:shadow-[0_4px_16px_rgba(199,255,50,0.4)]",
    light:
      "bg-[#FCFCF7] text-[#312F2F] hover:bg-white shadow-md hover:shadow-lg",
    dark:
      "bg-[#312F2F] text-white border border-[#454343] hover:bg-[#242323] hover:border-[#C7FF32]",
  }[variant];

  return (
    <>
      <div className={`relative inline-flex items-center rounded-full ${className || "w-full"}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`flex w-full items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer ${sizeClasses} ${variantClasses}`}
        >
          <span>{label}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {mounted && (
        <BookingModal
          isOpen={open}
          onClose={() => setOpen(false)}
          locale={locale}
          tourTitle={derivedTitle}
        />
      )}
    </>
  );
}
