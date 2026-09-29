"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { locales, type Dict, type Locale } from "@/lib/i18n";
import { useLinks, useSite } from "@/components/SiteProvider";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";

const localeLabels: Record<Locale, string> = { ru: "RU", hy: "HY", en: "EN" };

export default function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = useLinks();
  const { logo } = useSite();

  const restPath = pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, "");
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/tours`, label: dict.nav.tours },
    { href: `/${locale}/tour-packages`, label: dict.nav.packages },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#454343] bg-[#312F2F]/95 backdrop-blur-md text-[#FCFCF7]">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand identity - Official AMARAS Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center transition-transform hover:scale-[1.03]"
          aria-label="AMARAS Home"
        >
          <div className="relative h-10 flex items-center">
            <Image
              src="/images/amaras-logo.svg"
              alt="AMARAS Tour"
              width={260}
              height={36}
              priority
              className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-all duration-300 group-hover:brightness-110"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm lg:flex" aria-label="Main">
          {nav.map((item) => {
            const isActive =
              item.href === `/${locale}`
                ? pathname === `/${locale}`
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#C7FF32] font-bold text-[#312F2F] shadow-sm"
                    : "text-[#FCFCF7]/85 hover:text-[#C7FF32] hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Social icons */}
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:border-[#C7FF32] hover:text-[#C7FF32] sm:flex"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>

          {/* Language Switcher */}
          <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${restPath}`}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                  l === locale
                    ? "bg-[#586EFF] text-white shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          {/* Quick Booking CTA */}
          <Link
            href={`/${locale}/tours`}
            className="hidden rounded-full bg-[#586EFF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#475be6] hover:shadow-lg sm:inline-flex"
          >
            {dict.hero.ctaTours}
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:border-[#C7FF32] lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
              {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-[#454343] bg-[#242323] lg:hidden"
              aria-label="Mobile"
            >
              <ul className="flex flex-col gap-1.5 px-6 py-5">
                {nav.map((item) => {
                  const isActive =
                    item.href === `/${locale}`
                      ? pathname === `/${locale}`
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-bold transition-colors ${
                          isActive
                            ? "bg-[#C7FF32] text-[#312F2F]"
                            : "text-[#FCFCF7]/90 hover:bg-white/5 hover:text-[#C7FF32]"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="text-xs">●</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 bg-[#312F2F] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                  {dict.hero.ctaWrite}
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={links.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-bold text-white shadow"
                  >
                    <TelegramIcon className="h-4 w-4" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </MotionConfig>
    </header>
  );
}
