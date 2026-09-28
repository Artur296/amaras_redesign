import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

// Canonical + hreflang alternates for a page at /<locale>/<path>.
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Metadata {
  const suffix = path ? `/${path}` : "";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://amarastour.com");

  const keywordsMap: Record<Locale, string[]> = {
    ru: [
      "туры по Армении",
      "экскурсии из Еревана",
      "индивидуальные туры Армения",
      "групповые экскурсии Армения",
      "джип туры Армения",
      "гид в Армении",
      "отдых в Армении",
      "достопримечательности Армении",
      "AMARAS TOUR",
    ],
    hy: [
      "տուրեր Հայաստանում",
      "էքսկուրսիաներ Երևանից",
      "անհատական տուրեր Հայաստան",
      "խմբակային էքսկուրսիաներ",
      "ջիպ տուրեր Հայաստան",
      "զբոսավար Հայաստանում",
      "հանգիստ Հայաստանում",
      "AMARAS TOUR",
    ],
    en: [
      "Armenia tours",
      "Yerevan excursions",
      "private tours Armenia",
      "group tours Armenia",
      "jeep tours Armenia",
      "Armenia travel agency",
      "travel to Armenia",
      "AMARAS TOUR",
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
          url: "/images/og-amaras.jpg",
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
      images: ["/images/og-amaras.jpg"],
    },
  };
}
