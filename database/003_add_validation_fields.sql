-- Add validation and review fields to reckonings table
-- Run with: psql $DATABASE_URL -f 003_add_validation_fields.sql

-- Add confidence score (if not already present)
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS confidence_score INTEGER;

-- Add validation flags
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS validation_flags JSONB DEFAULT '[]';

-- Add error log for failed generations
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS error_log TEXT;

-- Add edit tracking
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS edited_by TEXT;

-- Add review tracking
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Add generation tracking
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS generation_attempts INTEGER DEFAULT 1;

-- Add PDF URL
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Update status enum to include new states
-- Note: This requires dropping and recreating the constraint
ALTER TABLE reckonings DROP CONSTRAINT IF EXISTS reckonings_status_check;
ALTER TABLE reckonings ADD CONSTRAINT reckonings_status_check 
CHECK (status IN ('pending', 'generating', 'completed', 'ready', 'pending_review', 'failed', 'reviewed'));

-- Add index for review queue (pending_review with low confidence)
CREATE INDEX IF NOT EXISTS idx_reckonings_review_queue 
ON reckonings(status, confidence_score) 
WHERE status = 'pending_review';

-- Add index for auto-approved reports (ready status, last 24h)
CREATE INDEX IF NOT EXISTS idx_reckonings_auto_approved
ON reckonings(status, created_at)
WHERE status = 'ready';

-- Comments for documentation
COMMENT ON COLUMN reckonings.confidence_score IS 'Validation confidence score 0-100';
COMMENT ON COLUMN reckonings.validation_flags IS 'Array of validation warnings/errors';
COMMENT ON COLUMN reckonings.error_log IS 'Error message if generation failed';
COMMENT ON COLUMN reckonings.edited_at IS 'Timestamp of last manual edit';
COMMENT ON COLUMN reckonings.edited_by IS 'Admin who made the last edit';
COMMENT ON COLUMN reckonings.reviewed_at IS 'Timestamp of admin review';
COMMENT ON COLUMN reckonings.reviewed_by IS 'Admin who reviewed';
COMMENT ON COLUMN reckonings.review_notes IS 'Notes from admin review';
COMMENT ON COLUMN reckonings.generation_attempts IS 'Number of generation attempts';
COMMENT ON COLUMN reckonings.pdf_url IS 'URL to generated PDF report';
