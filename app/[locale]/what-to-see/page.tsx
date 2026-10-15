import type { Metadata } from "next";
import Link from "next/link";
import { WhatToSeeSection } from "@/components/WhatToSeeSection";
import { type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    ru: "Что посмотреть в Армении — Достопримечательности и путеводитель | Amaras Tour",
    hy: "Ինչ տեսնել Հայաստանում — Տեսարժան վայրեր և ուղեցույց | Amaras Tour",
    en: "What to See in Armenia — Attractions & Travel Guide | Amaras Tour",
  };
  const descriptions = {
    ru: "Полный путеводитель по достопримечательностям Армении от Amaras Tour: Хор Вирап, Гарни, Гегард, озеро Севан, Татев, Нораванк, Дилижан и многое другое с точным расстоянием от Еревана.",
    hy: "Հայաստանի տեսարժան վայրերի ամբողջական ուղեցույց Amaras Tour-ից․ Խոր Վիրապ, Գառնի, Գեղարդ, Սևանա լիճ, Տաթև, Նորավանք, Դիլիջան և շատ ավելին՝ Երևանից հստակ հեռավորությամբ։",
    en: "Complete guide to Armenia's attractions by Amaras Tour: Khor Virap, Garni, Geghard, Lake Sevan, Tatev, Noravank, Dilijan and more with exact distances from Yerevan.",
  };

  return pageMetadata(
    locale,
    "what-to-see",
    titles[locale] || titles.ru,
    descriptions[locale] || descriptions.ru
  );
}

export default async function WhatToSeePage({ params }: Props) {
  const { locale } = await params;
  const content = await getContent();

  const labels = {
    ru: {
      home: "Главная",
      whatToSee: "Что посмотреть",
    },
    hy: {
      home: "Գլխավոր",
      whatToSee: "Ինչ տեսնել",
    },
    en: {
      home: "Home",
      whatToSee: "What to See",
    },
  }[locale];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, url: `/${locale}` },
    { name: labels.whatToSee, url: `/${locale}/what-to-see` },
  ]);

  return (
    <div className="min-h-screen bg-[#F6F5EE]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Editorial Breadcrumbs Banner */}
      <div className="border-b border-black/5 bg-[#ECEAE0]/60">
        <div className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500"
          >
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-[#586EFF]"
            >
              {labels.home}
            </Link>
            <span>/</span>
            <span className="text-[#312F2F] font-bold">{labels.whatToSee}</span>
          </nav>
        </div>
      </div>

      {/* Main What To See Section */}
      <div className="pb-16 sm:pb-24">
        <WhatToSeeSection
          locale={locale}
          initialAttractions={content.attractions}
        />
      </div>
    </div>
  );
}
