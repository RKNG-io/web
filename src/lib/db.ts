import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'reckoning',
  user: process.env.DB_USER || 'liz',
  password: process.env.DB_PASSWORD || 'localdev',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

// Reckoning types
export interface Reckoning {
  id: string;
  token: string;
  persona: string;
  answers: Record<string, unknown>;
  report: Record<string, unknown> | null;
  status: 'pending' | 'completed' | 'failed' | 'reviewed' | 'pending_review' | 'generating' | 'ready';
  confidence_score: number | null;
  validation_flags: string[];
  created_at: Date;
  completed_at: Date | null;
  email: string | null;
  name: string | null;
  error_log: string | null;
  edited_at: Date | null;
  edited_by: string | null;
  generation_attempts: number;
  pdf_url: string | null;
}

export interface QuestionnaireSubmission {
  id: string;
  persona: string;
  answers: Record<string, unknown>;
  email: string;
  created_at: string;
}

// Submission queries
export async function getSubmissionById(id: string): Promise<QuestionnaireSubmission | null> {
  // For now, submissions might be stored in reckonings table or separate
  // This is a placeholder that assumes submissions are stored elsewhere
  // In practice, you might query a questionnaire_submissions table
  return queryOne<QuestionnaireSubmission>(
    'SELECT id, persona, answers, email, created_at FROM questionnaire_submissions WHERE id = $1',
    [id]
  );
}

// Reckoning queries
export async function createReckoning(
  token: string,
  persona: string,
  answers: Record<string, unknown>,
  name?: string,
  email?: string
): Promise<Reckoning> {
  const [reckoning] = await query<Reckoning>(
    `INSERT INTO reckonings (token, persona, answers, name, email, status, generation_attempts)
     VALUES ($1, $2, $3, $4, $5, 'pending', 1)
     RETURNING *`,
    [token, persona, JSON.stringify(answers), name, email]
  );
  return reckoning;
}

export async function getReckoningByToken(token: string): Promise<Reckoning | null> {
  return queryOne<Reckoning>(
    'SELECT * FROM reckonings WHERE token = $1',
    [token]
  );
}

export async function getReckoningById(id: string): Promise<Reckoning | null> {
  return queryOne<Reckoning>(
    'SELECT * FROM reckonings WHERE id = $1',
    [id]
  );
}

export async function updateReckoningReport(
  token: string,
  report: Record<string, unknown>,
  confidenceScore: number
): Promise<void> {
  const status = confidenceScore >= 90 ? 'ready' : 'pending_review';
  await query(
    `UPDATE reckonings 
     SET report = $1, confidence_score = $2, status = $3, completed_at = NOW()
     WHERE token = $4`,
    [JSON.stringify(report), confidenceScore, status, token]
  );
}

export async function updateReckoningStatus(
  id: string,
  status: Reckoning['status']
): Promise<void> {
  await query(
    'UPDATE reckonings SET status = $1 WHERE id = $2',
    [status, id]
  );
}

export async function updateReckoningValidation(
  id: string,
  confidenceScore: number,
  validationFlags: string[]
): Promise<void> {
  await query(
    `UPDATE reckonings 
     SET confidence_score = $1, validation_flags = $2
     WHERE id = $3`,
    [confidenceScore, JSON.stringify(validationFlags), id]
  );
}

export async function markReckoningReviewed(
  id: string,
  reviewedBy: string,
  notes?: string
): Promise<void> {
  await query(
    `UPDATE reckonings 
     SET status = 'reviewed', reviewed_at = NOW(), reviewed_by = $1, review_notes = $2
     WHERE id = $3`,
    [reviewedBy, notes, id]
  );
}

export async function updateReckoningReport2(
  id: string,
  report: Record<string, unknown>,
  editedBy: string
): Promise<void> {
  await query(
    `UPDATE reckonings 
     SET report = $1, edited_at = NOW(), edited_by = $2
     WHERE id = $3`,
    [JSON.stringify(report), editedBy, id]
  );
}

