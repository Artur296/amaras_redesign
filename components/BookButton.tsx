"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useLinks } from "@/components/SiteProvider";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";

export default function BookButton({
  label,
  message,
  variant = "primary",
  size = "md",
  className = "",
}: {
  label: string;
  message?: string;
  variant?: "primary" | "accent" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const links = useLinks();

  const whatsappHref = message
    ? `${links.whatsapp}?text=${encodeURIComponent(message)}`
    : links.whatsapp;

  const options = [
    {
      href: whatsappHref,
      label: "WhatsApp",
      subtitle: "Instant response",
      icon: WhatsAppIcon,
      badgeColor: "bg-[#25D366]",
      textColor: "text-[#25D366]",
    },
    {
      href: links.telegram,
      label: "Telegram",
      subtitle: "Chat with manager",
      icon: TelegramIcon,
      badgeColor: "bg-[#229ED9]",
      textColor: "text-[#229ED9]",
    },
  ];

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
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
    <MotionConfig reducedMotion="user">
      <div className={`relative inline-flex items-center rounded-full ${className || "w-full"}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`flex w-full items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.98] ${sizeClasses} ${variantClasses}`}
        >
          <span>{label}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <>
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute bottom-full left-0 right-0 z-40 mb-2 min-w-[220px] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-2xl ring-1 ring-black/5"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Choose messenger
                </div>
                {options.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F7F7F0]"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${option.badgeColor} text-white`}>
                      <option.icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <span className="block text-sm font-bold text-[#312F2F]">
                        {option.label}
                      </span>
                      <span className="block text-[11px] text-muted">
                        {option.subtitle}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary">→</span>
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

