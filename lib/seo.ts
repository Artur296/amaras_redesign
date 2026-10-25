import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import { getCanonicalSiteUrl } from "@/lib/site";

// Canonical + hreflang alternates for a page at /<locale>/<path>.
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Metadata {
  const suffix = path ? `/${path}` : "";
  const siteUrl = getCanonicalSiteUrl();

  const keywordsMap: Record<Locale, string[]> = {
    ru: [
      "туры в армению",
      "туры в армению 2026",
      "туры по армении",
      "экскурсии в армении",
      "экскурсии по армении",
      "экскурсии из еревана",
      "индивидуальные туры в армению",
      "групповые туры по армении",
      "джип туры армения",
      "гид в армении",
      "отдых в армении",
      "достопримечательности армении",
      "севан",
      "гарни",
      "татев",
      "хор вирап",
      "джемук",
      "турпакеты армения",
      "amaras tour",
      "amarastour.com",
    ],
    hy: [
      "տուրեր հայաստանում",
      "էքսկուրսիաներ հայաստանում",
      "էքսկուրսիաներ երևանից",
      "հայաստանի տուրեր",
      "անհատական տուրեր հայաստան",
      "խմբակային էքսկուրսիաներ",
      "ջիպ տուրեր հայաստան",
      "զբոսավար հայաստանում",
      "հանգիստ հայաստանում",
      "տուր փաթեթներ հայաստան",
      "սևան",
      "գառնի",
      "տաթև",
      "խոր վիրապ",
      "amaras tour",
      "amarastour.com",
    ],
    en: [
      "armenia tours",
      "armenian tours",
      "tours in armenia",
      "armenia travel",
      "travel to armenia",
      "yerevan excursions",
      "day trips from yerevan",
      "private tours armenia",
      "group tours armenia",
      "jeep safari armenia",
      "lake sevan tour",
      "garni geghard tour",
      "tatev wings tour",
      "armenia tour packages",
      "armenia travel agency",
      "local guide armenia",
      "amaras tour",
      "amarastour.com",
    ],
  };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: keywordsMap[locale] || keywordsMap.ru,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}${suffix}`])),
        "x-default": `/${defaultLocale}${suffix}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${suffix}`,
      siteName: "AMARAS TOUR",
      locale: locale === "ru" ? "ru_RU" : locale === "hy" ? "hy_AM" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/og-amaras.jpg`,
          width: 1024,
          height: 682,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/og-amaras.jpg`],
    },
  };
}
