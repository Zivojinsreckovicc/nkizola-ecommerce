"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// One entrance shared by the whole site: a short rise and fade. Keeping the
// numbers here (rather than per call site) is what stops the motion from
// drifting out of sync as sections get added.
const RISE_PX = 14;
const DURATION = 0.5;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Reveal slightly before the element is fully on screen, and only once — a
// section that re-animates every time you scroll past it reads as noise.
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

type Tag = "div" | "section" | "ul" | "li" | "p" | "span";

const TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} satisfies Record<Tag, unknown>;

/**
 * Reduced motion collapses the entrance to a no-op rather than a faster
 * version of itself: both states are fully visible, so nothing moves or fades.
 */
function entrance(reduce: boolean, distance: number, delay: number): Variants {
  if (reduce) return { hidden: { opacity: 1 }, visible: { opacity: 1 } };

  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION, ease: EASE, delay },
    },
  };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  distance?: number;
  /** Animate on mount instead of on scroll — for above-the-fold content. */
  immediate?: boolean;
};

/** A single element that rises into place when it reaches the viewport. */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  distance = RISE_PX,
  immediate = false,
}: RevealProps) {
  const reduce = useReducedMotion() ?? false;
  const Component = TAGS[as];

  return (
    <Component
      className={className}
      variants={entrance(reduce, distance, delay)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: VIEWPORT })}
    >
      {children}
    </Component>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** Gap between each child's entrance. */
  stagger?: number;
  immediate?: boolean;
};

/**
 * Wraps a list or grid so its `StaggerItem` children arrive one after another.
 * The children inherit the run through variant propagation, which is why they
 * carry no `initial` of their own.
 */
export function Stagger({
  children,
  className,
  as = "div",
  delay = 0,
  stagger = 0.08,
  immediate = false,
}: StaggerProps) {
  const Component = TAGS[as];
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: VIEWPORT })}
    >
      {children}
    </Component>
  );
}

/** A child of `Stagger`. Timing comes from the parent. */
export function StaggerItem({
  children,
  className,
  as = "div",
  distance = RISE_PX,
}: Omit<RevealProps, "delay" | "immediate">) {
  const reduce = useReducedMotion() ?? false;
  const Component = TAGS[as];

  return (
    <Component className={className} variants={entrance(reduce, distance, 0)}>
      {children}
    </Component>
  );
}
