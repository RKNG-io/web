import React from 'react';
import Link from 'next/link';

interface PersonaCard {
  title: string;
  description: string;
  href: string;
}

const personaData: PersonaCard[] = [
  {
    title: 'Launching',
    description:
      'Still dreaming, planning, or just getting started. You need clarity on what actually matters — and permission to begin.',
    href: '/questionnaire?persona=launcher',
  },
  {
    title: 'Building',
    description:
      'Running, but doing everything yourself. Busy but stuck. You need systems that give you time back — without hiring.',
    href: '/questionnaire?persona=builder',
  },
  {
    title: 'Scaling',
    description:
      "Successful, but capped. The business can't run without you. You need operations that free up space for what's next.",
    href: '/questionnaire?persona=architect',
  },
];

const PersonaCards: React.FC = () => {
  return (
    <section className="bg-ice py-24" id="where-are-you">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal mb-4">
            Where are you?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {personaData.map((persona) => (
            <article
              key={persona.title}
              className="bg-white border border-stone rounded-[10px] p-10 transition-all duration-150 hover:border-fuchsia hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-fuchsia mb-2">
                {persona.title}
              </h3>
              <p className="text-sm text-charcoal/70 mb-6">
                {persona.description}
              </p>
              <Link
                href={persona.href}
                className="text-sm font-medium text-charcoal inline-flex items-center group"
              >
                That&apos;s me
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaCards;
