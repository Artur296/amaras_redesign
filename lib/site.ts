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

  // Bento Trend Grid (4 cards)
  bentoCard1: "/images/package-sevan.jpg",
  bentoCard2: "/images/offer-khor-virap.jpg",
  bentoCard3: "/images/package-dilijan.jpg",
  bentoCard4: "/images/package-garni-hd.jpg",

  // Luxury Resort slider (3 slides)
  resortSevan: "/images/package-sevan.jpg",
  resortDilijan: "/images/package-dilijan.jpg",
  resortJermuk: "/images/offer-khor-virap.jpg",

  // Panoramic banner in advantages
  panoramicBanner: "/images/noravank.jpg",

  // Immersive full-width resort banner
  featuredBanner: "/images/package-sevan.jpg",

  // Top Tours Highlights (Left & Right images)
  topTour1Left: "/images/khor-virap.jpg",
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
