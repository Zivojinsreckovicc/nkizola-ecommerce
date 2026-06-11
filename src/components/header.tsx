import Link from "next/link";
import { Suspense } from "react";
import { getCurrentCart } from "@/lib/cart";

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

async function CartBadge() {
  const cart = await getCurrentCart();
  const quantity = cart?.totalQuantity ?? 0;

  if (quantity === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-yellow px-1 text-xs font-bold text-ink">
      {quantity}
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-deep-sea text-sand shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl tracking-wide">
          NK <span className="text-sun-yellow">IZOLA</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium tracking-wide uppercase transition-colors hover:text-sky-blue"
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium tracking-wide uppercase transition-colors hover:text-sky-blue"
          >
            Contact
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative transition-colors hover:text-sky-blue"
          >
            <CartIcon />
            <Suspense>
              <CartBadge />
            </Suspense>
          </Link>
        </nav>
      </div>
    </header>
  );
}
