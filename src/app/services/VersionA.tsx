'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Calendar,
  Smartphone,
  Settings,
  Rocket,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '@/components/services/CartContext';
import { BUNDLES, Bundle } from '@/lib/data/bundles';

// Map icon names to Lucide components
const iconComponents: Record<string, React.ReactNode> = {
  globe: <Globe className="w-8 h-8 text-fuchsia" />,
  calendar: <Calendar className="w-8 h-8 text-fuchsia" />,
  smartphone: <Smartphone className="w-8 h-8 text-fuchsia" />,
  settings: <Settings className="w-8 h-8 text-fuchsia" />,
  rocket: <Rocket className="w-8 h-8 text-fuchsia" />,
  'trending-up': <TrendingUp className="w-8 h-8 text-fuchsia" />,
};

// ═══════════════════════════════════════════════════════════════
// VERSION A: BUNDLE-ONLY
// Clean, focused bundles page
// ═══════════════════════════════════════════════════════════════

export function ServicesVersionA() {
  const { addBundle, itemCount, openCart } = useCart();

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 text-charcoal hover:text-fuchsia transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-fuchsia text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-charcoal text-white py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-semibold mb-4">
            Support when you want it
          </h1>
          <p className="text-xl text-white/70 mb-2">
            Some people run with it themselves. Others want help.
          </p>
          <p className="text-lg text-white/60">
            Both paths work.
          </p>
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-charcoal mb-2">
              Bundles — best value
            </h2>
            <p className="text-charcoal/60">
              Services that work better together, priced to match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUNDLES.filter(b => b.popular).map(bundle => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onAdd={() => addBundle(bundle)}
              />
            ))}
          </div>

          {/* Show remaining bundles */}
          <details className="mt-8">
            <summary className="text-center text-charcoal/60 cursor-pointer hover:text-charcoal transition-colors">
              View all bundles ({BUNDLES.length})
            </summary>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {BUNDLES.filter(b => !b.popular).map(bundle => (
                <BundleCard
                  key={bundle.id}
                  bundle={bundle}
                  onAdd={() => addBundle(bundle)}
                />
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Simple jobs note */}
      <section className="py-8 px-6 border-t border-stone">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-charcoal/60">
            Sometimes you just need a Linktree, or one small fix.{' '}
            <span className="text-charcoal">That&apos;s fine too.</span>
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-charcoal text-white py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-white/70 mb-4">
            Not sure what you need?
          </p>
          <Link
            href="/start"
            className="inline-flex px-8 py-3 bg-fuchsia text-white rounded-lg font-medium hover:bg-fuchsia/90 transition-colors"
          >
            Get your free Reckoning
          </Link>
          <p className="text-sm text-white/50 mt-3">
            15 minutes to clarity — we&apos;ll tell you what&apos;s blocking you
          </p>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUNDLE CARD
// ═══════════════════════════════════════════════════════════════

function BundleCard({ bundle, onAdd }: { bundle: Bundle; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-fuchsia/20 hover:border-fuchsia/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        {iconComponents[bundle.icon] || <Settings className="w-8 h-8 text-fuchsia" />}
        <span className="px-2 py-1 bg-mint text-charcoal text-xs font-medium rounded">
          Save £{bundle.savings}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-charcoal mb-1">
        {bundle.name}
      </h3>
      <p className="text-sm text-charcoal/60 mb-4">
        {bundle.tagline}
      </p>

      <p className="text-sm text-charcoal/70 mb-4">
        {bundle.description}
      </p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-semibold text-charcoal">
          £{bundle.bundlePrice}
        </span>
        <span className="text-sm text-charcoal/40 line-through">
          £{bundle.alaCarteTotal}
        </span>
      </div>

      <p className="text-xs text-charcoal/50 mb-4">
        {bundle.includes.length} services included
      </p>

      <button
        onClick={onAdd}
        className="w-full py-3 bg-fuchsia text-white rounded-lg font-medium hover:bg-fuchsia/90 transition-colors"
      >
        Add to cart
      </button>
    </div>
  );
}
