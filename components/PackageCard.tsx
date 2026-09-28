import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import { packageIncludes } from "@/components/PackageIncludes";
import { BedIcon, CalendarIcon, RouteIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";
import { discountPercent, formatPrice, tourHref, type Tour } from "@/lib/tours";

export default function PackageCard({
  tour,
  locale,
  dict,
}: {
  tour: Tour;
  locale: Locale;
  dict: Dict;
}) {
  const href = tourHref(locale, tour);
  const includes = packageIncludes(dict);
  const days = tour.itinerary?.map((entry) => entry.day) ?? [];
  const stars = tour.priceTiers?.map((tier) => `${tier.stars}★`) ?? [];
  const discount = discountPercent(tour);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#454343] bg-[#312F2F] text-[#FCFCF7] shadow-[0_4px_20px_rgba(49,47,47,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C7FF32]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between gap-2 border-b border-[#454343] bg-[#242323] px-5 py-3">
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
          <RouteIcon className="h-4 w-4" />
          {dict.pkg.badge}
        </span>
        <span className="rounded-full bg-[#C7FF32] px-3 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#312F2F]">
          {dict.pkg.allInclusive}
        </span>
      </div>

      {/* Image with Duration & Discount */}
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-black/20">
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#312F2F] via-transparent to-black/30" />

        {discount !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black text-[#312F2F] shadow-lg">
            −{discount}%
          </span>
        )}

        <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-[#312F2F]/90 px-3.5 py-1.5 text-xs font-black text-[#FCFCF7] backdrop-blur-md">
          <CalendarIcon className="h-3.5 w-3.5 text-[#C7FF32]" />
          {tour.days} {dict.tours.days}
          {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-black leading-snug text-[#FCFCF7] transition-colors group-hover:text-[#C7FF32]">
          <Link href={href} className="line-clamp-2">
            {tour.title[locale]}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#FCFCF7]/80">
          {tour.description[locale]}
        </p>

        {/* Day-by-Day Indicators */}
        {days.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
              {dict.pkg.program}:
            </span>
            <span className="flex flex-wrap gap-1.5">
              {days.map((day) => (
                <span
                  key={day}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] font-black text-[#FCFCF7]"
                >
                  {day}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* Inclusions pill box */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#C7FF32]">
            {dict.pkg.includesTitle}
          </p>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
            {includes.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-2 text-xs font-medium text-[#FCFCF7]/90 leading-snug"
              >
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C7FF32]" />
                <span className="line-clamp-1">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FCFCF7]/70">
              {dict.tours.from} · {dict.pkg.perPerson}
            </span>
            {stars.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#C7FF32]">
                <BedIcon className="h-3.5 w-3.5" />
                {stars.join(" / ")}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            {tour.priceOldAmd && (
              <s className="text-sm font-semibold text-[#FCFCF7]/50">
                {formatPrice(tour.priceOldAmd)}
              </s>
            )}
            <span className="text-2xl font-black text-[#FCFCF7]">
              {formatPrice(tour.priceFromAmd)}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-2.5">
          <BookButton
            label={dict.tours.book}
            message={`${dict.tours.bookMessage} ${tour.title[locale]}`}
            variant="accent"
            size="md"
          />
          <Link
            href={href}
            className="flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FCFCF7] transition-all hover:border-[#C7FF32] hover:text-[#C7FF32]"
          >
            {dict.pkg.viewProgram} →
          </Link>
        </div>
      </div>
    </article>
  );
}

