// DIY Actions  - things users need to do that Reckoning doesn't provide
// These are recommended in reports but must be done by the user themselves
// NO specific provider recommendations (liability/reputation risk)

import type { PersonaType, BusinessCategory } from '@/lib/types';

export interface DIYAction {
  id: string;
  title: string;
  description: string;
  why: string;

  // Who sees this
  personas: PersonaType[];
  businessTypes: BusinessCategory[];  // Empty = all

  // Conditions
  regulatory: boolean;                // Legal/compliance requirement
  priority: 1 | 2 | 3;               // 1 = do first, 2 = soon, 3 = when ready

  // Guidance (generic, no specific providers)
  guidance: string;                   // What to search for / how to approach
  resourceType: 'search' | 'government' | 'professional';
  searchTerms?: string[];             // Suggested search terms

  // Triggers - when to show this
  triggers?: {
    questionId: string;
    condition: 'answered' | 'includes' | 'equals';
    value?: string | string[];
  }[];
}

export const DIY_ACTIONS: DIYAction[] = [
  // ═══════════════════════════════════════════════════════════════
  // BUSINESS REGISTRATION & LEGAL
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'register_business',
    title: 'Register your business',
    description: 'Formally register your business with your local government or tax authority.',
    why: 'Required for legal operation, tax compliance, and opening business accounts.',
    personas: ['launcher'],
    businessTypes: [],
    regulatory: true,
    priority: 1,
    guidance: 'Search for business registration requirements in your country. Most governments have online portals for this.',
    resourceType: 'government',
    searchTerms: ['register business [your country]', 'small business registration', 'sole trader registration'],
  },
  {
    id: 'business_structure',
    title: 'Choose your business structure',
    description: 'Decide whether to operate as a sole trader, limited company, LLC, or other structure.',
    why: 'Affects your taxes, liability, and how you can take money out of the business.',
    personas: ['launcher'],
    businessTypes: [],
    regulatory: true,
    priority: 1,
    guidance: 'Research the pros and cons of different structures for your situation. Consider consulting an accountant for tax implications.',
    resourceType: 'professional',
    searchTerms: ['sole trader vs limited company', 'LLC vs sole proprietorship', 'business structure comparison'],
  },
  {
    id: 'business_bank_account',
    title: 'Open a business bank account',
    description: 'Separate your business finances from personal finances with a dedicated account.',
    why: 'Makes accounting easier, looks more professional, and is often required for certain business structures.',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    regulatory: false,
    priority: 1,
    guidance: 'Compare business bank accounts from multiple providers. Look for low/no fees, good mobile app, and features you need.',
    resourceType: 'search',
    searchTerms: ['best business bank account [your country]', 'small business banking comparison', 'free business bank account'],
  },
  {
    id: 'accounting_system',
    title: 'Set up basic bookkeeping',
    description: 'Track income and expenses from day one, even if it is just a spreadsheet.',
    why: 'Required for tax returns and helps you understand if you are actually making money.',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    regulatory: true,
    priority: 2,
    guidance: 'Start simple with a spreadsheet or free accounting software. Upgrade when needed.',
    resourceType: 'search',
    searchTerms: ['free accounting software small business', 'simple bookkeeping spreadsheet', 'small business expense tracking'],
  },

  // ═══════════════════════════════════════════════════════════════
  // INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'public_liability_insurance',
    title: 'Get public liability insurance',
    description: 'Covers you if a client or member of the public is injured or their property is damaged because of your business.',
    why: 'Protects you from potentially business-ending claims. Often required to rent premises or work with certain clients.',
    personas: ['launcher', 'builder'],
    businessTypes: ['fitness', 'therapy', 'food', 'teaching'],
    regulatory: true,
    priority: 1,
    guidance: 'Search for public liability insurance for your specific industry. Get quotes from multiple providers.',
    resourceType: 'search',
    searchTerms: ['public liability insurance [your industry]', 'small business insurance quotes', 'professional liability insurance'],
  },
  {
    id: 'professional_indemnity',
    title: 'Consider professional indemnity insurance',
    description: 'Covers you if a client claims your advice or service caused them financial loss.',
    why: 'Essential for anyone giving advice, consulting, or providing professional services.',
    personas: ['builder', 'architect'],
    businessTypes: ['coaching', 'professional', 'therapy'],
    regulatory: false,
    priority: 2,
    guidance: 'Compare professional indemnity policies. Coverage levels vary by profession and risk.',
    resourceType: 'search',
    searchTerms: ['professional indemnity insurance [your profession]', 'errors and omissions insurance', 'consultant insurance'],
  },

  // ═══════════════════════════════════════════════════════════════
  // INDUSTRY-SPECIFIC COMPLIANCE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'food_safety_cert',
    title: 'Get food safety certification',
    description: 'Complete required food hygiene training and register with your local food authority.',
    why: 'Legal requirement for anyone handling food commercially. Protects you and your customers.',
    personas: ['launcher', 'builder'],
    businessTypes: ['food'],
    regulatory: true,
    priority: 1,
    guidance: 'Search for food hygiene certificate and food business registration in your area.',
    resourceType: 'government',
    searchTerms: ['food hygiene certificate', 'register food business', 'food safety training'],
  },
  {
    id: 'fitness_qualifications',
    title: 'Verify your fitness qualifications',
    description: 'Ensure your certifications are current and recognised for the services you offer.',
    why: 'Required for insurance, credibility, and in some regions legal operation.',
    personas: ['launcher', 'builder'],
    businessTypes: ['fitness'],
    regulatory: true,
    priority: 1,
    guidance: 'Check your certification body is recognised. Keep CPD up to date.',
    resourceType: 'professional',
    searchTerms: ['personal trainer certification requirements', 'fitness instructor qualifications', 'CPD requirements fitness'],
  },
  {
    id: 'therapy_registration',
    title: 'Register with professional body',
    description: 'Join the appropriate professional body or register with regulators for your therapy type.',
    why: 'Required for insurance, credibility, and in many cases legal practice.',
    personas: ['launcher', 'builder'],
    businessTypes: ['therapy'],
    regulatory: true,
    priority: 1,
    guidance: 'Research professional bodies for your specific therapy type. Requirements vary by modality and region.',
    resourceType: 'professional',
    searchTerms: ['[therapy type] professional registration', 'counselling accreditation', 'therapy practitioner insurance'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DATA & PRIVACY
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'privacy_policy',
    title: 'Create a privacy policy',
    description: 'Document how you collect, use, and protect client data.',
    why: 'Legal requirement in most regions if you collect any personal information (including email addresses).',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    regulatory: true,
    priority: 2,
    guidance: 'Use a privacy policy generator as a starting point, but review it carefully for your specific situation.',
    resourceType: 'search',
    searchTerms: ['free privacy policy generator', 'GDPR privacy policy template', 'small business privacy policy'],
  },
  {
    id: 'terms_conditions',
    title: 'Write terms and conditions',
    description: 'Document what clients can expect and your policies on refunds, cancellations, etc.',
    why: 'Protects you legally and sets clear expectations. Reduces disputes.',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Start with a template but customise for your business. Consider legal review for high-value services.',
    resourceType: 'search',
    searchTerms: ['service terms and conditions template', 'client contract template [industry]', 'cancellation policy examples'],
  },

  // ═══════════════════════════════════════════════════════════════
  // PRICING & FINANCE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'set_prices',
    title: 'Research and set your prices',
    description: 'Understand your costs, research competitors, and set prices that work for you.',
    why: 'Underpricing is the most common mistake. You need to cover costs and make it worth your time.',
    personas: ['launcher'],
    businessTypes: [],
    regulatory: false,
    priority: 1,
    guidance: 'Calculate your costs (time, materials, overheads). Research what others charge. Price for profit, not just survival.',
    resourceType: 'search',
    searchTerms: ['how to price services [industry]', 'pricing strategy small business', 'hourly rate calculator'],
  },
  {
    id: 'tax_registration',
    title: 'Register for tax',
    description: 'Register with your tax authority and understand your obligations.',
    why: 'Legal requirement. Penalties for late registration can be significant.',
    personas: ['launcher'],
    businessTypes: [],
    regulatory: true,
    priority: 1,
    guidance: 'Check your tax authority website for self-employment or business registration. Consider an accountant for setup.',
    resourceType: 'government',
    searchTerms: ['self employment tax registration [your country]', 'small business tax obligations', 'VAT registration threshold'],
  },
  {
    id: 'find_accountant',
    title: 'Find an accountant',
    description: 'Get professional help with tax planning and compliance.',
    why: 'A good accountant saves you more than they cost. Essential as you grow.',
    personas: ['builder', 'architect'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Ask other small business owners for recommendations. Look for someone who understands your industry.',
    resourceType: 'professional',
    searchTerms: ['small business accountant near me', 'accountant for [industry]', 'online accountant small business'],
  },

  // ═══════════════════════════════════════════════════════════════
  // MARKETING & VISIBILITY (DIY)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'claim_social_handles',
    title: 'Claim your social media handles',
    description: 'Secure your business name on platforms you might use, even if not immediately.',
    why: 'Protects your brand name. Easier to claim early than fight for it later.',
    personas: ['launcher'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Claim consistent handles across Instagram, Facebook, TikTok, LinkedIn, X. Even if you will not use them all.',
    resourceType: 'search',
    searchTerms: ['check social media username availability', 'social media handle checker'],
  },
  {
    id: 'google_business_verify',
    title: 'Verify your Google Business Profile',
    description: 'Complete the verification process to appear in local search results.',
    why: 'Free visibility for local searches. Clients expect to find you on Google.',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Create your profile at business.google.com. Verification usually requires a postcard or phone call.',
    resourceType: 'search',
    searchTerms: ['Google Business Profile setup', 'verify Google business listing', 'Google My Business'],
    triggers: [
      { questionId: 'delivery_mode', condition: 'includes', value: ['in_person', 'both'] }
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CLIENT MANAGEMENT (DIY)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'client_contract_template',
    title: 'Create a client contract template',
    description: 'Have a standard agreement ready for client engagements.',
    why: 'Protects both you and your client. Prevents misunderstandings about scope and payment.',
    personas: ['launcher', 'builder'],
    businessTypes: ['coaching', 'professional', 'creative'],
    regulatory: false,
    priority: 2,
    guidance: 'Start with a template and customise. Include scope, payment terms, cancellation policy, IP ownership.',
    resourceType: 'search',
    searchTerms: ['freelance contract template', 'coaching agreement template', 'service agreement template'],
  },
  {
    id: 'testimonial_system',
    title: 'Set up a way to collect testimonials',
    description: 'Create a simple process for asking happy clients for reviews.',
    why: 'Social proof is your most powerful marketing tool. Make it easy to collect.',
    personas: ['launcher', 'builder'],
    businessTypes: [],
    regulatory: false,
    priority: 3,
    guidance: 'Ask after successful outcomes. Make it easy with a direct link or simple form.',
    resourceType: 'search',
    searchTerms: ['how to ask for testimonials', 'testimonial request template', 'collect client reviews'],
  },

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS (DIY)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'backup_system',
    title: 'Set up data backups',
    description: 'Ensure your important files and client data are backed up automatically.',
    why: 'Losing client data or your work can be catastrophic. Prevention is cheap.',
    personas: ['builder', 'architect'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Use cloud storage with automatic sync. Consider a second backup location for critical files.',
    resourceType: 'search',
    searchTerms: ['cloud backup small business', 'automatic file backup', 'business data backup solution'],
  },
  {
    id: 'password_manager',
    title: 'Use a password manager',
    description: 'Stop reusing passwords. Use a password manager for all business accounts.',
    why: 'Weak passwords are the number one cause of account breaches. This is basic security hygiene.',
    personas: ['launcher', 'builder', 'architect'],
    businessTypes: [],
    regulatory: false,
    priority: 2,
    guidance: 'Choose a reputable password manager. Generate unique passwords for every account.',
    resourceType: 'search',
    searchTerms: ['best password manager', 'password manager comparison', 'small business password security'],
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get DIY actions relevant to a specific persona
 */
export function getDIYActionsForPersona(persona: PersonaType): DIYAction[] {
  return DIY_ACTIONS.filter(action => action.personas.includes(persona));
}

/**
 * Get DIY actions relevant to a specific business type
 */
export function getDIYActionsForBusinessType(
  businessType: BusinessCategory,
  persona: PersonaType
): DIYAction[] {
  return DIY_ACTIONS.filter(action => {
    // Must match persona
    if (!action.personas.includes(persona)) return false;
    // If businessTypes is empty, it applies to all
    if (action.businessTypes.length === 0) return true;
    // Otherwise, must match business type
    return action.businessTypes.includes(businessType);
  });
}

/**
 * Get regulatory/must-do actions (priority 1 and regulatory)
 */
export function getMustDoActions(
  persona: PersonaType,
  businessType?: BusinessCategory
): DIYAction[] {
  return DIY_ACTIONS.filter(action => {
    if (!action.personas.includes(persona)) return false;
    if (businessType && action.businessTypes.length > 0 && !action.businessTypes.includes(businessType)) {
      return false;
    }
    return action.regulatory && action.priority === 1;
  });
}

/**
 * Get all actions by priority
 */
export function getDIYActionsByPriority(
  persona: PersonaType,
  businessType?: BusinessCategory
): { priority1: DIYAction[]; priority2: DIYAction[]; priority3: DIYAction[] } {
  const relevant = businessType
    ? getDIYActionsForBusinessType(businessType, persona)
    : getDIYActionsForPersona(persona);

  return {
    priority1: relevant.filter(a => a.priority === 1),
    priority2: relevant.filter(a => a.priority === 2),
    priority3: relevant.filter(a => a.priority === 3),
  };
}
