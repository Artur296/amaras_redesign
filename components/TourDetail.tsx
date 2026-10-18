import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import PackageIncludes from "@/components/PackageIncludes";
import TourInfo from "@/components/TourInfo";
import TourGallery from "@/components/TourGallery";
import CopyCodeBadge from "@/components/CopyCodeBadge";
import { CalendarIcon, PhoneIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { generateTourDetailSchema, generateBreadcrumbSchema } from "@/lib/schema";
import {
  discountPercent,
  formatPrice,
  getTourCode,
  getTourGroupSize,
  getTourWhatToBring,
  getTourDressCode,
  hasPrice,
  isPackageTour,
  tourPath,
  type Category,
  type Tour,
} from "@/lib/tours";

export default function TourDetail({
  tour,
  locale,
  dict,
  categories,
  backHref,
  backLabel,
  phone,
}: {
  tour: Tour;
  locale: Locale;
  dict: Dict;
  categories: Category[];
  backHref: string;
  backLabel: string;
  phone: string;
}) {
  const code = getTourCode(tour);
  const groupSize = getTourGroupSize(tour, locale);
  const whatToBring = getTourWhatToBring(tour, locale);
  const dressCode = getTourDressCode(tour, locale);
  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  const isPackage = isPackageTour(tour);
  const discount = discountPercent(tour);
  const duration = tour.days
    ? `${tour.days} ${dict.tours.days}${tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}`
    : `${tour.durationHours} ${dict.tours.hours}`;


  const tourSchema = generateTourDetailSchema({
    tour,
    locale,
    site,
    categoryTitle: backLabel,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: backLabel, url: backHref },
    { name: tour.title[locale], url: `/${locale}${tourPath(tour)}` },
  ]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 sm:px-6 pt-4 pb-28 sm:py-8 md:py-16">
      {/* Schema.org Structured Data for SEO Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation - single-line scroll on mobile to prevent awkward line breaks */}
      <FadeIn>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6967] overflow-x-auto whitespace-nowrap scrollbar-none py-1"
        >
          <Link href={`/${locale}`} className="hover:text-[#586EFF] shrink-0 transition-colors">
            {dict.nav.home}
          </Link>
          <span className="text-[#6B6967]/40 shrink-0">/</span>
          <Link href={backHref} className="hover:text-[#586EFF] shrink-0 transition-colors">
            {backLabel}
          </Link>
          <span className="text-[#6B6967]/40 shrink-0">/</span>
          <span className="text-[#312F2F] font-bold shrink-0">
            {tour.title[locale]}
          </span>
        </nav>

        {/* Tour Header */}
        <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Interactive Tour Code Chip */}
            <CopyCodeBadge code={code} locale={locale} />

            {tour.categories.map((id) => (
              <span
                key={id}
                className="rounded-full bg-[#312F2F] px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C7FF32]"
              >
                {catTitle(id)}
              </span>
            ))}

            {discount !== null && (
              <span className="rounded-full bg-[#C7FF32] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-[#312F2F] shadow-xs">
                −{discount}% {locale === "ru" ? "СКИДКА" : locale === "hy" ? "ԶԵՂՉ" : "OFF"}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full bg-white border border-[#EAE9E0] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#312F2F] shadow-xs">
              <span className="text-amber-500">★</span> 5.0 (120+ {locale === "ru" ? "отзывов" : "reviews"})
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#312F2F] leading-snug sm:leading-tight">
            {tour.title[locale]}
          </h1>

          {/* Quick specs bar - styled chip badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-[#6B6967]">
            {isPackage ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#586EFF]/10 px-3 py-1 text-xs font-bold text-[#586EFF]">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {tour.days} {dict.tours.days}
                  {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-[#312F2F] shadow-xs">
                  <svg className="w-3.5 h-3.5 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{locale === "ru" ? "Группа" : locale === "hy" ? "Խումբ" : "Group"}: <b className="text-[#312F2F]">{groupSize}</b></span>
                </span>
              </>
            ) : (
              <>
                {tour.departure && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-[#312F2F] shadow-xs">
                    <svg className="w-3.5 h-3.5 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{dict.tour.departure}: <b className="text-[#312F2F]">{tour.departure}</b></span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-[#312F2F] shadow-xs">
                  <svg className="w-3.5 h-3.5 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{dict.tour.duration}: <b className="text-[#312F2F]">{duration}</b></span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-[#312F2F] shadow-xs">
                  <svg className="w-3.5 h-3.5 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{locale === "ru" ? "Группа" : locale === "hy" ? "Խումբ" : "Group"}: <b className="text-[#312F2F]">{groupSize}</b></span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-[#312F2F] shadow-xs">
                  <svg className="w-3.5 h-3.5 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{locale === "ru" ? "Выезд из Еревана" : locale === "hy" ? "Մեկնում Երևանից" : "From Yerevan"}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Main Grid: Details + Sticky Booking Card */}
      <div className="mt-6 sm:mt-10 grid items-start gap-8 lg:gap-12 lg:grid-cols-12">
        {/* Left Column: Image, Story, Route, Itinerary, Info */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-10">
          {/* Main Hero Gallery / Slideshow */}
          <FadeIn>
            <TourGallery
              images={
                tour.images && tour.images.length > 0
                  ? tour.images
                  : [tour.image]
              }
              title={tour.title[locale]}
            />
          </FadeIn>

          {/* Description & Overview */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl sm:rounded-3xl border border-[#EAE9E0] bg-white p-5 sm:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#312F2F]">
                {locale === "ru" ? "О путешествии" : locale === "hy" ? "Տուրի մասին" : "About this journey"}
              </h2>
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-[#6B6967]">
                {tour.about[locale].split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Practical Checklist: What to Bring, Dress code & Group size */}
          <FadeIn delay={0.12}>
            <div className="rounded-2xl sm:rounded-3xl border border-[#EAE9E0] bg-white p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#C7FF32]/25 text-xl">
                  🎒
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#312F2F]">
                    {locale === "ru"
                      ? "Что взять с собой и как одеться"
                      : locale === "hy"
                      ? "Ի՞նչ վերցնել և ինչպե՞ս հագնվել"
                      : "What to Bring & Dress Code"}
                  </h2>
                  <p className="text-xs text-[#6B6967]">
                    {locale === "ru"
                      ? "Полезные рекомендации для максимального комфорта в поездке"
                      : locale === "hy"
                      ? "Օգտակար խորհուրդներ ուղևորության հարմարավետության համար"
                      : "Helpful travel tips for a smooth and comfortable journey"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* 1. Group Size & Vehicle */}
                <div className="sm:col-span-2 rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#586EFF]/10 text-[#586EFF] text-xl">
                        👥
                      </span>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#6B6967]">
                          {locale === "ru" ? "Количество человек в туре" : locale === "hy" ? "Խմբի մասնակիցների քանակ" : "Group Size & Capacity"}
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#312F2F]">
                          {groupSize}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-xs font-bold text-[#586EFF]">
                      {locale === "ru" ? "Комфортные авто с кондиционером" : locale === "hy" ? "Հարմարավետ մեքենաներ օդորակիչով" : "Air-conditioned vehicles"}
                    </span>
                  </div>
                </div>

                {/* 2. What to bring (checklist) */}
                <div className="rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#EAE9E0]">
                      <span className="text-base">🎒</span>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F]">
                        {locale === "ru" ? "Что взять с собой" : locale === "hy" ? "Ի՞նչ վերցնել հետը" : "What to bring"}
                      </h3>
                    </div>
                    <ul className="mt-3.5 space-y-2.5">
                      {whatToBring.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#312F2F] leading-snug">
                          <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-[#C7FF32]/40 text-[#312F2F] text-[10px] sm:text-xs font-black">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. Dress code & footwear */}
                <div className="rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#EAE9E0]">
                      <span className="text-base">👟</span>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F]">
                        {locale === "ru" ? "Что одеть / Обувь" : locale === "hy" ? "Ի՞նչ հագնել / Կոշիկ" : "Dress code & Footwear"}
                      </h3>
                    </div>
                    <p className="mt-3.5 text-xs sm:text-sm text-[#6B6967] leading-relaxed">
                      {dressCode}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#EAE9E0] text-[11px] text-[#6B6967] flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                      {locale === "ru"
                        ? "В горах погода прохладнее на 5–10°C, чем в Ереване"
                        : locale === "hy"
                        ? "Լեռներում եղանակը 5–10°C ավելի զով է, քան Երևանում"
                        : "Highlands are typically 5–10°C cooler than Yerevan"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Itinerary Timeline */}
          {tour.itinerary?.length ? (
            <FadeIn delay={0.15}>
              <div className="rounded-2xl sm:rounded-3xl border border-[#EAE9E0] bg-white p-5 sm:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#312F2F]">
                  {dict.tour.itinerary}
                </h2>
                <ol className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  {tour.itinerary.map((entry) => (
                    <li
                      key={entry.day}
                      className="rounded-xl sm:rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-4 sm:p-6 transition-all hover:border-[#586EFF]/40"
                    >
                      <div className="flex items-baseline gap-2.5 sm:gap-3">
                        <span className="rounded-full bg-[#586EFF] px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                          {dict.tour.day} {entry.day}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#312F2F]">
                          {entry.title[locale]}
                        </h3>
                      </div>
                      <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
                        {entry.items[locale].map((item, k) => (
                          <li
                            key={k}
                            className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm leading-relaxed text-[#6B6967]"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-[#586EFF]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>
          ) : null}

          {/* Practical Info Panel */}
          {!isPackage && (
            <FadeIn delay={0.2}>
              <TourInfo tour={tour} locale={locale} dict={dict} phone={phone} />
            </FadeIn>
          )}
        </div>

        {/* Right Sticky Column: Route stops & Booking Card */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Main Booking Card */}
          <FadeIn delay={0.15}>
            <div className="rounded-3xl border border-[#EAE9E0] bg-white p-7 shadow-xl">
              {/* Pricing Box */}
              <div className="border-b border-[#EAE9E0] pb-6">
                {hasPrice(tour) ? (
                  <>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6967]">
                      {dict.tours.from}
                    </span>
                    <div className="mt-1 flex items-baseline gap-3">
                      {tour.priceOldAmd && (
                        <s className="text-sm font-bold text-[#6B6967]/60">
                          {formatPrice(tour.priceOldAmd)}
                        </s>
                      )}
                      <span className="text-3xl font-black text-[#312F2F]">
                        {formatPrice(tour.priceFromAmd)}
                      </span>
                      {isPackage && (
                        <span className="text-xs font-bold text-[#6B6967]">
                          / {dict.pkg.perPerson}
                        </span>
                      )}
                    </div>
                    {discount !== null && (
                      <span className="mt-2 inline-block rounded-full bg-[#C7FF32] px-3 py-0.5 text-xs font-black text-[#312F2F]">
                        {locale === "ru"
                          ? `Экономия ${formatPrice(tour.priceOldAmd! - tour.priceFromAmd)}`
                          : locale === "hy"
                          ? `Խնայողություն ${formatPrice(tour.priceOldAmd! - tour.priceFromAmd)}`
                          : `Save ${formatPrice(tour.priceOldAmd! - tour.priceFromAmd)}`}
                      </span>
                    )}
                  </>
                ) : (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6967]">
                      {locale === "ru" ? "Стоимость тура" : locale === "hy" ? "Արժեքը" : "Tour Pricing"}
                    </span>
                    <div className="mt-1">
                      <span className="text-2xl font-black text-[#586EFF]">
                        {dict.tours.onRequest}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#6B6967]">
                      {locale === "ru"
                        ? "Индивидуальный расчет под ваши даты, количество гостей и класс авто."
                        : locale === "hy"
                        ? "Անհատական հաշվարկ՝ ըստ ձեր ամսաթվերի, հյուրերի քանակի և ավտոմեքենայի դասի։"
                        : "Custom quote tailored to your dates, group size, and car class."}
                    </p>
                  </div>
                )}
              </div>

              {/* Key Highlights list */}
              <div className="py-5 space-y-2.5 text-xs font-semibold text-[#6B6967]">
                <div className="flex items-center justify-between">
                  <span>{dict.tour.duration}</span>
                  <span className="font-bold text-[#312F2F]">{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{locale === "ru" ? "Группа" : locale === "hy" ? "Խումբ" : "Group size"}</span>
                  <span className="font-bold text-[#312F2F]">{groupSize}</span>
                </div>
                {tour.departure && (
                  <div className="flex items-center justify-between">
                    <span>{dict.tour.departure}</span>
                    <span className="font-bold text-[#312F2F]">{tour.departure}</span>
                  </div>
                )}
                {tour.meetTime && (
                  <div className="flex items-center justify-between">
                    <span>{dict.info?.meetLabel ?? "Сбор"}</span>
                    <span className="font-bold text-[#586EFF]">{tour.meetTime}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>{locale === "ru" ? "Оплата" : locale === "hy" ? "Վճարում" : "Payment"}</span>
                  <span className="font-bold text-[#312F2F]">
                    {locale === "ru"
                      ? "На месте (без предоплаты)"
                      : locale === "hy"
                      ? "Տեղում (առանց կանխավճարի)"
                      : "On site (zero prepayment)"}
                  </span>
                </div>
              </div>

              {/* CTA Booking Button / Notice */}
              {tour.bookingDisabled ? (
                <div className="pt-2 space-y-3">
                  <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="block text-xs font-black uppercase tracking-wider text-amber-950">
                          {locale === "ru"
                            ? "Бронирование временно приостановлено"
                            : locale === "hy"
                            ? "Ամրագրումը ժամանակավորապես դադարեցված է"
                            : "Booking Temporarily Paused"}
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-amber-900 font-medium">
                          {tour.bookingNotice?.[locale] ||
                            (locale === "ru"
                              ? "На текущие даты запись закрыта. Уточняйте ближайшие свободные места у координатора."
                              : locale === "hy"
                              ? "Ընթացիկ ամսաթվերին տեղերը սպառված են։ Ճշտեք առաջիկա ազատ օրերը կոորդինատորից։"
                              : "Currently fully booked. Please contact our coordinator for upcoming dates.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <BookButton
                    label={
                      locale === "ru"
                        ? "Узнать о доступных датах"
                        : locale === "hy"
                        ? "Ճշտել հասանելի օրերը"
                        : "Check Available Dates"
                    }
                    tourTitle={tour.title[locale]}
                    message={
                      locale === "ru"
                        ? `Здравствуйте! Хочу уточнить доступные даты для тура [Код: ${code}] ${tour.title[locale]}`
                        : locale === "hy"
                        ? `Բարև ձեզ, ցանկանում եմ ճշտել հասանելի օրերը [Կոդ՝ ${code}] ${tour.title[locale]} տուրի համար`
                        : `Hello! I would like to check available dates for [Code: ${code}] ${tour.title[locale]}`
                    }
                    variant="primary"
                    size="lg"
                  />
                </div>
              ) : (
                <div className="pt-2">
                  <BookButton
                    label={dict.tours.book}
                    tourTitle={tour.title[locale]}
                    message={`${dict.tours.bookMessage} [Код: ${code}] ${tour.title[locale]}`}
                    variant="primary"
                    size="lg"
                  />
                </div>
              )}

              {/* Tour Code Callout for Phone / Chat Orders */}
              <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#F6F5EE] border border-[#EAE9E0] px-3.5 py-2.5 text-xs">
                <span className="text-[#6B6967] font-semibold">
                  {locale === "ru" ? "Код тура оператору:" : locale === "hy" ? "Տուրի կոդը օպերատորին․" : "Tour code for operator:"}
                </span>
                <span className="font-mono font-black text-[#312F2F] text-sm bg-white px-2 py-0.5 rounded border border-black/10">
                  #{code}
                </span>
              </div>


              {/* Direct Telephone */}
              <div className="mt-4 text-center">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#6B6967] hover:text-[#586EFF]"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  <span>
                    {locale === "ru"
                      ? "Или позвоните нам:"
                      : locale === "hy"
                      ? "Կամ զանգահարեք մեզ՝"
                      : "Or call directly:"}{" "}
                    {phone}
                  </span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 border-t border-[#EAE9E0] pt-4 space-y-2 text-[11px] text-[#6B6967]">
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span>{" "}
                  {locale === "ru"
                    ? "Моментальное подтверждение в чате"
                    : locale === "hy"
                    ? "Ակնթարթային հաստատում չաթում"
                    : "Instant chat confirmation"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span>{" "}
                  {locale === "ru"
                    ? "Современные комфортабельные авто"
                    : locale === "hy"
                    ? "Ժամանակակից հարմարավետ մեքենաներ"
                    : "Premium modern transport"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span>{" "}
                  {locale === "ru"
                    ? "Бесплатная отмена за 24 часа"
                    : locale === "hy"
                    ? "Անվճար չեղարկում 24 ժամ առաջ"
                    : "Free 24h cancellation"}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Route Stops Card */}
          <FadeIn delay={0.2}>
            <div className="rounded-2xl sm:rounded-3xl border border-[#EAE9E0] bg-white p-5 sm:p-7 shadow-sm">
              <h3 className="text-base font-black uppercase tracking-tight text-[#312F2F]">
                {dict.tour.route}
              </h3>
              <ol className="mt-4 space-y-3.5">
                {tour.destinations[locale].map((stop, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#586EFF] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed text-[#312F2F]">
                      {stop}
                    </span>
                  </li>
                ))}
              </ol>

              {isPackage && (
                <div className="mt-6 border-t border-[#EAE9E0] pt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#586EFF]">
                    {dict.pkg.includesTitle}
                  </h4>
                  <PackageIncludes dict={dict} className="mt-3 space-y-2.5" />
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Mobile Sticky Bottom Floating Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE9E0] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B6967] leading-none">
            {hasPrice(tour)
              ? dict.tours.from
              : locale === "ru"
              ? "Стоимость"
              : locale === "hy"
              ? "Արժեքը"
              : "Price"}
          </span>
          <div className="text-base sm:text-lg font-black text-[#312F2F] leading-tight truncate mt-0.5">
            {hasPrice(tour) ? formatPrice(tour.priceFromAmd) : dict.tours.onRequest}
            {isPackage && hasPrice(tour) && (
              <span className="text-[10px] font-bold text-[#6B6967] ml-1">
                / {dict.pkg.perPerson}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <BookButton
            label={
              tour.bookingDisabled
                ? locale === "ru"
                  ? "Узнать даты"
                  : locale === "hy"
                  ? "Ճշտել օրերը"
                  : "Check Dates"
                : dict.tours.book
            }
            tourTitle={tour.title[locale]}
            message={
              tour.bookingDisabled
                ? locale === "ru"
                  ? `Здравствуйте! Хочу уточнить доступные даты для тура [Код: ${code}] ${tour.title[locale]}`
                  : locale === "hy"
                  ? `Բարև ձեզ, ցանկանում եմ ճշտել հասանելի օրերը [Կոդ՝ ${code}] ${tour.title[locale]} տուրի համար`
                  : `Hello! I would like to check available dates for [Code: ${code}] ${tour.title[locale]}`
                : `${dict.tours.bookMessage} [Код: ${code}] ${tour.title[locale]}`
            }

            variant="primary"
            size="md"
            className="px-4 py-2 text-xs font-bold shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

