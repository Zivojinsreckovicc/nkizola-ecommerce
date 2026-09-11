import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { getCollections, getProducts } from "@/lib/shopify";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return {
    title: dict.thankYou.metaTitle,
    // A confirmation page has no value in search results, and landing on one
    // from Google is confusing. Kept out of the sitemap for the same reason.
    robots: { index: false, follow: true },
  };
}

function ThankYouHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-deep-sea text-sand">
      <Stagger
        immediate
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <StaggerItem>
          <p className="mb-4 flex items-center gap-2 font-semibold tracking-widest text-sky-blue uppercase">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-sun-yellow text-sm text-ink"
            >
              ✓
            </span>
            {dict.thankYou.eyebrow}
          </p>
        </StaggerItem>
        <StaggerItem>
          <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
            {dict.thankYou.title}{" "}
            <span className="text-sun-yellow">{dict.thankYou.titleAccent}</span>
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-6 max-w-xl text-lg text-sand/85">
            {dict.thankYou.body}
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={localizePath(locale, "/products")}
              className="inline-block rounded-full bg-sun-yellow px-8 py-4 text-center font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
            >
              {dict.thankYou.ctaShop}
            </Link>
            <Link
              href={localizePath(locale, "/")}
              className="inline-block rounded-full border border-sand/40 px-8 py-4 text-center font-display text-lg tracking-wide text-sand uppercase transition-colors hover:border-sand hover:bg-sand hover:text-deep-sea"
            >
              {dict.thankYou.ctaHome}
            </Link>
          </div>
        </StaggerItem>
      </Stagger>
      <div
        aria-hidden="true"
        className="h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

/** The shop, inlined below the fold so the wait turns into browsing. */
async function KeepBrowsing({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [products, collections] = await Promise.all([
    getProducts(locale, 8),
    getCollections(locale, 6),
  ]);

  if (products.length === 0) {
    return (
      <Reveal
        as="section"
        className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6"
      >
        <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
          {dict.home.featuredEmptyTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-deep-sea/70">
          {dict.home.featuredEmptyBody}
        </p>
      </Reveal>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
          {dict.thankYou.shopHeading}
        </h2>
        <Link
          href={localizePath(locale, "/products")}
          className="shrink-0 text-sm font-semibold text-sea-blue hover:text-deep-sea"
        >
          {dict.common.viewAll} →
        </Link>
      </Reveal>

      {collections.length > 0 && (
        <Reveal delay={0.06}>
          <nav
            aria-label={dict.home.collectionsTitle}
            className="mb-10 flex flex-wrap gap-2"
          >
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={localizePath(locale, `/collections/${collection.handle}`)}
                className="rounded-full border border-deep-sea/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-deep-sea"
              >
                {collection.title}
              </Link>
            ))}
          </nav>
        </Reveal>
      )}

      <ProductGrid products={products} locale={locale} dict={dict} />
    </section>
  );
}

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <ThankYouHero locale={locale} dict={dict} />
      <KeepBrowsing locale={locale} dict={dict} />
    </>
  );
}
