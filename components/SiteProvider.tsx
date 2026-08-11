"use client";

import { createContext, useContext } from "react";
import { site as defaultSite, buildLinks, type SiteInfo } from "@/lib/site";

// Makes the (DB-editable) site contacts available to client components
// without threading props through every level.
const SiteContext = createContext<SiteInfo>(defaultSite);

export function SiteProvider({
  site,
  children,
}: {
  site: SiteInfo;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

export function useLinks() {
  return buildLinks(useContext(SiteContext));
}
