import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CATALOG_TAG } from "@/lib/shopify";

/**
 * Shopify webhook target (product and collection create/update/delete).
 *
 * Catalog fetches are cached for 5 minutes; this expires them immediately so
 * deleted or edited products disappear from listings on the next request.
 * Requests are authenticated with Shopify's HMAC signature.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { revalidated: false, message: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", secret).update(body).digest("base64");

  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    return Response.json(
      { revalidated: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  revalidateTag(CATALOG_TAG, { expire: 0 });

  return Response.json({ revalidated: true, now: Date.now() });
}
