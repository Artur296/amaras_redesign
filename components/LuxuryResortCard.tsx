"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { HomepageImages } from "@/lib/site";

interface ResortSlide {
  id: string;
  location: string;
  brand: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export default function LuxuryResortCard({
  locale,
  images,
}: {
  locale: Locale;
  images?: Partial<HomepageImages>;
}) {
  const slides: ResortSlide[] = [
    {
      id: "sevan-resort",
      location: locale === "ru" ? "Армения / Озеро Севан" : locale === "hy" ? "Հայաստան / Սևանա լիճ" : "Armenia / Lake Sevan",
      brand: "AMARAS LUXURY",
      title: "SEVAN RESORT & SPA",
      subtitle:
        locale === "ru"
          ? "Искусство гостеприимства в каждой детали. Лазурный пляж, панорамные коттеджи и авторская кухня."
          : locale === "hy"
          ? "Հյուրընկալության արվեստը յուրաքանչյուր դետալում։ Լազուր ափ, պանորամային քոթեջներ և հեղինակային խոհանոց։"
          : "The art of hospitality in every detail. Azure shoreline, panoramic cottages, and gourmet dining.",
      image: images?.resortSevan || "/images/package-sevan.jpg",
      href: `/${locale}/tour-packages`,
    },
    {
      id: "dilijan-resort",
      location: locale === "ru" ? "Армения / Дилижан" : locale === "hy" ? "Հայաստան / Դիլիջան" : "Armenia / Dilijan",
      brand: "AMARAS NATURE",
      title: "DILIJAN FOREST CHALET",
      subtitle:
        locale === "ru"
          ? "Альпийский спа-отель среди реликтовых сосновых лесов. Кристальный воздух и абсолютная тишина."
          : locale === "hy"
          ? "Ալպիական սպա հյուրանոց սոճիների անտառներում։ Բյուրեղյա օդ և բացարձակ հանգստություն։"
          : "Alpine spa sanctuary nestled in ancient pine woods. Pure mountain air and serene luxury.",
      image: images?.resortDilijan || "/images/package-dilijan.jpg",
      href: `/${locale}/tour-packages`,
    },
    {
      id: "jermuk-resort",
      location: locale === "ru" ? "Армения / Джермук" : locale === "hy" ? "Հայաստան / Ջերմուկ" : "Armenia / Jermuk",
      brand: "AMARAS WELLNESS",
      title: "GRAND JERMUK SPRINGS",
      subtitle:
        locale === "ru"
          ? "Минеральные целебные гейзеры, термальные спа-бассейны и живописный горный каньон."
          : locale === "hy"
          ? "Հանքային բուժիչ աղբյուրներ, ջերմային սպա ավազաններ և գեղատեսիլ լեռնային կիրճ։"
          : "Healing mineral springs, thermal pools, and breathtaking waterfall gorge panoramas.",
      image: images?.resortJermuk || "/images/offer-khor-virap.jpg",
      href: `/${locale}/tour-packages`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation arrows (desktop sides) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous resort"
          className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-[#312F2F] text-white shadow-xl border border-white/20 transition-all hover:border-[#C7FF32] hover:text-[#C7FF32] hover:scale-110 active:scale-95 cursor-pointer"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next resort"
          className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-[#312F2F] text-white shadow-xl border border-white/20 transition-all hover:border-[#C7FF32] hover:text-[#C7FF32] hover:scale-110 active:scale-95 cursor-pointer"
        >
          ›
        </button>

        {/* Mobile View (< lg): Unified Luxury Poster Card */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-[2rem] border-2 border-[#586EFF]/40 bg-neutral-900 shadow-2xl min-h-[460px] flex flex-col justify-end p-5 text-white"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start w-full">
                {/* Top Location & Brand Pill */}
                <div className="flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-wider text-white/80 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5 text-white/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32]" />
                    {slide.location}
                  </span>
                  <span className="text-[#C7FF32] font-black">{slide.brand}</span>
                </div>

                {/* 5 Stars */}
                <div className="mt-3 flex items-center gap-1 text-sm text-[#C7FF32]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                {/* Title */}
                <h3 className="mt-2 font-sans text-2xl font-black uppercase tracking-tight text-white leading-tight">
                  {slide.title}
                </h3>

                {/* Subtitle */}
                <p className="mt-2 text-xs text-[#FCFCF7]/85 leading-relaxed line-clamp-3">
                  {slide.subtitle}
                </p>

                {/* Select Tour Button */}
                <div className="mt-5 w-full">
                  <Link
                    href={slide.href}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#586EFF] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all active:scale-95"
                  >
                    {locale === "ru" ? "Выбрать тур" : locale === "hy" ? "Ընտրել տուրը" : "Select Tour"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop View (>= lg): Split Card Layout */}
        <div className="hidden lg:block relative overflow-hidden rounded-[2.5rem] border-2 border-[#586EFF]/30 bg-neutral-900 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative grid grid-cols-12 min-h-[460px] items-stretch"
            >
              {/* Left Side: Dark charcoal card with luxury details */}
              <div className="col-span-5 z-10 flex items-center p-10 lg:p-12">
                <div className="w-full rounded-3xl bg-[#312F2F]/95 backdrop-blur-xl border border-white/15 p-9 shadow-2xl text-[#FCFCF7]">
                  {/* Top info & brand */}
                  <div className="flex items-center justify-between text-xs text-[#FCFCF7]/60 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32]" />
                      {slide.location}
                    </span>
                    <span className="text-[#C7FF32] font-black">{slide.brand}</span>
                  </div>

                  {/* 5 Stars in Brand Lime */}
                  <div className="mt-4 flex items-center gap-1 text-base text-[#C7FF32]">
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">★</span>
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">★</span>
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">★</span>
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">★</span>
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">★</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-sans text-3xl font-black uppercase tracking-tight text-white">
                    {slide.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-3 text-sm text-[#FCFCF7]/75 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Button */}
                  <div className="mt-8">
                    <Link
                      href={slide.href}
                      className="inline-flex items-center justify-center rounded-xl bg-[#586EFF] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-[#475ceb] hover:scale-105 active:scale-95"
                    >
                      {locale === "ru" ? "Выбрать тур" : locale === "hy" ? "Ընտրել տուրը" : "Select Tour"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side: Scenic Resort Aerial Photo */}
              <div className="col-span-7 relative min-h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="60vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? "w-6 bg-[#586EFF]" : "w-2 bg-neutral-500 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
