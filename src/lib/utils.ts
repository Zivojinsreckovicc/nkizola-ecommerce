import type { Money } from "@/lib/shopify/types";

export function formatPrice({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));
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
