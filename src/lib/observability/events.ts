import { query } from '../db';
import { randomUUID } from 'crypto';

// Event types
export type AgentType = 'claude-code' | 'n8n' | 'script' | 'webhook' | 'api';
export type EventType = 'task_started' | 'task_completed' | 'file_changed' | 'error' | 'decision' | 'api_call' | 'session_started' | 'session_ended';

export interface AgentEvent {
  sessionId?: string;
  agentType: AgentType;
  agentName?: string;
  eventType: EventType;
  description: string;
  metadata?: Record<string, unknown>;
  project?: string;
}

export interface AgentEventRow {
  id: string;
  session_id: string | null;
  agent_type: AgentType;
  agent_name: string | null;
  event_type: EventType;
  description: string | null;
  metadata: Record<string, unknown>;
  project: string | null;
  created_at: Date;
}

/**
 * Log an agent event to the database
 */
export async function logAgentEvent(event: AgentEvent): Promise<string> {
  const [row] = await query<{ id: string }>(
    `INSERT INTO agent_events (session_id, agent_type, agent_name, event_type, description, metadata, project)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      event.sessionId || null,
      event.agentType,
      event.agentName || null,
      event.eventType,
      event.description,
      JSON.stringify(event.metadata || {}),
      event.project || null,
    ]
  );
  return row.id;
}

/**
 * Start a new agent session and return the session ID
 */
export async function startSession(
  agentType: AgentType,
  agentName: string,
  project?: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  const sessionId = `${agentType}-${Date.now()}-${randomUUID().slice(0, 8)}`;

  await logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'session_started',
    description: `Session started: ${agentName}`,
    metadata: {
      ...metadata,
      startedAt: new Date().toISOString(),
    },
    project,
  });

  return sessionId;
}

/**
 * End an agent session with optional summary
 */
export async function endSession(
  sessionId: string,
  agentType: AgentType,
  agentName: string,
  summary?: string,
  project?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'session_ended',
    description: summary || `Session ended: ${agentName}`,
    metadata: {
      ...metadata,
      endedAt: new Date().toISOString(),
    },
    project,
  });
}

/**
 * Log an error event
 */
export async function logError(
  error: Error,
  agentType: AgentType,
  agentName: string,
  sessionId?: string,
  project?: string,
  context?: Record<string, unknown>
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'error',
    description: error.message,
    metadata: {
      errorName: error.name,
      stack: error.stack,
      ...context,
    },
    project,
  });
}

/**
 * Log a task starting
 */
export async function logTaskStarted(
  taskName: string,
  agentType: AgentType,
  agentName: string,
  sessionId?: string,
  project?: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'task_started',
    description: taskName,
    metadata,
    project,
  });
}

/**
 * Log a task completion
 */
export async function logTaskCompleted(
  taskName: string,
  agentType: AgentType,
  agentName: string,
  sessionId?: string,
  project?: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'task_completed',
    description: taskName,
    metadata,
    project,
  });
}

/**
 * Log a file change
 */
export async function logFileChanged(
  filePath: string,
  changeType: 'created' | 'modified' | 'deleted',
  agentType: AgentType,
  agentName: string,
  sessionId?: string,
  project?: string
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'file_changed',
    description: `${changeType}: ${filePath}`,
    metadata: {
      filePath,
      changeType,
    },
    project,
  });
}

/**
 * Log a decision made by an agent
 */
export async function logDecision(
  decision: string,
  reasoning: string,
  agentType: AgentType,
  agentName: string,
  sessionId?: string,
  project?: string,
  alternatives?: string[]
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName,
    eventType: 'decision',
    description: decision,
    metadata: {
      reasoning,
      alternatives,
    },
    project,
  });
}

/**
 * Log an API call
 */
export async function logApiCall(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs: number,
  agentType: AgentType = 'api',
  agentName?: string,
  sessionId?: string,
  project?: string
): Promise<string> {
  return logAgentEvent({
    sessionId,
    agentType,
    agentName: agentName || endpoint,
    eventType: 'api_call',
    description: `${method} ${endpoint} - ${statusCode}`,
    metadata: {
      endpoint,
      method,
      statusCode,
      durationMs,
    },
    project,
  });
}
