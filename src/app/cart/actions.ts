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
import { CART_COOKIE, getCartId } from "@/lib/cart";

export async function addItem(variantId: string): Promise<void> {
  const cartId = await getCartId();

  // A stored cart id can be stale (e.g. after checkout), so verify it first.
  const existingCart = cartId ? await getCart(cartId) : null;

  if (existingCart) {
    await addCartLines(existingCart.id, [
      { merchandiseId: variantId, quantity: 1 },
    ]);
  } else {
    const cart = await createCart([{ merchandiseId: variantId, quantity: 1 }]);
    (await cookies()).set(CART_COOKIE, cart.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  revalidatePath("/", "layout");
  redirect("/cart");
}

export async function updateItemQuantity(
  lineId: string,
  quantity: number
): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  if (quantity <= 0) {
    await removeCartLines(cartId, [lineId]);
  } else {
    await updateCartLines(cartId, [{ id: lineId, quantity }]);
  }

  revalidatePath("/", "layout");
}

export async function removeItem(lineId: string): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  await removeCartLines(cartId, [lineId]);
  revalidatePath("/", "layout");
}
