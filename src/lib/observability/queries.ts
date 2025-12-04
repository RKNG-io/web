import { query, queryOne } from '../db';
import type { AgentEventRow, AgentType, EventType } from './events';

// Active session from view
export interface ActiveSession {
  session_id: string;
  agent_type: AgentType;
  agent_name: string | null;
  project: string | null;
  started_at: Date;
  last_activity: Date;
  event_count: number;
  error_count: number;
  completed_count: number;
}

// Daily summary from view
export interface DailyEventSummary {
  date: Date;
  agent_type: AgentType;
  total_events: number;
  tasks_completed: number;
  errors: number;
  sessions: number;
}

/**
 * Get active sessions (last 24 hours)
 */
export async function getActiveSessions(): Promise<ActiveSession[]> {
  return query<ActiveSession>(
    `SELECT * FROM active_sessions ORDER BY last_activity DESC`
  );
}

/**
 * Get recent events with optional filters
 */
export async function getRecentEvents(options?: {
  limit?: number;
  sessionId?: string;
  agentType?: AgentType;
  eventType?: EventType;
  project?: string;
  hoursAgo?: number;
}): Promise<AgentEventRow[]> {
  const {
    limit = 50,
    sessionId,
    agentType,
    eventType,
    project,
    hoursAgo = 24,
  } = options || {};

  const conditions: string[] = [`created_at > NOW() - INTERVAL '${hoursAgo} hours'`];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (sessionId) {
    conditions.push(`session_id = $${paramIndex++}`);
    params.push(sessionId);
  }
  if (agentType) {
    conditions.push(`agent_type = $${paramIndex++}`);
    params.push(agentType);
  }
  if (eventType) {
    conditions.push(`event_type = $${paramIndex++}`);
    params.push(eventType);
  }
  if (project) {
    conditions.push(`project = $${paramIndex++}`);
    params.push(project);
  }

  params.push(limit);

  return query<AgentEventRow>(
    `SELECT * FROM agent_events
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${paramIndex}`,
    params
  );
}

/**
 * Get recent errors
 */
export async function getRecentErrors(limit = 20): Promise<AgentEventRow[]> {
  return query<AgentEventRow>(
    `SELECT * FROM recent_errors LIMIT $1`,
    [limit]
  );
}

/**
 * Get events for a specific session
 */
export async function getSessionEvents(sessionId: string): Promise<AgentEventRow[]> {
  return query<AgentEventRow>(
    `SELECT * FROM agent_events
     WHERE session_id = $1
     ORDER BY created_at ASC`,
    [sessionId]
  );
}

/**
 * Get daily summary for the last N days
 */
export async function getDailySummary(days = 7): Promise<DailyEventSummary[]> {
  return query<DailyEventSummary>(
    `SELECT * FROM daily_event_summary
     WHERE date > NOW() - INTERVAL '${days} days'
     ORDER BY date DESC, agent_type`
  );
}

/**
 * Get event counts by type for a time period
 */
export async function getEventCountsByType(hoursAgo = 24): Promise<{ event_type: EventType; count: number }[]> {
  return query<{ event_type: EventType; count: number }>(
    `SELECT event_type, COUNT(*) as count
     FROM agent_events
     WHERE created_at > NOW() - INTERVAL '${hoursAgo} hours'
     GROUP BY event_type
     ORDER BY count DESC`
  );
}

/**
 * Get event counts by agent for a time period
 */
export async function getEventCountsByAgent(hoursAgo = 24): Promise<{ agent_name: string; agent_type: AgentType; count: number }[]> {
  return query<{ agent_name: string; agent_type: AgentType; count: number }>(
    `SELECT COALESCE(agent_name, agent_type) as agent_name, agent_type, COUNT(*) as count
     FROM agent_events
     WHERE created_at > NOW() - INTERVAL '${hoursAgo} hours'
     GROUP BY agent_name, agent_type
     ORDER BY count DESC`
  );
}

/**
 * Get files changed in a time period
 */
export async function getFilesChanged(hoursAgo = 24): Promise<{ file_path: string; change_type: string; created_at: Date }[]> {
  const events = await query<AgentEventRow>(
    `SELECT * FROM agent_events
     WHERE event_type = 'file_changed'
       AND created_at > NOW() - INTERVAL '${hoursAgo} hours'
     ORDER BY created_at DESC`
  );

  return events.map(e => ({
    file_path: (e.metadata as { filePath?: string })?.filePath || e.description || '',
    change_type: (e.metadata as { changeType?: string })?.changeType || 'unknown',
    created_at: e.created_at,
  }));
}

/**
 * Get aggregate stats for the dashboard
 */
export async function getAgentStats(hoursAgo = 24): Promise<{
  totalEvents: number;
  activeSessions: number;
  tasksCompleted: number;
  errors: number;
  filesChanged: number;
}> {
  const [stats] = await query<{
    total_events: string;
    active_sessions: string;
    tasks_completed: string;
    errors: string;
    files_changed: string;
  }>(
    `SELECT
       COUNT(*) as total_events,
       COUNT(DISTINCT session_id) as active_sessions,
       COUNT(*) FILTER (WHERE event_type = 'task_completed') as tasks_completed,
       COUNT(*) FILTER (WHERE event_type = 'error') as errors,
       COUNT(*) FILTER (WHERE event_type = 'file_changed') as files_changed
     FROM agent_events
     WHERE created_at > NOW() - INTERVAL '${hoursAgo} hours'`
  );

  return {
    totalEvents: parseInt(stats.total_events, 10),
    activeSessions: parseInt(stats.active_sessions, 10),
    tasksCompleted: parseInt(stats.tasks_completed, 10),
    errors: parseInt(stats.errors, 10),
    filesChanged: parseInt(stats.files_changed, 10),
  };
}

/**
 * Search events by description
 */
export async function searchEvents(
  searchTerm: string,
  limit = 50
): Promise<AgentEventRow[]> {
  return query<AgentEventRow>(
    `SELECT * FROM agent_events
     WHERE description ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [`%${searchTerm}%`, limit]
  );
}

/**
 * Get events by project
 */
export async function getEventsByProject(
  project: string,
  limit = 100
): Promise<AgentEventRow[]> {
  return query<AgentEventRow>(
    `SELECT * FROM agent_events
     WHERE project = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [project, limit]
  );
}

/**
 * Delete old events (cleanup)
 */
export async function deleteOldEvents(daysOld = 30): Promise<number> {
  const [result] = await query<{ count: string }>(
    `WITH deleted AS (
       DELETE FROM agent_events
       WHERE created_at < NOW() - INTERVAL '${daysOld} days'
       RETURNING *
     )
     SELECT COUNT(*) as count FROM deleted`
  );
  return parseInt(result.count, 10);
}
