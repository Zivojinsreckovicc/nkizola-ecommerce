"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  label: string;
  suffix?: string;
};

// Illustrative club figures — confirm and update with the real numbers.
const stats: Stat[] = [
  { value: 100, suffix: "+", label: "Years on the coast" },
  { value: 38, suffix: "+", label: "League goals this season" },
  { value: 1200, suffix: "+", label: "Members & supporters" },
  { value: 11, label: "Active youth teams" },
];

const DURATION_MS = 1600;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCounters() {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<number[]>(() => stats.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const finalValues = stats.map((stat) => stat.value);
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
          The club <span className="text-sun-yellow">in numbers</span>
        </h2>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <dd className="font-display text-5xl tracking-wide text-sun-yellow tabular-nums sm:text-6xl">
                {values[index].toLocaleString("en")}
                {stat.suffix}
              </dd>
              <dt className="mt-3 text-sm font-medium tracking-wide text-sand/80 uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
