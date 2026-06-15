import type { MetadataRoute } from "next";
import { defaultLocale, localizePath, locales } from "@/lib/i18n/config";
import { getCollections, getProducts } from "@/lib/shopify";
import { getSiteUrl } from "@/lib/utils";

const baseUrl = getSiteUrl().origin;

/**
 * One sitemap entry per page: the canonical is the prefix-free Slovenian URL,
 * with `alternates.languages` listing every locale (en/it prefixed).
 */
function entry(path: string, lastModified: Date): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${baseUrl}${localizePath(locale, path)}`;
  }

  return {
    url: `${baseUrl}${localizePath(defaultLocale, path)}`,
    lastModified,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["/", "/products", "/about", "/contact"].map((route) =>
    entry(route, now)
  );

  // Don't let a Shopify outage or misconfigured credentials break the build;
  // the sitemap still ships with its static routes. Handles are locale-stable,
  // so the default locale is enough to enumerate them.
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  try {
    [products, collections] = await Promise.all([
      getProducts(defaultLocale),
      getCollections(defaultLocale),
    ]);
  } catch (error) {
    console.error("sitemap: failed to load Shopify data", error);
  }

  return [
    ...staticRoutes,
    ...products.map((product) =>
      entry(`/products/${product.handle}`, new Date(product.updatedAt))
    ),
    ...collections.map((collection) =>
      entry(`/collections/${collection.handle}`, new Date(collection.updatedAt))
    ),
  ];
}
