import type { NextConfig } from "next";

// Tour pages moved from /tours/<slug> to /tours/<category>/<slug>. These are
// the historical URLs that were already public, kept alive so nothing 404s
// while the site is being indexed. Tours added later never had an old URL, so
// this list is fixed.
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
      // Tour packages became their own top-level section, so everything that
      // used to live under /tours/packages now points at /tour-packages.
      {
        source: "/:locale/tours/packages/:slug",
        destination: "/:locale/tour-packages/:slug",
        permanent: true,
      },
      {
        source: "/:locale/tours/packages",
        destination: "/:locale/tour-packages",
        permanent: true,
      },
      // This tour once sat at the flat URL; it is a group tour now, so send
      // the old link to the tour itself rather than to the index.
      {
        source: "/:locale/tours/echmiadzin-zvartnots-masterclass",
        destination: "/:locale/tours/group/echmiadzin-zvartnots-masterclass",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
