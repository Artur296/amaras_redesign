import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Armenian } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFab from "@/components/ContactFab";
import { SiteProvider } from "@/components/SiteProvider";
import {
  locales,
  defaultLocale,
  ogLocales,
  type Locale,
} from "@/lib/i18n";
import { getContent } from "@/lib/content";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
});

const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-armenian",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#141c38",
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const { dicts, site } = await getContent();
  const dict = dicts[locale as Locale];
  return {
    metadataBase: new URL(site.url),
    // The tab icon follows the logo set in /admin.
    icons: { icon: site.logo, apple: site.logo },
    title: {
      default: dict.meta.home.title,
      template: `%s | ${site.name}`,
    },
    description: dict.meta.home.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocales[locale as Locale],
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      images: ["/images/hero-khor-virap.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      images: ["/images/hero-khor-virap.jpg"],
    },
    verification: {
      google: [
        "IEP1yZ-kktUS1c6tSlysalSFOm7pgl1xzN-ILaqTNo4",
        "bfXRmcOYJ_1zOc6top2dS4olQEyTo76uoxox_DOFdQI",
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const { dicts, site } = await getContent();
  const dict = dicts[locale as Locale];

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${notoArmenian.variable}`}
    >
      {/* suppressHydrationWarning: browser extensions (Bitdefender, Grammarly)
          inject attributes into <body> before React hydrates */}
      <body className="font-sans" suppressHydrationWarning>
        <SiteProvider site={site}>
          <Header locale={locale as Locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale as Locale} dict={dict} site={site} />
          <ContactFab label={dict.hero.ctaWrite} />
        </SiteProvider>
      </body>
    </html>
  );
}
