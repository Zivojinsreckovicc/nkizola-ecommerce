import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { getCurrentCart } from "@/lib/cart";
import type { CartLine } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { removeItem, updateItemQuantity } from "./actions";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your NK Izola order before checkout.",
};

function LineItem({ line }: { line: CartLine }) {
  const { merchandise } = line;
  const options = merchandise.selectedOptions
    .filter((option) => option.name !== "Title" || option.value !== "Default Title")
    .map((option) => option.value)
    .join(" / ");

  return (
    <li className="flex gap-4 py-6">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-white">
        {merchandise.product.featuredImage ? (
          <Image
            src={merchandise.product.featuredImage.url}
            alt={
              merchandise.product.featuredImage.altText ??
              merchandise.product.title
            }
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-deep-sea/30">
            NK
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/products/${merchandise.product.handle}`}
              className="font-semibold text-ink hover:text-sea-blue"
            >
              {merchandise.product.title}
            </Link>
            {options && <p className="mt-1 text-sm text-ink/60">{options}</p>}
          </div>
          <p className="font-semibold">{formatPrice(line.cost.totalAmount)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-deep-sea/30 bg-white">
            <form
              action={updateItemQuantity.bind(null, line.id, line.quantity - 1)}
            >
              <SubmitButton
                pendingText="−"
                className="px-3 py-1 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </SubmitButton>
            </form>
            <span className="min-w-6 text-center text-sm font-medium">
              {line.quantity}
            </span>
            <form
              action={updateItemQuantity.bind(null, line.id, line.quantity + 1)}
            >
              <SubmitButton
                pendingText="+"
                className="px-3 py-1 text-lg"
                aria-label="Increase quantity"
              >
                +
              </SubmitButton>
            </form>
          </div>

          <form action={removeItem.bind(null, line.id)}>
            <SubmitButton
              pendingText="Removing…"
              className="text-sm text-ink/60 underline hover:text-ink"
            >
              Remove
            </SubmitButton>
          </form>
        </div>
      </div>
    </li>
  );
}

export default async function CartPage() {
  const cart = await getCurrentCart();
  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl tracking-wide text-deep-sea uppercase">
        Your cart
      </h1>

      {isEmpty ? (
        <div className="py-16 text-center">
          <p className="text-deep-sea/70">
            Your cart is empty — the kit room is fully stocked though.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-deep-sea/10">
            {cart.lines.map((line) => (
              <LineItem key={line.id} line={line} />
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-white p-6">
            <div className="flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(cart.cost.subtotalAmount)}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(cart.cost.totalAmount)}</span>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              Shipping and taxes calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="mt-6 block rounded-full bg-sun-yellow px-8 py-4 text-center font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
            >
              Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
}
