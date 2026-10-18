"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tour, Category } from "@/lib/tours";
import type { Locale } from "@/lib/i18n";
import BookButton from "@/components/BookButton";

type Props = {
  tours: Tour[];
  categories: Category[];
  locale: Locale;
};

const I18N = {
  ru: {
    badge: "1 ТУР ИЗ КАЖДОЙ КАТЕГОРИИ",
    title: "Армения в 6 форматах отдыха",
    subtitle: "Компактная подборка лучших маршрутов: выберите идеальный формат за 10 секунд.",
    all: "Все форматы",
    details: "Подробнее",
    book: "Забронировать",
    from: "от",
    days: "дн.",
    hours: "ч.",
    prev: "Назад",
    next: "Вперед",
  },
  hy: {
    badge: "1 ՏՈՒՐ ԱՄԵՆ ԿԱՏԵԳՈՐԻԱՅԻՑ",
    title: "Հայաստանը 6 ձևաչափով",
    subtitle: "Լավագույն երթուղիների կոմպակտ ընտրանի. ընտրեք ձեր ոճը 10 վայրկյանում։",
    all: "Բոլորը",
    details: "Մանրամասն",
    book: "Ամրագրել",
    from: "",
    days: "օր",
    hours: "ժամ",
    prev: "Նախորդ",
    next: "Հաջորդ",
  },
  en: {
    badge: "1 TOUR FROM EACH CATEGORY",
    title: "Armenia in 6 Travel Styles",
    subtitle: "A compact curated showcase: discover your travel vibe in 10 seconds.",
    all: "All Styles",
    details: "Details",
    book: "Book Tour",
    from: "from",
    days: "days",
    hours: "hrs",
    prev: "Prev",
    next: "Next",
  },
};

export default function CompactCategoryTours({ tours, categories, locale }: Props) {
  const t = I18N[locale] || I18N.ru;
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter public categories (excluding 'guests' which is not a tour category)
  const validCategories = categories.filter((c) => c.id !== "guests");

  // Pick exactly 1 premier distinct tour for each category
  const usedSlugs = new Set<string>();
  const categoryTours = validCategories.map((cat) => {
    const match =
      tours.find(
        (tour) =>
          Array.isArray(tour.categories) &&
          tour.categories.includes(cat.id) &&
          !usedSlugs.has(tour.slug)
      ) ||
      tours.find(
        (tour) => Array.isArray(tour.categories) && tour.categories.includes(cat.id)
      ) ||
      tours.find((tour) => !usedSlugs.has(tour.slug)) ||
      tours[0];

    if (match) {
      usedSlugs.add(match.slug);
    }

    return {
      category: cat,
      tour: match,
    };
  });

  const displayedItems =
    selectedCat === "all"
      ? categoryTours
      : categoryTours.filter((item) => item.category.id === selectedCat);

  const scrollLeft = () => {
    if (trackRef.current) {
      const card = trackRef.current.querySelector<HTMLElement>(".compact-tour-card");
      const scrollStep = card ? card.offsetWidth + 24 : 560;
      trackRef.current.scrollBy({ left: -scrollStep, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      const card = trackRef.current.querySelector<HTMLElement>(".compact-tour-card");
      const scrollStep = card ? card.offsetWidth + 24 : 560;
      trackRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#242323] py-8 sm:py-12 border-y border-white/10 text-[#FCFCF7]">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        {/* Header & Controls: compact 1-row layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32] animate-pulse" />
              <span>{t.badge}</span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
              {t.title}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-white/85 max-w-xl font-medium leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label={t.prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F] transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label={t.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F] transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Pills Switcher */}
        <div className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedCat("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm sm:text-base font-bold transition-all cursor-pointer ${
              selectedCat === "all"
                ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.all} ({validCategories.length})
          </button>

          {validCategories.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#C7FF32] text-[#312F2F] shadow-sm"
                    : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.title[locale]}
              </button>
            );
          })}
        </div>

        {/* 2 Tours Per Screen Carousel Track */}
        <div
          ref={trackRef}
          className="mt-4 flex gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory touch-pan-x scrollbar-none"
        >
          {displayedItems.map(({ category, tour }) => {
            if (!tour) return null;
            const tourTitle = tour.title[locale] || tour.title.ru;
            const tourDesc = tour.description?.[locale] || tour.description?.ru || "";
            const price = tour.priceFromAmd
              ? `${tour.priceFromAmd.toLocaleString("ru-RU")} ֏`
              : "По запросу";

            const duration = tour.days
              ? `${tour.days} ${t.days}`
              : tour.durationHours
              ? `${tour.durationHours} ${t.hours}`
              : "";

            return (
              <div
                key={category.id + "-" + tour.slug}
                className="compact-tour-card group relative flex w-[calc(100vw-56px)] sm:w-[calc(50%-12px)] shrink-0 snap-start flex-col sm:flex-row overflow-hidden rounded-2xl border border-white/15 bg-[#1C1B1B] p-3.5 sm:p-4 shadow-md transition-all hover:border-[#C7FF32]/50 hover:bg-[#201F1F]"
              >
                {/* Left: Thumbnail */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full sm:w-44 md:w-52 shrink-0 overflow-hidden rounded-xl bg-black/30">
                  <Image
                    src={tour.image || category.image}
                    alt={tourTitle}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 220px, 260px"
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-[#312F2F]/90 px-2.5 py-1 text-xs sm:text-sm font-black text-[#C7FF32] backdrop-blur-xs">
                    {category.title[locale]}
                  </span>
                </div>

                {/* Right: Content & Full Action Buttons */}
                <div className="flex flex-1 flex-col justify-between mt-3 sm:mt-0 sm:pl-4 overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between gap-1 text-sm text-white/80">
                      {duration ? (
                        <span className="inline-flex items-center gap-1 font-bold text-white/90">
                          ⏱ {duration}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-[#C7FF32] font-black">★ 5.0</span>
                    </div>

                    <Link
                      href={`/${locale}/tours/${tour.slug}`}
                      className="mt-1.5 block font-bold text-lg sm:text-xl text-white hover:text-[#C7FF32] transition-colors line-clamp-1"
                    >
                      {tourTitle}
                    </Link>

                    <p className="mt-1.5 text-sm sm:text-base text-white/80 line-clamp-2 leading-relaxed">
                      {tourDesc}
                    </p>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-bold text-white/70 block leading-none">
                        {t.from}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-[#C7FF32]">
                        {price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/${locale}/tours/${tour.slug}`}
                        className="rounded-full bg-white/10 px-3.5 py-2 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition-colors whitespace-nowrap"
                      >
                        {t.details}
                      </Link>
                      <div className="shrink-0">
                        <BookButton
                          label={t.book}
                          tourTitle={tourTitle}
                          variant="accent"
                          size="md"
                          className="whitespace-nowrap px-4 py-2 text-sm font-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
