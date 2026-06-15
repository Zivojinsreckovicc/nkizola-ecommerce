import type { Dictionary } from "@/lib/i18n/dictionaries";

// Author names are language-independent, so they live alongside the localized
// quotes/moments (which come from the dictionary, in matching order).
const names = ["Marko", "Ana", "Luka"];

function QuoteMark() {
  return (
    <span
      aria-hidden="true"
      className="font-serif text-6xl leading-none text-sun-yellow"
    >
      &ldquo;
    </span>
  );
}

export function FanStories({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-sky-blue/15">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            {dict.fanStories.eyebrow}
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            {dict.fanStories.title}
          </h2>
          <p className="mt-4 text-deep-sea/70">{dict.fanStories.body}</p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.fanStories.items.map((story, index) => (
            <li
              key={names[index] ?? index}
              className="flex flex-col rounded-2xl border-t-4 border-sun-yellow bg-white p-6 shadow-sm"
            >
              <QuoteMark />
              <blockquote className="-mt-4 flex-1 font-serif text-lg leading-relaxed text-ink/85">
                {story.quote}
              </blockquote>
              <footer className="mt-6 border-t border-deep-sea/10 pt-4">
                <p className="font-display text-lg tracking-wide text-deep-sea uppercase">
                  {names[index]}
                </p>
                <p className="text-sm text-sea-blue">{story.moment}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
