import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import TourListingClient from "@/components/TourListingClient";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { isPackageTour, publicCategories } from "@/lib/tours";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema, generateTourListSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { dicts } = await getContent();
  const dict = dicts[locale];
  return pageMetadata(
    locale,
    "tours",
    dict.meta.tours.title,
    dict.meta.tours.description
  );
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, tours, categories: allCategories } = await getContent();
  const categories = publicCategories(allCategories);
  const dict = dicts[locale];
  const dayTours = tours.filter((t) => !isPackageTour(t));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.nav.tours, url: `/${locale}/tours` },
  ]);
  const tourListSchema = generateTourListSchema(
    dayTours,
    locale,
    dict.tours.title
  );

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourListSchema) }}
      />

      {/* Header */}
      <FadeIn>
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
            {locale === "ru" ? "Все экскурсии по Армении" : locale === "hy" ? "Բոլոր էքսկուրսիաները" : "All Armenia Excursions"}
          </span>
          <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-[#312F2F] sm:text-5xl lg:text-6xl">
            {dict.tours.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B6967] sm:text-lg">
            {dict.meta.tours.description}
          </p>
        </div>
      </FadeIn>

      {/* Tour Explorer with Categories & Search */}
      <div className="mt-8 sm:mt-10">
        <TourListingClient
          tours={dayTours}
          categories={categories}
          locale={locale}
          dict={dict}
        />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

