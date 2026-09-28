import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { publicCategories, tourPath } from "@/lib/tours";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tours, categories } = await getContent();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : site.url);

  const getPriority = (path: string): number => {
    if (path === "") return 1.0;
    if (path === "/tours" || path === "/tour-packages") return 0.9;
    if (path.startsWith("/tours/")) return 0.85;
    if (path === "/about" || path === "/contacts") return 0.7;
    return 0.8;
  };

  const getChangeFrequency = (
    path: string
  ): "daily" | "weekly" | "monthly" => {
    if (path === "" || path === "/tours" || path === "/tour-packages")
      return "daily";
    if (path === "/about" || path === "/contacts") return "monthly";
    return "weekly";
  };

  const paths = [
    "",
    "/about",
    "/tours",
    "/contacts",
    "/tour-packages",
    ...publicCategories(categories).map((c) => `/tours/${c.id}`),
    ...tours.map((t) => tourPath(t)),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: getChangeFrequency(path),
      priority: getPriority(path),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`])
        ),
      },
    }))
  );
}
