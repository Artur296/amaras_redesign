import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { publicCategories, tourPath } from "@/lib/tours";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tours, categories } = await getContent();
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
      url: `${site.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${site.url}/${l}${path}`])
        ),
      },
    }))
  );
}
