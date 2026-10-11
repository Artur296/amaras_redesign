"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { formatPrice } from "@/lib/tours";
import type { SpecialOffer } from "@/lib/offers";
import type { Dict, Locale } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/icons";

export default function SpecialOffersSection({
  offers,
  locale,
  dict,
}: {
  offers: SpecialOffer[];
  locale: Locale;
  dict: Dict;
}) {
  const activeOffers = offers.filter((o) => o.active);
  if (!activeOffers.length) return null;

  // Primary active offer
  const offer = activeOffers[0];

  const title = offer.title[locale] || offer.title.ru;
  const subtitle = offer.subtitle[locale] || offer.subtitle.ru;
  const badge = offer.badge[locale] || offer.badge.ru;
  const priceHighlight =
    offer.priceHighlightText?.[locale] ||
    offer.priceHighlightText?.ru ||
    (offer.priceFromAmd
      ? `${locale === "ru" ? "2 экскурсии — всего" : locale === "hy" ? "2 էքսկուրսիա — ընդամենը" : "2 Day Tours — Only"} ${formatPrice(offer.priceFromAmd)}`
      : "");
  const leftRoute =
    offer.leftRouteTitle?.[locale] ||
    offer.leftRouteTitle?.ru ||
    (locale === "ru" ? "ОТ АРАРАТА ДО ДЖЕРМУКА" : locale === "hy" ? "ԱՐԱՐԱՏԻՑ ՄԻՆՉԵՎ ՋԵՐՄՈՒԿ" : "FROM ARARAT TO JERMUK");
  const rightRoute =
    offer.rightRouteTitle?.[locale] ||
    offer.rightRouteTitle?.ru ||
    (locale === "ru" ? "ОТ ГАРНИ ДО СЕВАНА" : locale === "hy" ? "ԳԱՌՆԻԻՑ ՄԻՆՉԵՎ ՍԵՎԱՆ" : "FROM GARNI TO SEVAN");
  const primaryBtn =
    offer.primaryButtonText?.[locale] ||
    offer.primaryButtonText?.ru ||
    (locale === "ru" ? "ЗАБРОНИРОВАТЬ СЕЙЧАС" : locale === "hy" ? "ԱՄՐԱԳՐԵԼ ՀԻՄԱ" : "BOOK NOW");
  const secondaryBtn =
    offer.secondaryLinkText?.[locale] ||
    offer.secondaryLinkText?.ru ||
    (locale === "ru" ? "ПОДРОБНЕЕ" : locale === "hy" ? "ՄԱՆՐԱՄԱՍՆ" : "DETAILS");
  const valid = offer.validUntil?.[locale] || offer.validUntil?.ru;
  const features = offer.highlightFeatures?.[locale] || offer.highlightFeatures?.ru || [
    locale === "ru" ? "Только при 2 экскурсиях" : "Valid for 2 tours",
    locale === "ru" ? "Специальная фиксированная цена" : "Fixed promotional price",
    locale === "ru" ? "Два уникальных маршрута" : "Two iconic routes",
    locale === "ru" ? "Больше впечатлений по выгодной цене" : "Maximum impressions",
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full overflow-hidden bg-[#312F2F] pt-16 pb-24 sm:pt-20 sm:pb-32 text-[#FCFCF7]" id="special-offers">
        {/* Ambient Brand Glows */}
        <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#C7FF32]/10 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#586EFF]/15 blur-[150px]" />

        {/* Outer full-width container */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {/* Top Branding Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-center text-center"
          >
            {/* AMARAS Logo badge */}
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-[#C7FF32]">▲</span>
              <span className="font-heading text-lg sm:text-xl tracking-[0.25em] text-[#FCFCF7] uppercase font-bold">
                AMARAS TOUR
              </span>
            </div>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#FCFCF7]/65">
              {locale === "ru" ? "Ваш гид и друг в Армении" : locale === "hy" ? "Ձեր գիդը և ընկերը Հայաստանում" : "Your Local Guide & Friend in Armenia"}
            </span>

            {/* Brand Lime Pill Badge */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#C7FF32] shadow-[0_0_20px_rgba(199,255,50,0.15)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
              <span>{badge}</span>
            </motion.div>
          </motion.div>

          {/* Main Triple-Wing Showcase Layout */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT WING: Khor Virap, Ararat, Jermuk preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="hidden lg:flex lg:col-span-3 flex-col gap-4"
            >
              <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-2xl transition-all duration-500 hover:border-[#C7FF32]/60 hover:shadow-[0_20px_40px_rgba(199,255,50,0.15)]">
                <Image
                  src="/images/offer-khor-virap.jpg"
                  alt={leftRoute}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                {/* Left Route Badge */}
                <div className="absolute top-4 left-4 right-4">
                  <span className="inline-block rounded-full bg-[#312F2F]/85 backdrop-blur-md px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32] border border-[#C7FF32]/35 shadow-md">
                    {leftRoute}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-[#FCFCF7]/90 font-medium">
                    {locale === "ru" ? "Хор Вирап • Арарат • Арени • Джермук" : "Khor Virap • Areni Winery • Jermuk"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CENTER STAGE: Huge Special Offer Billboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-6 flex flex-col items-center text-center px-2 sm:px-6"
            >
              {/* Massive Bold Headline */}
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.05] drop-shadow-md">
                {title}
              </h2>

              {/* Brand Cobalt Banner with Lime Price Highlight */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="mt-6 w-full max-w-xl rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#586EFF] via-[#475BE6] to-[#586EFF] px-6 py-4 sm:py-5 shadow-[0_12px_36px_rgba(88,110,255,0.35)] border border-white/20"
              >
                <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wide text-white drop-shadow">
                  {priceHighlight}
                </div>
                {offer.priceOldAmd && (
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-white/75 line-through">
                    {locale === "ru" ? "Обычная цена:" : "Regular price:"} {formatPrice(offer.priceOldAmd)}
                  </div>
                )}
              </motion.div>

              {/* Subtitle */}
              <p className="mt-5 max-w-lg text-base sm:text-lg text-[#FCFCF7]/90 font-normal leading-relaxed">
                {subtitle}
              </p>

              {/* 4 Feature Badges with Icons */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-md transition-colors hover:border-[#C7FF32]/40 hover:bg-white/10"
                  >
                    <span className="text-lg">
                      {idx === 0 ? "📅" : idx === 1 ? "🕒" : idx === 2 ? "📍" : "⛰️"}
                    </span>
                    <span className="mt-1 text-xs font-bold leading-snug text-[#FCFCF7]/90">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile route previews (shown only on mobile/tablet) */}
              <div className="mt-6 flex flex-wrap lg:hidden items-center justify-center gap-2">
                <span className="rounded-full bg-[#312F2F]/90 px-3 py-1 text-xs font-bold text-[#C7FF32] border border-[#C7FF32]/35">
                  ✓ {leftRoute}
                </span>
                <span className="rounded-full bg-[#312F2F]/90 px-3 py-1 text-xs font-bold text-[#586EFF] border border-[#586EFF]/35">
                  ✓ {rightRoute}
                </span>
              </div>

              {/* Action Buttons Bar matching AMARAS signature buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                {/* Primary CTA (Signature Lime button) */}
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href={offer.linkHref}
                  target={offer.linkHref.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#C7FF32] px-8 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-[#312F2F] shadow-[0_8px_25px_rgba(199,255,50,0.35)] transition-all hover:bg-[#b8f226]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>{primaryBtn}</span>
                  <span className="transition-transform group-hover:translate-x-1">›</span>
                </motion.a>

                {/* Secondary CTA (Dark pill button with border) */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={offer.secondaryLinkHref || "/#tours"}
                    className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/25 bg-black/40 px-8 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-[#586EFF] hover:text-[#586EFF]"
                  >
                    <span>{secondaryBtn}</span>
                    <span className="transition-transform group-hover:translate-x-1">›</span>
                  </Link>
                </motion.div>
              </div>

              {valid && (
                <span className="mt-4 text-xs font-medium text-white/50">
                  {valid}
                </span>
              )}
            </motion.div>

            {/* RIGHT WING: Garni, Symphony of stones, Sevan preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="hidden lg:flex lg:col-span-3 flex-col gap-4"
            >
              <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-2xl transition-all duration-500 hover:border-[#586EFF]/60 hover:shadow-[0_20px_40px_rgba(88,110,255,0.2)]">
                <Image
                  src="/images/package-garni-hd.jpg"
                  alt={rightRoute}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                {/* Right Route Badge */}
                <div className="absolute top-4 left-4 right-4">
                  <span className="inline-block rounded-full bg-[#312F2F]/85 backdrop-blur-md px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#586EFF] border border-[#586EFF]/35 shadow-md">
                    {rightRoute}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-[#FCFCF7]/90 font-medium">
                    {locale === "ru" ? "Гарни • Симфония камней • Севан • Севанаванк" : "Garni • Symphony of Stones • Lake Sevan"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
