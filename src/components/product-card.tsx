import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-sky-blue/10">
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
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-sand">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ink">{product.title}</h3>
        <p className="mt-1 text-sm text-deep-sea">
          {formatPrice(product.priceRange.minVariantPrice)}
        </p>
      </div>
    </Link>
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
