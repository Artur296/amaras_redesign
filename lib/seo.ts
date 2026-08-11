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
  return {
    title,
    description,
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
      images: ["/images/hero-khor-virap.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-khor-virap.jpg"],
    },
  };
}
