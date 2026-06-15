import "server-only";
import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * Resolve the current locale from the request header set by the proxy. For
 * Server Components that don't receive route params (e.g. `not-found.tsx`).
 */
export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get("x-locale");
  return value && isLocale(value) ? value : defaultLocale;
}
