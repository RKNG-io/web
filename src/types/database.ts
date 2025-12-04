// Database row types (matching PostgreSQL schema)

export interface ReckoningRow {
  id: string;
  token: string;
  persona: string;
  answers: Record<string, unknown>;
  report: Record<string, unknown> | null;
  status: string;
  confidence_score: number | null;
  created_at: Date;
  completed_at: Date | null;
  email: string | null;
  name: string | null;
}

export interface IntakeRequestRow {
  id: string;
  type: string;
  answers: Record<string, unknown>;
  name: string;
  email: string;
  contact_preference: string | null;
  status: string;
  created_at: Date;
}

export interface OrderRow {
  id: string;
  reckoning_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  items: Array<{ id: string; name: string; price: number }>;
  total_amount: number;
  discount_amount: number;
  status: string;
  created_at: Date;
  paid_at: Date | null;
}

// Query result types
export interface ReckoningWithReport extends ReckoningRow {
  report: NonNullable<ReckoningRow['report']>;
}

export interface PendingReport {
  id: string;
  token: string;
  name: string | null;
  persona: string;
  confidence_score: number | null;
  created_at: Date;
  status: string;
}
