import React from 'react';
import Link from 'next/link';

interface Benefit {
  title: string;
  slug: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    title: 'Time',
    slug: 'time',
    description: 'The hours you\'re losing to emails, invoices, and "I should probably sort that out."',
  },
  {
    title: 'Space',
    slug: 'space',
    description: 'Mental, emotional, practical — room to think about your business, not just run it.',
  },
  {
    title: 'Presence',
    slug: 'presence',
    description: 'Show up online in a way that feels like you — not performative, not exhausting.',
  },
  {
    title: 'Systems',
    slug: 'systems',
    description: 'Automations that handle the repetitive stuff. Your voice. Your way. Without hiring.',
  },
  {
    title: 'Clarity',
    slug: 'clarity',
    description: 'Know what\'s blocking you. Know what to do next. Just the next step — not the whole life plan.',
  },
  {
    title: 'Calm',
    slug: 'calm',
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
            <Link
              key={benefit.title}
              href={`/get/${benefit.slug}`}
              className="block p-6 rounded-lg hover:bg-stone/30 transition-colors group"
            >
              <h3 className="text-lg font-semibold text-charcoal mb-2 group-hover:text-fuchsia transition-colors">
                {benefit.title}
              </h3>
              <p className="text-sm text-charcoal/60">
                {benefit.description}
              </p>
              <span className="inline-block mt-3 text-sm text-fuchsia opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
