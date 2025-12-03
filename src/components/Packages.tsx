import React from 'react';
import Link from 'next/link';

interface Package {
  name: string;
  description: string;
  features: string[];
  price: string;
}

const packages: Package[] = [
  {
    name: 'Launcher',
    description: 'Everything you need to go from idea to taking money.',
    features: [
      'One-page website',
      'Booking system',
      'Payment setup',
      'Basic online presence',
    ],
    price: 'From £399',
  },
  {
    name: 'Builder',
    description: 'Systems that give you time back.',
    features: [
      'Workflow automation',
      'Follow-up sequences',
      'Invoicing setup',
      'Content that sounds like you',
    ],
    price: 'From £599',
  },
  {
    name: 'Architect',
    description: "Operations that don't depend on you.",
    features: [
      'AI-powered workflows',
      'Client communications',
      'Reporting dashboards',
      'Scale without headcount',
    ],
    price: 'From £999',
  },
];

const Packages: React.FC = () => {
  return (
    <section className="py-24" id="support">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-fuchsia font-medium mb-2">
            When you&apos;re ready
          </p>
          <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal mb-4">
            Support if you want it
          </h2>
        </div>

        {/* Intro */}
        <div className="max-w-[500px] mx-auto mb-16 text-center">
          <p className="text-charcoal/70">
            Some people take their Reckoning and run with it. Others want help building what comes next.
            Both paths work.
          </p>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className="bg-white border border-stone rounded-[10px] p-10 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                {pkg.name}
              </h3>
              <p className="text-sm text-charcoal/60 mb-6">
                {pkg.description}
              </p>
              <ul className="flex-1 mb-6">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-charcoal/70 py-2 border-b border-stone last:border-b-0"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-charcoal/50 mb-4">
                {pkg.price}
              </p>
              <Link
                href={`/services?package=${pkg.name.toLowerCase()}`}
                className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-transparent border-2 border-charcoal text-charcoal font-medium transition-transform hover:-translate-y-0.5"
              >
                Learn more
              </Link>
            </article>
          ))}
        </div>

        {/* Browse all services */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="text-charcoal font-medium inline-flex items-center group"
          >
            Browse all services
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Packages;
