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
    { href: `/${locale}/tour-packages`, label: dict.nav.packages },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep text-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        {/* min-w-0 + truncate: the wordmark is the one part allowed to give way,
            so the row can never push the document wider than the viewport. */}
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-2 text-base font-extrabold tracking-tight sm:gap-2.5 sm:text-lg"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
          />
          {/* Under 360px the row can't hold the wordmark too; show the logo mark
              alone rather than an ellipsised brand name. */}
          <span className="hidden truncate min-[360px]:block">
            Amaras<span className="text-accent"> Tour</span>
          </span>
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden text-white/85 transition-colors hover:text-accent min-[380px]:block"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          <div className="flex items-center rounded-full border border-white/20 p-0.5" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${restPath}`}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors sm:px-2.5 ${
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
              <div className="flex gap-2 border-t border-white/10 px-4 py-4 sm:gap-3 sm:px-6">
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white sm:px-4"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>
                <a
                  href={links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#229ED9] px-3 py-2.5 text-sm font-bold text-white sm:px-4"
                >
                  <TelegramIcon className="h-5 w-5 shrink-0" />
                  <span className="truncate">Telegram</span>
                </a>
                {/* The header icon is hidden under 380px, so keep Instagram reachable here. */}
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white min-[380px]:hidden"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </MotionConfig>
    </header>
  );
}
