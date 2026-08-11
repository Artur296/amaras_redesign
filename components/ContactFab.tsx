"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useLinks } from "@/components/SiteProvider";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";

// Floating contact button: expands into WhatsApp / Telegram links.
export default function ContactFab({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const links = useLinks();

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

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
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
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${option.bg}`}
              >
                <option.icon className="h-5 w-5" />
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
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_16px_rgba(0,0,0,.3)] transition-colors hover:bg-primary-dark"
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
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
