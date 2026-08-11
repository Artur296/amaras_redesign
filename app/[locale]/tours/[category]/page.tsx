import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import PackageIncludes from "@/components/PackageIncludes";
import TourCard from "@/components/TourCard";
import { CalendarIcon, RouteIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { defaultCategories, packageDayRange } from "@/lib/tours";
import { getContent } from "@/lib/content";

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
  if (!found) notFound();
  const dict = dicts[locale];
  const list = tours.filter((t) => t.categories.includes(category));
  // A listing of multi-day packages needs to say so up front, otherwise it
  // looks like just another list of excursions.
  const range = packageDayRange(list);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
      <FadeIn>
        <Link
          href={`/${locale}/tours`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← {dict.tour.back}
        </Link>
        {range && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-deep px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
              <RouteIcon className="h-4 w-4 text-accent" />
              {dict.pkg.badge}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-deep">
              <CalendarIcon className="h-4 w-4" />
              {range.min === range.max
                ? `${range.min} ${dict.tours.days}`
                : `${range.min}–${range.max} ${dict.tours.days}`}
            </span>
            <span className="rounded-full border border-deep/20 px-3 py-1 text-xs font-extrabold text-deep">
              {dict.pkg.allInclusive}
            </span>
          </div>
        )}
        <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
          {found.title[locale]}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          {found.desc[locale]}
        </p>
      </FadeIn>

      {range && (
        <FadeIn delay={0.05}>
          <section className="mt-8 rounded-2xl border border-black/5 bg-surface p-6 shadow-[0_1px_3px_rgba(16,24,40,.08)]">
            <p className="max-w-3xl text-base leading-relaxed text-muted">
              {dict.pkg.intro}
            </p>
            <h2 className="mt-6 text-sm font-extrabold uppercase tracking-wide text-deep">
              {dict.pkg.includesTitle}
            </h2>
            <PackageIncludes
              dict={dict}
              className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            />
          </section>
        </FadeIn>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    defaultCategories.map((category) => ({ locale, category: category.id }))
  );
}
