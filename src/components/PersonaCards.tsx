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
    <section className="bg-ice py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center md:mb-20">
          <h2 className="text-3xl font-bold text-charcoal md:text-4xl lg:text-5xl">
            Where are you?
          </h2>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {personaData.map((persona) => (
            <Link
              key={persona.title}
              href={persona.href}
              className="group block"
            >
              <div
                className="
                  h-full rounded-[10px] border border-stone bg-white p-8
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:border-fuchsia hover:shadow-lg
                "
              >
                {/* Card title */}
                <h3 className="mb-4 text-2xl font-semibold text-fuchsia">
                  {persona.title}
                </h3>

                {/* Description */}
                <p className="mb-6 text-base leading-relaxed text-charcoal/70">
                  {persona.description}
                </p>

                {/* CTA */}
                <div className="text-fuchsia transition-colors group-hover:text-fuchsia/80">
                  <span className="font-medium">That's me →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaCards;
