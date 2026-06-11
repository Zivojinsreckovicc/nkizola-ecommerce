import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { VariantSelector } from "@/components/variant-selector";
import { getProduct } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return {};

  return {
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description,
    openGraph: product.featuredImage
      ? {
          images: [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText ?? product.title,
            },
          ],
        }
      : undefined,
  };
}

function resolveSelectedOptions(
  product: Product,
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string> {
  const defaults =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];

  const selected: Record<string, string> = {};
  for (const option of defaults?.selectedOptions ?? []) {
    const fromUrl = searchParams[option.name];
    selected[option.name] =
      typeof fromUrl === "string" ? fromUrl : option.value;
  }
  return selected;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ handle }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const product = await getProduct(handle);

  if (!product) notFound();

  const selectedOptions = resolveSelectedOptions(
    product,
    resolvedSearchParams
  );
  const selectedVariant =
    product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    ) ?? null;

  const price = selectedVariant
    ? formatPrice(selectedVariant.price)
    : formatPrice(product.priceRange.minVariantPrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/products"
        className="text-sm font-semibold text-sea-blue hover:text-deep-sea"
      >
        ← All products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-4xl text-deep-sea/30">
                NK IZOLA
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <ul className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image) => (
                <li
                  key={image.url}
                  className="relative aspect-square overflow-hidden rounded-lg bg-white"
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.title}
                    fill
                    sizes="(max-width: 1024px) 25vw, 12vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl tracking-wide text-deep-sea uppercase">
            {product.title}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-ink">{price}</p>

          <div className="mt-8">
            <VariantSelector
              product={product}
              selectedOptions={selectedOptions}
            />
          </div>

          <div className="mt-8">
            <AddToCart variant={selectedVariant} />
          </div>

          {product.descriptionHtml && (
            <div
              className="product-description mt-10 leading-relaxed text-ink/85"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
