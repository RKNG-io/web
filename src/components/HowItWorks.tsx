import React from 'react';
import { SectionHeader, Badge } from '@/components/ui';

interface Step {
  number: number;
  title: string;
  description: string;
  timeBadge: string;
  color: 'mint' | 'fuchsia' | 'blue';
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Take the questionnaire',
    description:
      'Answer a few questions about your business, your challenges, and your goals. No jargon, no trick questions — just honest conversation.',
    timeBadge: '~10 minutes',
    color: 'mint',
  },
  {
    number: 2,
    title: 'Get your Reckoning',
    description:
      'Receive a personalised report that diagnoses where you are, prioritises what matters, and maps out your next steps.',
    timeBadge: 'Within 24 hours',
    color: 'fuchsia',
  },
  {
    number: 3,
    title: 'Take action',
    description:
      'Follow your roadmap DIY, or let us handle the heavy lifting. Either way, you\'ll know exactly what to do and why.',
    timeBadge: 'Your pace',
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
    <section className="bg-white py-32 px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="02"
          subtitle="The Process"
          title="Three steps to clarity"
          className="mb-16 text-center"
        />

        {/* Steps grid with connecting line */}
        <div className="relative">
          {/* Connecting gradient line - hidden on mobile, visible on lg */}
          <div className="absolute left-0 right-0 top-6 hidden h-1 lg:block">
            <div className="mx-auto h-full max-w-5xl bg-gradient-to-r from-mint via-fuchsia to-blue" />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div
                  className={`relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full text-white font-bold ${colorClasses[step.color]}`}
                >
                  {step.number}
                </div>

                {/* Step content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-charcoal">{step.title}</h3>
                  <p className="text-base leading-relaxed text-charcoal/70">{step.description}</p>
                  <Badge variant="default" className="bg-ice">
                    {step.timeBadge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