export async function incrementGenerationAttempts(id: string): Promise<void> {
  await query(
    'UPDATE reckonings SET generation_attempts = generation_attempts + 1 WHERE id = $1',
    [id]
  );
}

export async function setReckoningError(id: string, error: string): Promise<void> {
  await query(
    `UPDATE reckonings SET status = 'failed', error_log = $1 WHERE id = $2`,
    [error, id]
  );
}

export async function setReckoningPdfUrl(id: string, pdfUrl: string): Promise<void> {
  await query(
    'UPDATE reckonings SET pdf_url = $1 WHERE id = $2',
    [pdfUrl, id]
  );
}

// Admin queries
export async function getPendingReports(): Promise<Reckoning[]> {
  return query<Reckoning>(
    `SELECT * FROM reckonings 
     WHERE status IN ('pending_review', 'pending') 
     ORDER BY created_at DESC`
  );
}

export async function getRecentReports(limit = 20): Promise<Reckoning[]> {
  return query<Reckoning>(
    `SELECT * FROM reckonings 
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
}

export async function getReportStats(): Promise<{
  pending: number;
  autoApproved24h: number;
  total: number;
  avgConfidence: number;
}> {
  const [stats] = await query<{
    pending: string;
    auto_approved_24h: string;
    total: string;
    avg_confidence: string;
  }>(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'pending_review') as pending,
      COUNT(*) FILTER (WHERE status = 'ready' AND created_at > NOW() - INTERVAL '24 hours') as auto_approved_24h,
      COUNT(*) as total,
      COALESCE(AVG(confidence_score), 0) as avg_confidence
    FROM reckonings
  `);

  return {
    pending: parseInt(stats.pending, 10),
    autoApproved24h: parseInt(stats.auto_approved_24h, 10),
    total: parseInt(stats.total, 10),
    avgConfidence: Math.round(parseFloat(stats.avg_confidence)),
  };
}

export async function getReckoningsByStatus(status: string): Promise<Reckoning[]> {
  return query<Reckoning>(
    'SELECT * FROM reckonings WHERE status = $1 ORDER BY created_at DESC',
    [status]
  );
}

// ═══════════════════════════════════════════════════════════════
// INTAKE REQUESTS (bypass intakes)
// ═══════════════════════════════════════════════════════════════

export interface IntakeRequest {
  id: string;
  type: 'website' | 'automations' | 'social';
  answers: Record<string, unknown>;
  name: string;
  email: string;
  contact_preference: 'quote' | 'call';
  status: 'new' | 'quoted' | 'converted' | 'closed';
  created_at: Date;
}

export async function createIntakeRequest(
  type: IntakeRequest['type'],
  answers: Record<string, unknown>,
  name: string,
  email: string,
  contactPreference: 'quote' | 'call'
): Promise<IntakeRequest> {
  const [intake] = await query<IntakeRequest>(
    `INSERT INTO intake_requests (type, answers, name, email, contact_preference, status)
     VALUES ($1, $2, $3, $4, $5, 'new')
     RETURNING *`,
    [type, JSON.stringify(answers), name, email, contactPreference]
  );
  return intake;
}

export async function getIntakeRequestById(id: string): Promise<IntakeRequest | null> {
  return queryOne<IntakeRequest>(
    'SELECT * FROM intake_requests WHERE id = $1',
    [id]
  );
}

export async function updateIntakeStatus(
  id: string,
  status: IntakeRequest['status']
): Promise<void> {
  await query(
    'UPDATE intake_requests SET status = $1 WHERE id = $2',
    [status, id]
  );
}

export async function getRecentIntakes(limit = 20): Promise<IntakeRequest[]> {
  return query<IntakeRequest>(
    `SELECT * FROM intake_requests
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
}

export async function getIntakesByStatus(status: IntakeRequest['status']): Promise<IntakeRequest[]> {
  return query<IntakeRequest>(
    'SELECT * FROM intake_requests WHERE status = $1 ORDER BY created_at DESC',
    [status]
  );
}

export default pool;
