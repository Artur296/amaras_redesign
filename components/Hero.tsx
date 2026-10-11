"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import type { Dict, Locale } from "@/lib/i18n";

export default function Hero({
  locale,
  dict,
  images,
}: {
  locale: Locale;
  dict: Dict;
  images: string[];
}) {
  const destinations = [
    {
      id: "sevan",
      title: locale === "ru" ? "Озеро Севан" : locale === "hy" ? "Սևանա լիճ" : "Lake Sevan",
      subtitle: locale === "ru" ? "Голубая жемчужина Армении" : "Azure Highland Lake",
      image: "/images/package-sevan.jpg",
      href: `/${locale}/tours/popular/tsaghkadzor-sevan-dilijan`,
    },
    {
      id: "khor-virap",
      title: locale === "ru" ? "Хор Вирап & Арарат" : locale === "hy" ? "Խոր Վիրապ և Արարատ" : "Khor Virap & Ararat",
      subtitle: locale === "ru" ? "Легендарный вид на библейскую гору" : "Iconic Mount Ararat views",
      image: "/images/offer-khor-virap.jpg",
      href: `/${locale}/tours/popular/khor-virap-azat-garni-geghard`,
    },
    {
      id: "garni",
      title: locale === "ru" ? "Храм Гарни & Гегард" : locale === "hy" ? "Գառնի և Գեղարդ" : "Garni & Geghard",
      subtitle: locale === "ru" ? "Античный храм и скальные святыни" : "Classical temple & UNESCO cave",
      image: "/images/package-garni-hd.jpg",
      href: `/${locale}/tours/popular/garni-charents-arch-lavash-geghard`,
    },
    {
      id: "tatev",
      title: locale === "ru" ? "Крылья Татева" : locale === "hy" ? "Տաթևի թևեր" : "Wings of Tatev",
      subtitle: locale === "ru" ? "Монастырь над ущельем Воротан" : "Medieval monastery over the gorge",
      image: "/images/package-tatev.jpg",
      href: `/${locale}/tours?q=tatev`,
    },
    {
      id: "noravank",
      title: locale === "ru" ? "Красный Нораванк" : locale === "hy" ? "Նորավանք" : "Noravank Canyon",
      subtitle: locale === "ru" ? "Живописные скалы и край вин Арени" : "Red rock canyon & Areni wines",
      image: "/images/package-noravank.jpg",
      href: `/${locale}/tours/popular/khor-virap-areni-noravank-birds-cave`,
    },
    {
      id: "azhdahak",
      title: locale === "ru" ? "Вулкан Аждаак (4x4)" : locale === "hy" ? "Աժդահակ (4x4)" : "Azhdahak 4x4",
      subtitle: locale === "ru" ? "Внедорожная экспедиция к кратеру" : "Volcano crater lake expedition",
      image: "/images/azhdahak.jpg",
      href: `/${locale}/tours/jeep`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  // Get visible cards in sliding order (showing 3-4 cards ahead)
  const visibleCards = [
    destinations[currentIndex],
    destinations[(currentIndex + 1) % destinations.length],
    destinations[(currentIndex + 2) % destinations.length],
    destinations[(currentIndex + 3) % destinations.length],
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-black text-[#FCFCF7] pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* Fullscreen Video Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/og-amaras.jpg"
            className="h-full w-full object-cover object-center"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Ambient Overlay for Cinematic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/30 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Main Content Container: Left Editorial Text + Right Destination Cards Slider */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT COLUMN: Bold Headline & Editorial Story */}
            <div className="lg:col-span-5 flex flex-col items-start justify-center text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-md"
              >
                <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
                  Armenia • Exclusive Tours
                </span>
              </motion.div>

              {/* World Tours / Armenia Tours Header */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-4 sm:mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.04] tracking-tight text-[#FCFCF7] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
              >
                {locale === "ru"
                  ? "Туры по Армении"
                  : locale === "hy"
                  ? "Տուրեր Հայաստանում"
                  : "World Tours"}
              </motion.h1>

              {/* Subtitle paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6 }}
                className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-[#FCFCF7]/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-normal"
              >
                {dict.hero.subtitle}
              </motion.p>

              {/* Action Button: Exact match to reference "see more" accent button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.6 }}
                className="mt-6 sm:mt-8"
              >
                <Link
                  href={`/${locale}/tours`}
                  className="group inline-flex items-center justify-center gap-3 rounded-xl sm:rounded-2xl bg-[#C7FF32] px-8 py-4 sm:px-9 sm:py-4 text-sm sm:text-base font-black text-[#312F2F] shadow-[0_10px_30px_rgba(199,255,50,0.35)] transition-all duration-300 hover:bg-[#b8f226] hover:scale-105 active:scale-95"
                >
                  <span className="uppercase tracking-wider">
                    {locale === "ru" ? "Смотреть туры" : locale === "hy" ? "Դիտել տուրերը" : "See more"}
                  </span>
                  <span className="text-base font-black transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Signature Destination Cards Slider */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Top Navigation Arrows: Circular Translucent Glass Buttons */}
              <div className="flex items-center justify-end gap-3 mb-4 sm:mb-6 pr-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous destination"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/60 active:scale-90 shadow-lg cursor-pointer"
                >
                  <svg className="h-5 w-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next destination"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/60 active:scale-90 shadow-lg cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Cards Row: Horizontal flowing cards with smooth animation */}
              <div className="relative overflow-hidden pt-2 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {visibleCards.slice(0, 3).map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <Link
                        href={item.href}
                        className="relative w-full aspect-[3/4] sm:aspect-[9/13] overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/25 bg-black/40 shadow-2xl transition-all duration-500 hover:border-[#C7FF32]/80 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                        {/* Top tag */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-[#C7FF32] backdrop-blur-md">
                            ★ Популярно
                          </span>
                        </div>

                        {/* Bottom overlay inside card */}
                        <div className="absolute bottom-3 inset-x-3 text-left">
                          <span className="text-[11px] font-semibold text-white/80 line-clamp-1">
                            {item.subtitle}
                          </span>
                        </div>
                      </Link>

                      {/* Destination Label Below Card (Exact match to reference style!) */}
                      <Link
                        href={item.href}
                        className="mt-3 text-center text-sm sm:text-base font-bold text-[#FCFCF7] drop-shadow-md transition-colors group-hover:text-[#C7FF32]"
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
