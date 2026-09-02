import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetail from "@/components/TourDetail";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import {
  tours as defaultTours,
  isPackageTour,
  PACKAGES_CATEGORY_ID,
} from "@/lib/tours";
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
  // served from two different URLs. Packages have their own section, so they
  // are not served from here at all — next.config redirects those paths.
  if (!tour || !tour.categories.includes(category)) notFound();
  if (category === PACKAGES_CATEGORY_ID || isPackageTour(tour)) notFound();
  const dict = dicts[locale];
  const catTitle =
    categories.find((c) => c.id === category)?.title[locale] ?? category;

  return (
    <TourDetail
      tour={tour}
      locale={locale}
      dict={dict}
      categories={categories}
      backHref={`/${locale}/tours/${category}`}
      backLabel={catTitle}
    />
  );
}

// Built-in tours are prerendered under each of their categories; tours added
// in /admin render on demand. Packages are excluded — they are prerendered by
// the /tour-packages section instead.
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    defaultTours
      .filter((tour) => !isPackageTour(tour))
      .flatMap((tour) =>
        tour.categories.map((category) => ({ locale, category, slug: tour.slug }))
      )
  );
}
