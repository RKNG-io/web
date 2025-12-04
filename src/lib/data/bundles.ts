// data/bundles.ts
// Synergy bundles — services that work better together

import { PersonaType } from '../types';

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];           // Service IDs
  alaCarteTotal: number;        // Sum of individual prices
  bundlePrice: number;          // Discounted bundle price
  savings: number;              // Amount saved
  savingsPercent: number;       // Percentage saved
  personas: PersonaType[];      // Who this bundle suits
  popular: boolean;
  icon: string;                 // Emoji for display
  yourTimeSaved: number;        // Hours you save delivering together
  customerBenefit: string;      // Why it's better for them together
}

export const BUNDLES: Bundle[] = [
  // ═══════════════════════════════════════════════════════════════
  // GET FOUND — Show up properly everywhere
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'get_found',
    name: 'Get Found',
    tagline: 'Show up properly, everywhere',
    description: 'Your complete online presence: website, domain, professional email, and Google visibility. One setup, fully connected.',
    includes: [
      'website_single',    // £199
      'domain_setup',      // £49
      'email_pro',         // £49
      'google_business'    // £79
    ],
    alaCarteTotal: 376,
    bundlePrice: 299,
    savings: 77,
    savingsPercent: 20,
    personas: ['launcher', 'builder'],
    popular: true,
    icon: 'globe',
    yourTimeSaved: 2,
    customerBenefit: 'Everything connects from day one — no half-finished presence'
  },

  // ═══════════════════════════════════════════════════════════════
  // GET BOOKED — From enquiry to client, automated
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'get_booked',
    name: 'Get Booked',
    tagline: 'Enquiry to client, hands-free',
    description: 'Booking system, payment setup, intake form, and welcome sequence. Clients book, pay, and get nurtured — while you sleep.',
    includes: [
      'booking_system',     // £99
      'payment_setup',      // £99
      'intake_form',        // £79
      'welcome_sequence'    // £149
    ],
    alaCarteTotal: 426,
    bundlePrice: 329,
    savings: 97,
    savingsPercent: 23,
    personas: ['launcher', 'builder'],
    popular: true,
    icon: 'calendar',
    yourTimeSaved: 2,
    customerBenefit: 'One seamless client journey instead of cobbled-together tools'
  },

  // ═══════════════════════════════════════════════════════════════
  // GET SOCIAL — Content engine, ready to run
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'get_social',
    name: 'Get Social',
    tagline: '30 days of content, ready to post',
    description: 'Social media system, content calendar with 30 days of ideas, and branded templates. Just swap text and go.',
    includes: [
      'social_media_setup', // £249
      'content_bank',       // £149
      'social_templates'    // £129
    ],
    alaCarteTotal: 527,
    bundlePrice: 399,
    savings: 128,
    savingsPercent: 24,
    personas: ['launcher', 'builder', 'architect'],
    popular: true,
    icon: 'smartphone',
    yourTimeSaved: 1.5,
    customerBenefit: 'Templates use your brand, content fits your calendar — all one system'
  },

  // ═══════════════════════════════════════════════════════════════
  // GET SYSTEMATIC — Business ops that run themselves
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'get_systematic',
    name: 'Get Systematic',
    tagline: 'Track clients, get paid, get reviews',
    description: 'Simple CRM, invoicing with auto-reminders, and review request automation. Your backend, sorted.',
    includes: [
      'crm_setup',           // £149
      'invoicing',           // £79
      'review_automation'    // £99
    ],
    alaCarteTotal: 327,
    bundlePrice: 269,
    savings: 58,
    savingsPercent: 18,
    personas: ['builder', 'architect'],
    popular: false,
    icon: 'settings',
    yourTimeSaved: 1.5,
    customerBenefit: 'All three touch client data — one integration, everything connected'
  },

  // ═══════════════════════════════════════════════════════════════
  // LAUNCH READY — Everything to go from zero to live
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'launch_ready',
    name: 'Launch Ready',
    tagline: 'Zero to taking bookings in a week',
    description: 'Website, domain, email, booking, and payments. Everything a new business needs to look legit and get paid.',
    includes: [
      'website_single',    // £199
      'domain_setup',      // £49
      'email_pro',         // £49
      'booking_system',    // £99
      'payment_setup',     // £99
    ],
    alaCarteTotal: 495,
    bundlePrice: 399,
    savings: 96,
    savingsPercent: 19,
    personas: ['launcher'],
    popular: true,
    icon: 'rocket',
    yourTimeSaved: 3,
    customerBenefit: 'One onboarding call, everything set up together, fully integrated'
  },

  // ═══════════════════════════════════════════════════════════════
  // SCALE READY — For architects hitting capacity
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'scale_ready',
    name: 'Scale Ready',
    tagline: 'Stop being the bottleneck',
    description: 'Operations audit plus implementation sprint. Find what\'s broken, fix the top 5 things, get your time back.',
    includes: [
      'ops_audit',         // £299
      'ops_sprint'         // £799
    ],
    alaCarteTotal: 1098,
    bundlePrice: 899,
    savings: 199,
    savingsPercent: 18,
    personas: ['architect'],
    popular: true,
    icon: 'trending-up',
    yourTimeSaved: 2,
    customerBenefit: 'Audit informs the sprint — no wasted effort fixing the wrong things'
  }
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get bundles suitable for a persona
 */
export function getBundlesForPersona(persona: PersonaType): Bundle[] {
  return BUNDLES.filter(b => b.personas.includes(persona));
}

/**
 * Get bundle by ID
 */
export function getBundleById(id: string): Bundle | undefined {
  return BUNDLES.find(b => b.id === id);
}

/**
 * Get popular bundles
 */
export function getPopularBundles(): Bundle[] {
  return BUNDLES.filter(b => b.popular);
}

/**
 * Check if a set of service IDs matches a bundle
 * Returns the bundle if all services in a bundle are selected
 */
export function findMatchingBundle(serviceIds: string[]): Bundle | undefined {
  const serviceSet = new Set(serviceIds);

  return BUNDLES.find(bundle =>
    bundle.includes.every(id => serviceSet.has(id)) &&
    bundle.includes.length === serviceIds.length
  );
}

/**
 * Find bundles that could be completed by adding more services
 * Returns bundles where user has selected at least 50% of services
 */
export function findNearBundles(serviceIds: string[]): { bundle: Bundle; missing: string[]; have: string[] }[] {
  const serviceSet = new Set(serviceIds);

  return BUNDLES
    .map(bundle => {
      const have = bundle.includes.filter(id => serviceSet.has(id));
      const missing = bundle.includes.filter(id => !serviceSet.has(id));
      return { bundle, have, missing };
    })
    .filter(({ bundle, have }) =>
      have.length >= Math.ceil(bundle.includes.length / 2) &&
      have.length < bundle.includes.length
    )
    .sort((a, b) => a.missing.length - b.missing.length);
}
