import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import PackageIncludes from "@/components/PackageIncludes";
import PackageCard from "@/components/PackageCard";
import { CalendarIcon, RouteIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { findPackagesCategory, isPackageTour, packageDayRange } from "@/lib/tours";
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
    "tour-packages",
    dict.meta.packages.title,
    dict.meta.packages.description
  );
}

export default async function TourPackagesPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, tours, categories } = await getContent();
  const dict = dicts[locale];
  const section = findPackagesCategory(categories);
  const list = tours.filter(isPackageTour);
  const range = packageDayRange(list);

  const title = section?.title[locale] ?? dict.nav.packages;
  const desc = section?.desc[locale] ?? dict.meta.packages.description;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: title, url: `/${locale}/tour-packages` },
  ]);
  const tourListSchema = generateTourListSchema(list, locale, title);

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

      {/* Breadcrumb */}
      <FadeIn>
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B6967]">
          <Link href={`/${locale}`} className="hover:text-[#586EFF]">
            {dict.nav.home}
          </Link>
          <span>/</span>
          <span className="text-[#312F2F]">{title}</span>
        </div>

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
          <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-[#312F2F] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B6967] sm:text-lg">{desc}</p>
        </div>
      </FadeIn>

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

      <div className="mt-12">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B6967]">
          <span>
            {locale === "ru"
              ? (list.length === 1
                  ? "Доступна 1 программа"
                  : list.length >= 2 && list.length <= 4
                  ? `Доступно ${list.length} программы`
                  : `Доступно ${list.length} программ`)
              : locale === "hy"
              ? `Հասանելի է ${list.length} տուր-փաթեթ`
              : `${list.length} ${list.length === 1 ? "tour package" : "tour packages"} available`}
          </span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tour, i) => (
            <FadeIn key={tour.slug} delay={i * 0.08} className="h-full">
              <PackageCard
                tour={tour}
                locale={locale}
                dict={dict}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

