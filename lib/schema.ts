import type { Locale } from "@/lib/i18n";
import type { Tour } from "@/lib/tours";
import type { SiteInfo } from "@/lib/site";
import { isPackageTour, tourPath } from "@/lib/tours";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://amarastour.com");

/**
 * BreadcrumbList Schema.org generator
 * Enables Google rich breadcrumbs in search results (e.g. Home > Tours > Garni)
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * TouristTrip & Product Schema.org generator for Tour Detail pages
 * Enables Price, Rating, Duration, and Tour Itinerary Rich Snippets in Google
 */
export function generateTourDetailSchema({
  tour,
  locale,
  site,
  categoryTitle,
}: {
  tour: Tour;
  locale: Locale;
  site: SiteInfo;
  categoryTitle?: string;
}) {
  const fullUrl = `${SITE_URL}/${locale}${tourPath(tour)}`;
  const imageUrl = tour.image.startsWith("http")
    ? tour.image
    : `${SITE_URL}${tour.image}`;

  const allImages = [
    imageUrl,
    ...(tour.images || []).map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`
    ),
  ];

  const durationIso = tour.days
    ? `P${tour.days}D`
    : tour.durationHours
    ? `PT${parseInt(tour.durationHours, 10) || 8}H`
    : undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Product"],
    name: tour.title[locale],
    description: tour.description[locale],
    image: allImages,
    url: fullUrl,
    category: categoryTitle || (isPackageTour(tour) ? "Tour Packages" : "Excursions"),
    touristType: ["Sightseeing", "Adventure", "Family", "Cultural"],
    provider: {
      "@type": "TravelAgency",
      name: site.name,
      telephone: site.phone,
      url: SITE_URL,
      image: `${SITE_URL}/images/og-amaras.jpg`,
      priceRange: "֏֏",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "138",
      reviewCount: "138",
    },
  };

  if (durationIso) {
    schema.duration = durationIso;
  }

  if (tour.priceFromAmd && tour.priceFromAmd > 0) {
    schema.offers = {
      "@type": "Offer",
      price: tour.priceFromAmd,
      priceCurrency: "AMD",
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: "https://schema.org/InStock",
      url: fullUrl,
      validFrom: `${new Date().getFullYear()}-01-01`,
    };
  }

  // Use itinerary days if present (multi-day packages) or destinations (day tours)
  if (tour.itinerary && tour.itinerary.length) {
    schema.itinerary = {
      "@type": "ItemList",
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((day, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: day.title[locale],
        description: day.items[locale]?.join(", "),
      })),
    };
  } else if (tour.destinations && tour.destinations[locale]?.length) {
    schema.itinerary = {
      "@type": "ItemList",
      numberOfItems: tour.destinations[locale].length,
      itemListElement: tour.destinations[locale].map((point, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: point,
      })),
    };
  }

  return schema;
}

/**
 * TravelAgency / LocalBusiness Schema for Contacts and Homepage
 */
export function generateTravelAgencySchema(site: SiteInfo, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#travelagency`,
    name: site.name,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/og-amaras.jpg`,
    image: `${SITE_URL}/images/og-amaras.jpg`,
    telephone: site.phone,
    email: site.email,
    priceRange: "֏֏",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yerevan",
      addressCountry: "AM",
      streetAddress: "Yerevan, Armenia",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.1792",
      longitude: "44.4991",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      site.instagram ? `https://instagram.com/${site.instagram}` : null,
      site.telegram ? `https://t.me/${site.telegram}` : null,
    ].filter(Boolean),
  };
}

/**
 * ItemList Schema for Tour Catalog & Category pages
 * Enables search engine carousel of tours
 */
export function generateTourListSchema(
  tours: Tour[],
  locale: Locale,
  listTitle: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listTitle,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tour.title[locale],
      url: `${SITE_URL}/${locale}${tourPath(tour)}`,
      image: tour.image.startsWith("http")
        ? tour.image
        : `${SITE_URL}${tour.image}`,
    })),
  };
}
