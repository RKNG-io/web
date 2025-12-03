// data/question-bank.ts
// Conditional question logic and business-type specific questions

import { Question, ChecklistItem } from '../types';

// ═══════════════════════════════════════════════════════════════
// BUSINESS TYPE QUESTIONS
// ═══════════════════════════════════════════════════════════════

export const BUSINESS_TYPE_QUESTIONS: Record<string, Question[]> = {
  food: [
    {
      id: 'food_hygiene',
      text: 'Do you have a food hygiene certificate?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'food' }
      ],
      options: [
        { value: 'yes', label: 'Yes — Level 2 or higher' },
        { value: 'no', label: 'Not yet' },
        { value: 'unsure', label: "I'm not sure what I need" }
      ],
      required: true
    },
    {
      id: 'food_kitchen',
      text: 'Where will you prepare food?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'food' }
      ],
      options: [
        {
          value: 'home_registered',
          label: 'Home kitchen — registered with council'
        },
        {
          value: 'home_not_registered',
          label: 'Home kitchen — not yet registered',
          triggers: [
            { action: 'setFlag', target: 'needs_kitchen_registration' }
          ]
        },
        { value: 'commercial', label: 'Commercial kitchen' },
        { value: 'rented', label: 'Rented kitchen space' },
        { value: 'unsure', label: "I haven't figured this out yet" }
      ],
      required: true
    },
    {
      id: 'food_delivery',
      text: 'How will customers receive their food?',
      type: 'multi',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'food' }
      ],
      options: [
        { value: 'delivery', label: 'I deliver to them' },
        { value: 'collection', label: 'They collect from me' },
        { value: 'both', label: 'Both options' },
        { value: 'unsure', label: 'Not decided yet' }
      ],
      required: true
    }
  ],

  fitness: [
    {
      id: 'fitness_qualification',
      text: 'What qualifications do you have?',
      type: 'multi',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'fitness' }
      ],
      options: [
        { value: 'level2', label: 'Level 2 Gym Instructor' },
        { value: 'level3', label: 'Level 3 Personal Trainer' },
        { value: 'specialist', label: 'Specialist certifications (yoga, pilates, etc.)' },
        { value: 'nutrition', label: 'Nutrition qualification' },
        { value: 'none_yet', label: 'Still working on qualifications' },
        { value: 'other', label: 'Other: ________' }
      ],
      required: true
    },
    {
      id: 'fitness_location',
      text: 'Where do you train clients?',
      type: 'multi',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'fitness' }
      ],
      options: [
        { value: 'gym', label: 'Commercial gym' },
        { value: 'home_studio', label: 'Home studio' },
        { value: 'client_home', label: "Client's home" },
        { value: 'outdoor', label: 'Outdoor / parks' },
        { value: 'online', label: 'Online only' },
        { value: 'unsure', label: 'Not decided yet' }
      ],
      required: true
    },
    {
      id: 'fitness_insurance',
      text: 'Do you have insurance?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'fitness' }
      ],
      options: [
        { value: 'yes_both', label: 'Yes — public liability + professional indemnity' },
        { value: 'yes_partial', label: 'Yes — but not sure if it covers everything' },
        { value: 'no', label: 'Not yet' }
      ],
      required: true
    }
  ],

  therapy: [
    {
      id: 'therapy_registration',
      text: 'Are you registered with a professional body?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'therapy' }
      ],
      options: [
        { value: 'bacp', label: 'BACP' },
        { value: 'ukcp', label: 'UKCP' },
        { value: 'hcpc', label: 'HCPC' },
        { value: 'other', label: 'Other professional body' },
        { value: 'in_progress', label: 'Working towards registration' },
        { value: 'no', label: 'Not registered' }
      ],
      required: true
    },
    {
      id: 'therapy_supervision',
      text: 'Do you have clinical supervision in place?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'therapy' }
      ],
      options: [
        { value: 'yes', label: 'Yes — regular supervision' },
        { value: 'arranging', label: 'Currently arranging' },
        { value: 'no', label: 'Not yet' }
      ],
      required: true
    }
  ],

  creative: [
    {
      id: 'creative_portfolio',
      text: 'Do you have a portfolio?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'creative' }
      ],
      options: [
        { value: 'yes_good', label: 'Yes — and I\'m proud of it' },
        { value: 'yes_outdated', label: 'Yes — but it\'s outdated' },
        { value: 'partial', label: 'Some work collected, not properly displayed' },
        { value: 'no', label: 'Not yet' }
      ],
      required: true
    },
    {
      id: 'creative_contracts',
      text: 'Have you ever had a scope creep nightmare?',
      type: 'single',
      conditions: [
        { questionId: 'business_type', operator: 'equals', value: 'creative' },
        { questionId: 'duct_tape_areas', operator: 'includes', value: 'contracts' }
      ],
      options: [
        { value: 'yes_bad', label: 'Yes — it was awful' },
        { value: 'yes_minor', label: 'Yes — but managed to handle it' },
        { value: 'no_lucky', label: 'No — been lucky so far' },
        { value: 'no_contracts', label: 'No — I already use solid contracts' }
      ],
      required: false
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// BUSINESS TYPE CHECKLISTS
// ═══════════════════════════════════════════════════════════════

export const BUSINESS_TYPE_CHECKLISTS: Record<string, ChecklistItem[]> = {
  coaching: [
    { id: 'coaching_1', item: 'Way for clients to book discovery calls', priority: 1, regulatory: false, category: 'operations' },
    { id: 'coaching_2', item: 'Services and pricing defined', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'coaching_3', item: 'Session packages structured', priority: 2, regulatory: false, category: 'pricing' },
    { id: 'coaching_4', item: 'Client intake / onboarding form', priority: 2, regulatory: false, category: 'operations' },
    { id: 'coaching_5', item: 'Scheduling system for ongoing sessions', priority: 2, regulatory: false, category: 'operations' },
    { id: 'coaching_6', item: 'Client portal or resource delivery', priority: 3, regulatory: false, category: 'operations' },
    { id: 'coaching_7', item: 'Cancellation / rescheduling policy', priority: 2, regulatory: false, category: 'legal' }
  ],

  therapy: [
    { id: 'therapy_1', item: 'Professional registration / accreditation', priority: 1, regulatory: true, category: 'legal' },
    { id: 'therapy_2', item: 'Clinical supervision arrangement', priority: 1, regulatory: true, category: 'legal' },
    { id: 'therapy_3', item: 'Confidential booking system', priority: 1, regulatory: false, category: 'operations' },
    { id: 'therapy_4', item: 'Secure client notes system', priority: 1, regulatory: true, category: 'operations' },
    { id: 'therapy_5', item: 'Consent and privacy forms', priority: 1, regulatory: true, category: 'legal' },
    { id: 'therapy_6', item: 'Insurance (professional indemnity)', priority: 1, regulatory: true, category: 'legal' },
    { id: 'therapy_7', item: 'Cancellation policy', priority: 2, regulatory: false, category: 'legal' },
    { id: 'therapy_8', item: 'Crisis / safeguarding protocol documented', priority: 1, regulatory: true, category: 'legal' }
  ],

  fitness: [
    { id: 'fitness_1', item: 'Qualification / certification', priority: 1, regulatory: true, category: 'legal' },
    { id: 'fitness_2', item: 'Insurance (public liability + professional)', priority: 1, regulatory: true, category: 'legal' },
    { id: 'fitness_3', item: 'PAR-Q / health screening form', priority: 1, regulatory: true, category: 'operations' },
    { id: 'fitness_4', item: 'Liability waiver', priority: 1, regulatory: true, category: 'legal' },
    { id: 'fitness_5', item: 'Session booking system', priority: 2, regulatory: false, category: 'operations' },
    { id: 'fitness_6', item: 'Package pricing defined', priority: 2, regulatory: false, category: 'pricing' },
    { id: 'fitness_7', item: 'Programme delivery method (app, PDF, in-person)', priority: 2, regulatory: false, category: 'operations' },
    { id: 'fitness_8', item: 'Venue / location sorted', priority: 1, regulatory: false, category: 'operations' }
  ],

  food: [
    { id: 'food_1', item: 'Food hygiene certificate (Level 2 minimum)', priority: 1, regulatory: true, category: 'legal' },
    { id: 'food_2', item: 'Kitchen registered with local council', priority: 1, regulatory: true, category: 'legal' },
    { id: 'food_3', item: 'Kitchen setup (home, commercial, rented)', priority: 1, regulatory: false, category: 'operations' },
    { id: 'food_4', item: 'Menu and pricing defined', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'food_5', item: 'Ordering system', priority: 1, regulatory: false, category: 'operations' },
    { id: 'food_6', item: 'Payment collection method', priority: 1, regulatory: false, category: 'operations' },
    { id: 'food_7', item: 'Delivery or collection process', priority: 2, regulatory: false, category: 'operations' },
    { id: 'food_8', item: 'Packaging and labelling sorted', priority: 2, regulatory: true, category: 'operations' },
    { id: 'food_9', item: 'Allergen documentation', priority: 1, regulatory: true, category: 'legal' },
    { id: 'food_10', item: 'Food safety management system', priority: 1, regulatory: true, category: 'legal' },
    { id: 'food_11', item: 'Insurance (public liability + product)', priority: 1, regulatory: true, category: 'legal' }
  ],

  creative: [
    { id: 'creative_1', item: 'Portfolio (online)', priority: 1, regulatory: false, category: 'presence' },
    { id: 'creative_2', item: 'Services and pricing defined', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'creative_3', item: 'Enquiry / booking process', priority: 2, regulatory: false, category: 'operations' },
    { id: 'creative_4', item: 'Contracts / scope of work template', priority: 1, regulatory: false, category: 'legal' },
    { id: 'creative_5', item: 'Proposal / quote template', priority: 2, regulatory: false, category: 'operations' },
    { id: 'creative_6', item: 'Invoicing system', priority: 2, regulatory: false, category: 'operations' },
    { id: 'creative_7', item: 'Revision policy defined', priority: 2, regulatory: false, category: 'legal' },
    { id: 'creative_8', item: 'File delivery method', priority: 2, regulatory: false, category: 'operations' },
    { id: 'creative_9', item: 'Asset storage / handover process', priority: 3, regulatory: false, category: 'operations' }
  ],

  teaching: [
    { id: 'teaching_1', item: 'DBS check (if working with children)', priority: 1, regulatory: true, category: 'legal' },
    { id: 'teaching_2', item: 'Qualifications documented', priority: 1, regulatory: false, category: 'legal' },
    { id: 'teaching_3', item: 'Session booking system', priority: 2, regulatory: false, category: 'operations' },
    { id: 'teaching_4', item: 'Pricing and packages defined', priority: 2, regulatory: false, category: 'pricing' },
    { id: 'teaching_5', item: 'Payment collection method', priority: 2, regulatory: false, category: 'operations' },
    { id: 'teaching_6', item: 'Lesson materials / curriculum', priority: 2, regulatory: false, category: 'operations' },
    { id: 'teaching_7', item: 'Parent/guardian communication (if applicable)', priority: 2, regulatory: false, category: 'operations' },
    { id: 'teaching_8', item: 'Cancellation policy', priority: 2, regulatory: false, category: 'legal' },
    { id: 'teaching_9', item: 'Progress tracking method', priority: 3, regulatory: false, category: 'operations' }
  ],

  ecommerce: [
    { id: 'ecommerce_1', item: 'Products ready to sell', priority: 1, regulatory: false, category: 'operations' },
    { id: 'ecommerce_2', item: 'Product photography', priority: 1, regulatory: false, category: 'presence' },
    { id: 'ecommerce_3', item: 'Pricing defined', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'ecommerce_4', item: 'Online shop / checkout', priority: 1, regulatory: false, category: 'operations' },
    { id: 'ecommerce_5', item: 'Payment processing', priority: 1, regulatory: false, category: 'operations' },
    { id: 'ecommerce_6', item: 'Shipping method and pricing', priority: 1, regulatory: false, category: 'operations' },
    { id: 'ecommerce_7', item: 'Packaging sorted', priority: 2, regulatory: false, category: 'operations' },
    { id: 'ecommerce_8', item: 'Returns policy', priority: 2, regulatory: false, category: 'legal' },
    { id: 'ecommerce_9', item: 'Inventory tracking', priority: 2, regulatory: false, category: 'operations' },
    { id: 'ecommerce_10', item: 'Supplier relationships (if applicable)', priority: 2, regulatory: false, category: 'operations' }
  ],

  professional: [
    { id: 'professional_1', item: 'Services defined', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'professional_2', item: 'Pricing structure (hourly, retainer, project)', priority: 1, regulatory: false, category: 'pricing' },
    { id: 'professional_3', item: 'Proposal / quote template', priority: 2, regulatory: false, category: 'operations' },
    { id: 'professional_4', item: 'Contracts', priority: 1, regulatory: false, category: 'legal' },
    { id: 'professional_5', item: 'Time tracking system', priority: 2, regulatory: false, category: 'operations' },
    { id: 'professional_6', item: 'Invoicing system', priority: 2, regulatory: false, category: 'operations' },
    { id: 'professional_7', item: 'Client communication method', priority: 2, regulatory: false, category: 'operations' },
    { id: 'professional_8', item: 'File sharing / collaboration setup', priority: 2, regulatory: false, category: 'operations' },
    { id: 'professional_9', item: 'Confidentiality / NDA template', priority: 2, regulatory: false, category: 'legal' }
  ]
};

// Helper function to get checklist for business type
export function getChecklistForBusinessType(type: string): ChecklistItem[] {
  return BUSINESS_TYPE_CHECKLISTS[type] || [];
}

// Helper function to get questions for business type
export function getQuestionsForBusinessType(type: string): Question[] {
  return BUSINESS_TYPE_QUESTIONS[type] || [];
}
