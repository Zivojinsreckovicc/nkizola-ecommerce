import { cookies } from "next/headers";
import { getCart, isShopifyConfigured } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

export const CART_COOKIE = "cartId";

export async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

/** Read the current visitor's cart, if any. For server components. */
export async function getCurrentCart(): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;

  const cartId = await getCartId();
  if (!cartId) return null;

  return getCart(cartId);
}
