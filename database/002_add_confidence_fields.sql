-- Add additional fields for report confidence tracking
-- Run with: psql $DATABASE_URL -f 002_add_confidence_fields.sql

-- Add validation breakdown to reckonings
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS validation_scores JSONB;

-- Add review fields
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Add generation metadata
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS generation_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_generation_error TEXT;

-- Add index for review queue
CREATE INDEX IF NOT EXISTS idx_reckonings_review_queue 
ON reckonings(status, confidence_score) 
WHERE status = 'completed' AND confidence_score < 0.7;

-- Add comments
COMMENT ON COLUMN reckonings.validation_scores IS 'Breakdown of confidence score components (schema, echo, voice, maths, services)';
COMMENT ON COLUMN reckonings.reviewed_at IS 'When an admin reviewed this report';
COMMENT ON COLUMN reckonings.reviewed_by IS 'Admin who reviewed this report';
COMMENT ON COLUMN reckonings.review_notes IS 'Admin notes from review';
