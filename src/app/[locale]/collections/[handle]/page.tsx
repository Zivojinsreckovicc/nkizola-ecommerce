import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildAlternates } from "@/lib/i18n/seo";
import { getCollection, getCollectionProducts } from "@/lib/shopify";

type Props = {
  params: Promise<{ locale: string; handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, handle } = await params;
  if (!isLocale(locale)) return {};

  const [dict, collection] = await Promise.all([
    getDictionary(locale),
    getCollection(locale, handle),
  ]);
  if (!collection) return {};

  return {
    title: collection.title,
    description:
      collection.description ||
      dict.collections.metaDescriptionTemplate.replace(
        "{title}",
        collection.title.toLowerCase()
      ),
    alternates: buildAlternates(`/collections/${handle}`),
  };
}

export default async function CollectionPage({ params }: Props) {
  const { locale, handle } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, collection, products] = await Promise.all([
    getDictionary(locale),
    getCollection(locale, handle),
    getCollectionProducts(locale, handle),
  ]);

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href={localizePath(locale, "/products")}
        className="text-sm font-semibold text-sea-blue hover:text-deep-sea"
      >
        ← {dict.common.backToProducts}
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
          <ProductGrid products={products} locale={locale} dict={dict} />
        ) : (
          <p className="py-16 text-center text-deep-sea/70">
            {dict.collections.empty}
          </p>
        )}
      </div>
    </div>
  );
}
