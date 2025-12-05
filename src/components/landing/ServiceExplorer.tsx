'use client';

import React, { useState, useMemo } from 'react';
import { Button, SectionHeader } from '@/components/ui';
import { SERVICE_CATALOGUE } from '@/data/services';
import { ServiceItem } from '@/types';

// Industry filter mapping
const INDUSTRIES = [
  { label: 'All', value: 'all' },
  { label: 'Coaches', value: 'coaching' },
  { label: 'Creatives', value: 'creative' },
  { label: 'Therapists', value: 'therapy' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Food & Hospitality', value: 'food' },
  { label: 'Retail', value: 'retail' },
  { label: 'Professional Services', value: 'professional' },
  { label: 'E-commerce', value: 'ecommerce' },
];

// Category filter mapping
const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Presence', value: 'presence' },
  { label: 'Operations', value: 'operations' },
  { label: 'Automation', value: 'automation' },
  { label: 'Legal', value: 'legal' },
  { label: 'Visibility', value: 'visibility' },
  { label: 'Support', value: 'support' },
];

const ServiceExplorer: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter services based on both industry and category
  const filteredServices = useMemo(() => {
    return SERVICE_CATALOGUE.filter((service) => {
      // Industry filter
      const matchesIndustry =
        activeIndustry === 'all' ||
        service.businessTypes.length === 0 ||
        service.businessTypes.includes(activeIndustry as any);

      // Category filter
      const matchesCategory =
        activeCategory === 'all' || service.category === activeCategory;

      return matchesIndustry && matchesCategory;
    });
  }, [activeIndustry, activeCategory]);

  return (
    <section className="bg-charcoal px-6 py-16 text-white md:px-12 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12">
          <SectionHeader
            number="03"
            subtitle="What We Offer"
            title="Services that actually help"
            className="text-white [&>p]:text-white/70 [&>h2]:text-white"
          />
        </div>

        {/* Industry Filters */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/70">
            Industry
          </h3>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.value}
                onClick={() => setActiveIndustry(industry.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeIndustry === industry.value
                    ? 'border-fuchsia bg-fuchsia text-white'
                    : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
                }`}
              >
                {industry.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/70">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.value
                    ? 'border-fuchsia bg-fuchsia text-white'
                    : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Count */}
        <div className="mb-6 text-sm text-white/60">
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}{' '}
          found
        </div>

        {/* Services Grid */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-white/60">
              No services found matching your filters.
            </p>
            <button
              onClick={() => {
                setActiveIndustry('all');
                setActiveCategory('all');
              }}
              className="mt-4 text-sm text-fuchsia underline hover:text-fuchsia/80"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Button variant="primary" size="lg" href="#contact">
            Get Your Custom Plan
          </Button>
        </div>
      </div>
    </section>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Determine if this is an AI agent service
  // This is a placeholder - you may want to add an `isAgent` field to ServiceItem
  const isAgent = service.name.toLowerCase().includes('ai') ||
                  service.description.toLowerCase().includes('ai agent');

  return (
    <div className="flex flex-col rounded-[10px] border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
      {/* Title and Price */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
        <span className="shrink-0 text-lg font-bold text-mint">
          £{service.basePrice}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 flex-grow text-sm leading-relaxed text-white/70">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
          {service.category}
        </span>
        {isAgent && (
          <span className="rounded-full bg-fuchsia/20 px-3 py-1 text-xs font-medium text-fuchsia">
            AI
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceExplorer;
