import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="bg-deep-sea text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <Image
            src="/images/izola-logo.png"
            alt="NK Izola"
            width={60}
            height={75}
          />
          <p className="mt-3 max-w-xs text-sm text-sand/80">
            {dict.footer.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-semibold tracking-wide uppercase">
            {dict.footer.storeHeading}
          </p>
          <ul className="space-y-2 text-sand/80">
            <li>
              <Link
                href={localizePath(locale, "/products")}
                className="hover:text-sky-blue"
              >
                {dict.common.allProducts}
              </Link>
            </li>
            <li>
              <Link
                href={localizePath(locale, "/cart")}
                className="hover:text-sky-blue"
              >
                {dict.nav.cart}
              </Link>
            </li>
            <li>
              <Link
                href={localizePath(locale, "/contact")}
                className="hover:text-sky-blue"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-semibold tracking-wide uppercase">
            {dict.footer.clubHeading}
          </p>
          <p className="text-sand/80">{dict.footer.clubText}</p>
          <Link
            href={localizePath(locale, "/about")}
            className="mt-2 inline-block font-medium text-sky-blue hover:text-sun-yellow"
          >
            {dict.footer.aboutLink} →
          </Link>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-sand/60 sm:px-6">
          © {new Date().getFullYear()} NK Izola. {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
