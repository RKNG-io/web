// types/index.ts
// Core type definitions for Reckoning

// ═══════════════════════════════════════════════════════════════
// PERSONAS
// ═══════════════════════════════════════════════════════════════

export type PersonaType = 'launcher' | 'builder' | 'architect';

export type BusinessCategory = 
  | 'coaching' 
  | 'creative' 
  | 'food' 
  | 'fitness' 
  | 'professional' 
  | 'ecommerce' 
  | 'therapy'
  | 'teaching'
  | 'other';

export type DeliveryMode = 'online' | 'in_person' | 'both';

// ═══════════════════════════════════════════════════════════════
// QUESTIONNAIRE
// ═══════════════════════════════════════════════════════════════

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'single' | 'multi' | 'text' | 'scale' | 'rank';
  options?: Option[];
  conditions?: Condition[];      // when to show this question
  triggers?: Trigger[];          // what this answer unlocks
  required: boolean;
  aiExpandable?: boolean;        // can AI generate follow-ups
}

export interface Option {
  value: string;
  label: string;
  triggers?: Trigger[];          // this specific answer triggers something
}

export interface Condition {
  questionId: string;
  operator: 'equals' | 'includes' | 'notEquals' | 'answered';
  value?: string | string[];
}

export interface Trigger {
  action: 'showQuestion' | 'addChecklist' | 'setFlag' | 'aiGenerate';
  target: string;                // question ID, checklist category, or prompt key
}

export interface QuestionnaireAnswers {
  persona: PersonaType;
  answers: Record<string, string | string[] | number>;
  businessType: BusinessCategory;
  deliveryMode: DeliveryMode;
  checklist: ChecklistItem[];
  regulatoryFlags: RegulatoryFlag[];
}

// ═══════════════════════════════════════════════════════════════
// CHECKLISTS
// ═══════════════════════════════════════════════════════════════

export interface ChecklistItem {
  id: string;
  item: string;
  priority: 1 | 2 | 3;
  regulatory: boolean;
  category: string;
  completed?: boolean;
  completedAt?: Date;
  helpRequested?: boolean;
}

export interface RegulatoryFlag {
  type: 'regulatory' | 'legal' | 'safety';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

// ═══════════════════════════════════════════════════════════════
// SERVICES & PRICING
// ═══════════════════════════════════════════════════════════════

export type ServiceCategory =
  | 'presence'      // Website, branding, email
  | 'operations'    // Booking, payments, CRM
  | 'automation'    // Email sequences, workflows
  | 'visibility'    // SEO basics, Google Business
  | 'support';      // Retainers, ongoing

export type DeliveryType = 'diy_resource' | 'done_with_you' | 'done_for_you';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  
  // Pricing
  basePrice: number;                    // £ GBP
  timeEstimate: string;                 // "2-3 hours" or "1 week"
  
  // Filtering
  personas: PersonaType[];              // Who sees this
  businessTypes: BusinessCategory[];    // Which industries (empty = all)
  
  // Delivery
  deliveryType: DeliveryType;
  
  // Bundling
  category: ServiceCategory;
  suggestedWith: string[];              // IDs of complementary services
  requiredWith: string[];               // IDs of dependencies
  
  // Display
  popular: boolean;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  
  // Value framing
  agencyComparison: number;             // What an agency would charge
  timeSavedPerMonth?: number;           // Hours saved (for ROI calc)
  revenuePotential?: string;            // "Capture 10% more leads"
}

export interface SelectedItem {
  service: ServiceItem;
  quantity: number;
}

