import { dictionaries, type Dict, type Locale } from "@/lib/i18n";
import { tours, defaultCategories, type Tour, type Category } from "@/lib/tours";
import { site, type SiteInfo } from "@/lib/site";

// Admin edits live in content/*.json, committed to the repository by the
// admin panel. They are imported statically so every page stays fully
// static: no database, no runtime fetch, no per-request cost. A file holds
// `null` when nothing has been overridden yet.
import i18nOverride from "@/content/i18n.json";
import toursOverride from "@/content/tours.json";
import categoriesOverride from "@/content/categories.json";
import siteOverride from "@/content/site.json";
import heroOverride from "@/content/hero.json";
import reviewsOverride from "@/content/reviews.json";
import offersOverride from "@/content/offers.json";
import guestsOverride from "@/content/guests.json";
import guidesOverride from "@/content/guides.json";
import attractionsOverride from "@/content/attractions.json";
import fleetOverride from "@/content/fleet.json";
import fleetCategoriesOverride from "@/content/fleet_categories.json";
import type { Review } from "@/lib/reviews";
import { defaultOffers, type SpecialOffer } from "@/lib/offers";
import { defaultGuests, type GuestMedia } from "@/lib/guests";
import { defaultGuides, type Guide } from "@/lib/guides";
import { defaultAttractions, type Attraction } from "@/lib/attractions";
import { defaultVehicles, defaultFleetCategories, type Vehicle, type FleetCategory } from "@/lib/fleet";
import { githubConfig } from "@/lib/github";

export type Content = {
  dicts: Record<Locale, Dict>;
  tours: Tour[];
  categories: Category[];
  site: SiteInfo;
  hero: { images: string[] };
  reviews: Review[];
  offers: SpecialOffer[];
  guests: GuestMedia[];
  guides: Guide[];
  attractions: Attraction[];
  fleet: Vehicle[];
  fleetCategories: FleetCategory[];
};

export const CONTENT_KEYS = [
  "i18n",
  "tours",
  "categories",
  "site",
  "hero",
  "reviews",
  "offers",
  "guests",
  "guides",
  "attractions",
  "fleet",
  "fleet_categories",
] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const defaultHeroImages = [
  "/images/hero-mountain-road.jpg",
  "/images/hero-highland-lake.jpg",
  "/images/hero-valley-road.jpg",
  "/images/hero-travellers.jpg",
];

const defaults: Content = {
  dicts: dictionaries,
  tours,
  categories: defaultCategories,
  site,
  hero: { images: defaultHeroImages },
  reviews: (reviewsOverride as Review[]) || [],
  offers: (offersOverride as SpecialOffer[]) || defaultOffers,
  guests: (guestsOverride as GuestMedia[]) || defaultGuests,
  guides: (guidesOverride as Guide[]) || defaultGuides,
  attractions: (attractionsOverride as unknown as Attraction[]) || defaultAttractions,
  fleet: (fleetOverride as Vehicle[]) || defaultVehicles,
  fleetCategories: (fleetCategoriesOverride as FleetCategory[]) || defaultFleetCategories,
};

// Overlay stored values on defaults so keys added in future code versions
// still render even if the JSON file predates them. Arrays are replaced.
function deepMerge<T>(base: T, override: unknown): T {
  if (
    base !== null &&
    typeof base === "object" &&
    !Array.isArray(base) &&
    override !== null &&
    typeof override === "object" &&
    !Array.isArray(override)
  ) {
    const out = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
      out[k] = k in out ? deepMerge(out[k], v) : v;
    }
    return out as T;
  }
  return (override === undefined || override === null ? base : override) as T;
}

// A tour with no categories array crashes every page that filters by
// category, which fails the build and leaves the site with no deploy at all.
// Content arrives as hand-editable JSON in the repository, so one malformed
// entry should cost that entry, not the whole site.
function usableTours(value: unknown): Tour[] | null {
  if (!Array.isArray(value)) return null;
  const ok = value.filter(
    (tour) =>
      tour &&
      typeof tour.slug === "string" &&
      Array.isArray(tour.categories)
  ) as Tour[];
  return ok.length ? ok : null;
}

function usableCategories(value: unknown): Category[] | null {
  if (!Array.isArray(value)) return null;
  const ok = value.filter(
    (category) => category && typeof category.id === "string"
  ) as Category[];
  return ok.length ? ok : null;
}

function build(overrides: Record<ContentKey, unknown>): Content {
  const heroImages = (overrides.hero as Content["hero"] | null)?.images?.filter(
    Boolean
  );
  return {
    dicts: deepMerge(defaults.dicts, overrides.i18n),
    tours: usableTours(overrides.tours) ?? defaults.tours,
    categories: usableCategories(overrides.categories) ?? defaults.categories,
    site: deepMerge(defaults.site, overrides.site),
    hero: heroImages?.length ? { images: heroImages } : defaults.hero,
    reviews: Array.isArray(overrides.reviews)
      ? (overrides.reviews as Review[])
      : defaults.reviews,
    offers: Array.isArray(overrides.offers)
      ? (overrides.offers as SpecialOffer[])
      : defaults.offers,
    guests: Array.isArray(overrides.guests)
      ? (overrides.guests as GuestMedia[])
      : defaults.guests,
    guides: Array.isArray(overrides.guides)
      ? (overrides.guides as Guide[])
      : defaults.guides,
    attractions: Array.isArray(overrides.attractions)
      ? (overrides.attractions as Attraction[])
      : defaults.attractions,
    fleet: Array.isArray(overrides.fleet)
      ? (overrides.fleet as Vehicle[])
      : defaults.fleet,
    fleetCategories: Array.isArray(overrides.fleet_categories)
      ? (overrides.fleet_categories as FleetCategory[])
      : defaults.fleetCategories,
  };
}

