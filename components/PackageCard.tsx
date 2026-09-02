import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import { packageIncludes } from "@/components/PackageIncludes";
import { BedIcon, CalendarIcon, RouteIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";
import { discountPercent, formatPrice, tourHref, type Tour } from "@/lib/tours";

// Card for multi-day packages. It deliberately looks different from the
// day-tour card: a package header strip, days/nights instead of a price tag on
// the photo, the day-by-day programme and what the price already covers — so
// nobody mistakes it for a single-day excursion.
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-deep/15 bg-surface shadow-[0_1px_3px_rgba(16,24,40,.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,24,40,.16)]">
      <div className="flex items-center justify-between gap-2 bg-deep px-4 py-2.5 text-white">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide">
          <RouteIcon className="h-4 w-4 text-accent" />
          {dict.pkg.badge}
        </span>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-extrabold text-deep">
          {dict.pkg.allInclusive}
        </span>
      </div>

      <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        {discount !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-deep px-3 py-1.5 text-sm font-extrabold text-accent">
            −{discount}%
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-deep">
          <CalendarIcon className="h-4 w-4 text-primary" />
          {tour.days} {dict.tours.days}
          {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold">
          <Link href={href} className="transition-colors hover:text-primary">
            {tour.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {tour.description[locale]}
        </p>

        {days.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">
              {dict.pkg.program}
            </span>
            <span className="flex flex-wrap gap-1">
              {days.map((day) => (
                <span
                  key={day}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary"
                >
                  {day}
                </span>
              ))}
            </span>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-bg p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted">
            {dict.pkg.includesTitle}
          </p>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
            {includes.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-2 text-xs font-semibold leading-snug"
              >
                <Icon className="mt-px h-4 w-4 shrink-0 text-primary" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-black/5 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            {dict.tours.from} · {dict.pkg.perPerson}
          </p>
          <p className="mt-0.5 flex items-baseline gap-2">
            {tour.priceOldAmd && (
              <s className="text-sm font-semibold text-muted">
                {formatPrice(tour.priceOldAmd)}
              </s>
            )}
            <span className="text-2xl font-extrabold text-deep">
              {formatPrice(tour.priceFromAmd)}
            </span>
          </p>
          {stars.length > 0 && (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted">
              <BedIcon className="h-4 w-4 text-primary" />
              {stars.join(" / ")}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <BookButton
            label={dict.tours.book}
            message={`${dict.tours.bookMessage} ${tour.title[locale]}`}
          />
          <Link
            href={href}
            className="flex w-full items-center justify-center rounded-full border border-deep/20 px-4 py-2 text-sm font-bold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white"
          >
            {dict.pkg.viewProgram}
          </Link>
        </div>
      </div>
    </article>
  );
}
