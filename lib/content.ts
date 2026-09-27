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

export type Content = {
  dicts: Record<Locale, Dict>;
  tours: Tour[];
  categories: Category[];
  site: SiteInfo;
  hero: { images: string[] };
};

export const CONTENT_KEYS = ["i18n", "tours", "categories", "site", "hero"] as const;
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
  };
}

export async function getContent(): Promise<Content> {
  return build(currentOverrides());
}

// What the admin panel loads and edits — identical to what the site renders.
export const fetchContent = getContent;

// The raw override for one key, as the admin panel last saved it. Used when
// publishing so untouched keys are re-committed byte-identical.
export function currentOverrides(): Record<ContentKey, unknown> {
  return {
    i18n: i18nOverride,
    tours: toursOverride,
    categories: categoriesOverride,
    site: siteOverride,
    hero: heroOverride,
  };
}
