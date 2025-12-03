import React from 'react';
import { SectionHeader } from '@/components/ui';

interface PersonaCard {
  name: string;
  icon: string;
  iconBg: string;
  stage: string;
  tagline: string;
  description: string;
  package: string;
  borderColor: string;
  textColor?: string;
  variant?: 'default' | 'special';
}

const personaData: PersonaCard[] = [
  {
    name: 'The Launcher',
    icon: '🚀',
    iconBg: 'bg-mint',
    stage: 'Starting out',
    tagline: 'Finally making it real',
    description:
      "You've been planning, researching, dreaming. Now you're ready to actually launch — but where do you even start?",
    package: 'Launchpad · £399',
    borderColor: 'border-mint',
  },
  {
    name: 'The Builder',
    icon: '🔧',
    iconBg: 'bg-blue',
    stage: 'Running but chaotic',
    tagline: 'Making it work, barely',
    description:
      "You're getting clients and doing the work, but everything feels held together with duct tape and good intentions.",
    package: 'The Upgrade · £599',
    borderColor: 'border-blue',
  },
  {
    name: 'The Architect',
    icon: '🏗️',
    iconBg: 'bg-fuchsia',
    stage: 'Successful but drowning',
    tagline: 'Built something real, now trapped by it',
    description:
      "The business works — but only because you're running it 24/7. You wanted freedom; you got a job.",
    package: 'Scale with Sanity · £999+',
    borderColor: 'border-fuchsia',
    textColor: 'text-white',
  },
  {
    name: 'Pick & Fix',
    icon: '🧩',
    iconBg: 'bg-stone',
    stage: 'Know what you need',
    tagline: 'Just the parts that matter',
    description:
      "You don't need a full package — just specific help with specific things. Pick what you need, pay for what you use.",
    package: 'From £79',
    borderColor: 'border-stone',
    variant: 'special',
  },
];

const PersonaCards: React.FC = () => {
  return (
    <section className="bg-ice py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center md:mb-20">
          <SectionHeader
            number="01"
            subtitle="Who We Help"
            title="Find yourself"
          />
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          {personaData.map((persona) => (
            <div
              key={persona.name}
              className={`
                group relative overflow-hidden rounded-2xl p-8
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg
                ${
                  persona.variant === 'special'
                    ? 'border-2 border-dashed border-stone bg-ice'
                    : 'bg-white'
                }
              `}
            >
              {/* Animated top border */}
              <div
                className={`
                  absolute left-0 top-0 h-[3px] w-0
                  ${persona.borderColor}
                  transition-all duration-300 ease-out
                  group-hover:w-full
                `}
              />

              {/* Icon */}
              <div className="mb-6">
                <div
                  className={`
                    inline-flex h-16 w-16 items-center justify-center rounded-xl
                    ${persona.iconBg} ${persona.textColor || ''}
                  `}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {persona.icon}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Stage */}
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                  {persona.stage}
                </p>

                {/* Name & Tagline */}
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-charcoal">
                    {persona.name}
                  </h3>
                  <p className="text-sm font-medium text-charcoal/80">
                    {persona.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-charcoal/70">
                  {persona.description}
                </p>

                {/* Package */}
                <div className="pt-2">
                  <p className="text-sm font-semibold text-fuchsia">
                    {persona.package}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaCards;
