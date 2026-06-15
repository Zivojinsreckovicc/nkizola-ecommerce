"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Illustrative club figures — confirm and update with the real numbers. Labels
// are localized and passed in (in matching order) from the dictionary.
const figures: { value: number; suffix?: string }[] = [
  { value: 100, suffix: "+" },
  { value: 38, suffix: "+" },
  { value: 1200, suffix: "+" },
  { value: 11 },
];

const DURATION_MS = 1600;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCounters({
  locale,
  stats,
}: {
  locale: Locale;
  stats: Dictionary["stats"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<number[]>(() => figures.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const finalValues = figures.map((figure) => figure.value);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        // Reduced motion: jump straight to the final figures, no count-up.
        if (prefersReducedMotion) {
          setValues(finalValues);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = easeOutCubic(progress);
          setValues(finalValues.map((value) => Math.round(value * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-deep-sea text-sand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center font-display text-3xl tracking-wide uppercase sm:text-4xl">
          {stats.heading}{" "}
          <span className="text-sun-yellow">{stats.headingAccent}</span>
        </h2>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {figures.map((figure, index) => (
            <div key={stats.labels[index]} className="text-center">
              <dd className="font-display text-5xl tracking-wide text-sun-yellow tabular-nums sm:text-6xl">
                {values[index].toLocaleString(locale)}
                {figure.suffix}
              </dd>
              <dt className="mt-3 text-sm font-medium tracking-wide text-sand/80 uppercase">
                {stats.labels[index]}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
