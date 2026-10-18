// Single source of truth for site-wide values.
// TODO: replace every placeholder below with real values before launch.

export const defaultHomepageImages = {
  // Hero quick destination cards
  heroSevan: "/images/package-sevan.jpg",
  heroKhorVirap: "/images/offer-khor-virap.jpg",
  heroGarni: "/images/package-garni-hd.jpg",
  heroTatev: "/images/package-tatev.jpg",
  heroNoravank: "/images/package-noravank.jpg",
  heroAzhdahak: "/images/azhdahak.jpg",

  // Bento Trend Grid (6 cards)
  bentoCard1: "/images/package-sevan.jpg",
  bentoCard2: "/images/offer-khor-virap.jpg",
  bentoCard3: "/images/package-dilijan.jpg",
  bentoCard4: "/images/package-garni-hd.jpg",
  bentoCardGuests: "/images/hero-travellers.jpg",
  bentoCardExtreme: "/images/1792096571726-jeep-mountain-road-web.jpg",

  // Luxury Resort slider (3 slides)
  resortSevan: "/images/package-sevan.jpg",
  resortDilijan: "/images/package-dilijan.jpg",
  resortJermuk: "/images/offer-khor-virap.jpg",

  // Panoramic banner in advantages
  panoramicBanner: "/images/noravank.jpg",

  // Immersive full-width resort banner
  featuredBanner: "/images/package-sevan.jpg",

  // Top Tours Highlights (Left & Right images)
  topTour1Left: "/images/offer-khor-virap.jpg",
  topTour1Right: "/images/noravank.jpg",
  topTour2Left: "/images/garni.jpg",
  topTour2Right: "/images/sevan.jpg",
  topTour3Left: "/images/tatev.jpg",
  topTour3Right: "/images/azhdahak.jpg",

  // Travel Articles / Guides (3 cards)
  article1: "/images/jeep.jpg",
  article2: "/images/garni.jpg",
  article3: "/images/noravank.jpg",
};

export type HomepageImages = typeof defaultHomepageImages;

export interface BentoExtremeConfig {
  badge: string;
  title: Record<"ru" | "hy" | "en", string>;
  subtitle: Record<"ru" | "hy" | "en", string>;
  activities: string[];
  link: string;
}

export const defaultBentoExtreme: BentoExtremeConfig = {
  badge: "4×4",
  title: {
    ru: "Экстрим",
    hy: "Էքսթրիմ",
    en: "Extreme",
  },
  subtitle: {
    ru: "Зиплайн, парашют, 4×4 и перевалы",
    hy: "Զիփլայն, պարաշյուտ, 4×4 և լեռնանցքներ",
    en: "Zipline, skydiving, 4×4 & passes",
  },
  activities: [
    "Зиплайн",
    "Прыжок с парашютом",
    "Джип-туры 4×4",
    "Параплан",
    "Рафтинг",
  ],
  link: "/tours/jeep",
};

export const site = {
  name: "Amaras Tour",
  url: "https://amarastour.com",
  phone: "+374 99 250 525",
  whatsapp: "37499250525",
  telegram: "amaras_tour_armenia",
  instagram: "amarastourarmenia",
  email: "amarastour.am@gmail.com",
  // Photo beside the text on the About page; editable in /admin.
  aboutImage: "/images/noravank.jpg",
  // Round mark in the site header, also the browser-tab icon; editable in /admin.
  logo: "/images/logo.png",
  // Configurable widget & section images across homepage; editable in /admin.
  homepageImages: defaultHomepageImages,
  // Configurable Extreme & Adventure card settings; editable in /admin.
  bentoExtreme: defaultBentoExtreme,
};

export type SiteInfo = typeof site;
export type Links = ReturnType<typeof buildLinks>;

export function buildLinks(s: SiteInfo) {
  return {
    whatsapp: `https://wa.me/${s.whatsapp}`,
    telegram: `https://t.me/${s.telegram}`,
    instagram: `https://instagram.com/${s.instagram}`,
    phone: `tel:${s.phone.replace(/\s/g, "")}`,
    email: `mailto:${s.email}`,
  };
}

/**
 * Returns the canonical website URL for SEO, Schema.org, sitemaps, and OpenGraph.
 * Always resolves to https://amarastour.com in production so Google never indexes preview URLs.
 */
export function getCanonicalSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return site.url;
}

