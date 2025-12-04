// Outcome pages - linking benefits to services/bundles

export interface Outcome {
  slug: string;
  title: string;
  headline: string;
  subhead: string;
  description: string;
  serviceIds: string[];    // Individual services that deliver this outcome
  bundleIds: string[];     // Bundles that deliver this outcome
  ctaText: string;
  ctaLink: string;
}

export const OUTCOMES: Record<string, Outcome> = {
  time: {
    slug: 'time',
    title: 'Get Your Time Back',
    headline: 'Stop losing hours to admin',
    subhead: 'Emails, invoices, follow-ups — let systems handle the repetitive stuff.',
    description: 'Every hour spent on admin is an hour not spent on the work you actually want to do. These services automate the tasks that eat your time, so you can focus on what matters.',
    serviceIds: [
      'invoicing',
      'booking_system',
      'payment_setup',
      'crm_setup',
      'welcome_sequence',
      'review_automation',
      'workflow_automation',
    ],
    bundleIds: ['get_booked', 'get_systematic'],
    ctaText: 'Not sure where to start?',
    ctaLink: '/start',
  },

  space: {
    slug: 'space',
    title: 'Create Space to Think',
    headline: 'Room to work on your business, not just in it',
    subhead: 'Mental, emotional, practical — the breathing room you need.',
    description: 'When you are the bottleneck, everything slows down. These services help you step back, see clearly, and build systems that don\'t depend on you doing everything.',
    serviceIds: [
      'ops_audit',
      'ops_sprint',
      'process_documentation',
    ],
    bundleIds: ['scale_ready'],
    ctaText: 'Find what\'s blocking you',
    ctaLink: '/start',
  },

  presence: {
    slug: 'presence',
    title: 'Show Up Online',
    headline: 'A presence that feels like you',
    subhead: 'Not performative. Not exhausting. Just you, visible.',
    description: 'Your online presence should work for you, not create more work. These services set you up to be found, look professional, and show up consistently — without the daily grind.',
    serviceIds: [
      'website_single',
      'website_multi',
      'domain_setup',
      'email_pro',
      'google_business',
      'social_media_setup',
      'content_bank',
      'social_templates',
    ],
    bundleIds: ['get_found', 'get_social'],
    ctaText: 'See what fits',
    ctaLink: '/services',
  },

  systems: {
    slug: 'systems',
    title: 'Build Systems That Run',
    headline: 'Automations that work your way',
    subhead: 'Your voice. Your process. Without hiring.',
    description: 'Good systems let you scale without burning out. These services build automations that handle the repetitive stuff — booking, payments, follow-ups, reviews — while keeping your personal touch.',
    serviceIds: [
      'booking_system',
      'payment_setup',
      'intake_form',
      'welcome_sequence',
      'crm_setup',
      'invoicing',
      'review_automation',
      'workflow_automation',
    ],
    bundleIds: ['get_booked', 'get_systematic'],
    ctaText: 'Tell us what needs automating',
    ctaLink: '/start/automations',
  },

  clarity: {
    slug: 'clarity',
    title: 'Get Clarity',
    headline: 'Know what to do next',
    subhead: 'Just the next step — not the whole life plan.',
    description: 'The Reckoning is a 15-question conversation that helps you see what\'s really blocking you. You\'ll get a personalised report with exactly what to focus on first.',
    serviceIds: [],
    bundleIds: [],
    ctaText: 'Start your Reckoning',
    ctaLink: '/start',
  },

  calm: {
    slug: 'calm',
    title: 'Find Your Calm',
    headline: 'The confidence of knowing things are handled',
    subhead: 'Systems in place. Nothing falling through the cracks.',
    description: 'Calm isn\'t about doing less — it\'s about knowing what\'s covered. Browse our services and bundles to see what would give you that peace of mind.',
    serviceIds: [],
    bundleIds: ['launch_ready', 'get_booked', 'get_systematic', 'get_found'],
    ctaText: 'Browse all services',
    ctaLink: '/services',
  },

  clients: {
    slug: 'clients',
    title: 'Get Clients',
    headline: 'Tools that make it easy for people to say yes',
    subhead: 'From first touch to signed deal — without the awkward chase.',
    description: 'Getting clients shouldn\'t feel like begging. These services help you look professional, respond fast, and make it easy for the right people to work with you.',
    serviceIds: [
      'website_single',
      'website_multi',
      'intake_form',
      'booking_system',
      'crm_setup',
      'welcome_sequence',
      'email_capture',
      'content_bank',
      'google_business',
    ],
    bundleIds: ['get_found', 'get_booked', 'launch_ready'],
    ctaText: 'Ready to make it easy to say yes?',
    ctaLink: '/start',
  },

  paid: {
    slug: 'paid',
    title: 'Get Paid',
    headline: 'Revenue that arrives smoothly and consistently',
    subhead: 'Invoicing, chasing, reconciliation — handled.',
    description: 'Chasing invoices is awkward. Forgetting to invoice is worse. These services automate the money side so you can focus on the work.',
    serviceIds: [
      'payment_setup',
      'invoicing',
      'booking_system',
      'ordering_system',
      'review_automation',
    ],
    bundleIds: ['get_booked', 'get_systematic'],
    ctaText: 'Ready to get paid without the chase?',
    ctaLink: '/start',
  },
};

export function getOutcome(slug: string): Outcome | undefined {
  return OUTCOMES[slug];
}

export function getAllOutcomes(): Outcome[] {
  return Object.values(OUTCOMES);
}
