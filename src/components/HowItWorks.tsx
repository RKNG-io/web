import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
  color: 'mint' | 'fuchsia' | 'blue';
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Tell us where you are',
    description:
      'A 15-minute conversation (not a form). Your business, your goals, what feels like it\'s in the way.',
    color: 'mint',
  },
  {
    number: '02',
    title: 'Get your Reckoning',
    description:
      'Not a 50-point action plan. Just what matters now. Small shifts that compound — starting with one.',
    color: 'fuchsia',
  },
  {
    number: '03',
    title: 'Take the next step',
    description:
      'Just one. Then the next. Run with it yourself, or let us help.',
    color: 'blue',
  },
];

const colorClasses = {
  mint: 'bg-mint',
  fuchsia: 'bg-fuchsia',
  blue: 'bg-blue',
};

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-charcoal py-32 px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-mint">
            How it works
          </p>
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Three steps. No&nbsp;overwhelm.
          </h2>
        </div>

        {/* Steps with colour segments */}
        <div className="relative">
          {/* Three solid colour segments - hidden on mobile, visible on lg */}
          <div className="absolute left-0 right-0 top-8 hidden h-1 lg:block">
            <div className="mx-auto flex h-full max-w-5xl">
              <div className="h-full flex-1 bg-mint" />
              <div className="h-full flex-1 bg-fuchsia" />
              <div className="h-full flex-1 bg-blue" />
            </div>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col text-center lg:items-center">
                {/* Large step number with reduced opacity */}
                <div className="relative z-10 mb-6">
                  <span className="text-8xl font-bold text-fuchsia opacity-30 md:text-9xl">
                    {step.number}
                  </span>
                </div>

                {/* Step content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                  <p className="text-base leading-relaxed text-white/80 md:text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="rounded-full bg-fuchsia px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-fuchsia/90 hover:shadow-lg">
            Get Your Reckoning — Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