// Global in-memory overrides for zero-latency serverless updates across requests
const globalContentOverrides = ((globalThis as any).__amarasContentOverrides ||
  ((globalThis as any).__amarasContentOverrides = {})) as Record<string, unknown>;

let liveBundleCache: Record<ContentKey, unknown> | null = null;
let lastGitHubCheckTime = 0;
const GITHUB_CHECK_INTERVAL_MS = 15_000;

export function setRuntimeBundle(bundle: Record<ContentKey, unknown>) {
  liveBundleCache = bundle;
  lastGitHubCheckTime = Date.now();
  setRuntimeOverrides(bundle);
}

async function fetchLatestGitHubBundle(): Promise<Record<ContentKey, unknown> | null> {
  const now = Date.now();
  if (liveBundleCache && now - lastGitHubCheckTime < GITHUB_CHECK_INTERVAL_MS) {
    return liveBundleCache;
  }

  const cfg = githubConfig();
  if (!cfg) return liveBundleCache;

  if (now - lastGitHubCheckTime < GITHUB_CHECK_INTERVAL_MS) {
    return liveBundleCache;
  }
  lastGitHubCheckTime = now;

  try {
    const refRes = await fetch(
      `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/commits/${encodeURIComponent(cfg.branch)}`,
      {
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!refRes.ok) return liveBundleCache;
    const commit = await refRes.json();
    const latestSha: string | undefined = commit?.sha;

    if (!latestSha) return liveBundleCache;

    const deployedSha = process.env.VERCEL_GIT_COMMIT_SHA;
    if (deployedSha && deployedSha === latestSha) {
      liveBundleCache = null;
      return null;
    }

    const bundleRes = await fetch(
      `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/content/bundle.json?ref=${latestSha}`,
      {
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          Accept: "application/vnd.github.raw",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (bundleRes.ok) {
      const raw = await bundleRes.json();
      if (raw && typeof raw === "object") {
        liveBundleCache = raw as Record<ContentKey, unknown>;
        setRuntimeOverrides(liveBundleCache);
        return liveBundleCache;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch latest GitHub bundle:", err);
  }

  return liveBundleCache;
}

export async function getContent(): Promise<Content> {
  if (liveBundleCache) {
    return build(liveBundleCache);
  }

  if (typeof window === "undefined") {
    try {
      const remote = await fetchLatestGitHubBundle();
      if (remote) {
        return build(remote);
      }
    } catch {}
  }

  return build(currentOverrides());
}

// What the admin panel loads and edits — identical to what the site renders.
export const fetchContent = getContent;

export function setRuntimeOverrides(edits: Partial<Record<ContentKey, unknown>>) {
  for (const [key, val] of Object.entries(edits)) {
    if (val !== undefined && val !== null) {
      globalContentOverrides[key] = val;
    }
  }

  // Also persist to /tmp so any other process or lambda execution in same container can read it
  try {
    const tmpDir = path.join("/tmp", "amaras_content");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    for (const [key, val] of Object.entries(edits)) {
      if (val !== undefined && val !== null) {
        fs.writeFileSync(
          path.join(tmpDir, `${key}.json`),
          JSON.stringify(val, null, 2),
          "utf8"
        );
      }
    }
  } catch (err) {
    console.warn("Writing to /tmp/amaras_content warning:", err);
  }

  // Also write to local project directory if writable (e.g. local dev)
  try {
    const contentDir = path.join(process.cwd(), "content");
    for (const [key, val] of Object.entries(edits)) {
      if (val !== undefined && val !== null) {
        fs.writeFileSync(
          path.join(contentDir, `${key}.json`),
          `${JSON.stringify(val, null, 2)}\n`,
          "utf8"
        );
      }
    }
  } catch {}
}

import fs from "fs";
import path from "path";

function readJsonFile<T>(key: ContentKey, filename: string, fallback: T): T {
  // 1. Check in-memory global override (fastest, 0ms)
  if (globalContentOverrides[key] !== undefined && globalContentOverrides[key] !== null) {
    return globalContentOverrides[key] as T;
  }

  // 2. Check /tmp/amaras_content/ (writable on Vercel serverless / lambda)
  try {
    const tmpPath = path.join("/tmp", "amaras_content", filename);
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, "utf8");
      const parsed = JSON.parse(data) as T;
      globalContentOverrides[key] = parsed;
      return parsed;
    }
  } catch {}

  // 3. Check process.cwd()/content/ (local dev or repository clone)
  try {
    const p = path.join(process.cwd(), "content", filename);
    if (fs.existsSync(p)) {
      const data = fs.readFileSync(p, "utf8");
      return JSON.parse(data) as T;
    }
  } catch {}

  return fallback;
}

export function currentOverrides(): Record<ContentKey, unknown> {
  return {
    i18n: readJsonFile("i18n", "i18n.json", i18nOverride),
    tours: readJsonFile("tours", "tours.json", toursOverride),
    categories: readJsonFile("categories", "categories.json", categoriesOverride),
    site: readJsonFile("site", "site.json", siteOverride),
    hero: readJsonFile("hero", "hero.json", heroOverride),
    reviews: readJsonFile("reviews", "reviews.json", reviewsOverride),
    offers: readJsonFile("offers", "offers.json", offersOverride),
    guests: readJsonFile("guests", "guests.json", guestsOverride),
    guides: readJsonFile("guides", "guides.json", guidesOverride),
    attractions: readJsonFile("attractions", "attractions.json", attractionsOverride),
    fleet: readJsonFile("fleet", "fleet.json", fleetOverride),
    fleet_categories: readJsonFile("fleet_categories", "fleet_categories.json", fleetCategoriesOverride),
  };
}

