import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FanStories } from "@/components/fan-stories";
import { HomeContact } from "@/components/home-contact";
import { MatchdayBanner } from "@/components/matchday-banner";
import { OnThePitch } from "@/components/on-the-pitch";
import { ProductGrid } from "@/components/product-card";
import { StatCounters } from "@/components/stat-counters";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { getCollections, getProducts } from "@/lib/shopify";

type Props = {
  params: Promise<{ locale: string }>;
};

function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-deep-sea text-sand">
      <Image
        src="/images/home-page-hero-background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-deep-sea/75" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="mb-4 font-semibold tracking-widest text-sky-blue uppercase">
          {dict.home.heroEyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-5xl leading-tight tracking-wide uppercase sm:text-7xl">
          {dict.home.heroTitle}{" "}
          <span className="text-sun-yellow">{dict.home.heroTitleAccent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sand/85">
          {dict.home.heroSubtitle}
        </p>
        <Link
          href={localizePath(locale, "/products")}
          className="mt-10 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
        >
          {dict.common.shopNow}
        </Link>
      </div>
      <div
        aria-hidden="true"
        className="relative h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

async function FeaturedProducts({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const products = await getProducts(locale, 4);

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
          {dict.home.featuredEmptyTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-deep-sea/70">
          {dict.home.featuredEmptyBody}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
          {dict.home.featuredTitle}
        </h2>
        <Link
          href={localizePath(locale, "/products")}
          className="text-sm font-semibold text-sea-blue hover:text-deep-sea"
        >
          {dict.common.viewAll} →
        </Link>
      </div>
      <ProductGrid products={products} locale={locale} dict={dict} />
    </section>
  );
}

async function Collections({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const collections = await getCollections(locale, 6);

  if (collections.length === 0) return null;

  return (
    <section className="bg-sky-blue/15">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 font-display text-3xl tracking-wide text-deep-sea uppercase">
          {dict.home.collectionsTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                href={localizePath(locale, `/collections/${collection.handle}`)}
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-deep-sea shadow-sm transition-shadow hover:shadow-lg"
              >
                {collection.image && (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-sea/85 via-deep-sea/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 px-6 py-6 font-display text-2xl tracking-wide text-sand uppercase">
                  {collection.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClubStory({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
        {dict.home.clubStoryTitle}
      </h2>
      <p className="mt-6 font-serif text-xl leading-relaxed text-ink/85">
        {dict.home.clubStoryBody}
      </p>
    </section>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <FeaturedProducts locale={locale} dict={dict} />
      <MatchdayBanner locale={locale} dict={dict} />
      <Collections locale={locale} dict={dict} />
      <StatCounters locale={locale} stats={dict.stats} />
      <OnThePitch locale={locale} dict={dict} />
      <FanStories dict={dict} />
      <ClubStory dict={dict} />
      <HomeContact locale={locale} dict={dict} />
    </>
  );
}
