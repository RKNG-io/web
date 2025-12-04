// Core types for Reckoning

export type Persona = 'launcher' | 'builder' | 'architect';

export type ReckoningStatus = 'pending' | 'completed' | 'failed' | 'reviewed';

export type IntakeStatus = 'new' | 'quoted' | 'converted' | 'closed';

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'refunded';

export interface QuestionOption {
  value: string;
  label: string;
  triggers?: Array<{
    action: 'showQuestion' | 'addChecklist' | 'setFlag' | 'aiGenerate';
    target: string;
  }>;
}

export interface Question {
  id: string;
  type: 'single' | 'multi' | 'text' | 'acknowledgment' | 'scale' | 'rank';
  text?: string;          // Question text (preferred)
  question?: string;      // Legacy alias for text
  subtext?: string;
  options?: QuestionOption[];
  required?: boolean;
  maxSelections?: number;
  content?: string;       // For acknowledgment type
  conditions?: Array<{    // When to show this question
    questionId: string;
    operator: 'equals' | 'includes' | 'notEquals' | 'answered';
    value?: string | string[];
  }>;
  triggers?: Array<{      // What this answer unlocks
    action: 'showQuestion' | 'addChecklist' | 'setFlag' | 'aiGenerate';
    target: string;
  }>;
  aiExpandable?: boolean;
}

export interface QuestionnaireFlow {
  persona: Persona;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  persona?: Persona[];
  status: 'active' | 'discontinued';
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}

// Re-export specific types from lib/types (avoiding conflicts with locally-defined types)
export type {
  ServiceItem,
  ServiceCategory,
  DeliveryType,
  Package,
  PersonaType,
  ChecklistItem,
  RegulatoryFlag,
  BusinessCategory,
  SelectedItem,
  PricingResult,
} from '@/lib/types';
