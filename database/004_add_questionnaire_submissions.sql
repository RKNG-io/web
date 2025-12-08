-- Add questionnaire submissions table
-- Run with: psql $DATABASE_URL -f 004_add_questionnaire_submissions.sql

-- Questionnaire submissions table (separate from reckonings for clean data flow)
CREATE TABLE IF NOT EXISTS questionnaire_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona VARCHAR(20) NOT NULL CHECK (persona IN ('launcher', 'builder', 'architect')),
  answers JSONB NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  reckoning_id UUID REFERENCES reckonings(id)
);

-- Index for unprocessed submissions
CREATE INDEX IF NOT EXISTS idx_submissions_unprocessed
ON questionnaire_submissions(processed_at)
WHERE processed_at IS NULL;

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_submissions_email
ON questionnaire_submissions(email);

-- Comments
COMMENT ON TABLE questionnaire_submissions IS 'Raw questionnaire submissions before report generation';
COMMENT ON COLUMN questionnaire_submissions.processed_at IS 'When this submission was processed into a reckoning';
COMMENT ON COLUMN questionnaire_submissions.reckoning_id IS 'Link to generated reckoning report';
