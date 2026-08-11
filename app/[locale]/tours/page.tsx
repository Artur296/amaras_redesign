import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { CalendarIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { packageDayRange } from "@/lib/tours";
import { getContent } from "@/lib/content";

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
  const { dicts, tours, categories } = await getContent();
  const dict = dicts[locale];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
      <FadeIn>
        <h1 className="text-4xl font-extrabold md:text-5xl">
          {dict.tours.title}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          {dict.meta.tours.description}
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {categories.map((category, i) => {
          // Categories made of multi-day packages say so on the tile itself.
          const range = packageDayRange(
            tours.filter((t) => t.categories.includes(category.id))
          );
          return (
            <FadeIn key={category.id} delay={i * 0.06} className="h-full">
              <Link
                href={`/${locale}/tours/${category.id}`}
                className="group block h-full overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-[0_1px_3px_rgba(16,24,40,.08)] transition-colors hover:border-accent/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title[locale]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${category.imagePosition ?? "object-center"}`}
                  />
                  {range && (
                    <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="flex items-center gap-1.5 rounded-full bg-deep/90 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                        <CalendarIcon className="h-3.5 w-3.5 text-accent" />
                        {range.min === range.max
                          ? `${range.min} ${dict.tours.days}`
                          : `${range.min}–${range.max} ${dict.tours.days}`}
                      </span>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-deep">
                        {dict.pkg.allInclusive}
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-extrabold">
                    {category.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {category.desc[locale]}
                  </p>
                  <span className="mt-3 inline-block text-sm font-bold text-primary">
                    {dict.tours.viewAll} →
                  </span>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
