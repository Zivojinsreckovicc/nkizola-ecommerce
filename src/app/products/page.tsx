import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { getCollections, getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse all official NK Izola merchandise — jerseys, scarves, fan wear and accessories.",
};

export default async function ProductsPage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl tracking-wide text-deep-sea uppercase">
        Shop
      </h1>

      {collections.length > 0 && (
        <nav aria-label="Collections" className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-deep-sea px-4 py-2 text-sm font-medium text-sand">
            All
          </span>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="rounded-full border border-deep-sea/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-deep-sea"
            >
              {collection.title}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-16 text-center text-deep-sea/70">
            No products available yet — the first drop is on its way.
          </p>
        )}
      </div>
    </div>
  );
}
