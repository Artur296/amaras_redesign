import type { Locale } from "@/lib/i18n";
import attractionsData from "@/content/attractions.json";

export type RegionCategory = "near_yerevan" | "sevan_dilijan" | "south" | "north_lori";

export type Attraction = {
  id: string;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  regionCategory: RegionCategory;
  region: Record<Locale, string>;
  distance: Record<Locale, string>;
  travelTime: Record<Locale, string>;
  image: string;
  unesco: boolean;
  highlights: Record<Locale, string[]>;
  shortDescription: Record<Locale, string>;
  fullStory: Record<Locale, string>;
  tourQuery?: string;
};

export const defaultAttractions: Attraction[] = attractionsData as unknown as Attraction[];

export function getAttractions(): Attraction[] {
  return defaultAttractions;
}

export function getAttractionById(id: string): Attraction | undefined {
  return defaultAttractions.find((a) => a.id === id);
}

export function getAttractionsByCategory(category: RegionCategory): Attraction[] {
  return defaultAttractions.filter((a) => a.regionCategory === category);
}
