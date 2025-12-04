import React from 'react';

interface Benefit {
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    title: 'Time',
    description: 'The hours you\'re losing to emails, invoices, and "I should probably sort that out."',
  },
  {
    title: 'Space',
    description: 'Mental, emotional, practical — room to think about your business, not just run it.',
  },
  {
    title: 'Presence',
    description: 'Show up online in a way that feels like you — not performative, not exhausting.',
  },
  {
    title: 'Systems',
    description: 'Automations that handle the repetitive stuff. Your voice. Your way. Without hiring.',
  },
  {
    title: 'Clarity',
    description: 'Know what\'s blocking you. Know what to do next. Just the next step — not the whole life plan.',
  },
  {
    title: 'Calm',
    description: 'The quiet confidence that comes from knowing things are handled.',
  },
];

const Benefits: React.FC = () => {
  return (
    <section className="py-24" id="what-you-get">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-fuchsia font-medium mb-2">
            What you get
          </p>
          <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal mb-4">
            Small shifts. Real difference.
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-charcoal/60">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
