import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import PackageCard from "@/components/PackageCard";
import type { Dict, Locale } from "@/lib/i18n";
import {
  discountPercent,
  formatPrice,
  getTourCode,
  getTourGroupSize,
  hasPrice,
  isPackageTour,
  tourHref,
  type Category,
  type Tour,
} from "@/lib/tours";

export default function TourCard({
  tour,
  locale,
  dict,
  categories,
}: {
  tour: Tour;
  locale: Locale;
  dict: Dict;
  categories: Category[];
}) {
  // Multi-day packages get their own card
  if (isPackageTour(tour)) {
    return <PackageCard tour={tour} locale={locale} dict={dict} />;
  }

  const code = getTourCode(tour);
  const groupSize = getTourGroupSize(tour, locale);
  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  const href = tourHref(locale, tour);
  const discount = discountPercent(tour);
  const durationText = tour.days
    ? `${tour.days} ${dict.tours.days}${tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}`
    : `${tour.durationHours} ${dict.tours.hours}`;


  return (
    <article className="group flex h-full flex-col rounded-3xl border border-[#EAE9E0] bg-white shadow-[0_2px_12px_rgba(49,47,47,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#586EFF]/40 hover:shadow-[0_16px_36px_rgba(49,47,47,0.12)]">
      {/* Tour Image with Badges */}
      <Link href={href} className="relative block aspect-[16/11] overflow-hidden rounded-t-[23px] bg-black/5">
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges (Category & Discount) */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-1.5 z-10">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="rounded-full bg-black/85 px-2 py-0.5 text-xs font-black tracking-wider text-[#C7FF32] backdrop-blur-md border border-[#C7FF32]/40 font-mono shadow-sm shrink-0">
              №{code}
            </span>
            {(() => {
              const priority = ["jeep", "mini-group", "group", "individual", "popular", "offers"];
              const primaryCat = priority.find((c) => tour.categories.includes(c)) || tour.categories[0];
              if (!primaryCat) return null;
              return (
                <span
                  key={primaryCat}
                  className="rounded-full bg-[#312F2F]/85 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FCFCF7] backdrop-blur-md shrink-0"
                >
                  {catTitle(primaryCat)}
                </span>
              );
            })()}
          </div>

          {tour.bookingDisabled ? (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-white shadow-sm shrink-0">
              {locale === "ru" ? "Даты уточняются" : locale === "hy" ? "Ճշտել օրերը" : "Dates pending"}
            </span>
          ) : discount !== null ? (
            <span className="rounded-full bg-[#C7FF32] px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-[#312F2F] shadow-sm shrink-0">
              −{discount}%
            </span>
          ) : null}
        </div>

        {/* Bottom Tag on image (Duration, Group & Rating) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1.5 text-xs sm:text-sm font-bold text-white z-10">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 sm:px-3 py-1 backdrop-blur-md text-[11px] sm:text-xs">
              <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{durationText}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md text-[11px] sm:text-xs text-white/90">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{groupSize}</span>
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[#C7FF32] backdrop-blur-md text-[11px] sm:text-xs font-bold shrink-0">
            <svg className="w-3.5 h-3.5 fill-[#C7FF32]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>5.0</span>
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-black leading-snug text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
          <Link href={href} className="line-clamp-2">
            {tour.title[locale]}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm sm:text-base leading-relaxed text-[#4A4846]">
          {tour.description[locale]}
        </p>

        {/* Key Tour Specs / Inclusions */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#EAE9E0] pt-3 text-xs sm:text-sm font-semibold text-[#403e3c]">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v2m-6 8h4m2 0a2 2 0 104 0 2 2 0 00-4 0zm-10 0a2 2 0 104 0 2 2 0 00-4 0zm14-5h-4m4 0l-2-4h-3" />
            </svg>
            <span>{tour.departure ? `${dict.tour.departure}: ${tour.departure}` : (locale === "ru" ? "Комфортный трансфер" : locale === "hy" ? "Հարմարավետ տրանսֆեր" : "Comfort transfer")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#586EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 18h5.498" />
            </svg>
            <span>RU • HY • EN</span>
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#EAE9E0] pt-4">
          <div>
            {hasPrice(tour) ? (
              <>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#4a4846]">
                  {dict.tours.from}
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  {tour.priceOldAmd && (
                    <s className="text-xs font-bold text-[#6B6967]/70">
                      {formatPrice(tour.priceOldAmd)}
                    </s>
                  )}
                  <span className="text-xl sm:text-2xl font-black text-[#2b2929]">
                    {formatPrice(tour.priceFromAmd)}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#4a4846]">
                  {locale === "ru" ? "Формат" : locale === "hy" ? "Ձևաչափ" : "Format"}
                </span>
                <span className="mt-0.5 block text-lg font-black text-[#586EFF]">
                  {dict.tours.onRequest}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <BookButton
              label={
                tour.bookingDisabled
                  ? (locale === "ru" ? "Уточнить" : locale === "hy" ? "Ճշտել" : "Inquire")
                  : dict.tours.book
              }
              tourTitle={tour.title[locale]}
              message={
                tour.bookingDisabled
                  ? (locale === "ru"
                      ? `Здравствуйте! Подскажите, когда будут свободные даты на тур [Код: ${code}] ${tour.title[locale]}`
                      : locale === "hy"
                      ? `Բարև ձեզ, կասե՞ք, երբ կլինեն ազատ օրեր [Կոդ՝ ${code}] ${tour.title[locale]} տուրի համար`
                      : `Hello! Could you let me know upcoming available dates for [Code: ${code}] ${tour.title[locale]}`)
                  : `${dict.tours.bookMessage} [Код: ${code}] ${tour.title[locale]}`
              }
              variant={tour.bookingDisabled ? "dark" : "primary"}
              size="md"
              className="px-4 py-2.5 text-sm font-bold"
            />

          </div>
        </div>
      </div>
    </article>
  );
}

