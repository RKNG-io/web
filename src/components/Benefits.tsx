export default function Benefits() {
  const benefits = [
    {
      title: "Time",
      description: "The hours you're losing to emails, invoices, and 'I should probably sort that out.'"
    },
    {
      title: "Space",
      description: "Mental, emotional, practical — room to think about your business, not just run it."
    },
    {
      title: "Presence",
      description: "Show up online in a way that feels like you — not performative, not exhausting."
    },
    {
      title: "Systems",
      description: "Automations that handle the repetitive stuff. Your voice. Your way. Without hiring."
    },
    {
      title: "Clarity",
      description: "Know what's blocking you. Know what to do next. Just the next step — not the whole life plan."
    },
    {
      title: "Calm",
      description: "The quiet confidence that comes from knowing things are handled."
    }
  ];

  return (
    <section className="bg-white py-16 px-6 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Overline and Title */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-fuchsia-600 uppercase text-xs md:text-sm font-semibold tracking-wider mb-4">
            What you get
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Small shifts. Real difference.
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="space-y-3">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
