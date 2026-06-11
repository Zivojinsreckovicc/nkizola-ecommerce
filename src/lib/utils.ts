import type { Money } from "@/lib/shopify/types";

export function formatPrice({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));
}

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
}
