import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils";
import { defaultLocale, localizePath, locales } from "./config";

/**
 * Build canonical + hreflang alternates for a page, given its app-relative path
 * WITHOUT a locale prefix (e.g. "/products/home-jersey", or "/" for home).
 *
 * The canonical is always the prefix-free Slovenian (default) URL, and every
 * locale — plus `x-default` — is listed so search engines can map translations.
 */
export function buildAlternates(path: string): Metadata["alternates"] {
  const { origin } = getSiteUrl();
  const canonical = `${origin}${localizePath(defaultLocale, path)}`;

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${origin}${localizePath(locale, path)}`;
  }
  languages["x-default"] = canonical;

  return { canonical, languages };
}
