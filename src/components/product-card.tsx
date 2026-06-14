import Image from "next/image";
import Link from "next/link";
import { addItem, buyNow } from "@/app/cart/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const variant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const canPurchase = product.availableForSale && Boolean(variant);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-deep-sea/10 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-square overflow-hidden bg-sky-blue/10"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-deep-sea/30">
            NK IZOLA
          </div>
        )}
        {!product.availableForSale && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold tracking-wide text-sand uppercase">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="line-clamp-2 font-display text-base tracking-wide text-deep-sea uppercase transition-colors group-hover:text-sea-blue">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-lg font-semibold text-ink">
          {formatPrice(product.priceRange.minVariantPrice)}
        </p>

        <div className="mt-4 flex flex-col gap-2 pt-1">
          {canPurchase ? (
            <>
              <form action={buyNow.bind(null, variant.id)}>
                <SubmitButton
                  pendingText="Redirecting…"
                  className="w-full rounded-full bg-sun-yellow px-4 py-2.5 text-xs font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-sun-yellow/85"
                >
                  Buy now
                </SubmitButton>
              </form>
              <form action={addItem.bind(null, variant.id)}>
                <SubmitButton
                  pendingText="Adding…"
                  className="w-full rounded-full border border-deep-sea/30 px-4 py-2.5 text-xs font-semibold tracking-widest text-deep-sea uppercase transition-colors hover:border-deep-sea hover:bg-deep-sea hover:text-sand"
                >
                  Add to cart
                </SubmitButton>
              </form>
            </>
          ) : (
            <span className="block rounded-full bg-ink/5 px-4 py-2.5 text-center text-xs font-semibold tracking-widest text-ink/40 uppercase">
              Sold out
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
