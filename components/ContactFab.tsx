"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useLinks } from "@/components/SiteProvider";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";

// Floating contact button: expands into WhatsApp / Telegram links.
export default function ContactFab({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const links = useLinks();
  const pathname = usePathname() || "";

  // Tour detail pages have their own dedicated sticky booking CTA on mobile.
  // Hide the global FAB on mobile for these pages to prevent overlapping/clashing.
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "");
  const segments = cleanPath.split("/").filter(Boolean);
  const isTourDetail =
    (segments[1] === "tours" && segments.length >= 4) ||
    (segments[1] === "tour-packages" && segments.length >= 3);

  const options = [
    { href: links.whatsapp, label: "WhatsApp", icon: WhatsAppIcon, bg: "bg-[#25D366]" },
    { href: links.telegram, label: "Telegram", icon: TelegramIcon, bg: "bg-[#229ED9]" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 cursor-default bg-black/20"
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 ${
          isTourDetail ? "hidden lg:flex" : "flex"
        }`}
      >
        <AnimatePresence>
          {open &&
            options.map((option, i) => (
              <motion.a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.2, ease: "easeOut", delay: i * 0.05 },
                }}
                exit={{
                  opacity: 0,
                  y: 12,
                  scale: 0.9,
                  transition: { duration: 0.15, delay: (options.length - 1 - i) * 0.03 },
                }}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg ${option.bg}`}
              >
                <option.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {option.label}
              </motion.a>
            ))}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={label}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#586EFF] text-white shadow-[0_6px_24px_rgba(88,110,255,0.45)] transition-all hover:bg-[#475be6] hover:scale-105 active:scale-95"
        >
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C7FF32] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#C7FF32] border-2 border-[#312F2F]" />
          </span>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
            aria-hidden="true"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M21 12a8 8 0 0 1-8 8c-1.4 0-2.8-.4-4-1l-5 1 1.3-4.5A8 8 0 1 1 21 12Z" />
            )}
          </motion.svg>
        </motion.button>
      </div>
    </MotionConfig>
  );
}
