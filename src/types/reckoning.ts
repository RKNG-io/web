export interface ReckoningSnapshot {
  currentState: string;
  goal: string;
  gap: string;
}

export interface DiagnosisIssue {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  evidence: string[];
}

export interface JourneyAction {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

export interface JourneyPhase {
  id: string;
  phase: string;
  title: string;
  description: string;
  timeline: string;
  actions: JourneyAction[];
}

export interface CostOfWaiting {
  id: string;
  type: 'financial' | 'time' | 'opportunity';
  title: string;
  description: string;
  impact: string;
}

export interface RecommendedService {
  id: string;
  name: string;
  description: string;
  price?: string;
  features?: string[];
}

export interface NextStep {
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  action: string;
}

export interface ReckoningReport {
  id: string;
  generatedAt: string;
  personaName: string;
  openingMessage: string;
  snapshot: ReckoningSnapshot;
  diagnosis: DiagnosisIssue[];
  journey: JourneyPhase[];
  costOfWaiting: CostOfWaiting[];
  nextStep: NextStep;
  recommendedServices: RecommendedService[];
  packageName?: string;
  packageDescription?: string;
}
