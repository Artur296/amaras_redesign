import type { NextConfig } from "next";

// Tour pages moved from /tours/<slug> to /tours/<category>/<slug> and the jeep
// category was retired. These are the historical URLs that were already public,
// kept alive so nothing 404s while the site is being indexed. Tours added later
// never had an old URL, so this list is fixed.
const legacyTourUrls: Record<string, string> = {
  "tsaghkadzor-sevan-sevanavank": "group",
  "garni-geghard-symphony": "individual",
  "hovhannavank-saghmosavank-alphabet": "individual",
  "gutanasar-sevan-dilijan": "individual",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(legacyTourUrls).map(([slug, category]) => ({
        source: `/:locale/tours/${slug}`,
        destination: `/:locale/tours/${category}/${slug}`,
        permanent: true,
      })),
      // Retired with the jeep category.
      {
        source: "/:locale/tours/echmiadzin-zvartnots-masterclass",
        destination: "/:locale/tours",
        permanent: true,
      },
      {
        source: "/:locale/tours/jeep",
        destination: "/:locale/tours",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
