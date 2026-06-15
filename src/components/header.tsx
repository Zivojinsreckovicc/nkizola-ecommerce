import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  LanguageSwitcher,
  LanguageSwitcherFallback,
} from "@/components/language-switcher";
import { getCurrentCart } from "@/lib/cart";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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

async function CartBadge({ locale }: { locale: Locale }) {
  const cart = await getCurrentCart(locale);
  const quantity = cart?.totalQuantity ?? 0;

  if (quantity === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-yellow px-1 text-xs font-bold text-ink">
      {quantity}
    </span>
  );
}

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const navClass =
    "text-sm font-medium tracking-wide uppercase transition-colors hover:text-sky-blue";

  return (
    <header className="sticky top-0 z-10 bg-deep-sea text-sand shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href={localizePath(locale, "/")} className="flex items-center">
          <Image
            src="/images/izola-logo.png"
            alt="NK Izola"
            width={60}
            height={75}
            priority
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link href={localizePath(locale, "/")} className={navClass}>
            {dict.nav.home}
          </Link>
          <Link href={localizePath(locale, "/products")} className={navClass}>
            {dict.nav.shop}
          </Link>
          <Link href={localizePath(locale, "/about")} className={navClass}>
            {dict.nav.about}
          </Link>
          <Link href={localizePath(locale, "/contact")} className={navClass}>
            {dict.nav.contact}
          </Link>
          <Link
            href={localizePath(locale, "/cart")}
            aria-label={dict.nav.cart}
            className="relative transition-colors hover:text-sky-blue"
          >
            <CartIcon />
            <Suspense>
              <CartBadge locale={locale} />
            </Suspense>
          </Link>
          <Suspense
            fallback={
              <LanguageSwitcherFallback
                locale={locale}
                label={dict.nav.language}
              />
            }
          >
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
