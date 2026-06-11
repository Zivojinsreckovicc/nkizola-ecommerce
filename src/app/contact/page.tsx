import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the NK Izola store team — questions about orders, sizing, stock or club merchandise from the Slovenian coast.",
};

type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

const details: ContactDetail[] = [
  { label: "Email", value: "store@nkizola.si", href: "mailto:store@nkizola.si" },
  { label: "Find us", value: "Izola, Slovenian coast" },
  { label: "Matchdays", value: "Stadion Drvarski — every home game" },
];

function ContactHeader() {
  return (
    <section className="bg-deep-sea text-sand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="mb-4 font-semibold tracking-widest text-sky-blue uppercase">
          We&rsquo;re listening
        </p>
        <h1 className="max-w-2xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          Get in touch <span className="text-sun-yellow">with the club</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sand/85">
          Questions about an order, sizing, restocks or anything blue and
          yellow? Drop us a line — a supporter on the other side will answer.
        </p>
      </div>
      <div
        aria-hidden="true"
        className="h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-deep-sea uppercase">
              Reach the store
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
              Every message helps us serve the supporters better. Orders and
              checkout are handled securely through Shopify.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide text-deep-sea uppercase">
              Send a message
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
