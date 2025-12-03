import React from 'react';
import Link from 'next/link';

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Tell us where you are',
    description:
      "A 15-minute conversation (not a form). Your business, your goals, what feels like it's in the way.",
  },
  {
    number: '02',
    title: 'Get your Reckoning',
    description:
      'Not a 50-point action plan. Just what matters now. Small shifts that compound — starting with one.',
  },
  {
    number: '03',
    title: 'Take the next step',
    description:
      'Just one. Then the next. Run with it yourself, or let us help.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-charcoal py-24" id="how-it-works">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-mint font-medium mb-2">
            How it works
          </p>
          <h2 className="text-[2rem] font-semibold tracking-tight text-white mb-4">
            Three steps. No overwhelm.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="relative">
              <div className="text-[2.5rem] font-bold text-fuchsia opacity-30 leading-none mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/60">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(209,75,168,0.3)]"
          >
            Get Your Reckoning — Free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
