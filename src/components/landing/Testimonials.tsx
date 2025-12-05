import React from 'react';
import { SectionHeader } from '@/components/ui';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatarBg: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I'd been 'about to launch' for two years. Reckoning showed me exactly what was holding me back — and what to do about it. Launched within a month.",
    author: 'Priya S.',
    role: 'Life Coach',
    avatarBg: 'bg-mint',
    initials: 'PS',
  },
  {
    quote:
      "Running my freelance business felt like spinning plates. Now I have systems that actually work, and I'm not working weekends anymore.",
    author: 'Jordan M.',
    role: 'Graphic Designer',
    avatarBg: 'bg-blue',
    initials: 'JM',
  },
  {
    quote:
      'I built a successful agency but became the bottleneck. Reckoning helped me see what to delegate and how. Finally taking holidays again.',
    author: 'Marcus T.',
    role: 'Marketing Agency Owner',
    avatarBg: 'bg-fuchsia',
    initials: 'MT',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-ice py-24 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <SectionHeader
            number="04"
            subtitle="Success Stories"
            title="Real results, real people"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-lg bg-white p-8 border border-stone transition-colors hover:border-charcoal/20"
            >
              {/* Large quote mark */}
              <div
                className="absolute -top-2 left-6 text-6xl leading-none text-charcoal/10"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote className="relative z-10 mb-6">
                <p className="text-base leading-relaxed text-charcoal md:text-lg">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${testimonial.avatarBg} text-sm font-semibold text-charcoal`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-medium text-charcoal">{testimonial.author}</p>
                  <p className="text-sm text-charcoal/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
