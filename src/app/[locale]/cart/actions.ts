"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import { CART_COOKIE, getCartId } from "@/lib/cart";
import { localizePath, type Locale } from "@/lib/i18n/config";

async function addLineToCart(
  locale: Locale,
  variantId: string
): Promise<Cart> {
  const cartId = await getCartId();

  // A stored cart id can be stale (e.g. after checkout), so verify it first.
  const existingCart = cartId ? await getCart(locale, cartId) : null;

  if (existingCart) {
    return addCartLines(locale, existingCart.id, [
      { merchandiseId: variantId, quantity: 1 },
    ]);
  }

  const cart = await createCart(locale, [
    { merchandiseId: variantId, quantity: 1 },
  ]);
  (await cookies()).set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart;
}

export async function addItem(
  locale: Locale,
  variantId: string
): Promise<void> {
  await addLineToCart(locale, variantId);
  revalidatePath("/[locale]", "layout");
  redirect(localizePath(locale, "/cart"));
}

export async function buyNow(
  locale: Locale,
  variantId: string
): Promise<void> {
  const cart = await addLineToCart(locale, variantId);
  revalidatePath("/[locale]", "layout");
  redirect(cart.checkoutUrl);
}

export async function updateItemQuantity(
  locale: Locale,
  lineId: string,
  quantity: number
): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  if (quantity <= 0) {
    await removeCartLines(locale, cartId, [lineId]);
  } else {
    await updateCartLines(locale, cartId, [{ id: lineId, quantity }]);
  }

  revalidatePath("/[locale]", "layout");
}

export async function removeItem(
  locale: Locale,
  lineId: string
): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  await removeCartLines(locale, cartId, [lineId]);
  revalidatePath("/[locale]", "layout");
}
