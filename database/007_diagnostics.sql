-- Migration: 007_diagnostics.sql
-- Description: Create diagnostics table for v2 time audit → automation matching
-- Date: 2025-12-11

-- Create diagnostics table
CREATE TABLE IF NOT EXISTS diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,

    -- Contact info
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,

    -- Business info
    business VARCHAR(500) NOT NULL,
    stage VARCHAR(50) NOT NULL, -- 'launching', 'building', 'established'

    -- Time audit answers
    hours_per_week INTEGER NOT NULL,
    time_sinks JSONB NOT NULL DEFAULT '[]', -- array of time sink identifiers
    biggest_frustration TEXT,
    tools JSONB NOT NULL DEFAULT '[]', -- array of tool identifiers

    -- Source tracking
    source_vertical VARCHAR(50), -- 'fitness', 'wellness', 'trades', 'events', null

    -- Matching results
    matches JSONB NOT NULL DEFAULT '[]', -- array of {automation_id, score, match_reasons}

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'ready', -- 'pending', 'ready', 'viewed'

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed_at TIMESTAMP WITH TIME ZONE
);

-- Index for token lookups (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_diagnostics_token ON diagnostics(token);

-- Index for email lookups (for admin/support)
CREATE INDEX IF NOT EXISTS idx_diagnostics_email ON diagnostics(email);

-- Index for status filtering (for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_diagnostics_status ON diagnostics(status);

-- Index for analytics by source vertical
CREATE INDEX IF NOT EXISTS idx_diagnostics_source_vertical ON diagnostics(source_vertical);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_diagnostics_created_at ON diagnostics(created_at DESC);

COMMENT ON TABLE diagnostics IS 'V2 time audit diagnostic results with matched automations';
COMMENT ON COLUMN diagnostics.token IS 'Public URL-safe token for accessing diagnostic';
COMMENT ON COLUMN diagnostics.stage IS 'Business stage: launching, building, established';
COMMENT ON COLUMN diagnostics.time_sinks IS 'JSON array of time sink identifiers from intake';
COMMENT ON COLUMN diagnostics.tools IS 'JSON array of tool identifiers from intake';
COMMENT ON COLUMN diagnostics.matches IS 'JSON array of matched automations with scores';
