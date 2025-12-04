// Report types — matches Claude output schema exactly

export interface ReckoningReport {
  version: "1.0";
  generated_at: string; // ISO timestamp
  
  meta: {
    persona: "launcher" | "builder" | "architect";
    submission_id: string;
    model: string;
    prompt_version: string;
  };
  
  recipient: {
    name: string;
    business_name: string | null;
    business_type: string;
    industry: string | null;
  };
  
  sections: {
    opening: OpeningSection;
    snapshot: SnapshotSection;
    diagnosis: DiagnosisSection;
    journey_map: JourneyMapSection;
    next_step: NextStepSection;
    closing: ClosingSection;
  };
  
  recommendations: {
    services: ServiceRecommendation[];
    package: "launcher" | "builder" | "architect" | null;
  };
  
  // For validation — echo back key inputs
  input_echo: {
    name: string;
    persona: string;
    primary_goal: string;
    biggest_blocker: string;
    quoted_phrases: string[];
  };
}

export interface OpeningSection {
  headline: string;
  body: string;
}

export interface SnapshotSection {
  stage: string;
  stage_description: string;
  strengths: string[];
  blockers: string[];
}

export interface DiagnosisSection {
  primary_blocker: {
    title: string;
    explanation: string;
    impact: string;
  };
  secondary_blockers: Array<{
    title: string;
    explanation: string;
  }>;
  cost_of_inaction: {
    narrative: string;
    calculation: CostCalculation | null;
  };
}

export interface CostCalculation {
  hours_per_week: number;
  hourly_value: number;
  weeks_per_year: number;
  annual_cost: number;
}

export interface JourneyMapSection {
  overview: string;
  phases: [Phase, Phase, Phase];
}

export interface Phase {
  number: 1 | 2 | 3;
  title: string;
  duration: string;
  focus: string;
  tasks: Array<{
    task: string;
    diy_option: string | null;
    service_id: string | null;
    priority: "must" | "should" | "could";
  }>;
  completion_criteria?: string; // "Phase complete when: [criteria]"
}

export interface NextStepSection {
  headline: string;
  the_one_thing: {
    action: string;
    why_this: string;
    how_to_start: string;
  };
  diy_path: {
    description: string;
    first_step: string;
    resources: string[];
  };
  supported_path: {
    description: string;
    recommended_service: string;
    service_id: string;
    price_from: number;
  };
}

export interface ClosingSection {
  message: string;
  sign_off: string;
}

export interface ServiceRecommendation {
  service_id: string;
  service_name: string;
  relevance: string;
  priority: 1 | 2 | 3;
  price_from: number;
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Confidence result type
export interface ConfidenceResult {
  score: number;
  autoApprove: boolean;
  flags: string[];
  validationResults: {
    schema: ValidationResult;
    inputEcho: ValidationResult;
    brandVoice: ValidationResult;
    maths: ValidationResult;
    services: ValidationResult;
  };
}

// Questionnaire submission type (for validation)
export interface QuestionnaireSubmission {
  id: string;
  persona: "launcher" | "builder" | "architect";
  answers: Record<string, unknown>;
  email: string;
  created_at: string;
}
