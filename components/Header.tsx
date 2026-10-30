"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { locales, type Dict, type Locale } from "@/lib/i18n";
import { useLinks, useSite } from "@/components/SiteProvider";
import { SearchIcon, InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";
import SearchModal from "@/components/SearchModal";
import type { Tour } from "@/lib/tours";
import type { Attraction } from "@/lib/attractions";

const localeLabels: Record<Locale, string> = { ru: "RU", hy: "HY", en: "EN" };

export default function Header({
  locale,
  dict,
  tours = [],
  attractions = [],
}: {
  locale: Locale;
  dict: Dict;
  tours?: Tour[];
  attractions?: Attraction[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isToursDropdownOpen, setIsToursDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const links = useLinks();
  const { logo } = useSite();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Global shortcut: Cmd+K / Ctrl+K / / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA")
      ) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsToursDropdownOpen(false);
  }, [pathname]);

  const handleToursMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setIsToursDropdownOpen(true);
  };

  const handleToursMouseLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setIsToursDropdownOpen(false);
    }, 180);
  };

  const restPath = pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, "");

  const isToursActive =
    pathname === `/${locale}/tours` ||
    pathname.startsWith(`/${locale}/tours/`) ||
    pathname === `/${locale}/tour-packages` ||
    pathname.startsWith(`/${locale}/tour-packages/`);

  const tourDropdownItems = [
    {
      href: `/${locale}/tours`,
      label: locale === "ru" ? "Все экскурсии" : locale === "hy" ? "Բոլոր տուրերը" : "All Tours",
      desc: locale === "ru" ? "Регулярные групповые туры" : locale === "hy" ? "Խմբային էքսկուրսիաներ" : "Regular group excursions",
      badge: null,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      href: `/${locale}/tours/individual`,
      label: locale === "ru" ? "Индивидуальные туры" : locale === "hy" ? "Անհատական տուրեր" : "Private Tours",
      desc: locale === "ru" ? "Конструктор и свой маршрут" : locale === "hy" ? "Անհատական երթուղի" : "Custom route & private car",
      badge: null,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      href: `/${locale}/tours/offers`,
      label: locale === "ru" ? "Спецпредложения" : locale === "hy" ? "Հատուկ առաջարկներ" : "Special Offers",
      desc: locale === "ru" ? "Горящие туры и выгодные цены" : locale === "hy" ? "Զեղչեր և ակցիաներ" : "Deals and discounts",
      badge: locale === "ru" ? "−15%" : locale === "hy" ? "Զեղչ" : "SALE",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
    {
      href: `/${locale}/tour-packages`,
      label: dict.nav.packages,
      desc: locale === "ru" ? "Многодневные путешествия" : locale === "hy" ? "Բազմօրյա ծրագրեր" : "Multi-day packaged trips",
      badge: null,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
  ];

  const desktopOtherNav = [
    { href: `/${locale}/what-to-see`, label: locale === "ru" ? "Что посмотреть" : locale === "hy" ? "Ինչ տեսնել" : "What to See" },
    { href: `/${locale}/fleet`, label: locale === "ru" ? "Автопарк" : locale === "hy" ? "Ավտոպարկ" : "Fleet" },
    { href: `/${locale}/guests`, label: dict.nav.guests },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  const mobileNav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/tours`, label: dict.nav.tours },
    { href: `/${locale}/tours/individual`, label: locale === "ru" ? "Индивидуальные туры" : locale === "hy" ? "Անհատական տուրեր" : "Private Tours" },
    { href: `/${locale}/tours/offers`, label: locale === "ru" ? "Спецпредложения" : locale === "hy" ? "Հատուկ առաջարկներ" : "Special Offers", badge: "SALE" },
    { href: `/${locale}/tour-packages`, label: dict.nav.packages },
    { href: `/${locale}/what-to-see`, label: locale === "ru" ? "Что посмотреть" : locale === "hy" ? "Ինչ տեսնել" : "What to See" },
    { href: `/${locale}/fleet`, label: locale === "ru" ? "Автопарк" : locale === "hy" ? "Ավտոպարկ" : "Fleet" },
    { href: `/${locale}/guests`, label: dict.nav.guests },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  const isItemActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`z-50 transition-all duration-300 text-[#FCFCF7] ${
        isHome
          ? `fixed top-0 inset-x-0 ${
              scrolled
                ? "bg-[#312F2F]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
                : "bg-transparent border-b border-transparent"
            }`
          : "sticky top-0 bg-[#312F2F]/95 backdrop-blur-md border-b border-[#454343]"
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1360px] items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand identity - Official AMARAS Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center shrink-0 transition-transform hover:scale-[1.03] z-20"
          aria-label="AMARAS Home"
        >
          <div className="relative h-7 sm:h-10 flex items-center">
            <Image
              src="/images/amaras-logo.svg"
              alt="AMARAS Tour"
              width={260}
              height={44}
              priority
              className="h-5.5 sm:h-8 md:h-10 max-w-[120px] sm:max-w-[180px] md:max-w-none w-auto object-contain transition-all duration-300 group-hover:brightness-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            />
          </div>
        </Link>

        {/* Desktop Navigation - 7 balanced items, never overflows or overlaps on laptops */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 rounded-full border border-white/20 bg-black/35 px-2 xl:px-3 py-1 xl:py-1.5 backdrop-blur-md shadow-lg shrink-0 z-20"
          aria-label="Main"
        >
          {/* 1. Главная */}
          <Link
            href={`/${locale}`}
            className={`relative rounded-full px-2.5 xl:px-3.5 py-1 xl:py-1.5 text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              pathname === `/${locale}`
                ? "bg-[#C7FF32] font-bold text-[#312F2F] shadow-sm"
                : "text-[#FCFCF7]/90 hover:text-[#C7FF32] hover:bg-white/10"
            }`}
          >
            {dict.nav.home}
          </Link>

          {/* 2. Туры ▾ with Rich Hover/Click Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleToursMouseEnter}
            onMouseLeave={handleToursMouseLeave}
          >
            <Link
              href={`/${locale}/tours`}
              onClick={() => setIsToursDropdownOpen(false)}
              className={`group flex items-center gap-1 rounded-full px-2.5 xl:px-3.5 py-1 xl:py-1.5 text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isToursActive
                  ? "bg-[#C7FF32] font-bold text-[#312F2F] shadow-sm"
                  : "text-[#FCFCF7]/90 hover:text-[#C7FF32] hover:bg-white/10"
              }`}
            >
              <span>{dict.nav.tours}</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isToursDropdownOpen ? "rotate-180" : ""
                } ${isToursActive ? "text-[#312F2F]" : "text-white/60 group-hover:text-[#C7FF32]"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isToursDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-72"
                >
                  <div className="rounded-2xl border border-white/20 bg-[#242323]/95 backdrop-blur-xl p-2 shadow-2xl overflow-hidden ring-1 ring-black/40">
                    <div className="flex flex-col gap-1">
                      {tourDropdownItems.map((sub) => {
                        const isSubActive =
                          sub.href === `/${locale}/tours`
                            ? pathname === `/${locale}/tours`
                            : pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsToursDropdownOpen(false)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-150 ${
                              isSubActive
                                ? "bg-white/15 text-[#C7FF32]"
                                : "text-white/90 hover:bg-white/10 hover:text-[#C7FF32]"
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                isSubActive
                                  ? "bg-[#C7FF32] text-[#312F2F]"
                                  : "bg-white/10 text-white/80 group-hover:bg-[#C7FF32] group-hover:text-[#312F2F]"
                              }`}
                            >
                              {sub.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold leading-tight truncate">
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span className="rounded-full bg-[#C7FF32] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#312F2F]">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-white/50 leading-tight mt-0.5 truncate">
                                {sub.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3–7: What to see, Fleet, Guests, About, Contacts */}
          {desktopOtherNav.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-2.5 xl:px-3.5 py-1 xl:py-1.5 text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#C7FF32] font-bold text-[#312F2F] shadow-sm"
                    : "text-[#FCFCF7]/90 hover:text-[#C7FF32] hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search + Language Switcher + Mobile Menu Button */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 z-20">
          {/* Search Button (Лупа) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label={
              locale === "ru"
                ? "Поиск туров и мест (⌘K / Ctrl+K)"
                : locale === "hy"
                ? "Որոնել տուրեր (⌘K)"
                : "Search tours and sights (⌘K)"
            }
            title={
              locale === "ru"
                ? "Поиск по турам (⌘K / Ctrl+K)"
                : locale === "hy"
                ? "Որոնել տուրեր (⌘K)"
                : "Search tours (⌘K)"
            }
            className="group relative flex h-7.5 w-7.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/90 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[#C7FF32] hover:bg-white/10 hover:text-[#C7FF32] active:scale-95 cursor-pointer"
          >
            <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:scale-110" />
          </button>

          {/* Language Switcher */}
          <div
            className="flex shrink-0 items-center rounded-full border border-white/20 bg-black/35 p-0.5 backdrop-blur-md shadow-lg"
            role="group"
            aria-label="Language"
          >
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${restPath}`}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold transition-all text-center min-w-[26px] sm:min-w-[32px] ${
                  l === locale
                    ? "bg-[#586EFF] text-white shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger button (3 полоски) */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Меню"
            className="flex h-7.5 w-7.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all hover:border-[#C7FF32] hover:bg-white/20 active:scale-95 lg:hidden cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
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
              className="overflow-hidden border-t border-[#454343] bg-[#242323] lg:hidden shadow-2xl"
              aria-label="Mobile"
            >
              {/* Quick Search inside Drawer */}
              <div className="px-5 sm:px-6 pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:border-[#C7FF32] hover:text-white transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <SearchIcon className="h-4 w-4 text-[#C7FF32]" />
                    <span>
                      {locale === "ru"
                        ? "Поиск: Гарни, Севан, Татев..."
                        : locale === "hy"
                        ? "Որոնում․ Գառնի, Սևան..."
                        : "Search: Garni, Sevan..."}
                    </span>
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/80">
                    ⌘K
                  </span>
                </button>
              </div>

              {/* Mobile Drawer Language Switcher */}
              <div className="px-5 sm:px-6 py-2">
                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={`/${l}${restPath}`}
                      onClick={() => setOpen(false)}
                      aria-current={l === locale ? "true" : undefined}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        l === locale
                          ? "bg-[#586EFF] text-white shadow-md"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 uppercase">{l}</span>
                      <span>{localeLabels[l]}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <ul className="flex flex-col gap-1.5 px-6 py-4">
                {mobileNav.map((item) => {
                  const isActive = isItemActive(item.href);
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
                        <span className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {"badge" in item && item.badge && (
                            <span className="rounded-full bg-[#C7FF32] px-2 py-0.5 text-[10px] font-black uppercase text-[#312F2F]">
                              {item.badge}
                            </span>
                          )}
                        </span>
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
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 py-2.5 text-xs font-bold text-white shadow transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={links.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#229ED9] px-2 py-2.5 text-xs font-bold text-white shadow transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <TelegramIcon className="h-4 w-4 shrink-0" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-2 py-2.5 text-xs font-bold text-white shadow transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <InstagramIcon className="h-4 w-4 shrink-0" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </MotionConfig>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
        tours={tours}
        attractions={attractions}
      />
    </header>
  );
}

