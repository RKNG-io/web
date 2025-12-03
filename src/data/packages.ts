// data/packages.ts
// Pre-built package bundles for each persona

import { Package } from '../types';

export const PACKAGES: Record<string, Package> = {
  launchpad: {
    id: 'launchpad',
    name: 'Launchpad',
    tagline: 'Everything you need to launch properly',
    persona: 'leaper',
    price: 399,
    includes: [
      'website_single',
      'domain_setup',
      'email_pro',
      'booking_system',
      'payment_setup',
      'contract_template'
    ],
    alaCarteValue: 574,   // Sum of individual prices
    savings: 175
  },

  upgrade: {
    id: 'upgrade',
    name: 'The Upgrade',
    tagline: 'From duct tape to done right',
    persona: 'scrappy',
    price: 599,
    includes: [
      'website_refresh',
      'booking_system',
      'invoicing',
      'contract_template',
      'welcome_sequence',
      'google_business'
    ],
    alaCarteValue: 804,
    savings: 205
  },

  scaleWithSanity: {
    id: 'scaleWithSanity',
    name: 'Scale with Sanity',
    tagline: 'Get your business — and your life — back',
    persona: 'overwhelmed',
    price: 999,
    includes: [
      'ops_audit',
      'ops_sprint'
    ],
    alaCarteValue: 1098,
    savings: 99,
    note: 'Audit first, then we scope the sprint together'
  }
};

// Helper to get package by persona
export function getPackageForPersona(persona: string): Package | undefined {
  return Object.values(PACKAGES).find(p => p.persona === persona);
}

// Helper to get all packages
export function getAllPackages(): Package[] {
  return Object.values(PACKAGES);
}
