"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { locales, type Dict, type Locale } from "@/lib/i18n";
import { useLinks } from "@/components/SiteProvider";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";

const localeLabels: Record<Locale, string> = { ru: "Рус", hy: "Հայ", en: "Eng" };

export default function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = useLinks();

  const restPath = pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, "");
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/tours`, label: dict.nav.tours },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep text-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <Image
            src="/images/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full"
          />
          Amaras<span className="text-accent"> Tour</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors hover:text-accent ${
                pathname === item.href ? "text-accent" : "text-white/85"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/85 transition-colors hover:text-accent"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          <div className="flex items-center rounded-full border border-white/20 p-0.5" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${restPath}`}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  l === locale
                    ? "bg-accent text-deep"
                    : "text-white/70 hover:text-accent"
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-white/10 bg-deep md:hidden"
              aria-label="Mobile"
            >
              <ul className="flex flex-col gap-3 px-6 py-4">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-1 text-base font-semibold ${
                        pathname === item.href ? "text-accent" : "text-white/90"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 border-t border-white/10 px-6 py-4">
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp
                </a>
                <a
                  href={links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#229ED9] px-4 py-2.5 text-sm font-bold text-white"
                >
                  <TelegramIcon className="h-5 w-5" />
                  Telegram
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </MotionConfig>
    </header>
  );
}
