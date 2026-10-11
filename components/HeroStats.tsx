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
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 px-4 py-5 sm:px-6 sm:py-6 sm:flex-row">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 w-full sm:w-auto">
            <dl className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:gap-10 text-center sm:text-left">
              {dict.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-xl sm:text-3xl font-black text-[#C7FF32]">
                    {stat.value}
                  </dd>
                  <dt className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#FCFCF7]/75">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Trust Pill: 5-Star Reviews & Instant Response Guarantee */}
            <div className="hidden xl:flex items-center gap-3 border-l border-white/10 pl-6 text-xs text-white/80">
              <div className="flex items-center gap-1 text-[#C7FF32]">
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
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#C7FF32]">
                {locale === "ru" ? "✓ Без предоплаты" : locale === "hy" ? "✓ Առանց կանխավճարի" : "✓ No Prepayment"}
              </span>
            </div>
          </div>

          <div className="flex w-full items-center justify-between sm:justify-end gap-3 sm:w-auto">
            <span className="text-xs font-semibold text-white/70">
              {locale === "ru"
                ? "Индивидуальный расчет маршрута:"
                : locale === "hy"
                ? "Անհատական երթուղու հաշվարկ:"
                : "Personalized itinerary request:"}
            </span>
            <BookButton
              label={dict.hero.ctaWrite}
              variant="accent"
              size="sm"
              className="shrink-0"
            />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
