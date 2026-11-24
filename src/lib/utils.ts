import type { Money, Product, ProductVariant } from "@/lib/shopify/types";
import type { Locale } from "@/lib/i18n/config";

export function formatPrice(
  { amount, currencyCode }: Money,
  locale: Locale = "sl"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));
}

/** True when Shopify lists a compare-at price above the selling price. */
export function isDiscounted(
  price: Money,
  compareAtPrice: Money | null
): compareAtPrice is Money {
  return (
    compareAtPrice !== null &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
  );
}

/**
 * The price a product is shown at — the given variant's, or else the lowest
 * variant price — together with the compare-at price that belongs to it.
 */
export function getProductPrice(
  product: Product,
  variant?: ProductVariant | null
): { price: Money; compareAtPrice: Money | null } {
  if (variant) {
    return { price: variant.price, compareAtPrice: variant.compareAtPrice };
  }

  const price = product.priceRange.minVariantPrice;
  const cheapest = product.variants.find(
    (v) => parseFloat(v.price.amount) === parseFloat(price.amount)
  );
  return { price, compareAtPrice: cheapest?.compareAtPrice ?? null };
}

export function getSiteUrl(): URL {
  // Prefer an explicit canonical URL, then Vercel's deployment URL, then local dev.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const raw =
    explicit ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

  // Tolerate values entered without a protocol (e.g. "nkizola.vercel.app").
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}
