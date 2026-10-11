"use client";

import { motion, MotionConfig } from "framer-motion";
import BookButton from "@/components/BookButton";
import type { Dict, Locale } from "@/lib/i18n";

export default function HeroStats({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-20 border-b border-[#454343] bg-[#312F2F] text-[#FCFCF7] shadow-xl">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-6 px-4 py-6 sm:px-6 sm:py-7 sm:flex-row">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-12 w-full sm:w-auto">
            <dl className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:gap-12 text-center sm:text-left">
              {dict.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#C7FF32] tracking-tight">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-xs sm:text-sm font-bold text-[#FCFCF7]/80">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Trust Pill: 5-Star Reviews & Instant Response Guarantee */}
            <div className="hidden xl:flex items-center gap-3.5 border-l border-white/15 pl-8 text-sm text-white/90">
              <div className="flex items-center gap-1 text-[#C7FF32] text-base">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <span className="font-bold">
                {locale === "ru"
                  ? "5.0 • 138+ отзывов гостей"
                  : locale === "hy"
                  ? "5.0 • 138+ հյուրերի կարծիք"
                  : "5.0 • 138+ Traveler Reviews"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-[#C7FF32]">
                {locale === "ru" ? "Без предоплаты" : locale === "hy" ? "Առանց կանխավճարի" : "No Prepayment"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-1 sm:pt-0">
            <span className="text-xs sm:text-sm font-semibold text-white/80 text-center sm:text-left">
              {locale === "ru"
                ? "Индивидуальный расчет маршрута:"
                : locale === "hy"
                ? "Անհատական երթուղու հաշվարկ:"
                : "Personalized itinerary request:"}
            </span>
            <BookButton
              label={dict.hero.ctaWrite}
              variant="accent"
              size="md"
              className="w-full sm:w-auto shrink-0 justify-center"
            />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
