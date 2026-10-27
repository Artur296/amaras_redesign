import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import TourCard from "@/components/TourCard";
import IndividualTourBuilder from "@/components/individual/IndividualTourBuilder";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    ru: "Конструктор индивидуальных туров по Армении — AMARAS TOUR",
    hy: "Անհատական տուրերի կոնստրուկտոր Հայաստանում — AMARAS TOUR",
    en: "Private Custom Tour Builder in Armenia — AMARAS TOUR",
  };
  const descriptions = {
    ru: "Соберите свой персональный тур по Армении: выбор автомобиля (седан, минивэн, джип 4x4), гида, любых достопримечательностей и доп. услуг. Индивидуальный расчет и быстрая подача заявки.",
    hy: "Ստեղծեք ձեր անհատական երթուղին Հայաստանում՝ մեքենայի, գիդի, տեսարժան վայրերի և լրացուցիչ ծառայությունների ընտրությամբ։",
    en: "Design your custom private journey across Armenia: choose your preferred vehicle, guide, landmarks, and extra services with instant live preview.",
  };

  return pageMetadata(
    locale,
    "tours/individual",
    titles[locale] || titles.ru,
    descriptions[locale] || descriptions.ru
  );
}

export default async function IndividualTourPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, tours = [], categories = [], attractions = [], fleet = [], fleetCategories = [], site } = await getContent();
  const dict = dicts[locale];

  // Preset individual tours from catalog
  const presetIndividualTours = tours.filter((t) => t.categories.includes("individual"));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.nav.tours, url: `/${locale}/tours` },
    {
      name: locale === "ru" ? "Индивидуальные туры (Конструктор)" : locale === "hy" ? "Անհատական տուրեր" : "Custom Private Tours",
      url: `/${locale}/tours/individual`,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header */}
      <div className="border-b border-[#FCFCF7]/10 bg-gradient-to-b from-[#242323] to-[#312F2F]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/tours`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.tours}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">
              {locale === "ru" ? "Индивидуальные туры" : locale === "hy" ? "Անհատական տուրեր" : "Private Tours"}
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-3.5 py-1 text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
              {locale === "ru" ? "Интерактивный конструктор" : locale === "hy" ? "Ինտերակտիվ կոնստրուկտոր" : "Interactive Tour Builder"}
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFCF7]">
              {locale === "ru"
                ? "Создайте свой идеальный тур по Армении"
                : locale === "hy"
                ? "Ստեղծեք ձեր իդեալական տուրը Հայաստանում"
                : "Craft Your Bespoke Armenia Journey"}
            </h1>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed text-[#FCFCF7]/75">
              {locale === "ru"
                ? "Личный гид, персональный комфортабельный автомобиль, свободный темп без посторонних и программа, собранная исключительно под ваши мечты и интересы."
                : locale === "hy"
                ? "Անձնական գիդ, հարմարավետ ավտոմեքենա, ազատ տեմպ և երթուղի՝ հարմարեցված ձեր նախասիրություններին։"
                : "A private guide, executive vehicle, unhurried pace, and a route tailored strictly to your personal preferences and bucket-list destinations."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Builder */}
      <IndividualTourBuilder
        locale={locale}
        attractions={attractions}
        fleet={fleet}
        categories={fleetCategories}
        site={site}
      />

      {/* Preset Individual Tours Showcase (Inspiration) */}
      {presetIndividualTours.length > 0 && (
        <section className="border-t border-white/10 bg-[#242323] py-14 sm:py-20 mt-12">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                    {locale === "ru" ? "Готовые идеи" : locale === "hy" ? "Պատրաստի գաղափարներ" : "Ready-Made Routes"}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold text-[#FCFCF7]">
                    {locale === "ru"
                      ? "Популярные готовые индивидуальные маршруты"
                      : locale === "hy"
                      ? "Հանրաճանաչ անհատական երթուղիներ"
                      : "Popular Tested Private Itineraries"}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#FCFCF7]/70 max-w-2xl">
                    {locale === "ru"
                      ? "Если вы предпочитаете проверенную классическую программу — выберите один из готовых маршрутов с фиксированным таймингом."
                      : "Prefer a pre-designed classical journey? Pick one of our curated private routes."}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {presetIndividualTours.map((tour, i) => (
                  <FadeIn key={tour.slug} delay={i * 0.05} className="h-full">
                    <TourCard
                      tour={tour}
                      locale={locale}
                      dict={dict}
                      categories={categories}
                    />
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
