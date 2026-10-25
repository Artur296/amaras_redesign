import type { Metadata } from "next";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";
import FleetPageClient from "@/components/FleetPageClient";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    ru: "Автопарк Amaras Tour — комфортные минивэны, джипы 4x4 и микроавтобусы в Армении",
    hy: "Amaras Tour ավտոպարկ — հարմարավետ մինիվեններ, ամենագնացներ և միկրոավտոբուսներ Հայաստանում",
    en: "Amaras Tour Fleet — Modern Minivans, 4x4 SUVs, and Touring Minibuses in Armenia",
  };
  const descriptions = {
    ru: "Современный автопарк для экскурсий и трансферов по Армении: Toyota Alphard, Mercedes V-Class, Land Cruiser Prado 4x4, Sprinter Lux. Климат-контроль, Wi-Fi и опытные горные водители.",
    hy: "Ժամանակակից ավտոպարկ էքսկուրսիաների և տրանսֆերների համար Հայաստանում։ Օդորակիչներ, Wi-Fi և փորձառու լեռնային վարորդներ։",
    en: "Modern touring vehicle fleet in Armenia: Toyota Alphard, Mercedes-Benz V-Class, Land Cruiser Prado 4x4, Sprinter Lux. Multi-zone AC, onboard Wi-Fi, and certified mountain chauffeurs.",
  };

  return pageMetadata(
    locale,
    "fleet",
    titles[locale] || titles.ru,
    descriptions[locale] || descriptions.ru
  );
}

export default async function FleetPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, site, fleet = [], fleetCategories = [] } = await getContent();
  const dict = dicts[locale];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    {
      name: locale === "ru" ? "Автопарк" : locale === "hy" ? "Ավտոպարկ" : "Fleet",
      url: `/${locale}/fleet`,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header Banner */}
      <div className="border-b border-[#FCFCF7]/10 bg-gradient-to-b from-[#242323] to-[#312F2F]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">
              {locale === "ru" ? "Автопарк" : locale === "hy" ? "Ավտոպարկ" : "Fleet"}
            </span>
          </nav>

          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
            {locale === "ru" ? "Транспорт для ваших путешествий" : locale === "hy" ? "Մեր տրանսպորտը" : "Touring Vehicles"}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFCF7]">
            {locale === "ru" ? "Автопарк Amaras Tour" : locale === "hy" ? "Amaras Tour ավտոպարկ" : "Amaras Tour Fleet"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed text-[#FCFCF7]/75">
            {locale === "ru"
              ? "Комфортные минивэны, надежные рамные джипы 4x4, просторные туристические микроавтобусы и бизнес-седаны. Путешествуйте по Армении с непревзойденным комфортом."
              : locale === "hy"
              ? "Հարմարավետ մինիվեններ, հուսալի ամենագնացներ 4x4, ընդարձակ միկրոավտոբուսներ և սեդաններ։ Ճամփորդեք Հայաստանով առավելագույն հարմարավետությամբ։"
              : "Comfortable executive minivans, rugged 4x4 mountain SUVs, spacious touring minibuses, and business sedans for first-class journeys across Armenia."}
          </p>
        </div>
      </div>

      <FleetPageClient locale={locale} fleet={fleet} categories={fleetCategories} site={site} />
    </div>
  );
}
