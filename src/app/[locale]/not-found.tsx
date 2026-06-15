import Link from "next/link";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl text-sky-blue">404</p>
      <h1 className="mt-4 font-display text-3xl tracking-wide text-deep-sea uppercase">
        {dict.notFound.title}
      </h1>
      <p className="mt-4 text-deep-sea/70">{dict.notFound.body}</p>
      <Link
        href={localizePath(locale, "/products")}
        className="mt-8 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        {dict.notFound.cta}
      </Link>
    </div>
  );
}
