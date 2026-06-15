/**
 * Locale configuration — the single source of truth for the site's languages.
 *
 * URL strategy: Slovenian is the default and is served prefix-free at `/`.
 * English and Italian are prefixed (`/en`, `/it`). The `/sl` prefix is only an
 * internal rewrite target (see `src/proxy.ts`) and is never shown to users.
 */

export const locales = ["sl", "en", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sl";

/** Human-readable names for the language switcher, in each language itself. */
export const localeNames: Record<Locale, string> = {
  sl: "Slovenščina",
  en: "English",
  it: "Italiano",
};

/**
 * How each frontend locale maps onto Shopify Storefront API `@inContext`
 * language/country. Country drives the market (currency, availability);
 * language drives the translated fields.
 */
export const SHOPIFY_LOCALE: Record<
  Locale,
  { language: string; country: string }
> = {
  sl: { language: "SL", country: "SI" },
  en: { language: "EN", country: "SI" },
  it: { language: "IT", country: "IT" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Prefix an app-relative path with the locale segment, leaving the default
 * locale prefix-free. `localizePath("en", "/products")` -> "/en/products";
 * `localizePath("sl", "/products")` -> "/products".
 */
export function localizePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  // Avoid a trailing slash for the home path ("/" -> "/en", not "/en/").
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/**
 * Split a visible pathname into its locale and the remaining app path.
 * Matches on a segment boundary so `/entire` is not read as the `en` locale.
 * Unprefixed paths resolve to the default locale.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(`/${locale}`.length) };
    }
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
