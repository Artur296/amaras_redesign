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

  const inclusions = [
    {
      icon: "🚐",
      title: locale === "ru" ? "Комфортный трансфер" : locale === "hy" ? "Հարմարավետ տրանսֆեր" : "Comfort Transfer",
      desc: locale === "ru" ? "Mercedes Sprinter с панорамными окнами и климат-контролем" : locale === "hy" ? "Mercedes Sprinter օդորակիչով" : "Modern Mercedes Sprinter with A/C",
    },
    {
      icon: "🗣️",
      title: locale === "ru" ? "Лицензированный гид" : locale === "hy" ? "Արտոնագրված գիդ" : "Licensed Guide",
      desc: locale === "ru" ? "Увлекательные экскурсии на русском, армянском или английском" : locale === "hy" ? "Պրոֆեսիոնալ էքսկուրսավար" : "Fluent in Russian, Armenian & English",
    },
    {
      icon: "🍷",
      title: locale === "ru" ? "Дегустации и мастер-класс" : locale === "hy" ? "Համտես և վարպետաց դաս" : "Tasting & Masterclass",
      desc: locale === "ru" ? "Дегустация армянских вин в Арени и выпечка горячего лаваша" : locale === "hy" ? "Արենիի գինի և լավաշի թխում" : "Areni wine tasting & fresh lavash baking",
    },
    {
      icon: "🛡️",
      title: locale === "ru" ? "Без скрытых доплат" : locale === "hy" ? "Առանց հավելյալ վճարների" : "Zero Hidden Fees",
      desc: locale === "ru" ? "Все остановки, транспортные сборы и питьевая вода включены" : locale === "hy" ? "Բոլոր կանգառները ներառված են" : "All toll fees, stops & bottled water included",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full overflow-hidden bg-[#242323] py-24 sm:py-36 text-[#FCFCF7]" id="special-offers">
        {/* Ambient Brand Glows */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#C7FF32]/12 blur-[160px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#586EFF]/18 blur-[170px]" />

        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 sm:mb-20 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#C7FF32] shadow-[0_0_20px_rgba(199,255,50,0.15)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
              <span>{badge}</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#FCFCF7] sm:text-5xl lg:text-6xl drop-shadow-md">
              {locale === "ru" ? "Эксклюзивный пакет путешествий" : locale === "hy" ? "Բացառիկ ճամփորդական փաթեթ" : "Exclusive Armenia Travel Bundle"}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#FCFCF7]/75 max-w-2xl mx-auto">
              {locale === "ru"
                ? "Два главных направления страны в одном комбо-предложении по специальной цене"
                : "Two iconic routes across Armenia in one curated bundle at an exceptional rate"}
            </p>
          </motion.div>

          {/* 9:16 Vertical Card + Editorial Breakdown Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT COLUMN: Statuesque 9:16 Luxury Poster Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-[420px] rounded-[2.5rem] p-2 bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] border border-white/15 backdrop-blur-md">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-black group shadow-inner">
                  {/* High Definition Visual */}
                  <Image
                    src="/images/offer-khor-virap.jpg"
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    priority
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlays for cinematic depth and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />

                  {/* Top Branding Pill inside Poster */}
                  <div className="absolute top-5 inset-x-5 flex items-center justify-between gap-2 z-10">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-[#C7FF32] border border-[#C7FF32]/40 shadow-lg">
                      AMARAS TOUR
                    </span>
                    <span className="rounded-full bg-[#586EFF] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                      -28% СКИДКА
                    </span>
                  </div>

                  {/* Mid Floating Badges */}
                  <div className="absolute top-20 left-5 right-5 space-y-2 z-10">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                      <span>🏔️</span>
                      <span>{leftRoute}</span>
                    </div>
                    <br />
                    <div className="inline-flex items-center gap-2 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                      <span>🌊</span>
                      <span>{rightRoute}</span>
                    </div>
                  </div>

                  {/* Bottom Grand Callout inside 9:16 Card */}
                  <div className="absolute bottom-6 inset-x-6 z-10 space-y-3 text-left">
                    <span className="inline-block rounded-full bg-[#C7FF32]/20 border border-[#C7FF32]/60 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                      2 ЭКСКУРСИИ ПО ЦЕНЕ ОДНОЙ
                    </span>

                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                        39 900 ֏
                      </span>
                      {offer.priceOldAmd && (
                        <span className="text-base font-bold text-white/50 line-through">
                          {formatPrice(offer.priceOldAmd)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#FCFCF7]/80 font-medium leading-relaxed">
                      {locale === "ru"
                        ? "Хор Вирап, Арарат, Арени, Джермук + Гарни, Симфония камней, Севан"
                        : "Khor Virap, Areni, Jermuk + Garni, Symphony of Stones, Sevan"}
                    </p>

                    <a
                      href={offer.linkHref}
                      target={offer.linkHref.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#C7FF32] py-3 text-xs font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>{primaryBtn}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Large Editorial Details & Route Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-7 flex flex-col justify-center space-y-8"
            >
              {/* Massive Title */}
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                  {locale === "ru" ? "Главная акция сезона" : locale === "hy" ? "Սեզոնի գլխավոր ակցիան" : "Top Seasonal Special"}
                </span>
                <h3 className="mt-2 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.05]">
                  {title}
                </h3>
                <p className="mt-4 text-lg sm:text-xl text-[#FCFCF7]/85 font-normal leading-relaxed max-w-xl">
                  {subtitle}
                </p>
              </div>

              {/* Massive Price Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#312F2F] to-[#2B2929] border border-white/15 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                    {priceHighlight}
                  </span>
                  <div className="mt-1 flex items-baseline gap-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                      39 900 ֏
                    </span>
                    {offer.priceOldAmd && (
                      <span className="text-lg sm:text-xl font-bold text-white/50 line-through">
                        {formatPrice(offer.priceOldAmd)}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block text-xs font-semibold text-white/70">
                    {locale === "ru" ? "Фиксированная стоимость с человека за обе экскурсии" : "Fixed price per person for both day tours"}
                  </span>
                </div>

                <div className="shrink-0 rounded-2xl bg-[#C7FF32]/15 border border-[#C7FF32]/40 px-4 py-2 text-center">
                  <span className="block text-xl font-black text-[#C7FF32]">-28%</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">ЭКОНОМИЯ 15 100 ֏</span>
                </div>
              </div>

              {/* Two Detailed Route Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Route 1 */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-[#C7FF32]/50 hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏔️</span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                      День 1 • Южное направление
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-black text-white">{leftRoute}</h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#FCFCF7]/75 leading-relaxed">
                    {locale === "ru"
                      ? "Монастырь Хор Вирап у подножия Арарата, дегустация вин в Арени, пещера Птиц, ущелье Нораванк и курортный Джермук с водопадом."
                      : "Khor Virap at Mount Ararat, Areni wineries, Birds cave, Noravank canyon and Jermuk waterfall."}
                  </p>
                </div>

                {/* Route 2 */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-[#586EFF]/50 hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌊</span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#586EFF]">
                      День 2 • Классика Армении
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-black text-white">{rightRoute}</h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#FCFCF7]/75 leading-relaxed">
                    {locale === "ru"
                      ? "Языческий храм Гарни, Симфония камней, скальный монастырь Гегард (ЮНЕСКО), мастер-класс выпечки лаваша и высокогорное озеро Севан."
                      : "Garni Temple, Symphony of Stones, Geghard cave monastery (UNESCO), lavash baking and Lake Sevan."}
                  </p>
                </div>
              </div>

              {/* Inclusions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/10">
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{item.title}</h5>
                      <p className="text-[11px] text-white/70 leading-snug mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={offer.linkHref}
                  target={offer.linkHref.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-full bg-[#C7FF32] px-9 py-4.5 text-base font-black uppercase tracking-wider text-[#312F2F] shadow-[0_10px_35px_rgba(199,255,50,0.4)] transition-all hover:bg-[#b8f226]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>{primaryBtn}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#312F2F] text-xs font-black text-[#C7FF32]">
                    →
                  </span>
                </motion.a>

                <Link
                  href={offer.secondaryLinkHref || `/${locale}/tours`}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-[#586EFF] hover:text-[#586EFF]"
                >
                  <span>{secondaryBtn}</span>
                  <span>›</span>
                </Link>
              </div>

              {valid && (
                <div className="text-xs font-medium text-white/50">
                  ⚡ {valid}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
