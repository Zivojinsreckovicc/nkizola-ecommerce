import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatCounters } from "@/components/stat-counters";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { buildAlternates } from "@/lib/i18n/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    alternates: buildAlternates("/about"),
  };
}

function AboutHero({ dict }: { dict: Dictionary }) {
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
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-4 font-semibold tracking-widest text-sky-blue uppercase">
          {dict.about.heroEyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          {dict.about.heroTitle}{" "}
          <span className="text-sun-yellow">{dict.about.heroTitleAccent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sand/85">
          {dict.about.heroBody}
        </p>
      </div>
      <div
        aria-hidden="true"
        className="relative h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

function CrestStory({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex items-center justify-center rounded-2xl bg-deep-sea p-12">
          <Image
            src="/images/izola-logo.png"
            alt={dict.about.crestAlt}
            width={280}
            height={276}
            className="h-auto w-48 sm:w-64"
          />
        </div>
        <div>
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            {dict.about.crestEyebrow}
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            {dict.about.crestTitle}{" "}
            <span className="text-sun-yellow">
              {dict.about.crestTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-deep-sea/70">{dict.about.crestBody1}</p>
          <p className="mt-4 text-deep-sea/70">{dict.about.crestBody2}</p>
        </div>
      </div>
    </section>
  );
}

function CommunitySection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="bg-sky-blue/15">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-last lg:order-first">
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            {dict.about.communityEyebrow}
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            {dict.about.communityTitle}{" "}
            <span className="text-sun-yellow">
              {dict.about.communityTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-deep-sea/70">{dict.about.communityBody1}</p>
          <p className="mt-4 text-deep-sea/70">{dict.about.communityBody2}</p>
          <Link
            href={localizePath(locale, "/contact")}
            className="mt-8 inline-block rounded-full bg-deep-sea px-8 py-4 font-display text-lg tracking-wide text-sand uppercase transition-colors hover:bg-sea-blue"
          >
            {dict.about.communityCta}
          </Link>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src="/images/image1.webp"
            alt={dict.about.communityImageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function StadiumSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-deep-sea text-sand">
      <Image
        src="/images/image2.jpg"
        alt={dict.about.stadiumImageAlt}
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-deep-sea/70" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-semibold tracking-widest text-sky-blue uppercase">
          {dict.about.stadiumEyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-wide uppercase sm:text-5xl">
          {dict.about.stadiumTitle}{" "}
          <span className="text-sun-yellow">
            {dict.about.stadiumTitleAccent}
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sand/85">
          {dict.about.stadiumBody}
        </p>
      </div>
    </section>
  );
}

function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
        {dict.about.closingTitle}
      </h2>
      <p className="mt-6 font-serif text-xl leading-relaxed text-ink/85">
        {dict.about.closingBody}
      </p>
      <Link
        href={localizePath(locale, "/products")}
        className="mt-10 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        {dict.about.closingCta}
      </Link>
    </section>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <AboutHero dict={dict} />
      <CrestStory dict={dict} />
      <CommunitySection locale={locale} dict={dict} />
      <StatCounters locale={locale} stats={dict.stats} />
      <StadiumSection dict={dict} />
      <ClosingCta locale={locale} dict={dict} />
    </>
  );
}
