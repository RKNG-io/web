export default function BlockedUnlocked() {
  const rows = [
    {
      blocked: "I don't know where to start",
      unlocked: "A prioritised list of what actually matters",
    },
    {
      blocked: "Social media feels fake",
      unlocked: "Permission to do it your way",
    },
    {
      blocked: "It's easier to do it myself",
      unlocked: "Automation that sounds like you",
    },
    {
      blocked: "Chasing invoices feels awkward",
      unlocked: "Automation that follows up, reconciles, and gets you paid",
    },
    {
      blocked: "I need to hire to scale",
      unlocked: "Systems that run without headcount",
    },
  ];

  return (
    <section className="bg-ice py-16 px-4 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Overline */}
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-600">
          The weight we lift
        </p>

        {/* Section title */}
        <h2 className="mb-6 text-3xl font-bold text-stone-900 sm:text-4xl">
          You know the feeling
        </h2>

        {/* Intro paragraphs */}
        <div className="mb-12 space-y-4 text-lg text-stone-700">
          <p>
            The constant context-switching. The background hum of things you
            haven't got to yet. More time on admin than on the work you actually
            love.
          </p>
          <p>
            <strong>That's not a character flaw. That's a systems problem.</strong>{" "}
            And systems problems have systems solutions.
          </p>
        </div>

        {/* Blocked/Unlocked rows */}
        <div className="mb-12 space-y-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 rounded-lg border border-stone-300 bg-white p-6 transition-colors hover:border-fuchsia-500 sm:grid-cols-2"
            >
              {/* Blocked column */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
                  Blocked by
                </p>
                <p className="italic text-stone-600">{row.blocked}</p>
              </div>

              {/* Unlocked column */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-fuchsia-600">
                  Unlocked by
                </p>
                <p className="font-bold text-stone-900">{row.unlocked}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/questionnaire"
            className="inline-block rounded-lg bg-fuchsia-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-fuchsia-700"
          >
            See what's blocking you
          </a>
        </div>
      </div>
    </section>
  );
}
