import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StatCounters } from "@/components/stat-counters";

export const metadata: Metadata = {
  title: "About NK Izola",
  description:
    "The story behind NK Izola — the football club of Izola, Slovenia. Its crest, its home at Stadion Drvarski, and the community that fills the stands.",
};

function AboutHero() {
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
          About the club
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          One town. One badge.{" "}
          <span className="text-sun-yellow">One family.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-sand/85">
          NK Izola is the football club of Izola — a small fishing town on the
          Slovenian coast where the sea, the sun and Saturday afternoons at
          Stadion Drvarski all run together.
        </p>
      </div>
      <div
        aria-hidden="true"
        className="relative h-2 bg-linear-to-r from-sky-blue via-sea-blue to-sun-yellow"
      />
    </section>
  );
}

function CrestStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex items-center justify-center rounded-2xl bg-deep-sea p-12">
          <Image
            src="/images/izola-logo.png"
            alt="The NK Izola club crest"
            width={280}
            height={276}
            className="h-auto w-48 sm:w-64"
          />
        </div>
        <div>
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            The crest
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            Sea, sun and{" "}
            <span className="text-sun-yellow">a ball at the centre</span>
          </h2>
          <p className="mt-4 text-deep-sea/70">
            The badge takes its colours straight from the coast: blue for the
            Adriatic that the town looks out on, and yellow for the sun that
            sits over it on a matchday afternoon. It&rsquo;s the same blue and
            yellow you&rsquo;ll see on the terraces at Stadion Drvarski, on
            training tops around town, and on every shirt in this store.
          </p>
          <p className="mt-4 text-deep-sea/70">
            Wearing the crest means something here — it ties the first team,
            the youth sides and the supporters together under one badge, win
            or lose.
          </p>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="bg-sky-blue/15">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-last lg:order-first">
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            Built from the ground up
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            A small town club{" "}
            <span className="text-sun-yellow">with big ambitions</span>
          </h2>
          <p className="mt-4 text-deep-sea/70">
            Izola isn&rsquo;t a big place, but on matchday it feels like the
            whole town shows up. The senior squad battles it out on the same
            pitch where the youth teams train all week, chasing the same
            colours and the same crest.
          </p>
          <p className="mt-4 text-deep-sea/70">
            This store exists to back that effort. Every order helps fund kit,
            travel and the academy programmes that keep bringing players
            through from the local streets onto the pitch at Stadion
            Drvarski.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-deep-sea px-8 py-4 font-display text-lg tracking-wide text-sand uppercase transition-colors hover:bg-sea-blue"
          >
            Get in touch
          </Link>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src="/images/image1.webp"
            alt="An NK Izola player driving forward past a defender during a home match"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function StadiumSection() {
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
          Our home
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-wide uppercase sm:text-5xl">
          Stadion Drvarski.{" "}
          <span className="text-sun-yellow">Where it all happens.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sand/85">
          Tucked close to the coast, Stadion Drvarski is where NK Izola has
          played its football for generations. No corporate boxes, no
          distance from the pitch — just the squad, the bench and a crowd of
          blue and yellow close enough to hear every shout.
        </p>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase">
        Join the family
      </h2>
      <p className="mt-6 font-serif text-xl leading-relaxed text-ink/85">
        Whether you&rsquo;re from Izola, the wider coast, or just love the
        game, there&rsquo;s a place for you in the stands. Pick up your
        colours, follow the squad, and we&rsquo;ll see you at Stadion
        Drvarski.
      </p>
      <Link
        href="/products"
        className="mt-10 inline-block rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85"
      >
        Shop the store
      </Link>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CrestStory />
      <CommunitySection />
      <StatCounters />
      <StadiumSection />
      <ClosingCta />
    </>
  );
}
