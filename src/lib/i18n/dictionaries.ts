import "server-only";
import type { Locale } from "./config";
import type sl from "./dictionaries/sl.json";

/**
 * The shape of a dictionary, derived from the Slovenian (source) dictionary.
 * JSON modules are typed with general `string` fields, so all three locale
 * files share this structure — and TypeScript flags any that drift.
 */
export type Dictionary = typeof sl;

/**
 * Per-locale UI dictionaries, loaded on demand. Because these are dynamic
 * imports inside Server Components, the JSON never ships to the client bundle —
 * only the rendered HTML reaches the browser.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  sl: () => import("./dictionaries/sl.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
