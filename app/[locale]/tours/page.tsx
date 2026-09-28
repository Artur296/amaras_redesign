import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import TourListingClient from "@/components/TourListingClient";
import { CalendarIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { isPackageTour, packageDayRange, publicCategories } from "@/lib/tours";
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
  const { dicts, tours, categories: allCategories } = await getContent();
  const categories = publicCategories(allCategories);
  const dict = dicts[locale];
  const dayTours = tours.filter((t) => !isPackageTour(t));

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-12 md:py-16">
      {/* Header */}
      <FadeIn>
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
            {locale === "ru" ? "Каталог экскурсий" : locale === "hy" ? "Էքսկուրսիաների կատալոգ" : "Tour Directory"}
          </span>
          <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-[#312F2F] sm:text-5xl lg:text-6xl">
            {dict.tours.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B6967] sm:text-lg">
            {dict.meta.tours.description}
          </p>
        </div>
      </FadeIn>

      {/* Categories Cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => {
          const range = packageDayRange(
            tours.filter((t) => t.categories.includes(category.id))
          );
          return (
            <FadeIn key={category.id} delay={i * 0.06} className="h-full">
              <Link
                href={`/${locale}/tours/${category.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#EAE9E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#586EFF]/50 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                  <Image
                    src={category.image}
                    alt={category.title[locale]}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${category.imagePosition ?? "object-center"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {range && (
                    <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="flex items-center gap-1.5 rounded-full bg-[#312F2F]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        <CalendarIcon className="h-3.5 w-3.5 text-[#C7FF32]" />
                        {range.min === range.max
                          ? `${range.min} ${dict.tours.days}`
                          : `${range.min}–${range.max} ${dict.tours.days}`}
                      </span>
                      <span className="rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black text-[#312F2F]">
                        {dict.pkg.allInclusive}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-black text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
                    {category.title[locale]}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#6B6967]">
                    {category.desc[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#586EFF]">
                    {dict.tours.viewAll} →
                  </span>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>

      {/* Interactive Tour Explorer */}
      <div className="mt-16 border-t border-[#EAE9E0] pt-12">
        <FadeIn>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#586EFF]">
              {locale === "ru" ? "Все экскурсии по Армении" : locale === "hy" ? "Բոլոր էքսկուրսիաները" : "All Armenia Excursions"}
            </span>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl">
              {locale === "ru" ? "Выберите свой маршрут" : locale === "hy" ? "Ընտրեք ձեր երթուղին" : "Choose Your Journey"}
            </h2>
          </div>
        </FadeIn>

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

