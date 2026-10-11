"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function HeritageBanner({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#070D38] via-[#0E1A63] to-[#14238A] p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-[#586EFF]/30"
      >
        {/* Abstract Concentric Circles / Glow matching Screenshot 2 */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[450px] w-[450px] rounded-full bg-[#586EFF]/25 blur-[90px]" />
        <div className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full border border-white/10 opacity-40" />
        <div className="pointer-events-none absolute right-28 top-1/2 -translate-y-1/2 h-[240px] w-[240px] rounded-full border border-[#C7FF32]/20 opacity-60" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Bold Headline & Description */}
          <div className="lg:col-span-8 max-w-2xl">
            <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
              {locale === "ru"
                ? "Лучшие авторские и научные маршруты"
                : locale === "hy"
                ? "Լավագույն հեղինակային և գիտական երթուղիները"
                : "Heritage & Scientific Expeditions"}
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-blue-100/90 font-normal">
              {locale === "ru"
                ? "Экспедиции в уникальную Бюраканскую астрофизическую обсерваторию, мегалитический комплекс Караундж (Зорац-Карер), институт древних рукописей Матенадаран и встречи с ведущими исследователями."
                : locale === "hy"
                ? "Արշավներ դեպի Բյուրականի աստղադիտարան, Զորաց Քարերի մեգալիթյան համալիր (Քարահունջ), Մատենադարան և հանդիպումներ գիտնականների հետ։"
                : "Expeditions to Byurakan Astrophysical Observatory, ancient Carahunge megaliths, Matenadaran manuscripts vault, and dialogue with local scholars."}
            </p>
          </div>

          {/* Right Column: Orbit graphic & Accent Lime Button */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-6">
            {/* Scientific emblem / orbit badge */}
            <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 border border-white/15 backdrop-blur-md">
              <svg className="h-8 w-8 text-[#C7FF32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="3" />
                <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
              </svg>
              <div className="text-left text-xs font-bold text-white/90">
                <span className="block text-[10px] text-[#C7FF32] uppercase tracking-wider">Amaras Science</span>
                <span>Наследие & Астрономия</span>
              </div>
            </div>

            {/* Bright Brand Button in Electric Lime #C7FF32 matching Screenshot 2 */}
            <Link
              href={`/${locale}/tours/individual`}
              className="inline-flex items-center justify-center rounded-xl bg-[#C7FF32] px-10 py-4 text-sm font-black uppercase tracking-wider text-[#161616] shadow-[0_10px_30px_rgba(199,255,50,0.4)] transition-all duration-300 hover:bg-[#b8f226] hover:scale-105 active:scale-95"
            >
              {locale === "ru" ? "Выбрать" : locale === "hy" ? "Ընտրել" : "Explore"}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
