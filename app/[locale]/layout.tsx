import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Sans_Armenian } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFab from "@/components/ContactFab";
import JeepPreloader from "@/components/JeepPreloader";
import { SiteProvider } from "@/components/SiteProvider";
import {
  locales,
  defaultLocale,
  ogLocales,
  type Locale,
} from "@/lib/i18n";
import { getContent } from "@/lib/content";
import "../globals.css";

const bebasArmenian = localFont({
  src: "../../public/fonts/bebas/Arm-Bebas-Neue.ttf",
  variable: "--font-bebas-arm",
  display: "swap",
});

const bebas = localFont({
  src: [
    {
      path: "../../public/fonts/bebas/BebasNeuePro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/bebas/BebasNeue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bebas",
  display: "swap",
});

const futura = localFont({
  src: [
    {
      path: "../../public/fonts/futura/FuturaCyrillicMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/futura/FuturaCyrillicBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-futura",
  display: "swap",
});

const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-armenian",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c7ff32" },
    { media: "(prefers-color-scheme: dark)", color: "#586eff" },
  ],
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const { dicts, site } = await getContent();
  const dict = dicts[locale as Locale];
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : site.url);

  return {
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/site.webmanifest",
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
      images: [
        {
          url: "/images/og-amaras.jpg",
          width: 1024,
          height: 682,
          alt: "AMARAS TOUR — туры и экскурсии по Армении",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      images: ["/images/og-amaras.jpg"],
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
      className={`${futura.variable} ${bebas.variable} ${bebasArmenian.variable} ${notoArmenian.variable}`}
    >
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#c7ff32" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#586eff" />
        <meta name="msapplication-navbutton-color" content="#586eff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      {/* suppressHydrationWarning: browser extensions (Bitdefender, Grammarly)
          inject attributes into <body> before React hydrates */}
      <body className="font-sans" suppressHydrationWarning>
        <JeepPreloader />
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
