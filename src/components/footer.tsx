import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-deep-sea text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-xl tracking-wide">
            NK <span className="text-sun-yellow">IZOLA</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-sand/80">
            The official store of NK Izola. Worn by the squad, made for the
            supporters on the Slovenian coast.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-semibold tracking-wide uppercase">Store</p>
          <ul className="space-y-2 text-sand/80">
            <li>
              <Link href="/products" className="hover:text-sky-blue">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-sky-blue">
                Cart
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-semibold tracking-wide uppercase">Club</p>
          <p className="text-sand/80">
            One town. One club. Support NK Izola — every purchase backs the
            squad.
          </p>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-sand/60 sm:px-6">
          © {new Date().getFullYear()} NK Izola. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
