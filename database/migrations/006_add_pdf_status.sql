-- Add PDF generation status tracking
-- Run with: psql $DATABASE_URL -f 006_add_pdf_status.sql

-- Add PDF status column
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS pdf_status VARCHAR(20) DEFAULT 'pending'
CHECK (pdf_status IN ('pending', 'generating', 'ready', 'failed', 'skipped'));

-- Add PDF error column
ALTER TABLE reckonings
ADD COLUMN IF NOT EXISTS pdf_error TEXT;

-- Comments
COMMENT ON COLUMN reckonings.pdf_status IS 'Status of PDF generation: pending, generating, ready, failed, skipped';
COMMENT ON COLUMN reckonings.pdf_error IS 'Error message if PDF generation failed';
