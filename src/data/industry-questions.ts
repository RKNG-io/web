// Industry-specific follow-up questions
// Mapped from the automation-os master catalogue
// These are injected after business_type selection

import type { PersonaQuestion } from './persona-questions';

export type IndustryKey =
  | 'fitness'
  | 'food'
  | 'ecommerce'
  | 'coaching'
  | 'therapy'
  | 'creative'
  | 'professional';

// Map business_type answer values to industry keys
export const BUSINESS_TYPE_TO_INDUSTRY: Record<string, IndustryKey> = {
  // Launcher business_type values
  coaching: 'coaching',
  creative: 'creative',
  fitness: 'fitness',
  food: 'food',
  therapy: 'therapy',
  professional: 'professional',
  ecommerce: 'ecommerce',

  // Builder business_type values
  design: 'creative',
  photography: 'creative',
  copywriting: 'creative',
  web_dev: 'creative',
  marketing: 'professional',
  va: 'professional',
};

// Industry-specific questions  - max 2-3 per industry to keep it focused
export const INDUSTRY_QUESTIONS: Record<IndustryKey, PersonaQuestion[]> = {
  fitness: [
    {
      id: 'fitness_booking',
      type: 'single',
      question: 'How do clients book sessions with you?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'OR',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'fitness' },
        ],
      },
      options: [
        { value: 'dm', label: 'DM / text / WhatsApp' },
        { value: 'manual', label: 'Email back and forth' },
        { value: 'system', label: 'I have a booking system' },
        { value: 'gym', label: 'Through the gym I work at' },
        { value: 'not_yet', label: 'Not taking clients yet' },
      ],
    },
    {
      id: 'fitness_retention',
      type: 'single',
      question: 'What happens when a client misses sessions or goes quiet?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'AND',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'fitness' },
          { questionId: 'business_stage', operator: 'notEquals', value: 'idea' },
        ],
      },
      options: [
        { value: 'nothing', label: 'Nothing  - they just drop off' },
        { value: 'manual', label: 'I text them when I remember' },
        { value: 'system', label: 'I have a follow-up system' },
      ],
    },
  ],

  food: [
    {
      id: 'food_ordering',
      type: 'single',
      question: 'How do customers order from you?',
      industrySpecific: true,
      phase: 'reality',
      showIf: { questionId: 'business_type', operator: 'equals', value: 'food' },
      options: [
        { value: 'dm', label: 'DM / text / WhatsApp' },
        { value: 'manual', label: 'Spreadsheet or paper' },
        { value: 'form', label: 'Google Form or similar' },
        { value: 'system', label: 'Online ordering system' },
        { value: 'not_yet', label: 'Not selling yet' },
      ],
    },
    {
      id: 'food_menu',
      type: 'single',
      question: 'How often does your menu change?',
      industrySpecific: true,
      phase: 'reality',
      showIf: { questionId: 'business_type', operator: 'equals', value: 'food' },
      options: [
        { value: 'weekly', label: 'Weekly rotation' },
        { value: 'seasonal', label: 'Seasonally' },
        { value: 'fixed', label: 'Mostly fixed menu' },
        { value: 'custom', label: 'Custom per client' },
      ],
    },
  ],

  ecommerce: [
    {
      id: 'ecommerce_platform',
      type: 'single',
      question: 'Where do you sell?',
      industrySpecific: true,
      phase: 'reality',
      showIf: { questionId: 'business_type', operator: 'equals', value: 'ecommerce' },
      options: [
        { value: 'etsy', label: 'Etsy' },
        { value: 'shopify', label: 'Shopify' },
        { value: 'own_site', label: 'My own website' },
        { value: 'social', label: 'Social media only' },
        { value: 'markets', label: 'Markets / in person' },
        { value: 'multiple', label: 'Multiple channels' },
        { value: 'not_yet', label: 'Not selling yet' },
      ],
    },
    {
      id: 'ecommerce_abandoned',
      type: 'single',
      question: 'Do you follow up with people who abandon their cart?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'AND',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'ecommerce' },
          { questionId: 'ecommerce_platform', operator: 'notEquals', value: 'not_yet' },
          { questionId: 'ecommerce_platform', operator: 'notEquals', value: 'markets' },
        ],
      },
      options: [
        { value: 'no', label: "No  - didn't know I could" },
        { value: 'manual', label: 'Sometimes manually' },
        { value: 'automated', label: 'Yes  - automated emails' },
      ],
    },
  ],

  coaching: [
    {
      id: 'coaching_discovery',
      type: 'single',
      question: 'How do potential clients learn about you before booking?',
      industrySpecific: true,
      phase: 'reality',
      showIf: { questionId: 'business_type', operator: 'equals', value: 'coaching' },
      options: [
        { value: 'call', label: 'Discovery call' },
        { value: 'content', label: 'My content (social/blog)' },
        { value: 'referral', label: 'Word of mouth only' },
        { value: 'website', label: 'Website + enquiry form' },
        { value: 'nothing', label: "Nothing specific  - they just reach out" },
      ],
    },
  ],

  therapy: [
    {
      id: 'therapy_registration',
      type: 'single',
      question: 'Are you registered with a professional body?',
      industrySpecific: true,
      phase: 'reality',
      showIf: { questionId: 'business_type', operator: 'equals', value: 'therapy' },
      options: [
        { value: 'yes', label: 'Yes  - fully registered' },
        { value: 'in_progress', label: 'Working towards it' },
        { value: 'no', label: 'Not required for my modality' },
        { value: 'unsure', label: "Not sure what's needed" },
      ],
    },
    {
      id: 'therapy_notes',
      type: 'single',
      question: 'How do you manage client notes and records?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'AND',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'therapy' },
          { questionId: 'business_stage', operator: 'notEquals', value: 'idea' },
        ],
      },
      options: [
        { value: 'paper', label: 'Paper notes' },
        { value: 'docs', label: 'Google Docs / Word' },
        { value: 'system', label: 'Practice management software' },
        { value: 'nothing', label: "Haven't set this up yet" },
      ],
    },
  ],

  creative: [
    {
      id: 'creative_portfolio',
      type: 'single',
      question: 'Where can potential clients see your work?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'OR',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'creative' },
          { questionId: 'business_type', operator: 'equals', value: 'design' },
          { questionId: 'business_type', operator: 'equals', value: 'photography' },
          { questionId: 'business_type', operator: 'equals', value: 'copywriting' },
        ],
      },
      options: [
        { value: 'website', label: 'My website' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'behance', label: 'Behance / Dribbble' },
        { value: 'pdf', label: 'PDF I send on request' },
        { value: 'nothing', label: "I don't have one yet" },
      ],
    },
  ],

  professional: [
    {
      id: 'professional_clients',
      type: 'single',
      question: 'How do you currently find clients?',
      industrySpecific: true,
      phase: 'reality',
      showIf: {
        operator: 'OR',
        conditions: [
          { questionId: 'business_type', operator: 'equals', value: 'professional' },
          { questionId: 'business_type', operator: 'equals', value: 'va' },
          { questionId: 'business_type', operator: 'equals', value: 'marketing' },
        ],
      },
      options: [
        { value: 'referral', label: 'Referrals and word of mouth' },
        { value: 'platforms', label: 'Freelance platforms (Upwork, etc.)' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'outreach', label: 'Cold outreach' },
        { value: 'not_yet', label: 'Still figuring this out' },
      ],
    },
  ],
};

/**
 * Get industry questions for a given business type
 */
export function getIndustryQuestions(businessType: string): PersonaQuestion[] {
  const industry = BUSINESS_TYPE_TO_INDUSTRY[businessType];
  if (!industry) return [];
  return INDUSTRY_QUESTIONS[industry] || [];
}

/**
 * Merge base questions with industry questions
 * Industry questions are inserted after the business_type question
 */
export function mergeWithIndustryQuestions(
  baseQuestions: PersonaQuestion[],
  businessType: string | undefined
): PersonaQuestion[] {
  if (!businessType) return baseQuestions;

  const industryQuestions = getIndustryQuestions(businessType);
  if (industryQuestions.length === 0) return baseQuestions;

  const result: PersonaQuestion[] = [];

  for (const question of baseQuestions) {
    result.push(question);

    // Inject industry questions after business_type
    if (question.id === 'business_type') {
      result.push(...industryQuestions);
    }
  }

  return result;
}
