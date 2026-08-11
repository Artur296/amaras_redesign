import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tours, categories } = await getContent();
  const paths = [
    "",
    "/about",
    "/tours",
    "/contacts",
    ...categories.map((c) => `/tours/${c.id}`),
    ...tours.map((t) => `/tours/${t.categories[0]}/${t.slug}`),
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
