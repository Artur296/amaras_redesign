"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const links = useLinks();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, mounted]);

  const whatsappHref = message
    ? `${links.whatsapp}?text=${encodeURIComponent(message)}`
    : links.whatsapp;

  const options = [
    {
      href: whatsappHref,
      label: "WhatsApp",
      subtitle: "Быстрый ответ • Онлайн",
      icon: WhatsAppIcon,
      badgeColor: "bg-[#25D366]",
      hoverBorder: "hover:border-[#25D366] hover:bg-[#25D366]/5",
    },
    {
      href: links.telegram,
      label: "Telegram",
      subtitle: "Чат с менеджером туров",
      icon: TelegramIcon,
      badgeColor: "bg-[#229ED9]",
      hoverBorder: "hover:border-[#229ED9] hover:bg-[#229ED9]/5",
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
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`flex w-full items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.98] ${sizeClasses} ${variantClasses}`}
        >
          <span>{label}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 opacity-80"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {mounted &&
          createPortal(
            <AnimatePresence>
              {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                  {/* Backdrop overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
                  />

                  {/* Modal Dialog */}
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-[380px] overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-2xl"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                          Бронирование и консультация
                        </span>
                        <h3 className="mt-0.5 text-xl font-black text-[#312F2F]">
                          Выберите мессенджер
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Закрыть"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#312F2F] transition-colors hover:bg-black/10 hover:text-black"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-[#6B6967] leading-relaxed">
                      Напишите нам — менеджер ответит в течение 5 минут, согласует дату и забронирует тур.
                    </p>

                    {/* Messenger Cards */}
                    <div className="mt-5 space-y-2.5">
                      {options.map((option) => (
                        <a
                          key={option.label}
                          href={option.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          className={`group flex items-center gap-3.5 rounded-2xl border border-black/10 bg-[#FCFCF7] p-3.5 transition-all duration-200 ${option.hoverBorder} hover:shadow-md active:scale-[0.99]`}
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${option.badgeColor} text-white shadow-md transition-transform group-hover:scale-105`}
                          >
                            <option.icon className="h-6 w-6" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="block text-base font-bold text-[#312F2F]">
                              {option.label}
                            </span>
                            <span className="block text-xs text-muted">
                              {option.subtitle}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-[#312F2F]/40 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                            →
                          </span>
                        </a>
                      ))}
                    </div>

                    {/* Footer badge */}
                    <div className="mt-5 pt-3.5 border-t border-black/5 text-center">
                      <span className="text-[11px] font-semibold text-muted">
                        ⚡ Без комиссии • Быстрый ответ 24/7
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </MotionConfig>
  );
}

