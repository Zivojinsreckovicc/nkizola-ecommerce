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

  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

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
