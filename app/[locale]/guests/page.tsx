import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import GuestsGallery from "@/components/GuestsGallery";
import { type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { dicts } = await getContent();
  const dict = dicts[locale];
  return pageMetadata(
    locale,
    "guests",
    dict.meta.guests.title,
    dict.meta.guests.description
  );
}

export default async function GuestsPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, guests, reviews } = await getContent();
  const dict = dicts[locale];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.nav.guests, url: `/${locale}/guests` },
  ]);

  const headers = {
    ru: {
      badge: "НАШИ ПУТЕШЕСТВЕННИКИ",
      title: "Гости Amaras Tour",
      subtitle:
        "Живые моменты, фотографии, видео и честные отзывы наших гостей из путешествий по Армении. Познакомьтесь с историями поездок и нашими гидами.",
    },
    hy: {
      badge: "ՄԵՐ ՃԱՄՓՈՐԴՆԵՐԸ",
      title: "Amaras Tour-ի Հյուրերը",
      subtitle:
        "Կենդանի կադրեր, լուսանկարներ, տեսանյութեր և անկեղծ կարծիքներ մեր հյուրերից՝ Հայաստանի բոլոր անկյուններից։ Ծանոթացեք ճամփորդությունների պատմություններին և մեր գիդերին։",
    },
    en: {
      badge: "OUR TRAVELERS",
      title: "Amaras Tour Guests",
      subtitle:
        "Genuine moments, photos, videos and heartfelt reviews from our guests across Armenia. Meet our beloved guides and travelers' true stories.",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Editorial Header & Breadcrumb */}
      <div className="border-b border-[#FCFCF7]/10 bg-[#242323]">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 md:py-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50"
          >
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-[#C7FF32]"
            >
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">{dict.nav.guests}</span>
          </nav>

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
              {headers.badge}
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#FCFCF7] sm:text-4xl md:text-5xl">
              {headers.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#FCFCF7]/75 sm:text-lg">
              {headers.subtitle}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Main Interactive Gallery & Reviews */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <GuestsGallery
          guests={guests}
          reviews={reviews}
          locale={locale}
        />
      </main>
    </div>
  );
}
