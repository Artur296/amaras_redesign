import { unstable_cache } from "next/cache";
import { dictionaries, type Dict, type Locale } from "@/lib/i18n";
import { tours, defaultCategories, type Tour, type Category } from "@/lib/tours";
import { site, type SiteInfo } from "@/lib/site";
import { db, hasDb } from "@/lib/db";

export type Content = {
  dicts: Record<Locale, Dict>;
  tours: Tour[];
  categories: Category[];
  site: SiteInfo;
  hero: { images: string[] };
};

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
// still render even if the DB document predates them. Arrays are replaced.
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
  return (override === undefined ? base : override) as T;
}

// The site must keep working from the built-in defaults if the DB is
// missing or unreachable — only admin edits stop applying.
export async function fetchContent(): Promise<Content> {
  if (!hasDb()) return defaults;
  try {
    const rows = (await db()`select key, value from site_content`) as {
      key: string;
      value: unknown;
    }[];
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const heroImages = (
      stored.hero as Content["hero"] | undefined
    )?.images?.filter(Boolean);
    return {
      dicts: deepMerge(defaults.dicts, stored.i18n),
      tours: (stored.tours as Tour[]) ?? defaults.tours,
      categories: (stored.categories as Category[]) ?? defaults.categories,
      site: deepMerge(defaults.site, stored.site),
      hero: heroImages?.length ? { images: heroImages } : defaults.hero,
    };
  } catch {
    return defaults;
  }
}

const cachedContent = unstable_cache(fetchContent, ["site-content"], {
  tags: ["content"],
  revalidate: 300,
});

// A cached document can also predate keys added in a newer code version, so
// overlay it on the defaults again on read — otherwise a page using a brand
// new text key crashes until the cache expires.
export async function getContent(): Promise<Content> {
  const content = await cachedContent();
  return {
    ...content,
    dicts: deepMerge(defaults.dicts, content.dicts),
    site: deepMerge(defaults.site, content.site),
  };
}
