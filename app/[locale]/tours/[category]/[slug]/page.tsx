import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import PackageIncludes from "@/components/PackageIncludes";
import { CalendarIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { tours as defaultTours, discountPercent, formatPrice } from "@/lib/tours";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale; category: string; slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const { tours } = await getContent();
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return {};
  const meta = pageMetadata(
    locale,
    `tours/${category}/${slug}`,
    tour.title[locale],
    tour.description[locale]
  );
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [tour.image] },
    twitter: { ...meta.twitter, images: [tour.image] },
  };
}

export default async function TourPage({ params }: Props) {
  const { locale, category, slug } = await params;
  const { dicts, tours, categories } = await getContent();
  const tour = tours.find((t) => t.slug === slug);
  // Each tour lives under its own categories only, so the same tour is never
  // served from two different URLs.
  if (!tour || !tour.categories.includes(category)) notFound();
  const dict = dicts[locale];
  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  const isPackage = Boolean(tour.days);
  const discount = discountPercent(tour);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
      <FadeIn>
        <Link
          href={`/${locale}/tours/${category}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← {catTitle(category)}
        </Link>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold md:text-5xl">
          {tour.title[locale]}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          {tour.categories.map((id) => (
            <span
              key={id}
              className="rounded-full bg-deep px-3 py-1 font-bold text-white"
            >
              {catTitle(id)}
            </span>
          ))}
          {isPackage ? (
            <>
              <span className="flex items-center gap-1.5 rounded-full border border-deep/15 bg-surface px-3 py-1 font-extrabold text-deep">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {tour.days} {dict.tours.days}
                {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/20 px-3 py-1 font-bold text-deep">
                {dict.pkg.allInclusive}
              </span>
            </>
          ) : (
            <>
              <span className="text-muted">
                {dict.tour.departure}: {tour.departure}
              </span>
              <span className="text-muted">
                {dict.tour.duration}: {tour.durationHours} {dict.tours.hours}
              </span>
            </>
          )}
          <span className="flex items-baseline gap-1.5 rounded-full bg-accent px-3 py-1 text-deep">
            {tour.priceOldAmd && (
              <s className="text-xs font-semibold text-deep/60">
                {formatPrice(tour.priceOldAmd)}
              </s>
            )}
            <span className="font-extrabold">
              {dict.tours.from} {formatPrice(tour.priceFromAmd)}
            </span>
          </span>
          {discount !== null && (
            <span className="rounded-full bg-deep px-3 py-1 font-extrabold text-accent">
              −{discount}%
            </span>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <FadeIn>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={tour.image}
                alt={tour.title[locale]}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              {tour.about[locale].split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          {tour.itinerary?.length ? (
            <FadeIn delay={0.15}>
              <section className="mt-10">
                <h2 className="text-2xl font-extrabold md:text-3xl">
                  {dict.tour.itinerary}
                </h2>
                <ol className="mt-6 space-y-6">
                  {tour.itinerary.map((entry) => (
                    <li
                      key={entry.day}
                      className="rounded-2xl border border-black/5 bg-surface p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                          {dict.tour.day} {entry.day}
                        </span>
                        <h3 className="text-lg font-bold">
                          {entry.title[locale]}
                        </h3>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {entry.items[locale].map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>
            </FadeIn>
          ) : null}
        </div>

        <FadeIn delay={0.15} className="md:col-span-2">
          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-[0_1px_3px_rgba(16,24,40,.08)] md:sticky md:top-24">
            <h2 className="text-xl font-extrabold">{dict.tour.route}</h2>
            <ol className="mt-4 space-y-3">
              {tour.destinations[locale].map((stop, i) => (
                <li key={stop} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-extrabold text-accent-dark">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{stop}</span>
                </li>
              ))}
            </ol>

            {isPackage && (
              <div className="mt-6 border-t border-black/5 pt-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-deep">
                  {dict.pkg.includesTitle}
                </h3>
                <PackageIncludes dict={dict} className="mt-3 space-y-3" />
              </div>
            )}

            {tour.priceTiers?.length ? (
              <div className="mt-6 border-t border-black/5 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">
                    {dict.tour.accommodation}
                  </span>
                  <span className="text-xs text-muted">
                    {dict.tour.perPerson}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  {tour.priceTiers.map((tier) => (
                    <div
                      key={tier.stars}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted">
                        {"★".repeat(tier.stars)}
                      </span>
                      <span className="font-extrabold">
                        {formatPrice(tier.amd)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 space-y-1.5 border-t border-black/5 pt-4 text-sm">
              {isPackage ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted">{dict.tour.duration}</span>
                  <span className="font-semibold">
                    {tour.days} {dict.tours.days}
                    {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">{dict.tour.departure}</span>
                    <span className="font-semibold">{tour.departure}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">{dict.tour.duration}</span>
                    <span className="font-semibold">
                      {tour.durationHours} {dict.tours.hours}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted">{dict.tours.from}</span>
                <span className="flex items-baseline gap-2">
                  {tour.priceOldAmd && (
                    <s className="text-xs font-semibold text-muted">
                      {formatPrice(tour.priceOldAmd)}
                    </s>
                  )}
                  <span className="font-extrabold">
                    {formatPrice(tour.priceFromAmd)}
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-4">
              <BookButton
                label={dict.tours.book}
                message={`${dict.tours.bookMessage} ${tour.title[locale]}`}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// Built-in tours are prerendered under each of their categories; tours added
// in /admin render on demand.
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    defaultTours.flatMap((tour) =>
      tour.categories.map((category) => ({ locale, category, slug: tour.slug }))
    )
  );
}
