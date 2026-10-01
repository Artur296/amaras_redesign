import type { Locale } from "@/lib/i18n";

export type ReviewText = string | { ru?: string; hy?: string; en?: string };

export type Review = {
  id: string;
  author: string;
  location?: string;
  rating: number; // 1 to 5
  tourTitle?: string;
  text: ReviewText;
  date: string; // "YYYY-MM-DD"
  approved: boolean;
  createdAt: string; // ISO string
};

export function getReviewText(text: ReviewText, locale: Locale): string {
  if (typeof text === "string") return text;
  if (!text) return "";
  return text[locale] || text.ru || text.en || text.hy || "";
}
