"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addCartLines,
  createCart,
  getCart,
  getProduct,
  removeCartLines,
  updateCartLines,
  type CartLineInput,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import { CART_COOKIE, getCartId } from "@/lib/cart";
import { localizePath, type Locale } from "@/lib/i18n/config";
import {
  parsePrintDetails,
  printAttributes,
  requiresPrintDetails,
  RETURN_TO_FIELD,
  type PrintFieldError,
} from "@/lib/personalization";

async function addLineToCart(
  locale: Locale,
  line: CartLineInput
): Promise<Cart> {
  const cartId = await getCartId();

  // A stored cart id can be stale (e.g. after checkout), so verify it first.
  const existingCart = cartId ? await getCart(locale, cartId) : null;

  if (existingCart) {
    return addCartLines(locale, existingCart.id, [line]);
  }

  const cart = await createCart(locale, [line]);
  (await cookies()).set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart;
}

/**
 * Build the cart line for a product page submission, re-deriving on the server
 * whether custom print details are required. The browser's own validation is
 * only a convenience — this is the check that actually holds.
 */
async function buildCartLine(
  locale: Locale,
  handle: string,
  variantId: string,
  formData: FormData
): Promise<{ line: CartLineInput } | { error: PrintFieldError }> {
  const plainLine: CartLineInput = { merchandiseId: variantId, quantity: 1 };

  const product = await getProduct(locale, handle);
  const variant =
    product?.variants.find((candidate) => candidate.id === variantId) ?? null;

  // Unknown product or variant: let the Shopify mutation reject it.
  if (!product || !variant) return { line: plainLine };
  if (!requiresPrintDetails(product, variant)) return { line: plainLine };

  const parsed = parsePrintDetails(formData);
  if ("error" in parsed) return { error: parsed.error };

  return {
    line: { ...plainLine, attributes: printAttributes(parsed.details) },
  };
}

/**
 * Send the shopper back to the product page they came from, with the failing
 * field flagged. Only same-site paths are honoured.
 */
function printErrorPath(
  locale: Locale,
  handle: string,
  formData: FormData,
  error: PrintFieldError
): string {
  const returnTo = String(formData.get(RETURN_TO_FIELD) ?? "");
  const safe =
    returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : localizePath(locale, `/products/${handle}`);

  const [path, query = ""] = safe.split("?");
  const params = new URLSearchParams(query);
  params.set("printError", error);
  return `${path}?${params}`;
}

export async function addItem(
  locale: Locale,
  handle: string,
  variantId: string,
  formData: FormData
): Promise<void> {
  const result = await buildCartLine(locale, handle, variantId, formData);
  if ("error" in result) {
    redirect(printErrorPath(locale, handle, formData, result.error));
  }

  await addLineToCart(locale, result.line);
  revalidatePath("/[locale]", "layout");
  redirect(localizePath(locale, "/cart"));
}

export async function buyNow(
  locale: Locale,
  handle: string,
  variantId: string,
  formData: FormData
): Promise<void> {
  const result = await buildCartLine(locale, handle, variantId, formData);
  if ("error" in result) {
    redirect(printErrorPath(locale, handle, formData, result.error));
  }

  const cart = await addLineToCart(locale, result.line);
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
