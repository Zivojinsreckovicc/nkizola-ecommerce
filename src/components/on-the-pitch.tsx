import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function OnThePitch({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src="/images/image1.webp"
            alt={dict.onThePitch.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            {dict.onThePitch.eyebrow}
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            {dict.onThePitch.title}{" "}
            <span className="text-sun-yellow">
              {dict.onThePitch.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-deep-sea/70">{dict.onThePitch.body1}</p>
          <p className="mt-4 text-deep-sea/70">{dict.onThePitch.body2}</p>
          <Link
            href={localizePath(locale, "/products")}
            className="mt-8 inline-block rounded-full bg-deep-sea px-8 py-4 font-display text-lg tracking-wide text-sand uppercase transition-colors hover:bg-sea-blue"
          >
            {dict.onThePitch.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
