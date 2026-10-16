"use client";

import { useState, useId, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { type Attraction, type RegionCategory, getAttractions } from "@/lib/attractions";
import FadeIn from "@/components/FadeIn";

type Props = {
  locale: Locale;
  initialAttractions?: Attraction[];
};

export function WhatToSeeSection({ locale, initialAttractions }: Props) {
  const [activeCategory, setActiveCategory] = useState<"all" | RegionCategory>("all");
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [allAttractions, setAllAttractions] = useState<Attraction[]>(
    () => initialAttractions ?? getAttractions()
  );

  useEffect(() => {
    if (initialAttractions) {
      setAllAttractions(initialAttractions);
    }
  }, [initialAttractions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = allAttractions.find((a) => a.id === hash);
        if (found) {
          setSelectedAttraction(found);
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [allAttractions]);


  const categories: { id: "all" | RegionCategory; label: Record<Locale, string>; count: number }[] = [
    {
      id: "all",
      label: {
        ru: "Все достопримечательности",
        hy: "Բոլոր տեսարժան վայրերը",
        en: "All Attractions",
      },
      count: allAttractions.length,
    },
    {
      id: "near_yerevan",
      label: {
        ru: "Рядом с Ереваном",
        hy: "Երևանի մոտակայքում",
        en: "Near Yerevan",
      },
      count: allAttractions.filter((a) => a.regionCategory === "near_yerevan").length,
    },
    {
      id: "sevan_dilijan",
      label: {
        ru: "Севан & Дилижан",
        hy: "Սևան և Դիլիջան",
        en: "Sevan & Dilijan",
      },
      count: allAttractions.filter((a) => a.regionCategory === "sevan_dilijan").length,
    },
    {
      id: "south",
      label: {
        ru: "Юг (Вайоц Дзор & Сюник)",
        hy: "Հարավ (Վայոց ձոր և Սյունիք)",
        en: "South (Vayots Dzor & Syunik)",
      },
      count: allAttractions.filter((a) => a.regionCategory === "south").length,
    },
    {
      id: "north_lori",
      label: {
        ru: "Север и Лори",
        hy: "Հյուսիս և Լոռի",
        en: "North & Lori",
      },
      count: allAttractions.filter((a) => a.regionCategory === "north_lori").length,
    },
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedAttraction) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAttraction]);

  // Handle escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedAttraction(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredAttractions = activeCategory === "all"
    ? allAttractions
    : allAttractions.filter((a) => a.regionCategory === activeCategory);

  const t = {
    badge: locale === "ru" ? "Путеводитель по Армении" : locale === "hy" ? "Հայաստանի ուղեցույց" : "Armenia Travel Guide",
    title: locale === "ru" ? "Что посмотреть в Армении" : locale === "hy" ? "Ինչ տեսնել Հայաստանում" : "What to See in Armenia",
    subtitle: locale === "ru"
      ? "Главные исторические святыни, древние монастыри ЮНЕСКО, средневековые крепости и чудеса природы с точным расстоянием от Еревана."
      : locale === "hy"
      ? "Գլխավոր պատմական սրբավայրերը, ՅՈՒՆԵՍԿՕ-ի վանքերը, միջնադարյան ամրոցները և բնության հրաշքները՝ Երևանից հստակ հեռավորությամբ։"
      : "Must-visit sanctuaries, UNESCO monasteries, medieval cliff fortresses and natural marvels with driving distances from Yerevan.",
    allTours: locale === "ru" ? "Подобрать тур в каталоге" : locale === "hy" ? "Ընտրել տուր կատալոգում" : "Explore Tour Catalog",
    readMore: locale === "ru" ? "Подробнее о месте" : locale === "hy" ? "Իմանալ ավելին" : "Discover More",
    distanceLabel: locale === "ru" ? "Расстояние от Еревана:" : locale === "hy" ? "Հեռավորությունը Երևանից՝" : "Distance from Yerevan:",
    travelTimeLabel: locale === "ru" ? "Время в пути:" : locale === "hy" ? "Ճանապարհի տևողությունը՝" : "Travel time:",
    locationLabel: locale === "ru" ? "Расположение:" : locale === "hy" ? "Տեղադրություն՝" : "Location:",
    highlightsLabel: locale === "ru" ? "Главные особенности" : locale === "hy" ? "Գլխավոր առանձնահատկությունները" : "Key Highlights",
    historyLabel: locale === "ru" ? "История и значение" : locale === "hy" ? "Պատմություն և նշանակություն" : "History & Heritage",
    bookCta: locale === "ru" ? "Хотите увидеть своими глазами?" : locale === "hy" ? "Ցանկանու՞մ եք տեսնել ձեր աչքերով:" : "Want to experience this in person?",
    bookSubtext: locale === "ru"
      ? "Мы с удовольствием организуем для вас индивидуальную или групповую экскурсию с комфортом, профессиональным гидом и душой."
      : locale === "hy"
      ? "Մենք մեծ սիրով կկազմակերպենք անհատական կամ խմբային էքսկուրսիա՝ հարմարավետությամբ, պրոֆեսիոնալ գիդով և հոգով։"
      : "We would love to arrange a comfortable private or group guided tour tailored to your wishes.",
    whatsappBtn: locale === "ru" ? "Забронировать тур в WhatsApp" : locale === "hy" ? "Ամրագրել տուրը WhatsApp-ով" : "Book This Tour via WhatsApp",
    viewToursBtn: locale === "ru" ? "Смотреть туры с этой локацией" : locale === "hy" ? "Դիտել այս վայրով տուրերը" : "View Matching Tours",
    closeBtn: locale === "ru" ? "Закрыть" : locale === "hy" ? "Փակել" : "Close",
    unescoBadge: locale === "ru" ? "ЮНЕСКО" : locale === "hy" ? "ՅՈՒՆԵՍԿՕ" : "UNESCO",
  };

  return (
    <section id="what-to-see" className="mx-auto max-w-[1360px] px-4 sm:px-6 py-20 sm:py-28">
      {/* 1. Header with Badge & Title */}
      <FadeIn>
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#586EFF]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#586EFF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#586EFF]" />
              {t.badge}
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#312F2F]">
              {t.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <Link
            href={`/${locale}/tours`}
            className="group hidden lg:inline-flex items-center gap-2 rounded-2xl bg-[#312F2F] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#242323] hover:text-[#C7FF32]"
          >
            {t.allTours}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </FadeIn>

      {/* 2. Region Filter Tabs */}
      <FadeIn delay={0.1}>
        <div className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0 justify-start lg:justify-start">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
                className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#312F2F] text-[#C7FF32] shadow-md scale-[1.02]"
                    : "bg-white border border-[#EAE9E0] text-[#312F2F] hover:bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                <span>{cat.label[locale]}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                    isActive ? "bg-[#C7FF32]/20 text-[#C7FF32]" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* 3. Responsive Cards Grid */}
      <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAttractions.map((attraction, i) => {
          return (
            <FadeIn key={attraction.id} delay={Math.min(i * 0.05, 0.4)} className="h-full">
              <div
                id={attraction.id}
                onClick={() => setSelectedAttraction(attraction)}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#EAE9E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer scroll-mt-24"
              >

                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                  <Image
                    src={attraction.image}
                    alt={attraction.name[locale]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top-left: Distance badge */}
                  <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#312F2F]/85 px-3 py-1 text-xs font-bold text-[#C7FF32] backdrop-blur-md">
                      {attraction.distance[locale]}
                    </span>
                  </div>

                  {/* Top-right: UNESCO badge if applicable */}
                  {attraction.unesco && (
                    <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
                      {t.unescoBadge}
                    </span>
                  )}

                  {/* Bottom-left: Region badge */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#312F2F] backdrop-blur-md shadow-sm">
                      {attraction.region[locale]}
                    </span>
                    <span className="rounded-full bg-[#312F2F]/80 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {attraction.travelTime[locale]}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#586EFF]">
                    {attraction.tagline[locale]}
                  </span>

                  <h3 className="mt-1 text-xl font-black text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
                    {attraction.name[locale]}
                  </h3>

                  <p className="mt-2.5 text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {attraction.shortDescription[locale]}
                  </p>

                  {/* Highlights Mini-list */}
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex-1 space-y-1.5">
                    {attraction.highlights[locale].slice(0, 2).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#586EFF]" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-5 flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#312F2F] group-hover:text-[#586EFF] transition-colors">
                      {t.readMore}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 group-hover:bg-[#C7FF32] group-hover:text-[#312F2F] transition-colors">
                      {locale === "ru" ? "Инфо" : locale === "hy" ? "Տեղեկություն" : "Details"}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Mobile Catalog Link */}
      <div className="mt-8 text-center lg:hidden">
        <Link
          href={`/${locale}/tours`}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#312F2F] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#242323] hover:text-[#C7FF32]"
        >
          {t.allTours} →
        </Link>
      </div>

      {/* 4. Rich Interactive Modal / Lightbox */}
      {selectedAttraction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedAttraction(null)}
        >
          <div
            className="relative flex flex-col max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Cover */}
            <div className="relative h-60 sm:h-72 w-full flex-shrink-0 bg-neutral-900">
              <Image
                src={selectedAttraction.image}
                alt={selectedAttraction.name[locale]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#312F2F] via-[#312F2F]/40 to-black/30" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedAttraction(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105"
                aria-label={t.closeBtn}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header Badges & Title */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#312F2F]">
                    {selectedAttraction.tagline[locale]}
                  </span>
                  {selectedAttraction.unesco && (
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                      {t.unescoBadge}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {selectedAttraction.name[locale]}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* Key Metrics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-neutral-50 p-4 border border-neutral-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {t.distanceLabel}
                  </span>
                  <p className="mt-0.5 text-sm sm:text-base font-extrabold text-[#312F2F]">
                    {selectedAttraction.distance[locale]}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {t.travelTimeLabel}
                  </span>
                  <p className="mt-0.5 text-sm sm:text-base font-extrabold text-[#312F2F]">
                    {selectedAttraction.travelTime[locale]}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {t.locationLabel}
                  </span>
                  <p className="mt-0.5 text-sm sm:text-base font-extrabold text-[#312F2F]">
                    {selectedAttraction.region[locale]}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#586EFF]">
                  {t.highlightsLabel}
                </h4>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {selectedAttraction.highlights[locale].map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-blue-50/50 p-3 border border-blue-100/60">
                      <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Historical Text */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#586EFF]">
                  {t.historyLabel}
                </h4>
                <div className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                  {selectedAttraction.fullStory[locale]}
                </div>
              </div>

              {/* Booking CTA Box */}
              <div className="rounded-2xl bg-[#312F2F] p-5 sm:p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="text-lg font-black text-[#C7FF32]">
                      {t.bookCta}
                    </h5>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                      {t.bookSubtext}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
                    <a
                      href={`https://wa.me/37499250525?text=${encodeURIComponent(
                        locale === "ru"
                          ? `Здравствуйте! Хочу посетить ${selectedAttraction.name.ru} (${selectedAttraction.distance.ru}) с Amaras Tour. Подскажите детали и варианты тура.`
                          : locale === "hy"
                          ? `Բարև ձեզ: Ցանկանում եմ այցելել ${selectedAttraction.name.hy} (${selectedAttraction.distance.hy}) Amaras Tour-ի հետ:`
                          : `Hello! I would like to book a tour to ${selectedAttraction.name.en} with Amaras Tour.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#20ba59] transition-all cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.489.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      {t.whatsappBtn}
                    </a>

                    <Link
                      href={`/${locale}/tours${selectedAttraction.tourQuery ? `?q=${selectedAttraction.tourQuery}` : ""}`}
                      onClick={() => setSelectedAttraction(null)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all text-center"
                    >
                      {t.viewToursBtn} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close Bar */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAttraction(null)}
                className="rounded-xl border border-neutral-300 bg-white px-5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
