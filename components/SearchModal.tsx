"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { type Tour, isPackageTour, tourHref, formatPrice } from "@/lib/tours";
import { type Attraction } from "@/lib/attractions";
import { SearchIcon, WhatsAppIcon } from "@/components/icons";
import { useLinks } from "@/components/SiteProvider";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  tours: Tour[];
  attractions: Attraction[];
}

const quickSuggestions: Record<Locale, string[]> = {
  ru: ["Гарни", "Севан", "Хор Вирап", "Татев", "Дилижан", "Джип-туры", "Турпакеты", "Лаваш"],
  hy: ["Գառնի", "Սևան", "Խոր Վիրապ", "Տաթև", "Դիլիջան", "Ջիպ", "Տուր փաթեթներ"],
  en: ["Garni", "Sevan", "Khor Virap", "Tatev", "Dilijan", "Jeep Tours", "Packages"],
};

export default function SearchModal({
  isOpen,
  onClose,
  locale,
  tours,
  attractions,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "tours" | "packages" | "attractions">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const links = useLinks();

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveTab("all");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Multilingual, fuzzy-friendly tokenized search
  const { matchedDayTours, matchedPackages, matchedAttractions } = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      return { matchedDayTours: [], matchedPackages: [], matchedAttractions: [] };
    }

    const tokens = raw.split(/\s+/).filter(Boolean);

    const matchesText = (text: string | undefined | null) => {
      if (!text) return false;
      const t = text.toLowerCase();
      return tokens.every((token) => t.includes(token));
    };

    const matchesTour = (tour: Tour) => {
      // Check titles across all locales for cross-language search
      if (
        matchesText(tour.title[locale]) ||
        matchesText(tour.title.ru) ||
        matchesText(tour.title.en) ||
        matchesText(tour.title.hy)
      ) {
        return true;
      }
      // Check descriptions
      if (
        matchesText(tour.description[locale]) ||
        matchesText(tour.description.ru) ||
        matchesText(tour.description.en) ||
        matchesText(tour.description.hy)
      ) {
        return true;
      }
      // Check destinations/stops
      const allStops = [
        ...(tour.destinations[locale] || []),
        ...(tour.destinations.ru || []),
        ...(tour.destinations.en || []),
        ...(tour.destinations.hy || []),
      ].join(" ");
      if (matchesText(allStops)) return true;

      // Check about narrative
      if (matchesText(tour.about[locale]) || matchesText(tour.about.ru)) return true;

      // Check itinerary for packages
      if (tour.itinerary) {
        const itinText = tour.itinerary
          .map(
            (d) =>
              `${d.title[locale] || ""} ${(d.items[locale] || []).join(" ")} ${
                d.title.ru || ""
              } ${(d.items.ru || []).join(" ")}`
          )
          .join(" ");
        if (matchesText(itinText)) return true;
      }

      // Check slug
      if (matchesText(tour.slug.replace(/-/g, " "))) return true;

      return false;
    };

    const matchesAttraction = (attr: Attraction) => {
      // Check names across all locales
      if (
        matchesText(attr.name[locale]) ||
        matchesText(attr.name.ru) ||
        matchesText(attr.name.en) ||
        matchesText(attr.name.hy)
      ) {
        return true;
      }
      // Check tagline
      if (
        matchesText(attr.tagline[locale]) ||
        matchesText(attr.tagline.ru) ||
        matchesText(attr.tagline.en) ||
        matchesText(attr.tagline.hy)
      ) {
        return true;
      }
      // Check region
      if (
        matchesText(attr.region[locale]) ||
        matchesText(attr.region.ru) ||
        matchesText(attr.region.en) ||
        matchesText(attr.region.hy)
      ) {
        return true;
      }
      // Check short description & story
      if (
        matchesText(attr.shortDescription[locale]) ||
        matchesText(attr.shortDescription.ru) ||
        matchesText(attr.fullStory[locale]) ||
        matchesText(attr.fullStory.ru)
      ) {
        return true;
      }
      // Check highlights
      const hls = [
        ...(attr.highlights[locale] || []),
        ...(attr.highlights.ru || []),
      ].join(" ");
      if (matchesText(hls)) return true;

      // Check id
      if (matchesText(attr.id.replace(/-/g, " "))) return true;

      return false;
    };

    const dayTours: Tour[] = [];
    const packages: Tour[] = [];

    for (const t of tours) {
      if (matchesTour(t)) {
        if (isPackageTour(t)) {
          packages.push(t);
        } else {
          dayTours.push(t);
        }
      }
    }

    const matchedAttrs = attractions.filter(matchesAttraction);

    return {
      matchedDayTours: dayTours,
      matchedPackages: packages,
      matchedAttractions: matchedAttrs,
    };
  }, [query, locale, tours, attractions]);

  const totalResults =
    matchedDayTours.length + matchedPackages.length + matchedAttractions.length;

  const labels = {
    ru: {
      placeholder: "Поиск туров, турпакетов или мест (например: Гарни, Севан)...",
      popular: "Популярные направления:",
      all: "Все",
      dayTours: "Экскурсии",
      packages: "Турпакеты",
      attractions: "Что посмотреть",
      noResults: "Ничего не найдено по запросу",
      noResultsDesc: "Попробуйте изменить запрос (например: Гарни, Севан, Татев, Джип) или напишите нам в WhatsApp — мы с радостью составим индивидуальную программу.",
      whatsappBtn: "Задать вопрос в WhatsApp",
      viewAllCatalog: "Смотреть все туры в каталоге",
      escHint: "ESC",
      days: "дней",
      nights: "ночей",
      hours: "ч",
      fromPrice: "от",
      seeStory: "Читать путеводитель →",
    },
    hy: {
      placeholder: "Որոնել տուրեր, փաթեթներ կամ վայրեր (օր․՝ Գառնի, Սևան)...",
      popular: "Հանրաճանաչ ուղղություններ․",
      all: "Բոլորը",
      dayTours: "Էքսկուրսիաներ",
      packages: "Տուր փաթեթներ",
      attractions: "Ինչ տեսնել",
      noResults: "Ոչինչ չի գտնվել",
      noResultsDesc: "Փորձեք փոխել հարցումը կամ գրեք մեզ WhatsApp-ում՝ մենք կկազմենք անհատական ծրագիր։",
      whatsappBtn: "Հարցնել WhatsApp-ում",
      viewAllCatalog: "Տեսնել բոլոր տուրերը կատալոգում",
      escHint: "ESC",
      days: "օր",
      nights: "գիշեր",
      hours: "ժ",
      fromPrice: "սկսած",
      seeStory: "Կարդալ պատմությունը →",
    },
    en: {
      placeholder: "Search tours, packages or sights (e.g. Garni, Sevan)...",
      popular: "Popular searches:",
      all: "All",
      dayTours: "Day Tours",
      packages: "Tour Packages",
      attractions: "What to See",
      noResults: "No results found for",
      noResultsDesc: "Try a different search term (e.g. Garni, Sevan, Tatev, Jeep) or contact us on WhatsApp for a custom itinerary.",
      whatsappBtn: "Ask us on WhatsApp",
      viewAllCatalog: "View all in tour catalogue",
      escHint: "ESC",
      days: "days",
      nights: "nights",
      hours: "h",
      fromPrice: "from",
      seeStory: "Read full guide →",
    },
  }[locale];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 md:pt-16"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex w-full max-w-3xl max-h-[88vh] flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#262424] text-[#FCFCF7] shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-3.5 sm:px-6 sm:py-4">
              <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#C7FF32] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.placeholder}
                className="w-full bg-transparent px-3 text-base sm:text-lg font-medium text-white placeholder-white/40 outline-none"
              />

              {/* Clear Query Button */}
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors text-sm"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}

              {/* Close Button / ESC hint */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Close search"
              >
                <span>{labels.escHint}</span>
                <span className="text-base leading-none">×</span>
              </button>
            </div>

            {/* Quick suggestions when query is empty */}
            {!query.trim() ? (
              <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                    {labels.popular}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickSuggestions[locale].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setQuery(tag);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:border-[#C7FF32] hover:bg-[#C7FF32]/10 hover:text-[#C7FF32] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommended starting tours */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                    {locale === "ru"
                      ? "Рекомендуемые туры"
                      : locale === "hy"
                      ? "Առաջարկվող տուրեր"
                      : "Featured Journeys"}
                  </span>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {tours.slice(0, 4).map((tour) => (
                      <Link
                        key={tour.slug}
                        href={tourHref(locale, tour)}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 transition-all hover:border-[#586EFF]/60 hover:bg-white/10"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/20">
                          <Image
                            src={tour.image}
                            alt={tour.title[locale]}
                            fill
                            sizes="60px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-white group-hover:text-[#C7FF32] transition-colors">
                            {tour.title[locale]}
                          </h4>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/60">
                            {tour.priceFromAmd > 0 && (
                              <span className="font-semibold text-[#C7FF32]">
                                {labels.fromPrice} {formatPrice(tour.priceFromAmd)}
                              </span>
                            )}
                            {tour.durationHours && <span>• {tour.durationHours} {labels.hours}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40">
                  <SearchIcon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {labels.noResults} «{query}»
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/60 leading-relaxed">
                  {labels.noResultsDesc}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow hover:brightness-105 transition-all"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>{labels.whatsappBtn}</span>
                  </a>
                  <Link
                    href={`/${locale}/tours`}
                    onClick={onClose}
                    className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition-all"
                  >
                    {labels.viewAllCatalog}
                  </Link>
                </div>
              </div>
            ) : (
              /* Results list */
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-black/20 px-4 py-2 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                      activeTab === "all"
                        ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {labels.all} ({totalResults})
                  </button>

                  {matchedDayTours.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("tours")}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                        activeTab === "tours"
                          ? "bg-[#586EFF] text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {labels.dayTours} ({matchedDayTours.length})
                    </button>
                  )}

                  {matchedPackages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("packages")}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                        activeTab === "packages"
                          ? "bg-[#586EFF] text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {labels.packages} ({matchedPackages.length})
                    </button>
                  )}

                  {matchedAttractions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("attractions")}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                        activeTab === "attractions"
                          ? "bg-[#586EFF] text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {labels.attractions} ({matchedAttractions.length})
                    </button>
                  )}
                </div>

                {/* Scrollable Results Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  {/* Section: Day Tours */}
                  {(activeTab === "all" || activeTab === "tours") &&
                    matchedDayTours.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                            {labels.dayTours} ({matchedDayTours.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {matchedDayTours.map((tour) => (
                            <Link
                              key={tour.slug}
                              href={tourHref(locale, tour)}
                              onClick={onClose}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-3.5 transition-all hover:border-[#C7FF32]/60 hover:bg-white/10"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-black/20">
                                  <Image
                                    src={tour.image}
                                    alt={tour.title[locale]}
                                    fill
                                    sizes="80px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                                      {labels.dayTours}
                                    </span>
                                    {tour.departure && (
                                      <span className="text-[11px] text-white/50">
                                        {tour.departure} • {tour.durationHours} {labels.hours}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="mt-1 font-bold text-sm sm:text-base text-white group-hover:text-[#C7FF32] transition-colors truncate">
                                    {tour.title[locale]}
                                  </h4>
                                  {tour.destinations[locale]?.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-white/60">
                                      {tour.destinations[locale].slice(0, 3).map((d) => (
                                        <span key={d} className="rounded bg-black/30 px-1.5 py-0.5">
                                          {d}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                                {tour.priceFromAmd > 0 && (
                                  <div className="text-right">
                                    <span className="text-xs text-white/50 block">
                                      {labels.fromPrice}
                                    </span>
                                    <span className="text-sm sm:text-base font-black text-[#C7FF32]">
                                      {formatPrice(tour.priceFromAmd)}
                                    </span>
                                  </div>
                                )}
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-[#C7FF32] group-hover:text-[#312F2F] transition-all">
                                  →
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Section: Packages */}
                  {(activeTab === "all" || activeTab === "packages") &&
                    matchedPackages.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-[#586EFF]">
                            {labels.packages} ({matchedPackages.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {matchedPackages.map((tour) => (
                            <Link
                              key={tour.slug}
                              href={`/${locale}/tour-packages/${tour.slug}`}
                              onClick={onClose}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-3.5 transition-all hover:border-[#586EFF]/80 hover:bg-white/10"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-black/20">
                                  <Image
                                    src={tour.image}
                                    alt={tour.title[locale]}
                                    fill
                                    sizes="80px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-md bg-[#586EFF] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                      {tour.days} {labels.days} / {tour.nights} {labels.nights}
                                    </span>
                                  </div>
                                  <h4 className="mt-1 font-bold text-sm sm:text-base text-white group-hover:text-[#586EFF] transition-colors truncate">
                                    {tour.title[locale]}
                                  </h4>
                                  <p className="mt-0.5 text-xs text-white/60 line-clamp-1">
                                    {tour.description[locale]}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                                {tour.priceFromAmd > 0 && (
                                  <div className="text-right">
                                    <span className="text-xs text-white/50 block">
                                      {labels.fromPrice}
                                    </span>
                                    <span className="text-sm sm:text-base font-black text-[#586EFF]">
                                      {formatPrice(tour.priceFromAmd)}
                                    </span>
                                  </div>
                                )}
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-[#586EFF] group-hover:text-white transition-all">
                                  →
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Section: Attractions (Что посмотреть) */}
                  {(activeTab === "all" || activeTab === "attractions") &&
                    matchedAttractions.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                            {labels.attractions} ({matchedAttractions.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {matchedAttractions.map((attr) => (
                            <Link
                              key={attr.id}
                              href={`/${locale}/what-to-see#${attr.id}`}
                              onClick={onClose}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-3.5 transition-all hover:border-amber-400/80 hover:bg-white/10"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-black/20">
                                  <Image
                                    src={attr.image}
                                    alt={attr.name[locale]}
                                    fill
                                    sizes="80px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-md bg-amber-500/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                      {labels.attractions}
                                    </span>
                                    <span className="text-[11px] text-[#C7FF32] font-semibold">
                                      {attr.distance[locale]}
                                    </span>
                                  </div>
                                  <h4 className="mt-1 font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors truncate">
                                    {attr.name[locale]}
                                  </h4>
                                  <p className="mt-0.5 text-xs text-white/60 line-clamp-1">
                                    {attr.region[locale]} • {attr.tagline[locale]}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                                <span className="text-xs font-bold text-amber-400/90 group-hover:text-amber-300">
                                  {labels.seeStory}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="border-t border-white/10 bg-black/40 px-4 py-3 sm:px-6 flex items-center justify-between text-xs text-white/60">
                  <span>
                    {totalResults} {locale === "ru" ? "результатов" : locale === "hy" ? "արդյունք" : "results"}
                  </span>
                  <Link
                    href={`/${locale}/tours?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="font-bold text-[#C7FF32] hover:underline"
                  >
                    {labels.viewAllCatalog} →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
