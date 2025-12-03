// data/packages.ts
// Pre-built package bundles for each persona

import { Package } from '../types';

export const PACKAGES: Record<string, Package> = {
  launcher: {
    id: 'launcher',
    name: 'Launcher',
    tagline: 'Everything you need to start properly',
    persona: 'launcher',
    price: 399,
    includes: [
      'website_single',
      'domain_setup', 
      'email_pro',
      'booking_system',
      'payment_setup',
      'contract_template'
    ],
    alaCarteValue: 574,
    savings: 175
  },
  
  builder: {
    id: 'builder',
    name: 'Builder',
    tagline: 'Systems that give you time back',
    persona: 'builder',
    price: 599,
    includes: [
      'website_refresh',
      'booking_system',
      'invoicing_automation',
      'contract_template',
      'welcome_sequence',
      'google_business'
    ],
    alaCarteValue: 804,
    savings: 205
  },
  
  architect: {
    id: 'architect',
    name: 'Architect',
    tagline: 'Scale without losing yourself',
    persona: 'architect',
    price: 999,
    includes: [
      'ops_audit',
      'ops_sprint',
      'process_documentation',
      'dashboard_setup'
    ],
    alaCarteValue: 1298,
    savings: 299,
    note: 'Starts with audit, then we scope the sprint together'
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
