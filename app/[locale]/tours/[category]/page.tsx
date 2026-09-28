import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import PackageIncludes from "@/components/PackageIncludes";
import TourCard from "@/components/TourCard";
import { CalendarIcon, RouteIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { defaultCategories, packageDayRange, PACKAGES_CATEGORY_ID } from "@/lib/tours";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema, generateTourListSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale; category: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const { categories } = await getContent();
  const found = categories.find((c) => c.id === category);
  if (!found) return {};
  return pageMetadata(
    locale,
    `tours/${category}`,
    found.title[locale],
    found.desc[locale]
  );
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  const { dicts, tours, categories } = await getContent();
  const found = categories.find((c) => c.id === category);

  if (!found || category === PACKAGES_CATEGORY_ID) notFound();
  const dict = dicts[locale];
  const list = tours.filter((t) => t.categories.includes(category));
  const range = packageDayRange(list);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.nav.tours, url: `/${locale}/tours` },
    { name: found.title[locale], url: `/${locale}/tours/${category}` },
  ]);
  const tourListSchema = generateTourListSchema(
    list,
    locale,
    found.title[locale]
  );

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-12 md:py-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourListSchema) }}
      />

      {/* Breadcrumb & Navigation */}
      <FadeIn>
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B6967]">
          <Link href={`/${locale}`} className="hover:text-[#586EFF]">
            {dict.nav.home}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/tours`} className="hover:text-[#586EFF]">
            {dict.nav.tours}
          </Link>
          <span>/</span>
          <span className="text-[#312F2F]">{found.title[locale]}</span>
        </div>

        {/* Category Header */}
        <div className="mt-6 max-w-3xl">
          {range && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-full bg-[#312F2F] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                <RouteIcon className="h-4 w-4" />
                {dict.pkg.badge}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black text-[#312F2F]">
                <CalendarIcon className="h-4 w-4" />
                {range.min === range.max
                  ? `${range.min} ${dict.tours.days}`
                  : `${range.min}–${range.max} ${dict.tours.days}`}
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-black text-[#312F2F]">
                {dict.pkg.allInclusive}
              </span>
            </div>
          )}

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-[#312F2F] sm:text-5xl">
            {found.title[locale]}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B6967] sm:text-lg">
            {found.desc[locale]}
          </p>
        </div>
      </FadeIn>

      {/* Package Inclusions if multi-day */}
      {range && (
        <FadeIn delay={0.05}>
          <section className="mt-10 rounded-3xl border border-[#EAE9E0] bg-white p-8 shadow-sm">
            <p className="max-w-3xl text-sm leading-relaxed text-[#6B6967]">
              {dict.pkg.intro}
            </p>
            <h2 className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#586EFF]">
              {dict.pkg.includesTitle}
            </h2>
            <PackageIncludes
              dict={dict}
              className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            />
          </section>
        </FadeIn>
      )}

      {/* Tours Grid */}
      <div className="mt-12">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B6967]">
          <span>
            {locale === "ru"
              ? `Всего маршрутов: ${list.length}`
              : locale === "hy"
              ? `Ընդհանուր: ${list.length} երթուղի`
              : `Total tours: ${list.length}`}
          </span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tour, i) => (
            <FadeIn key={tour.slug} delay={i * 0.06} className="h-full">
              <TourCard
                tour={tour}
                locale={locale}
                dict={dict}
                categories={categories}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    defaultCategories
      .filter((category) => category.id !== PACKAGES_CATEGORY_ID)
      .map((category) => ({ locale, category: category.id }))
  );
}

