import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getCanonicalSiteUrl } from "@/lib/site";
import { publicCategories, tourPath } from "@/lib/tours";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tours, categories } = await getContent();
  const siteUrl = getCanonicalSiteUrl();

  const getPriority = (path: string): number => {
    if (path === "") return 1.0;
    if (path === "/tours" || path === "/tour-packages" || path === "/tours/individual") return 0.9;
    if (path.startsWith("/tours/") || path === "/fleet" || path === "/what-to-see") return 0.85;
    if (path === "/about" || path === "/contacts" || path === "/guests") return 0.75;
    return 0.8;
  };

  const getChangeFrequency = (
    path: string
  ): "daily" | "weekly" | "monthly" => {
    if (path === "" || path === "/tours" || path === "/tour-packages" || path === "/tours/individual")
      return "daily";
    if (path === "/about" || path === "/contacts") return "monthly";
    return "weekly";
  };

  const paths = [
    "",
    "/tours",
    "/tours/individual",
    "/tours/offers",
    "/tour-packages",
    "/fleet",
    "/what-to-see",
    "/guests",
    "/about",
    "/contacts",
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
