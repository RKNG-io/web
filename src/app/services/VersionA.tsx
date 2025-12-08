'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/services/CartContext';
import { SERVICE_CATALOGUE, getServicesByCategory } from '@/lib/data/service-catalogue';
import { BUNDLES, Bundle, findNearBundles } from '@/lib/data/bundles';
import { ServiceItem, ServiceCategory } from '@/lib/types';

// Category display config
const CATEGORIES: { id: ServiceCategory; name: string; description: string }[] = [
  { id: 'presence', name: 'Presence', description: 'Show up properly online' },
  { id: 'operations', name: 'Operations', description: 'Stop chasing and start receiving' },
  { id: 'automation', name: 'Automation', description: 'Systems that run while you sleep' },
  { id: 'visibility', name: 'Visibility', description: 'Get found by the right people' },
  { id: 'support', name: 'Support', description: 'Ongoing help when you need it' },
];

export function ServicesVersionA() {
  const { addService, addBundle, items, itemCount, openCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');

  // Get cart service IDs for bundle suggestions
  // For services, the id is the service ID; for bundles, expand serviceIds
  const cartServiceIds = items.flatMap(item =>
    item.type === 'bundle' && item.serviceIds ? item.serviceIds : [item.id]
  );
  const nearBundles = findNearBundles(cartServiceIds);

  // Filter services by category
  const displayedServices = activeCategory === 'all'
    ? SERVICE_CATALOGUE.filter(s => s.purchaseType !== 'retainer')
    : getServicesByCategory(activeCategory).filter(s => s.purchaseType !== 'retainer');

  // Get retainers separately
  const retainers = SERVICE_CATALOGUE.filter(s => s.purchaseType === 'retainer');

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 py-2 text-charcoal hover:text-fuchsia transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-charcoal text-white py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Pick what you need
          </h1>
          <p className="text-lg text-white/70">
            Fix one thing. Come back for the next.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-stone py-4 px-6 sticky top-[65px] z-30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            <FilterButton
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </FilterButton>
            {CATEGORIES.map(cat => (
              <FilterButton
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </FilterButton>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle suggestion (if cart has near-matches) */}
      {nearBundles.length > 0 && (
        <section className="bg-mint/30 border-b border-mint py-4 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-charcoal">
                  Add {nearBundles[0].missing.length} more service{nearBundles[0].missing.length > 1 ? 's' : ''} to complete the{' '}
                  <span className="text-fuchsia">{nearBundles[0].bundle.name}</span> bundle and save £{nearBundles[0].bundle.savings}
                </p>
              </div>
              <button
                onClick={() => addBundle(nearBundles[0].bundle)}
                className="text-sm px-4 py-2 bg-fuchsia text-white rounded-md hover:bg-fuchsia/90 transition-colors"
              >
                Add bundle instead
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="py-10 px-6">
        <div className="container mx-auto max-w-6xl">
          {activeCategory !== 'all' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-charcoal">
                {CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-charcoal/60 text-sm">
                {CATEGORIES.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onAdd={() => addService(service)}
                inCart={cartServiceIds.includes(service.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bundles section - positioned as "these work well together" */}
      <section className="py-12 px-6 bg-white border-t border-stone">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold text-charcoal mb-2">
              These work well together
            </h2>
            <p className="text-charcoal/60 text-sm">
              Pre-made combinations with bundle pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUNDLES.slice(0, 6).map(bundle => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onAdd={() => addBundle(bundle)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Retainers */}
      <section className="py-12 px-6 border-t border-stone">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold text-charcoal mb-2">
              Ongoing support
            </h2>
            <p className="text-charcoal/60 text-sm">
              When you want someone in your corner month to month
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {retainers.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onAdd={() => addService(service)}
                inCart={cartServiceIds.includes(service.id)}
                isRetainer
              />
            ))}
          </div>
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
            className="inline-flex px-8 py-3 bg-fuchsia text-white rounded-md font-medium hover:bg-fuchsia/90 transition-colors"
          >
            Get your free Reckoning
          </Link>
          <p className="text-sm text-white/50 mt-3">
            15 minutes to clarity - we&apos;ll tell you what&apos;s blocking you
          </p>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${
        active
          ? 'bg-charcoal text-white'
          : 'bg-ice text-charcoal hover:bg-stone'
      }`}
    >
      {children}
    </button>
  );
}

function ServiceCard({
  service,
  onAdd,
  inCart,
  isRetainer = false,
}: {
  service: ServiceItem;
  onAdd: () => void;
  inCart: boolean;
  isRetainer?: boolean;
}) {
  const priceLabel = isRetainer ? `£${service.basePrice}/mo` : `£${service.basePrice}`;
  const needsQuote = service.purchaseType === 'quote';

  return (
    <div className={`bg-white rounded-[10px] p-5 border ${inCart ? 'border-fuchsia' : 'border-stone'} transition-colors`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-charcoal text-sm">
            {service.name}
          </h3>
          {service.popular && (
            <span className="text-xs text-fuchsia">Popular</span>
          )}
        </div>
        <div className="text-right">
          <span className="font-semibold text-charcoal">
            {needsQuote ? 'From ' : ''}{priceLabel}
          </span>
          {service.agencyComparison > service.basePrice * 1.5 && (
            <p className="text-xs text-charcoal/40 line-through">
              Agency: £{service.agencyComparison}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-charcoal/70 mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-charcoal/50">
          {service.timeEstimate}
        </span>
        <button
          onClick={onAdd}
          disabled={inCart}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            inCart
              ? 'bg-stone text-charcoal/50 cursor-default'
              : 'bg-fuchsia text-white hover:bg-fuchsia/90'
          }`}
        >
          {inCart ? 'Added' : needsQuote ? 'Get quote' : 'Add'}
        </button>
      </div>
    </div>
  );
}

function BundleCard({
  bundle,
  onAdd,
}: {
  bundle: Bundle;
  onAdd: () => void;
}) {
  return (
    <div className="bg-ice rounded-[10px] p-5 border border-stone hover:border-fuchsia/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-charcoal">
          {bundle.name}
        </h3>
        <span className="px-2 py-0.5 bg-mint text-charcoal text-xs font-medium rounded">
          Save £{bundle.savings}
        </span>
      </div>

      <p className="text-xs text-charcoal/70 mb-3">
        {bundle.tagline}
      </p>

      <p className="text-xs text-charcoal/50 mb-4">
        {bundle.includes.length} services included
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-charcoal">
            £{bundle.bundlePrice}
          </span>
          <span className="text-xs text-charcoal/40 line-through ml-2">
            £{bundle.alaCarteTotal}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="text-xs px-3 py-1.5 rounded-md font-medium bg-charcoal text-white hover:bg-charcoal/90 transition-colors"
        >
          Add bundle
        </button>
      </div>
    </div>
  );
}
