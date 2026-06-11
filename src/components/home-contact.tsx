import { ContactForm } from "@/components/contact-form";

const details = [
  { label: "Email", value: "store@nkizola.si", href: "mailto:store@nkizola.si" },
  { label: "Find us", value: "Izola, Slovenian coast" },
  { label: "Matchdays", value: "Stadion Drvarski — every home game" },
];

export function HomeContact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="overflow-hidden rounded-3xl bg-deep-sea text-sand shadow-xl">
        <div className="h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow" />
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 font-semibold tracking-widest text-sky-blue uppercase">
              Say hello
            </p>
            <h2 className="font-display text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
              Questions? <span className="text-sun-yellow">Talk to us</span>
            </h2>
            <p className="mt-4 max-w-md text-sand/85">
              Orders, sizing, restocks or anything blue and yellow — a supporter
              on the other side will get back to you.
            </p>
            <dl className="mt-8 space-y-4">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs font-semibold tracking-widest text-sky-blue uppercase">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sand/90">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="underline-offset-2 hover:text-sun-yellow hover:underline"
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
          </div>

          <div className="rounded-2xl bg-sand p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
