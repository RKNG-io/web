'use client';

import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const benefits = [
    'Clarity on what\'s actually blocking you',
    'Prioritised next steps — not a 50-point plan',
    'Systems that grow with you',
    'Automations that sound like you',
  ];

  return (
    <section className="min-h-[90vh] bg-charcoal text-white pt-[calc(6rem+80px)] pb-24 flex items-center" id="get-started">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
          {/* Left Column - Copy */}
          <div>
            <div className="text-[2.5rem] md:text-[3rem] font-semibold tracking-tight mb-2 leading-[1.1]">
              Unblock. Unlock. Unleash.
            </div>
            <div className="text-2xl font-normal text-white/60 mb-10">
              Your business. Your way.
            </div>
            <p className="text-lg text-white/70 max-w-[500px] mb-6">
              You didn't start your business to drown in admin.<br />
              You started it for the work — and the life you're building.
            </p>
            <p className="text-base text-white/50 max-w-[480px] mb-10">
              You don't need to overhaul a thing. Introduce automations that sound like you.
              Build systems that let you grow without burning out.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/start"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(209,75,168,0.3)]"
              >
                Get Your Reckoning — Free
              </Link>
              <Link
                href="/start/website"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-transparent border-2 border-white text-white font-medium transition-transform hover:-translate-y-0.5"
              >
                I know what I need
              </Link>
            </div>
          </div>

          {/* Right Column - What You Get Card */}
          <div>
            <div className="bg-white text-charcoal rounded-[10px] p-10 max-w-[340px]">
              <h3 className="text-xl font-semibold text-charcoal mb-4">
                What you get
              </h3>
              <ul className="space-y-0">
                {benefits.map((benefit, index) => (
                  <li key={index} className="py-2 text-sm text-charcoal/70 flex items-start gap-2">
                    <span className="text-fuchsia font-semibold">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
