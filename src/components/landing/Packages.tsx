'use client';

import React from 'react';
import Link from 'next/link';
import { getBundleById, Bundle } from '@/lib/data/bundles';
import { getServiceById } from '@/lib/data/service-catalogue';

interface PackageDisplay {
  bundleId: string;
  name: string;
  description: string;
}

// Map display names to actual bundles
const packageConfig: PackageDisplay[] = [
  {
    bundleId: 'launch_ready',
    name: 'Launcher',
    description: 'Everything you need to go from idea to taking money.',
  },
  {
    bundleId: 'get_booked',
    name: 'Builder',
    description: 'Systems that give you time back.',
  },
  {
    bundleId: 'scale_ready',
    name: 'Architect',
    description: "Operations that don't depend on you.",
  },
];

function getFeatureNames(bundle: Bundle): string[] {
  return bundle.includes.map(serviceId => {
    const service = getServiceById(serviceId);
    return service?.name || serviceId;
  });
}

const Packages: React.FC = () => {
  // Get actual bundle data
  const packages = packageConfig.map(config => {
    const bundle = getBundleById(config.bundleId);
    return {
      ...config,
      bundle,
      features: bundle ? getFeatureNames(bundle) : [],
      price: bundle ? `£${bundle.bundlePrice}` : '',
    };
  }).filter(pkg => pkg.bundle); // Only show packages with valid bundles

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
              key={pkg.bundleId}
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
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-lg font-semibold text-charcoal">
                  {pkg.price}
                </span>
                {pkg.bundle && (
                  <span className="text-sm text-charcoal/40 line-through">
                    £{pkg.bundle.alaCarteTotal}
                  </span>
                )}
              </div>
              <Link
                href={`/services?bundle=${pkg.bundleId}`}
                className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-charcoal/60 text-sm">
            Not sure which is right for you?{' '}
            <Link
              href="/start"
              className="text-fuchsia font-medium hover:underline"
            >
              Get your Reckoning first
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Packages;
