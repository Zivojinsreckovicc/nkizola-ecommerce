"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  localeNames,
  locales,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M4 6h16"
        className="origin-center transition-transform duration-300"
        style={open ? { transform: "translateY(6px) rotate(45deg)" } : undefined}
      />
      <path
        d="M4 12h16"
        className="transition-opacity duration-200"
        style={open ? { opacity: 0 } : undefined}
      />
      <path
        d="M4 18h16"
        className="origin-center transition-transform duration-300"
        style={open ? { transform: "translateY(-6px) rotate(-45deg)" } : undefined}
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Inline language selector — full-width tappable rows, active one marked. */
function LanguageRows({
  locale,
  path,
  suffix,
  onSelect,
}: {
  locale: Locale;
  path: string;
  suffix: string;
  onSelect: () => void;
}) {
  return (
    <ul className="space-y-1">
      {locales.map((option) => {
        const isActive = option === locale;
        return (
          <li key={option}>
            <Link
              href={`${localizePath(option, path)}${suffix}`}
              hrefLang={option}
              aria-current={isActive ? "true" : undefined}
              onClick={onSelect}
              className={`flex items-center justify-between rounded-lg px-3 py-3 text-base transition-colors ${
                isActive
                  ? "bg-white/10 font-semibold text-sun-yellow"
                  : "text-sand/90 hover:bg-white/5 hover:text-sky-blue"
              }`}
            >
              {localeNames[option]}
              {isActive && <CheckIcon />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function LanguageSection({
  locale,
  onSelect,
}: {
  locale: Locale;
  onSelect: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { path } = splitLocale(pathname);
  const query = searchParams.toString();

  return (
    <LanguageRows
      locale={locale}
      path={path}
      suffix={query ? `?${query}` : ""}
      onSelect={onSelect}
    />
  );
}

function LanguageSectionFallback({
  locale,
  onSelect,
}: {
  locale: Locale;
  onSelect: () => void;
}) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  return (
    <LanguageRows locale={locale} path={path} suffix="" onSelect={onSelect} />
  );
}

/**
 * Full-width hamburger navigation for small screens. The panel drops down from
 * the header and animates its height open/closed. The desktop nav is unchanged
 * and simply hidden below the `md` breakpoint, where this takes over.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Close after navigating to a new route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape or a click outside the menu while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/products", label: dict.nav.shop },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <div ref={containerRef}>
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

      <div
        id="mobile-nav"
        className={`absolute inset-x-0 top-full z-20 grid bg-deep-sea text-sand transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open
            ? "grid-rows-[1fr] opacity-100 shadow-xl"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-sand/10 px-4 pt-2 pb-6">
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={localizePath(locale, link.href)}
                  onClick={close}
                  className="border-b border-sand/10 px-3 py-4 text-base font-medium tracking-wide uppercase transition-colors hover:text-sky-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="px-3 pt-5 pb-2 text-xs font-semibold tracking-widest text-sky-blue uppercase">
              {dict.nav.language}
            </p>
            <Suspense
              fallback={
                <LanguageSectionFallback locale={locale} onSelect={close} />
              }
            >
              <LanguageSection locale={locale} onSelect={close} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
