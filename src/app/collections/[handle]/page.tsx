import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { getCollection, getCollectionProducts } from "@/lib/shopify";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) return {};

  return {
    title: collection.title,
    description:
      collection.description ||
      `Official NK Izola ${collection.title.toLowerCase()} — shop the collection.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
  ]);

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/products"
        className="text-sm font-semibold text-sea-blue hover:text-deep-sea"
      >
        ← All products
      </Link>
      <h1 className="mt-4 font-display text-4xl tracking-wide text-deep-sea uppercase">
        {collection.title}
      </h1>
      {collection.description && (
        <p className="mt-3 max-w-2xl text-deep-sea/80">
          {collection.description}
        </p>
      )}

      <div className="mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-16 text-center text-deep-sea/70">
            Nothing in this collection yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
