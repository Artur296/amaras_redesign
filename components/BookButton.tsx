"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useLinks } from "@/components/SiteProvider";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";

// Button that lets the user pick where to be redirected: WhatsApp or Telegram.
export default function BookButton({
  label,
  message,
  variant = "primary",
}: {
  label: string;
  message?: string;
  variant?: "primary" | "light";
}) {
  const [open, setOpen] = useState(false);
  const links = useLinks();

  const whatsappHref = message
    ? `${links.whatsapp}?text=${encodeURIComponent(message)}`
    : links.whatsapp;

  const options = [
    { href: whatsappHref, label: "WhatsApp", icon: WhatsAppIcon, color: "text-[#25D366]" },
    { href: links.telegram, label: "Telegram", icon: TelegramIcon, color: "text-[#229ED9]" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`flex w-full items-center justify-center gap-2 rounded-full font-bold transition-colors ${
            variant === "primary"
              ? "bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
              : "bg-white/95 px-6 py-3 text-base text-deep hover:bg-white"
          }`}
        >
          {label}
        </button>

        <AnimatePresence>
          {open && (
            <>
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-lg"
              >
                {options.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-bg"
                  >
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                    {option.label}
                  </a>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
