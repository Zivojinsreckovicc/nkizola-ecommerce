import Image from "next/image";
import Link from "next/link";

export function MatchdayBanner() {
  return (
    <section className="relative overflow-hidden bg-deep-sea text-sand">
      <Image
        src="/images/image2.jpg"
        alt="NK Izola and the visiting side lined up at the centre circle before kickoff at Stadion Drvarski"
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-deep-sea/70" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-semibold tracking-widest text-sky-blue uppercase">
          Matchday at Stadion Drvarski
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-wide uppercase sm:text-5xl">
          Two teams walk out.{" "}
          <span className="text-sun-yellow">One town holds its breath.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sand/85">
          Every home fixture, the squad lines up on this same pitch with the
          Adriatic at their backs and the stands full of blue and yellow.
          Whatever you wear on the terraces, they wear on the grass.
        </p>
        <Link
          href="/products"
          className="mt-10 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
        >
          Shop matchday gear
        </Link>
      </div>
    </section>
  );
}
