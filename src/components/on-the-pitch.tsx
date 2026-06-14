import Image from "next/image";
import Link from "next/link";

export function OnThePitch() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src="/images/image1.webp"
            alt="An NK Izola forward driving at a defender during a home match"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            From the pitch
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            Ninety minutes.{" "}
            <span className="text-sun-yellow">Every single week.</span>
          </h2>
          <p className="mt-4 text-deep-sea/70">
            This is what Saturday looks like in Izola — first touches,
            last-ditch tackles, and a town&rsquo;s worth of noise from the
            touchline. The squad gives everything for the crest, week in,
            week out.
          </p>
          <p className="mt-4 text-deep-sea/70">
            Every jersey, scarf and training top sold in this store helps
            keep that going — from the first team down to the youth sides
            chasing the same dream.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-deep-sea px-8 py-4 font-display text-lg tracking-wide text-sand uppercase transition-colors hover:bg-sea-blue"
          >
            Shop the kit
          </Link>
        </div>
      </div>
    </section>
  );
}
