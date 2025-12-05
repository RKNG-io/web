'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/services/CartContext';
import { BUNDLES, Bundle, getBundlesForPersona } from '@/lib/data/bundles';
import { SERVICE_CATALOGUE } from '@/lib/data/service-catalogue';
import type { ServiceItem, ServiceCategory, PersonaType } from '@/lib/types';

// ═══════════════════════════════════════════════════════════════
// VERSION B: EXPLORER-FIRST
// Full service grid with sidebar filters, bundles as callouts
// ═══════════════════════════════════════════════════════════════

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  presence: 'Presence',
  operations: 'Operations',
  automation: 'Automation',
  visibility: 'Visibility',
  support: 'Support',
};

const PERSONA_LABELS: Record<PersonaType, string> = {
  launcher: 'Just starting',
  builder: 'Already running',
  architect: 'Ready to scale',
};

const CATEGORIES: ServiceCategory[] = [
  'presence',
  'operations',
  'automation',
  'visibility',
  'support',
];

export function ServicesVersionB() {
  const { addBundle, addService, itemCount, openCart } = useCart();
  const [selectedCategories, setSelectedCategories] = useState<Set<ServiceCategory>>(new Set());
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filter services
  const filteredServices = useMemo(() => {
    return SERVICE_CATALOGUE.filter(service => {
      // Category filter
      if (selectedCategories.size > 0 && !selectedCategories.has(service.category)) {
        return false;
      }

      // Persona filter
      if (selectedPersona && !service.personas.includes(selectedPersona)) {
        return false;
      }

      // Popular filter
      if (showPopularOnly && !service.popular) {
        return false;
      }

      return true;
    });
  }, [selectedCategories, selectedPersona, showPopularOnly]);

  // Relevant bundles based on filters
  const relevantBundles = useMemo(() => {
    if (selectedPersona) {
      return getBundlesForPersona(selectedPersona);
    }
    return BUNDLES.filter(b => b.popular);
  }, [selectedPersona]);

  const toggleCategory = (category: ServiceCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPersona(null);
    setShowPopularOnly(false);
  };

  const hasFilters = selectedCategories.size > 0 || selectedPersona || showPopularOnly;

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/start"
              className="text-sm text-charcoal/60 hover:text-charcoal transition-colors hidden sm:block"
            >
              Not sure? Get your Reckoning
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
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[10px] p-6 sticky top-24 border border-stone">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-charcoal">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-fuchsia hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Persona filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">I am...</h3>
                <div className="space-y-2">
                  {(['launcher', 'builder', 'architect'] as PersonaType[]).map(persona => (
                    <button
                      key={persona}
                      onClick={() => setSelectedPersona(selectedPersona === persona ? null : persona)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPersona === persona
                          ? 'bg-fuchsia text-white'
                          : 'bg-ice text-charcoal hover:bg-stone/30'
                      }`}
                    >
                      {PERSONA_LABELS[persona]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-stone text-fuchsia focus:ring-fuchsia"
                      />
                      <span className="text-sm text-charcoal">
                        {CATEGORY_LABELS[category]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popular filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-stone text-fuchsia focus:ring-fuchsia"
                  />
                  <span className="text-sm text-charcoal">Popular only</span>
                </label>
              </div>

              {/* Bundles callout */}
              {relevantBundles.length > 0 && (
                <div className="border-t border-stone pt-6">
                  <h3 className="text-sm font-medium text-charcoal mb-3">
                    Save with bundles
                  </h3>
                  <div className="space-y-3">
                    {relevantBundles.slice(0, 2).map(bundle => (
                      <button
                        key={bundle.id}
                        onClick={() => addBundle(bundle)}
                        className="w-full text-left p-3 bg-mint/10 border border-mint rounded-lg hover:bg-mint/20 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{bundle.icon}</span>
                          <span className="font-medium text-charcoal text-sm">
                            {bundle.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-charcoal">
                            £{bundle.bundlePrice}
                          </span>
                          <span className="text-xs text-mint">
                            Save £{bundle.savings}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-charcoal mb-2">
                Services
              </h1>
              <p className="text-charcoal/60">
                {filteredServices.length} services available
                {hasFilters && ' (filtered)'}
              </p>
            </div>

            {/* Discount banner */}
            <div className="bg-white border border-stone rounded-lg p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="font-medium text-charcoal">Bundle discount</p>
                <p className="text-sm text-charcoal/60">
                  2+ services: 5% off • 4+ services: 10% off • 6+ services: 15% off
                </p>
              </div>
              <Link
                href="#bundles"
                className="text-sm text-fuchsia hover:underline"
              >
                Or choose a bundle
              </Link>
            </div>

            {/* Service Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCardB
                  key={service.id}
                  service={service}
                  onAdd={() => addService(service)}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <p className="text-charcoal/60 mb-4">No services match your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-fuchsia hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* All Bundles Section */}
            <section id="bundles" className="mt-16 pt-8 border-t border-stone">
              <h2 className="text-2xl font-semibold text-charcoal mb-2">
                All bundles
              </h2>
              <p className="text-charcoal/60 mb-8">
                Services that work better together — save up to 24%
              </p>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {BUNDLES.map(bundle => (
                  <BundleCardB
                    key={bundle.id}
                    bundle={bundle}
                    onAdd={() => addBundle(bundle)}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SERVICE CARD (Version B - more compact)
// ═══════════════════════════════════════════════════════════════

function ServiceCardB({ service, onAdd }: { service: ServiceItem; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-[10px] p-5 border border-stone hover:border-charcoal/30 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-charcoal group-hover:text-fuchsia transition-colors">
          {service.name}
        </h3>
        <span className="text-lg font-semibold text-charcoal">
          £{service.basePrice}
        </span>
      </div>

      <p className="text-sm text-charcoal/60 mb-3 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {service.popular && (
            <span className="px-2 py-0.5 bg-fuchsia/10 text-fuchsia text-xs rounded">
              Popular
            </span>
          )}
          <span className="text-xs text-charcoal/40">
            {service.timeEstimate}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-1.5 text-sm border border-charcoal text-charcoal rounded hover:bg-charcoal hover:text-white transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUNDLE CARD (Version B)
// ═══════════════════════════════════════════════════════════════

function BundleCardB({ bundle, onAdd }: { bundle: Bundle; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-lg p-5 border border-fuchsia/20 hover:border-fuchsia/40 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{bundle.icon}</span>
        <div>
          <h3 className="font-semibold text-charcoal">{bundle.name}</h3>
          <p className="text-sm text-charcoal/60">{bundle.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-charcoal/70 mb-4">
        {bundle.customerBenefit}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-semibold text-charcoal">
            £{bundle.bundlePrice}
          </span>
          <span className="ml-2 text-sm text-charcoal/40 line-through">
            £{bundle.alaCarteTotal}
          </span>
          <span className="ml-2 text-sm text-mint">
            Save {bundle.savingsPercent}%
          </span>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-fuchsia text-white text-sm rounded hover:bg-fuchsia/90 transition-colors"
        >
          Add bundle
        </button>
      </div>
    </div>
  );
}
