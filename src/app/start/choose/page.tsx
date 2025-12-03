'use client';

import React from 'react';
import Link from 'next/link';

const services = [
  {
    title: 'Website',
    description: 'New site, redesign, or landing page',
    href: '/start/website',
  },
  {
    title: 'Automations',
    description: 'Systems that handle the repetitive stuff',
    href: '/start/automations',
  },
  {
    title: 'Social Media',
    description: 'Setup, strategy, or ongoing posting',
    href: '/start/social',
  },
];

export default function ChooseService() {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-white">
            Reckoning
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-white text-center mb-2">
            What do you need?
          </h1>
          <p className="text-white/60 text-center mb-10">
            Pick one and we&apos;ll get you a quote within 24 hours.
          </p>

          <div className="space-y-4">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="block w-full p-6 rounded-lg border border-white/20 hover:border-fuchsia transition-all hover:-translate-y-0.5 group"
              >
                <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-fuchsia transition-colors">
                  {service.title}
                </h2>
                <p className="text-white/60 text-sm">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/50 text-sm mb-4">Not sure what you need?</p>
            <Link
              href="/start"
              className="text-fuchsia font-medium hover:underline"
            >
              Get your free Reckoning →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
