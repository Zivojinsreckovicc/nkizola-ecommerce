type FanStory = {
  quote: string;
  name: string;
  moment: string;
};

// Editorial content, not commerce data — illustrative supporter stories that
// set the tone. Swap these for real fan submissions when they come in.
const stories: FanStory[] = [
  {
    quote:
      "Last minute, rain coming off the sea, and the ball drops in off the far post. The whole stand went up at once — strangers hugging like family. I still get chills walking past that goal.",
    name: "Marko",
    moment: "94th-minute winner vs. Koper",
  },
  {
    quote:
      "My grandfather brought me to my first match in this scarf. Twenty years later I wrapped it around my own kid before kickoff. Blue and yellow runs in the family now.",
    name: "Ana",
    moment: "Three generations in the stand",
  },
  {
    quote:
      "We were 2–0 down at half time and nobody left. Two headers and a screamer later, the town didn't sleep that night. That's why I keep coming back.",
    name: "Luka",
    moment: "The comeback under the lights",
  },
];

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

export function FanStories() {
  return (
    <section className="bg-sky-blue/15">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 font-semibold tracking-widest text-sea-blue uppercase">
            Fan stories
          </p>
          <h2 className="font-display text-3xl tracking-wide text-deep-sea uppercase sm:text-4xl">
            The moments we never forget
          </h2>
          <p className="mt-4 text-deep-sea/70">
            Every shirt carries a memory. Here&rsquo;s what wearing the blue
            and yellow means to the people in the stand.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <li
              key={story.name}
              className="flex flex-col rounded-2xl border-t-4 border-sun-yellow bg-white p-6 shadow-sm"
            >
              <QuoteMark />
              <blockquote className="-mt-4 flex-1 font-serif text-lg leading-relaxed text-ink/85">
                {story.quote}
              </blockquote>
              <footer className="mt-6 border-t border-deep-sea/10 pt-4">
                <p className="font-display text-lg tracking-wide text-deep-sea uppercase">
                  {story.name}
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
