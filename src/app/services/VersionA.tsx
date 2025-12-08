'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/services/CartContext';
import { SERVICE_CATALOGUE } from '@/lib/data/service-catalogue';
import { ServiceItem } from '@/lib/types';

// ═══════════════════════════════════════════════════════════════
// PROBLEM-FIRST MAPPING
// ═══════════════════════════════════════════════════════════════

interface Problem {
  id: string;
  headline: string;
  subhead: string;
  serviceIds: string[];
}

const PROBLEMS: Problem[] = [
  {
    id: 'unprofessional',
    headline: "I look unprofessional online",
    subhead: "Show up properly with a real website, domain, and email",
    serviceIds: ['website_single', 'website_multi', 'website_refresh', 'domain_setup', 'email_pro', 'link_hub'],
  },
  {
    id: 'booking-payment',
    headline: "Clients can't book or pay me easily",
    subhead: "Stop the email tennis and get paid faster",
    serviceIds: ['booking_system', 'payment_setup', 'intake_form', 'ordering_system', 'class_booking'],
  },
  {
    id: 'admin-chaos',
    headline: "I'm chasing invoices and drowning in admin",
    subhead: "Systems that handle the boring stuff so you don't have to",
    serviceIds: ['invoicing', 'crm_setup', 'workflow_automation', 'review_automation'],
  },
  {
    id: 'social-exhausting',
    headline: "I need to show up on social but it's exhausting",
    subhead: "A system you can actually stick to",
    serviceIds: ['social_media_setup', 'social_templates', 'content_bank', 'social_training', 'social_audit'],
  },
  {
    id: 'cant-find-me',
    headline: "People can't find me",
    subhead: "Show up when they search for what you do",
    serviceIds: ['google_business', 'seo_basics', 'multi_location', 'welcome_sequence', 'email_capture'],
  },
  {
    id: 'bottleneck',
    headline: "I'm the bottleneck and can't step back",
    subhead: "Build operations that don't depend on you",
    serviceIds: ['ops_audit', 'ops_sprint', 'process_documentation', 'reporting_dashboard'],
  },
  {
    id: 'need-support',
    headline: "I just need someone in my corner",
    subhead: "Strategy, support, and someone who gets it",
    serviceIds: ['strategy_session', 'retainer_lite', 'retainer_standard', 'retainer_scale'],
  },
];

// Helper to get services for a problem
function getServicesForProblem(problem: Problem): ServiceItem[] {
  return problem.serviceIds
    .map(id => SERVICE_CATALOGUE.find(s => s.id === id))
    .filter((s): s is ServiceItem => s !== undefined);
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function ServicesVersionA() {
  const { addService, items, itemCount, openCart } = useCart();
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  // Get cart service IDs
  const cartServiceIds = items.flatMap(item =>
    item.type === 'bundle' && item.serviceIds ? item.serviceIds : [item.id]
  );

  const toggleProblem = (problemId: string) => {
    setExpandedProblem(expandedProblem === problemId ? null : problemId);
  };

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
      <section className="bg-charcoal text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            What&apos;s getting in your way?
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Pick a problem. We&apos;ll show you what fixes it.
          </p>
          <p className="text-sm text-white/50">
            Not sure? <Link href="/start" className="text-fuchsia hover:underline">Get your free Reckoning</Link> and we&apos;ll tell you exactly what&apos;s blocking you.
          </p>
        </div>
      </section>

      {/* Problems List */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-4">
            {PROBLEMS.map((problem) => {
              const isExpanded = expandedProblem === problem.id;
              const services = getServicesForProblem(problem);
              const addedCount = services.filter(s => cartServiceIds.includes(s.id)).length;

              return (
                <div
                  key={problem.id}
                  className="bg-white rounded-[10px] border border-stone overflow-hidden"
                >
                  {/* Problem Header - Clickable */}
                  <button
                    onClick={() => toggleProblem(problem.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-ice/50 transition-colors"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-charcoal">
                        {problem.headline}
                      </h2>
                      <p className="text-sm text-charcoal/60 mt-1">
                        {problem.subhead}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {addedCount > 0 && (
                        <span className="text-xs bg-fuchsia/10 text-fuchsia px-2 py-1 rounded">
                          {addedCount} added
                        </span>
                      )}
                      <svg
                        className={`w-5 h-5 text-charcoal/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Services */}
                  {isExpanded && (
                    <div className="border-t border-stone bg-ice/30 px-6 py-5">
                      <div className="space-y-3">
                        {services.map((service) => {
                          const inCart = cartServiceIds.includes(service.id);
                          const isRetainer = service.purchaseType === 'retainer';
                          const needsQuote = service.purchaseType === 'quote';
                          const priceLabel = isRetainer
                            ? `£${service.basePrice}/mo`
                            : `${needsQuote ? 'From ' : ''}£${service.basePrice}`;

                          return (
                            <div
                              key={service.id}
                              className={`bg-white rounded-lg p-4 border ${inCart ? 'border-fuchsia' : 'border-stone'} transition-colors`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-charcoal">
                                      {service.name}
                                    </h3>
                                    {service.popular && (
                                      <span className="text-xs text-fuchsia">Popular</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-charcoal/60 mb-2">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-charcoal/50">
                                    <span>{service.timeEstimate}</span>
                                    {service.timeSavedPerMonth && (
                                      <span className="text-mint-dark">Saves ~{service.timeSavedPerMonth}hrs/month</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="font-semibold text-charcoal whitespace-nowrap">
                                    {priceLabel}
                                  </span>
                                  <button
                                    onClick={() => addService(service)}
                                    disabled={inCart}
                                    className={`text-sm px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                                      inCart
                                        ? 'bg-stone text-charcoal/50 cursor-default'
                                        : 'bg-fuchsia text-white hover:bg-fuchsia/90'
                                    }`}
                                  >
                                    {inCart ? 'Added' : needsQuote ? 'Get quote' : 'Add'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Suggestion text */}
                      <p className="text-xs text-charcoal/40 mt-4 text-center">
                        Not sure which to pick? Start with what feels most urgent.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-charcoal text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Still not sure?
          </h2>
          <p className="text-white/70 mb-6">
            The Reckoning is a free diagnostic that tells you exactly what&apos;s blocking you  - and what to fix first.
          </p>
          <Link
            href="/start"
            className="inline-flex px-8 py-3 bg-fuchsia text-white rounded-md font-medium hover:bg-fuchsia/90 transition-colors"
          >
            Get your free Reckoning
          </Link>
          <p className="text-sm text-white/50 mt-4">
            15 minutes to clarity. No sales call.
          </p>
        </div>
      </section>
    </div>
  );
}
