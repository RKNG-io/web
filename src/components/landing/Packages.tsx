'use client';

import React from 'react';
import Link from 'next/link';

// Service categories with examples and price ranges
const categories = [
  {
    name: 'Presence',
    description: 'Show up properly online',
    examples: 'Website, domain, professional email',
    priceRange: 'From £49',
  },
  {
    name: 'Operations',
    description: 'Stop chasing and start receiving',
    examples: 'Booking, payments, invoicing',
    priceRange: 'From £79',
  },
  {
    name: 'Automation',
    description: 'Systems that run while you sleep',
    examples: 'Email sequences, workflows, social',
    priceRange: 'From £99',
  },
];

const Packages: React.FC = () => {
  return (
    <section className="py-24" id="support">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-fuchsia font-medium mb-2">
            When you want help
          </p>
          <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal mb-4">
            Fix one thing. Come back for the next.
          </h2>
        </div>

        {/* Intro */}
        <div className="max-w-[520px] mx-auto mb-16 text-center">
          <p className="text-charcoal/70">
            Some people take their Reckoning and run with it. Others want help building what comes next.
            No bundles, no pressure - just the thing you actually need.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          {categories.map((cat) => (
            <article
              key={cat.name}
              className="bg-white border border-stone rounded-[10px] p-8"
            >
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {cat.name}
              </h3>
              <p className="text-sm text-charcoal/70 mb-4">
                {cat.description}
              </p>
              <p className="text-xs text-charcoal/50 mb-4">
                {cat.examples}
              </p>
              <p className="text-sm font-medium text-fuchsia">
                {cat.priceRange}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-charcoal text-white font-medium transition-transform hover:-translate-y-0.5"
          >
            Browse services
          </Link>
          <p className="text-charcoal/50 text-sm mt-4">
            Or{' '}
            <Link
              href="/start"
              className="text-fuchsia font-medium hover:underline"
            >
              get your Reckoning first
            </Link>
            {' '}- we'll tell you what's blocking you
          </p>
        </div>
      </div>
    </section>
  );
};

export default Packages;
