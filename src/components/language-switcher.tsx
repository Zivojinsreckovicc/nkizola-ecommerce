"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  localeNames,
  locales,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Switcher({
  locale,
  label,
  path,
  suffix,
}: {
  locale: Locale;
  label: string;
  path: string;
  suffix: string;
}) {
  return (
    <details className="group relative">
      <summary
        aria-label={label}
        className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium tracking-wide uppercase transition-colors hover:text-sky-blue [&::-webkit-details-marker]:hidden"
      >
        <GlobeIcon />
        {locale.toUpperCase()}
      </summary>
      <ul className="absolute right-0 z-20 mt-2 min-w-44 overflow-hidden rounded-lg border border-deep-sea/10 bg-white py-1 text-ink shadow-lg">
        {locales.map((option) => {
          const isActive = option === locale;
          return (
            <li key={option}>
              <Link
                href={`${localizePath(option, path)}${suffix}`}
                hrefLang={option}
                aria-current={isActive ? "true" : undefined}
                className={`block px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-sea-blue"
                    : "hover:bg-sky-blue/10"
                }`}
              >
                {localeNames[option]}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/**
 * Switches between locales while preserving the current page and query string.
 * The visible pathname (e.g. `/en/products/x`) is stripped of its locale prefix
 * and re-prefixed for the target locale, dropping the prefix for the default.
 *
 * `useSearchParams` opts the tree into client rendering, so callers wrap this in
 * a Suspense boundary with `LanguageSwitcherFallback` (which preserves the page
 * but not the query string) shown during static prerender.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { path } = splitLocale(pathname);
  const query = searchParams.toString();

  return (
    <Switcher
      locale={locale}
      label={label}
      path={path}
      suffix={query ? `?${query}` : ""}
    />
  );
}

export function LanguageSwitcherFallback({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);

  return <Switcher locale={locale} label={label} path={path} suffix="" />;
}
