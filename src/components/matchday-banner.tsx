import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function MatchdayBanner({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="relative overflow-hidden bg-deep-sea text-sand">
      <Image
        src="/images/image2.jpg"
        alt={dict.matchday.imageAlt}
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-deep-sea/70" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-semibold tracking-widest text-sky-blue uppercase">
          {dict.matchday.eyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-wide uppercase sm:text-5xl">
          {dict.matchday.title}{" "}
          <span className="text-sun-yellow">{dict.matchday.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sand/85">
          {dict.matchday.body}
        </p>
        <Link
          href={localizePath(locale, "/products")}
          className="mt-10 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
        >
          {dict.matchday.cta}
        </Link>
      </div>
    </section>
  );
}
