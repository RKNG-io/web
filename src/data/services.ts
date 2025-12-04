// data/service-catalogue.ts
// Complete service catalogue with pricing and metadata

import { ServiceItem } from '../types';

export const SERVICE_CATALOGUE: ServiceItem[] = [

  // ═══════════════════════════════════════════════════════════════
  // PRESENCE
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'website_single',
    name: 'One-Page Website',
    description: 'Clean, professional landing page with your story, services, and call to action',
    basePrice: 199,
    timeEstimate: '3-5 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: ['domain_setup', 'email_pro'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'low',
    agencyComparison: 800,
    revenuePotential: 'First impression that converts'
  },

  {
    id: 'website_multi',
    name: 'Multi-Page Website',
    description: 'Full site: Home, About, Services, Contact, Blog-ready. Built to grow with you.',
    basePrice: 399,
    timeEstimate: '1-2 weeks',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: ['domain_setup', 'email_pro', 'seo_basics'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 2000,
    revenuePotential: 'Professional presence that works 24/7'
  },

  {
    id: 'website_refresh',
    name: 'Website Refresh',
    description: 'Modernise your existing site: new design, better copy, mobile-optimised',
    basePrice: 299,
    timeEstimate: '1 week',
    personas: ['builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: ['seo_basics'],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 1200
  },

  {
    id: 'domain_setup',
    name: 'Domain & Hosting Setup',
    description: 'Your own .com (or .co.uk), properly configured, SSL secured',
    basePrice: 49,
    timeEstimate: '1-2 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: ['email_pro'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 150
  },

  {
    id: 'email_pro',
    name: 'Professional Email',
    description: 'you@yourbusiness.com — Google Workspace setup and configured',
    basePrice: 49,
    timeEstimate: '1 day',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: ['domain_setup'],
    requiredWith: [],
    popular: true,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 100
  },

  {
    id: 'link_hub',
    name: 'Link-in-Bio Hub',
    description: 'Branded link page: all your important links in one place (like Linktree, but yours)',
    basePrice: 79,
    timeEstimate: '1-2 days',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'presence',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 200
  },

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'booking_system',
    name: 'Booking System',
    description: 'Online scheduling: clients book directly, calendar syncs, reminders sent automatically',
    basePrice: 99,
    timeEstimate: '2-3 days',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: ['coaching', 'creative', 'fitness', 'professional', 'therapy', 'teaching'],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['intake_form'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'low',
    agencyComparison: 300,
    timeSavedPerMonth: 4,
    revenuePotential: 'No more email tennis'
  },

  {
    id: 'payment_setup',
    name: 'Payment Setup',
    description: 'Stripe integration: take cards, send payment links, set up subscriptions',
    basePrice: 99,
    timeEstimate: '2-3 days',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['invoicing'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'low',
    agencyComparison: 250,
    revenuePotential: 'Get paid faster, look professional'
  },

  {
    id: 'invoicing',
    name: 'Invoicing System',
    description: 'Professional invoices, automatic reminders, payment tracking',
    basePrice: 79,
    timeEstimate: '1-2 days',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['payment_setup'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 200,
    timeSavedPerMonth: 2
  },

  {
    id: 'intake_form',
    name: 'Client Intake Form',
    description: 'Smart questionnaire that captures what you need before the first call',
    basePrice: 79,
    timeEstimate: '1-2 days',
    personas: ['launcher', 'builder'],
    businessTypes: ['coaching', 'creative', 'professional', 'therapy'],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['booking_system'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 150
  },

  {
    id: 'crm_setup',
    name: 'Simple CRM Setup',
    description: 'Track clients, deals, follow-ups — without the complexity of enterprise tools',
    basePrice: 149,
    timeEstimate: '3-5 days',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 500,
    timeSavedPerMonth: 3
  },

  {
    id: 'ordering_system',
    name: 'Ordering System',
    description: 'Online ordering: menu display, order collection, payment, notifications',
    basePrice: 199,
    timeEstimate: '1 week',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: ['food'],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['payment_setup'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 600,
    revenuePotential: 'Take orders while you sleep'
  },

  {
    id: 'class_booking',
    name: 'Class/Session Booking',
    description: 'Let clients book into classes, workshops, or group sessions with capacity limits',
    basePrice: 149,
    timeEstimate: '3-5 days',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: ['fitness'],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['payment_setup'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 400,
    timeSavedPerMonth: 5
  },

  // ═══════════════════════════════════════════════════════════════
  // AUTOMATION
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'welcome_sequence',
    name: 'Welcome Email Sequence',
    description: '3-5 emails that nurture new subscribers or clients automatically',
    basePrice: 149,
    timeEstimate: '3-5 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: ['email_capture'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 500,
    revenuePotential: 'Convert leads while you sleep'
  },

  {
    id: 'email_capture',
    name: 'Email List Setup',
    description: 'Lead magnet delivery, signup forms, list management — ready to grow your audience',
    basePrice: 99,
    timeEstimate: '2-3 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: ['welcome_sequence'],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'low',
    agencyComparison: 250
  },

  {
    id: 'review_automation',
    name: 'Review Request Automation',
    description: 'Automatically ask happy clients for Google reviews at the right moment',
    basePrice: 99,
    timeEstimate: '2-3 days',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'low',
    agencyComparison: 300,
    revenuePotential: 'More reviews = more trust = more clients'
  },

  {
    id: 'workflow_automation',
    name: 'Custom Workflow Automation',
    description: 'Connect your tools: when X happens, do Y. Tailored to your business.',
    basePrice: 199,
    timeEstimate: '1 week',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 600,
    timeSavedPerMonth: 5
  },

  {
    id: 'social_media_setup',
    name: 'Social Media System Setup',
    description: 'Your own content engine: scheduling tool, content calendar, post templates, and training so you can run it yourself',
    basePrice: 249,
    timeEstimate: '1 week',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_with_you',
    category: 'automation',
    suggestedWith: ['content_bank', 'social_templates'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 800,
    timeSavedPerMonth: 6,
    revenuePotential: 'Consistent visibility without the daily scramble'
  },

  {
    id: 'content_bank',
    name: 'Content Bank & Calendar',
    description: '30 days of post ideas tailored to your business, organised in a calendar you can reuse and adapt',
    basePrice: 149,
    timeEstimate: '3-5 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: ['social_media_setup'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 400,
    timeSavedPerMonth: 4,
    revenuePotential: 'Never stare at a blank screen again'
  },

  {
    id: 'social_templates',
    name: 'Social Media Templates',
    description: 'Branded Canva templates for posts, stories, and carousels — just swap the text and go',
    basePrice: 129,
    timeEstimate: '3-5 days',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: ['social_media_setup', 'content_bank'],
    requiredWith: [],
    popular: true,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 350,
    timeSavedPerMonth: 3,
    revenuePotential: 'Look professional without design skills'
  },

  {
    id: 'social_training',
    name: 'Social Media Training Session',
    description: '90-minute 1:1 session: your platforms, your strategy, your questions answered. Recording included.',
    basePrice: 149,
    timeEstimate: '90 mins + prep',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_with_you',
    category: 'automation',
    suggestedWith: ['social_media_setup'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 300
  },

  {
    id: 'social_audit',
    name: 'Social Media Audit',
    description: 'Honest review of your current social presence: what\'s working, what\'s not, and exactly what to fix',
    basePrice: 99,
    timeEstimate: '2-3 days',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'automation',
    suggestedWith: ['social_media_setup', 'social_training'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 250
  },

  // ═══════════════════════════════════════════════════════════════
  // VISIBILITY
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'google_business',
    name: 'Google Business Setup',
    description: 'Claim, optimise, and set up your Google Business Profile to show up in local search',
    basePrice: 79,
    timeEstimate: '1-2 days',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'visibility',
    suggestedWith: ['review_automation'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'low',
    agencyComparison: 200,
    revenuePotential: 'Show up when people search for what you do'
  },

  {
    id: 'seo_basics',
    name: 'SEO Foundations',
    description: 'On-page SEO: titles, descriptions, structure — so Google understands your site',
    basePrice: 149,
    timeEstimate: '3-5 days',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'visibility',
    suggestedWith: ['website_multi'],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'medium',
    agencyComparison: 500
  },

  {
    id: 'multi_location',
    name: 'Multi-Location Setup',
    description: 'Separate pages and Google profiles for each location, unified brand',
    basePrice: 249,
    timeEstimate: '1 week',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'visibility',
    suggestedWith: ['google_business'],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 800
  },

  // ═══════════════════════════════════════════════════════════════
  // SCALE WITH SANITY (Overwhelmed-specific)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'ops_audit',
    name: 'Operations Audit',
    description: 'Deep dive into how your business runs: what\'s working, what\'s broken, what to fix first',
    basePrice: 299,
    timeEstimate: '1 week',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: ['ops_sprint'],
    requiredWith: [],
    popular: true,
    impact: 'high',
    effort: 'low',
    agencyComparison: 1500
  },

  {
    id: 'ops_sprint',
    name: 'Operations Sprint',
    description: '2-week implementation: fix your top 3-5 operational bottlenecks',
    basePrice: 799,
    timeEstimate: '2 weeks',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: [],
    requiredWith: ['ops_audit'],
    popular: true,
    impact: 'high',
    effort: 'high',
    agencyComparison: 3000,
    timeSavedPerMonth: 15
  },

  {
    id: 'process_documentation',
    name: 'Process Documentation',
    description: 'Turn what\'s in your head into SOPs your team can follow',
    basePrice: 249,
    timeEstimate: '1 week',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_with_you',
    category: 'operations',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 800,
    timeSavedPerMonth: 5
  },

  {
    id: 'reporting_dashboard',
    name: 'Reporting Dashboard',
    description: 'One view of your key numbers: revenue, bookings, performance — updated automatically',
    basePrice: 299,
    timeEstimate: '1 week',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'operations',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 1000
  },

  // ═══════════════════════════════════════════════════════════════
  // SUPPORT / RETAINERS
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'retainer_lite',
    name: 'Ongoing Support — Lite',
    description: 'Hosting, updates, email support, one small tweak per month',
    basePrice: 79,  // per month
    timeEstimate: 'Monthly',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'support',
    suggestedWith: [],
    requiredWith: [],
    popular: true,
    impact: 'medium',
    effort: 'low',
    agencyComparison: 200
  },

  {
    id: 'retainer_standard',
    name: 'Ongoing Support — Standard',
    description: 'Everything in Lite + monthly check-in call, priority support, 2-3 tweaks per month',
    basePrice: 149,  // per month
    timeEstimate: 'Monthly',
    personas: ['builder', 'architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'support',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'medium',
    effort: 'medium',
    agencyComparison: 400
  },

  {
    id: 'retainer_scale',
    name: 'Ongoing Support — Scale',
    description: 'Strategic partner: quarterly planning, unlimited tweaks, new automations as you grow',
    basePrice: 299,  // per month
    timeEstimate: 'Monthly',
    personas: ['architect'],
    businessTypes: [],
    deliveryType: 'done_for_you',
    category: 'support',
    suggestedWith: [],
    requiredWith: [],
    popular: false,
    impact: 'high',
    effort: 'medium',
    agencyComparison: 800
  }
];

// Helper function to get services by persona
export function getServicesForPersona(persona: string): ServiceItem[] {
  return SERVICE_CATALOGUE.filter(s => s.personas.includes(persona as any));
}

// Helper function to get services by category
export function getServicesByCategory(category: string): ServiceItem[] {
  return SERVICE_CATALOGUE.filter(s => s.category === category);
}

// Helper function to get service by ID
export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICE_CATALOGUE.find(s => s.id === id);
}
