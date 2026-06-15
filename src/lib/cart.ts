import { cookies } from "next/headers";
import { getCart, isShopifyConfigured } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import type { Locale } from "@/lib/i18n/config";

export const CART_COOKIE = "cartId";

export async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

/**
 * Read the current visitor's cart, if any. For server components. The locale
 * drives the Shopify language context so line/product titles and the
 * checkout URL come back in the selected language.
 */
export async function getCurrentCart(locale: Locale): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;

  const cartId = await getCartId();
  if (!cartId) return null;

  return getCart(locale, cartId);
}