export interface PricingResult {
  // Core pricing
  items: {
    id: string;
    name: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
  
  subtotal: number;                 // À la carte total
  discount: number;                 // Discount amount
  discountPercentage: number;       // e.g., 0.15 for 15%
  total: number;                    // After discount
  
  // Comparisons
  agencyTotal: number;              // What agencies would charge
  agencySavings: number;            // Difference
  agencySavingsPercentage: number;
  
  // Cost of inaction
  costOfInaction: {
    timeLost: {
      hoursPerMonth: number;
      hoursPerYear: number;
      monetaryValue: number;
    };
    revenueLost: {
      description: string;
      estimate: number;
    };
    lifeCost: string;               // Qualitative, from questionnaire
  };
  
  // ROI framing
  roi: {
    paybackPeriod: string;          // "Pays for itself in X months"
    yearOneValue: number;           // Time saved + revenue potential
  };
  
  // Suggested additions
  suggestions: {
    service: ServiceItem;
    reason: string;
  }[];
}

// ═══════════════════════════════════════════════════════════════
// PACKAGES
// ═══════════════════════════════════════════════════════════════

export interface Package {
  id: string;
  name: string;
  tagline: string;
  persona: PersonaType;
  price: number;
  includes: string[];               // Service IDs
  alaCarteValue: number;
  savings: number;
  note?: string;
}

// ═══════════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════════

export interface ReckoningReport {
  meta: {
    persona: PersonaType;
    name: string;
    businessType: string;
    generatedDate: string;
  };
  
  opening: {
    headline: string;
    reflection: string;
  };
  
  snapshot: {
    whereYouAre?: string;
    whatYouveBuilt?: string;
    whatsWorking: string[];
    whatsMissing?: string[];
    whatsCostingYou?: string[];
  };
  
  diagnosis: {
    coreInsight?: string;
    pattern?: string;
    blockersReframed?: string;
    hiddenAdvantage?: string;
    hiddenCost?: string;
    quickWins?: string[];
  };
  
  journeyMap?: {
    phase1: Phase;
    phase2: Phase;
    phase3: Phase;
  };
  
  theFix?: {
    principle: string;
    phase1: FixPhase;
    phase2: FixPhase;
    phase3: FixPhase;
  };
  
  costOfWaiting?: {
    timeCost: string;
    moneyCost: string;
    lifeCost: string;
  };
  
  costOfStatusQuo?: {
    time: string;
    money: string;
    energy: string;
    reputation: string;
  };
  
  theUpgrade?: {
    beforeAfter: {
      before: string;
      after: string;
    };
    priorityFixes: PriorityFix[];
  };
  
  toolsAudit?: {
    alreadyPayingFor: string[];
    underutilised: string[];
    missing: string[];
    recommendation: string;
  };
  
  freedomVision?: {
    theirWords: string;
    whatItTakes: string;
  };
  
  yourInvestment: {
    diyPath: {
      description: string;
      estimatedTime?: string;
      toolsNeeded?: string[];
      realistic?: boolean;
      risk?: string;
    };
    supportedPath: {
      description: string;
      estimatedInvestment: string;
      whatYouGet?: string[];
      recommended?: string;
      roiFraming?: string;
    };
  };
  
  closing: {
    affirmation?: string;
    validation?: string;
    truth?: string;
    permission?: string;
    oneNextStep: string;
    signOff: string;
  };
}

interface Phase {
  title: string;
  description: string;
  items: PhaseItem[];
}

interface PhaseItem {
  task: string;
  why: string;
  diyOrHelp: 'diy' | 'help' | 'either';
  priority: number;
  regulatory: boolean;
}

interface FixPhase {
  title: string;
  focus: string;
  actions: FixAction[];
}

interface FixAction {
  action: string;
  owner: 'you' | 'team' | 'outsource';
  timeInvestment: string;
  timeReturned: string;
}

interface PriorityFix {
  area: string;
  currentState: string;
  upgradedState: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  diyOrHelp: 'diy' | 'help' | 'either';
}

// ═══════════════════════════════════════════════════════════════
// USER / CLIENT
// ═══════════════════════════════════════════════════════════════

export interface Client {
  id: string;
  email: string;
  name?: string;
  persona?: PersonaType;
  businessType?: BusinessCategory;
  createdAt: Date;
  questionnaireCompletedAt?: Date;
  reportGeneratedAt?: Date;
  checklistProgress?: number;       // 0-100
  purchasedServices?: string[];     // Service IDs
  retainerActive?: boolean;
}
