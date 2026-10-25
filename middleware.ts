import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

// Middleware to handle locale prefixes while excluding /portal and /admin
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If someone entered /ru/portal/... or /en/portal/..., strip locale prefix and redirect to /portal/...
  const portalLocaleMatch = pathname.match(/^\/(ru|hy|en)(\/portal(?:\/.*)?)$/);
  if (portalLocaleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = portalLocaleMatch[2];
    return NextResponse.redirect(url, 307);
  }

  // 2. Also handle /ru/admin/... if accessed with locale prefix
  const adminLocaleMatch = pathname.match(/^\/(ru|hy|en)(\/admin(?:\/.*)?)$/);
  if (adminLocaleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = adminLocaleMatch[2];
    return NextResponse.redirect(url, 307);
  }

  // 3. Directly allow /portal and /admin without locale prefix
  if (pathname === "/portal" || pathname.startsWith("/portal/") || pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // 4. If URL already has valid locale, let it pass
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  // 5. Otherwise redirect locale-less public pages: / -> /ru, /tours -> /ru/tours
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Catch all routes except Next.js internals, API routes, and static files
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
