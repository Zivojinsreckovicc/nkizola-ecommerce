import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

// Non-default locales that carry a visible URL prefix.
const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);

/** Request header carrying the resolved locale (read by `getRequestLocale`). */
export const LOCALE_HEADER = "x-locale";

/**
 * Locale routing (Next.js 16 renamed `middleware` → `proxy`).
 *
 * - `/en` and `/it` paths are served as-is by the `[locale]` segment.
 * - Every other path is the default locale (Slovenian) and is rewritten
 *   internally to `/sl/...` so it resolves under `[locale]` while the browser
 *   URL stays prefix-free.
 *
 * The resolved locale is also forwarded as a request header so special files
 * that don't receive route params (e.g. `not-found.tsx`) can read it.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefix = prefixedLocales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const locale: Locale = prefix ?? defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (prefix) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  // Run on everything except API routes, Next internals, metadata files and
  // static assets in /public (images live under public/images).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
