"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import BookButton from "@/components/BookButton";
import { useLinks } from "@/components/SiteProvider";
import { WhatsAppIcon, TelegramIcon, InstagramIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";

const SLIDE_MS = 6500;

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
  const links = useLinks();
  const slides = images.map((src, i) => ({
    src,
    alt: i === 0 ? dict.hero.imageAlt : "Armenia Landscape",
  }));
  const [index, setIndex] = useState(0);

  // Search widget state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory === "packages") {
      router.push(`/${locale}/tour-packages`);
    } else if (selectedCategory !== "all") {
      router.push(`/${locale}/tours/${selectedCategory}`);
    } else {
      router.push(`/${locale}/tours${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`);
    }
  };

  const categoryOptions = [
    { id: "all", label: locale === "ru" ? "Все форматы" : locale === "hy" ? "Բոլոր ձևաչափերը" : "All formats" },
    { id: "group", label: locale === "ru" ? "Групповые" : locale === "hy" ? "Խմբային" : "Group tours" },
    { id: "individual", label: locale === "ru" ? "Индивидуальные" : locale === "hy" ? "Անհատական" : "Private tours" },
    { id: "jeep", label: locale === "ru" ? "Джип 4x4" : locale === "hy" ? "Ջիպ 4x4" : "4x4 Jeep" },
    { id: "packages", label: locale === "ru" ? "Тур-пакеты" : locale === "hy" ? "Փաթեթներ" : "Packages" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[640px] flex-col justify-between overflow-hidden bg-[#312F2F] text-[#FCFCF7] lg:min-h-[82vh]">
        {/* Slideshow background with Ken Burns effect */}
        {slides.map((slide, i) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1.06 : 1,
            }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" },
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        ))}

        {/* Ambient Dark Gradient Overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#312F2F]/95 via-[#312F2F]/70 to-[#312F2F]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#312F2F] via-transparent to-[#312F2F]/60" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Brand pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#312F2F]/80 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
                Armenia • Curated Journeys
              </span>
            </motion.div>

            {/* Editorial Title - Black Tomato / Luxury Travel typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#FCFCF7] sm:text-6xl lg:text-7xl"
            >
              {dict.hero.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-[#FCFCF7]/90 sm:text-lg lg:text-xl"
            >
              {dict.hero.subtitle}
            </motion.p>

            {/* Prominent Landing CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Link
                href={`/${locale}/tours`}
                className="inline-flex items-center gap-3 rounded-full bg-[#C7FF32] px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-xl shadow-[#C7FF32]/25 transition-all hover:bg-[#bbf028] hover:scale-105 active:scale-95"
              >
                <span>
                  {locale === "ru"
                    ? "Выбирай свой тур"
                    : locale === "hy"
                    ? "Ընտրիր քո տուրը"
                    : "Choose Your Tour"}
                </span>
                <span className="text-base font-black">→</span>
              </Link>

              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-[#25D366] hover:bg-[#25D366]/20 hover:text-white hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-[#229ED9] hover:bg-[#229ED9]/20 hover:text-white hover:scale-105 active:scale-95"
              >
                <TelegramIcon className="h-4 w-4 text-[#229ED9]" />
                <span>Telegram</span>
              </a>

              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-[#E1306C] hover:bg-[#E1306C]/20 hover:text-white hover:scale-105 active:scale-95"
              >
                <InstagramIcon className="h-4 w-4 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
            </motion.div>
          </div>

          {/* Integrated Trip Discovery Widget (TripMate Reference Inspired) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.6 }}
            className="mt-10 max-w-4xl"
          >
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-[#FCFCF7] p-3 shadow-2xl backdrop-blur-lg sm:flex-row sm:items-center sm:p-2.5"
            >
              {/* Destination Search Input */}
              <div className="flex flex-1 items-center gap-3 px-4 py-2">
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
                    className="w-full bg-transparent text-sm font-bold text-[#312F2F] placeholder-black/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-px bg-black/10 sm:block" />

              {/* Format / Category Selector */}
              <div className="flex flex-1 items-center gap-3 px-4 py-2">
                <span className="text-lg">🚙</span>
                <div className="flex-1">
                  <label htmlFor="hero-category" className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                    {locale === "ru" ? "Тип путешествия" : locale === "hy" ? "Տուրի տեսակ" : "Travel type"}
                  </label>
                  <select
                    id="hero-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#312F2F] focus:outline-none cursor-pointer"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="text-[#312F2F]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#586EFF] px-8 py-4 font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#475be6] hover:shadow-lg sm:py-3.5"
              >
                <span>{dict.hero.ctaTours}</span>
                <span className="text-base">→</span>
              </button>
            </form>

            {/* Quick Action Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#FCFCF7]/80">
              <span className="text-white/50">{locale === "ru" ? "Быстрый поиск:" : locale === "hy" ? "Արագ որոնում:" : "Quick links:"}</span>
              <Link
                href={`/${locale}/tours/group`}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 transition-colors hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {locale === "ru" ? "Групповые от 10 000 ֏" : locale === "hy" ? "Խմբային սկսած 10 000 ֏" : "Group from 10k ֏"}
              </Link>
              <Link
                href={`/${locale}/tours/jeep`}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 transition-colors hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {locale === "ru" ? "Внедорожные Джип-туры" : locale === "hy" ? "Արտաճանապարհային ջիպ" : "4x4 Jeep Expeditions"}
              </Link>
              <Link
                href={`/${locale}/tour-packages`}
                className="rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3 py-1 font-bold text-[#C7FF32] transition-colors hover:bg-[#C7FF32] hover:text-[#312F2F]"
              >
                {locale === "ru" ? "Многодневные тур-пакеты" : locale === "hy" ? "Բազմօրյա տուր փաթեթներ" : "Multi-day Packages"}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats & Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          className="relative z-10 border-t border-white/10 bg-[#312F2F]/80 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 px-6 py-6 sm:flex-row">
            <dl className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-12">
              {dict.stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <dd className="text-2xl font-black text-[#C7FF32] sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-0.5 text-xs font-semibold text-[#FCFCF7]/75">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <span className="hidden text-xs font-semibold text-white/70 lg:block">
                {locale === "ru" ? "Индивидуальный расчет маршрута:" : locale === "hy" ? "Անհատական երթուղու հաշվարկ:" : "Personalized itinerary request:"}
              </span>
              <BookButton
                label={dict.hero.ctaWrite}
                variant="accent"
                size="sm"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}

