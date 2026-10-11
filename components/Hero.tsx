"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
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
  const router = useRouter();

  // Search widget state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory === "packages") {
      router.push(`/${locale}/tour-packages`);
    } else if (selectedCategory === "offers") {
      router.push(`/${locale}/tours/offers`);
    } else if (selectedCategory !== "all") {
      router.push(`/${locale}/tours/${selectedCategory}`);
    } else {
      router.push(`/${locale}/tours${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`);
    }
  };

  const categoryOptions = [
    { id: "all", label: locale === "ru" ? "Все форматы" : locale === "hy" ? "Բոլոր ձևաչափերը" : "All formats" },
    { id: "offers", label: locale === "ru" ? "🔥 Спецпредложения" : locale === "hy" ? "🔥 Հատուկ առաջարկներ" : "🔥 Special Offers" },
    { id: "group", label: locale === "ru" ? "Групповые" : locale === "hy" ? "Խմբային" : "Group tours" },
    { id: "individual", label: locale === "ru" ? "Индивидуальные" : locale === "hy" ? "Անհատական" : "Private tours" },
    { id: "jeep", label: locale === "ru" ? "Джип 4x4" : locale === "hy" ? "Ջիպ 4x4" : "4x4 Jeep" },
    { id: "packages", label: locale === "ru" ? "Тур-пакеты" : locale === "hy" ? "Փաթեթներ" : "Packages" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[100dvh] lg:h-[100dvh] w-full flex-col justify-between overflow-hidden bg-black text-[#FCFCF7] pt-24 sm:pt-28 pb-6 sm:pb-6">
        {/* Fullscreen Video Background - 100% natural, crisp, bright & vivid with poster fallback */}
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

        {/* Delicate subtle bottom gradient ONLY behind the search bar — no dark blanket on top/sky! */}
        <div className="absolute inset-x-0 bottom-0 h-72 sm:h-80 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top spacer for floating transparent header */}
        <div className="w-full h-2" />

        {/* Hero Main Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Brand pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-1.5 backdrop-blur-md shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
                Armenia • Curated Journeys
              </span>
            </motion.div>

            {/* Editorial Title - Luxury Travel typography with razor-sharp shadow */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-3 sm:mt-5 font-serif text-4xl font-normal leading-[1.06] tracking-tight text-[#FCFCF7] sm:text-6xl lg:text-7xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            >
              {dict.hero.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="mt-3 sm:mt-5 max-w-2xl text-base font-normal leading-relaxed text-[#FCFCF7] sm:text-lg lg:text-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              {dict.hero.subtitle}
            </motion.p>

            {/* Action Buttons: Button-in-Button primary CTA + Glassmorphism social pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="mt-5 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4"
            >
              {/* Primary CTA with nested circular button-in-button icon */}
              <Link
                href={`/${locale}/tours`}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#C7FF32] pl-7 pr-3 py-3.5 sm:pl-8 sm:pr-3.5 sm:py-3.5 text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-[0_10px_30px_rgba(199,255,50,0.4)] transition-all duration-300 hover:bg-[#bbf028] hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>
                  {locale === "ru"
                    ? "Выбирай свой тур"
                    : locale === "hy"
                    ? "Ընտրիր քո տուրը"
                    : "Choose Your Tour"}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#312F2F] text-xs font-black text-[#C7FF32] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Double-Bezel Trip Discovery Widget & Scroll Prompt */}
        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Double-Bezel Search Architecture */}
            <div className="rounded-[2rem] p-1.5 sm:p-2 bg-black/35 backdrop-blur-xl border border-white/25 shadow-2xl">
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-2 rounded-[calc(2rem-0.375rem)] bg-[#FCFCF7] p-2.5 shadow-inner sm:flex-row sm:items-center sm:p-2"
              >
                {/* Destination Search Input */}
                <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
                  <span className="text-lg">📍</span>
                  <div className="flex-1">
                    <label htmlFor="hero-search" className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                      {locale === "ru" ? "Куда хотите поехать?" : locale === "hy" ? "Ու՞ր եք ցանկանում գնալ" : "Where to?"}
                    </label>
                    <input
                      id="hero-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        locale === "ru"
                          ? "Севан, Гарни, Дилижан, Татев..."
                          : locale === "hy"
                          ? "Սևան, Գառնի, Դիլիջան, Տաթև..."
                          : "Sevan, Garni, Dilijan, Tatev..."
                      }
                      className="w-full bg-transparent text-base sm:text-sm font-bold text-[#312F2F] placeholder-black/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="hidden h-9 w-px bg-black/10 sm:block" />

                {/* Format / Category Selector */}
                <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
                  <span className="text-lg">🚙</span>
                  <div className="flex-1">
                    <label htmlFor="hero-category" className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                      {locale === "ru" ? "Тип путешествия" : locale === "hy" ? "Տուրի տեսակ" : "Travel type"}
                    </label>
                    <select
                      id="hero-category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-transparent text-base sm:text-sm font-bold text-[#312F2F] focus:outline-none cursor-pointer"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id} className="text-[#312F2F]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#586EFF] px-7 py-3.5 font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#475be6] hover:shadow-lg sm:py-3 active:scale-95"
                >
                  <span>{dict.hero.ctaTours}</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                    →
                  </span>
                </button>
              </form>
            </div>

            {/* Quick Action Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#FCFCF7]/90">
              <span className="text-white/60">{locale === "ru" ? "Быстрый поиск:" : locale === "hy" ? "Արագ որոնում:" : "Quick links:"}</span>
              <Link
                href={`/${locale}/tours/offers`}
                className="rounded-full border border-[#C7FF32] bg-[#C7FF32]/25 backdrop-blur-md px-3.5 py-1 font-bold text-[#C7FF32] transition-all hover:bg-[#C7FF32] hover:text-[#312F2F] shadow-[0_0_15px_rgba(199,255,50,0.3)] animate-pulse"
              >
                {locale === "ru" ? "🔥 Спецпредложения" : locale === "hy" ? "🔥 Հատուկ առաջարկներ" : "🔥 Special Offers"}
              </Link>
              <Link
                href={`/${locale}/tours/group`}
                className="rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-3 py-1 transition-colors hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {locale === "ru" ? "Групповые от 10 000 ֏" : locale === "hy" ? "Խմբային սկսած 10 000 ֏" : "Group from 10k ֏"}
              </Link>
              <Link
                href={`/${locale}/tours/jeep`}
                className="rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-3 py-1 transition-colors hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {locale === "ru" ? "Внедорожные Джип-туры" : locale === "hy" ? "Արտաճանապարհային ջիպ" : "4x4 Jeep Expeditions"}
              </Link>
              <Link
                href={`/${locale}/tour-packages`}
                className="rounded-full border border-[#C7FF32]/50 bg-[#C7FF32]/15 backdrop-blur-md px-3 py-1 font-bold text-[#C7FF32] transition-colors hover:bg-[#C7FF32] hover:text-[#312F2F]"
              >
                {locale === "ru" ? "Многодневные тур-пакеты" : locale === "hy" ? "Բազմօրյա տուր փաթեթներ" : "Multi-day Packages"}
              </Link>
            </div>
          </motion.div>

          {/* Minimal Animated Scroll Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-2 flex items-center justify-center gap-2 text-white/70"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="flex h-5 w-3.5 items-start justify-center rounded-full border border-white/40 p-0.5"
            >
              <div className="h-1 w-0.5 rounded-full bg-[#C7FF32]" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
