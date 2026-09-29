import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import PackageCard from "@/components/PackageCard";
import type { Dict, Locale } from "@/lib/i18n";
import {
  discountPercent,
  formatPrice,
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

  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  const href = tourHref(locale, tour);
  const discount = discountPercent(tour);
  const durationText = tour.days
    ? `${tour.days} ${dict.tours.days}${tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}`
    : `${tour.durationHours} ${dict.tours.hours}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#EAE9E0] bg-white shadow-[0_2px_12px_rgba(49,47,47,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#586EFF]/40 hover:shadow-[0_16px_36px_rgba(49,47,47,0.12)]">
      {/* Tour Image with Badges */}
      <Link href={href} className="relative block aspect-[16/11] overflow-hidden bg-black/5">
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges (Category & Discount) */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tour.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-[#312F2F]/85 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FCFCF7] backdrop-blur-md"
              >
                {catTitle(category)}
              </span>
            ))}
          </div>

          {tour.bookingDisabled ? (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-white shadow-sm">
              {locale === "ru" ? "Даты уточняются" : locale === "hy" ? "Ճշտել օրերը" : "Dates pending"}
            </span>
          ) : discount !== null ? (
            <span className="rounded-full bg-[#C7FF32] px-2.5 py-1 text-xs font-black text-[#312F2F] shadow-sm">
              −{discount}%
            </span>
          ) : null}
        </div>

        {/* Bottom Tag on image (Duration & Rating) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">
            <span>⏱</span> {durationText}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[#C7FF32] backdrop-blur-md">
            <span>★</span> 4.9
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-black leading-snug text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
          <Link href={href} className="line-clamp-2">
            {tour.title[locale]}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#6B6967]">
          {tour.description[locale]}
        </p>

        {/* Key Tour Specs / Inclusions */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#EAE9E0] pt-3 text-xs text-[#6B6967]">
          <span className="flex items-center gap-1">
            <span>🚐</span> {tour.departure ? `${dict.tour.departure}: ${tour.departure}` : (locale === "ru" ? "Комфортный трансфер" : "Comfort transfer")}
          </span>
          <span className="flex items-center gap-1">
            <span>🗣</span> RU • HY • EN
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#EAE9E0] pt-4">
          <div>
            {hasPrice(tour) ? (
              <>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6B6967]">
                  {dict.tours.from}
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  {tour.priceOldAmd && (
                    <s className="text-xs font-bold text-[#6B6967]/70">
                      {formatPrice(tour.priceOldAmd)}
                    </s>
                  )}
                  <span className="text-xl font-black text-[#312F2F]">
                    {formatPrice(tour.priceFromAmd)}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6B6967]">
                  {locale === "ru" ? "Формат" : locale === "hy" ? "Ձևաչափ" : "Format"}
                </span>
                <span className="mt-0.5 block text-base font-black text-[#586EFF]">
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
              message={
                tour.bookingDisabled
                  ? (locale === "ru"
                      ? `Здравствуйте! Подскажите, когда будут свободные даты на тур: ${tour.title[locale]}`
                      : locale === "hy"
                      ? `Բարև ձեզ: Կասե՞ք, երբ կլինեն ազատ օրեր տուրի համար՝ ${tour.title[locale]}`
                      : `Hello! Could you let me know upcoming available dates for: ${tour.title[locale]}`)
                  : `${dict.tours.bookMessage} ${tour.title[locale]}`
              }
              variant={tour.bookingDisabled ? "dark" : "primary"}
              size="sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

