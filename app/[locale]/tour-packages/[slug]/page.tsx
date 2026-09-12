import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetail from "@/components/TourDetail";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import {
  tours as defaultTours,
  findPackagesCategory,
  isPackageTour,
} from "@/lib/tours";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { tours } = await getContent();
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return {};
  const meta = pageMetadata(
    locale,
    `tour-packages/${slug}`,
    tour.title[locale],
    tour.description[locale]
  );
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [tour.image] },
    twitter: { ...meta.twitter, images: [tour.image] },
  };
}

export default async function TourPackagePage({ params }: Props) {
  const { locale, slug } = await params;
  const { dicts, tours, categories, site } = await getContent();
  const tour = tours.find((t) => t.slug === slug);
  // Only packages are served here, so a tour is never reachable from both this
  // section and /tours/<category>/<slug>.
  if (!tour || !isPackageTour(tour)) notFound();
  const dict = dicts[locale];
  const backLabel =
    findPackagesCategory(categories)?.title[locale] ?? dict.nav.packages;

  return (
    <TourDetail
      tour={tour}
      locale={locale}
      dict={dict}
      categories={categories}
      backHref={`/${locale}/tour-packages`}
      backLabel={backLabel}
      phone={site.phone}
    />
  );
}

// Built-in packages are prerendered; ones added in /admin render on demand.
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    defaultTours
      .filter(isPackageTour)
      .map((tour) => ({ locale, slug: tour.slug }))
  );
}
