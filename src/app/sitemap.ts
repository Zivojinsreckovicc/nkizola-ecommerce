import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().origin;

  const staticRoutes: MetadataRoute.Sitemap = ["", "/products"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })
  );

  // Don't let a Shopify outage or misconfigured credentials break the build;
  // the sitemap still ships with its static routes.
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  try {
    [products, collections] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);
  } catch (error) {
    console.error("sitemap: failed to load Shopify data", error);
  }

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(product.updatedAt),
    })),
    ...collections.map((collection) => ({
      url: `${baseUrl}/collections/${collection.handle}`,
      lastModified: new Date(collection.updatedAt),
    })),
  ];
}
