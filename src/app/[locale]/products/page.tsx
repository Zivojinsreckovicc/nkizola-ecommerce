import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildAlternates } from "@/lib/i18n/seo";
import { getCollections, getProducts } from "@/lib/shopify";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return {
    title: dict.products.metaTitle,
    description: dict.products.metaDescription,
    alternates: buildAlternates("/products"),
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const [products, collections] = await Promise.all([
    getProducts(locale),
    getCollections(locale),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl tracking-wide text-deep-sea uppercase">
        {dict.products.title}
      </h1>

      {collections.length > 0 && (
        <nav aria-label="Collections" className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-deep-sea px-4 py-2 text-sm font-medium text-sand">
            {dict.products.filterAll}
          </span>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={localizePath(locale, `/collections/${collection.handle}`)}
              className="rounded-full border border-deep-sea/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-deep-sea"
            >
              {collection.title}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} locale={locale} dict={dict} />
        ) : (
          <p className="py-16 text-center text-deep-sea/70">
            {dict.products.empty}
          </p>
        )}
      </div>
    </div>
  );
}
