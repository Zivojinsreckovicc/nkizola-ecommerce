import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { getContactDetails } from "@/lib/contact";
import { isLocale } from "@/lib/i18n/config";
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
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: buildAlternates("/contact"),
  };
}

function ContactHeader({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-deep-sea text-sand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-4 font-semibold tracking-widest text-sky-blue uppercase">
          {dict.contact.headerEyebrow}
        </p>
        <h1 className="max-w-2xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          {dict.contact.headerTitle}{" "}
          <span className="text-sun-yellow">
            {dict.contact.headerTitleAccent}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sand/85">
          {dict.contact.headerBody}
        </p>
      </div>
      <div
        aria-hidden="true"
        className="h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const details = getContactDetails(dict);

  return (
    <>
      <ContactHeader dict={dict} />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-deep-sea uppercase">
              {dict.contact.reachHeading}
            </h2>
            <dl className="mt-8 space-y-6">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-sm font-semibold tracking-wide text-sea-blue uppercase">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-lg text-ink/85">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="underline-offset-2 hover:text-sea-blue hover:underline"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 font-serif text-lg leading-relaxed text-ink/75">
              {dict.contact.note}
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide text-deep-sea uppercase">
              {dict.contact.sendHeading}
            </h2>
            <div className="mt-8">
              <ContactForm locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
