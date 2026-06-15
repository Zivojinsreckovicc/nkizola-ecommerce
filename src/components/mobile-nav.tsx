"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  LanguageSwitcher,
  LanguageSwitcherFallback,
} from "@/components/language-switcher";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

/**
 * Hamburger navigation for small screens. The desktop nav is unchanged and
 * simply hidden below the `md` breakpoint, where this takes over.
 */
export function MobileNav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after navigating to a new route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/products", label: dict.nav.shop },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={dict.nav.menu}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center transition-colors hover:text-sky-blue"
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <>
          {/* Tap outside to close. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            id="mobile-nav"
            className="absolute right-0 top-full z-20 mt-3 w-56 overflow-hidden rounded-xl border border-deep-sea/10 bg-white text-ink shadow-lg"
          >
            <nav className="flex flex-col py-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={localizePath(locale, link.href)}
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-sky-blue/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-deep-sea/10 px-5 py-3">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
