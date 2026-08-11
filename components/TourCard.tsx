import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import PackageCard from "@/components/PackageCard";
import type { Dict, Locale } from "@/lib/i18n";
import { formatPrice, type Category, type Tour } from "@/lib/tours";

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
  // Multi-day packages get their own card so they never read as a day tour.
  if (tour.days) return <PackageCard tour={tour} locale={locale} dict={dict} />;

  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-[0_1px_3px_rgba(16,24,40,.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,24,40,.16)]">
      <Link
        href={`/${locale}/tours/${tour.categories[0]}/${tour.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {tour.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-deep/80 px-3 py-1 text-xs font-bold text-white backdrop-blur"
            >
              {catTitle(category)}
            </span>
          ))}
        </span>
        <span className="absolute bottom-3 right-3 flex items-baseline gap-1.5 rounded-full bg-accent px-3 py-1 text-deep">
          {tour.priceOldAmd && (
            <s className="text-xs font-semibold text-deep/60">
              {formatPrice(tour.priceOldAmd)}
            </s>
          )}
          <span className="text-sm font-extrabold">
            {dict.tours.from} {formatPrice(tour.priceFromAmd)}
          </span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold">
          <Link
            href={`/${locale}/tours/${tour.categories[0]}/${tour.slug}`}
            className="transition-colors hover:text-primary"
          >
            {tour.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {tour.description[locale]}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-muted">
            {tour.days
              ? `${tour.days} ${dict.tours.days}`
              : `${tour.durationHours} ${dict.tours.hours}`}
          </span>
          <BookButton
            label={dict.tours.book}
            message={`${dict.tours.bookMessage} ${tour.title[locale]}`}
          />
        </div>
      </div>
    </article>
  );
}
