-- Migration: 005_agent_observability.sql
-- Purpose: Unified event logging for all agents (Claude, n8n, scripts, webhooks)
-- Created: 2025-12-04

-- Agent event log
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),           -- groups related events
  agent_type VARCHAR(50) NOT NULL,   -- 'claude-code', 'n8n', 'script', 'webhook', 'api'
  agent_name VARCHAR(100),           -- 'questionnaire-builder', 'stripe-webhook', etc.
  event_type VARCHAR(50) NOT NULL,   -- 'task_started', 'task_completed', 'file_changed', 'error', 'decision', 'api_call'
  description TEXT,
  metadata JSONB DEFAULT '{}',       -- flexible: files changed, tokens used, duration, etc.
  project VARCHAR(100),              -- 'reckoning', 'website-builder', 'client-xyz'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_agent_events_session ON agent_events(session_id);
CREATE INDEX idx_agent_events_type ON agent_events(event_type);
CREATE INDEX idx_agent_events_agent_type ON agent_events(agent_type);
CREATE INDEX idx_agent_events_created ON agent_events(created_at DESC);
CREATE INDEX idx_agent_events_project ON agent_events(project);

-- Active sessions view (last 24 hours)
CREATE VIEW active_sessions AS
SELECT
  session_id,
  agent_type,
  agent_name,
  project,
  MIN(created_at) as started_at,
  MAX(created_at) as last_activity,
  COUNT(*) as event_count,
  COUNT(*) FILTER (WHERE event_type = 'error') as error_count,
  COUNT(*) FILTER (WHERE event_type = 'task_completed') as completed_count
FROM agent_events
WHERE created_at > NOW() - INTERVAL '24 hours'
  AND session_id IS NOT NULL
GROUP BY session_id, agent_type, agent_name, project;

-- Recent errors view (last 7 days)
CREATE VIEW recent_errors AS
SELECT
  id,
  session_id,
  agent_type,
  agent_name,
  description,
  metadata,
  project,
  created_at
FROM agent_events
WHERE event_type = 'error'
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Daily summary view
CREATE VIEW daily_event_summary AS
SELECT
  DATE(created_at) as date,
  agent_type,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE event_type = 'task_completed') as tasks_completed,
  COUNT(*) FILTER (WHERE event_type = 'error') as errors,
  COUNT(DISTINCT session_id) as sessions
FROM agent_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), agent_type
ORDER BY date DESC, agent_type;
