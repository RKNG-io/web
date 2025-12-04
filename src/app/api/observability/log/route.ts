import { NextRequest, NextResponse } from 'next/server';
import { logAgentEvent, AgentType, EventType } from '@/lib/observability';

interface LogEventRequest {
  sessionId?: string;
  agentType: AgentType;
  agentName?: string;
  eventType: EventType;
  description: string;
  metadata?: Record<string, unknown>;
  project?: string;
}

const VALID_AGENT_TYPES: AgentType[] = ['claude-code', 'n8n', 'script', 'webhook', 'api'];
const VALID_EVENT_TYPES: EventType[] = [
  'task_started',
  'task_completed',
  'file_changed',
  'error',
  'decision',
  'api_call',
  'session_started',
  'session_ended',
];

export async function POST(request: NextRequest) {
  try {
    const body: LogEventRequest = await request.json();

    // Validate required fields
    if (!body.agentType || !body.eventType || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: agentType, eventType, description' },
        { status: 400 }
      );
    }

    // Validate agentType
    if (!VALID_AGENT_TYPES.includes(body.agentType)) {
      return NextResponse.json(
        { error: `Invalid agentType. Must be one of: ${VALID_AGENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate eventType
    if (!VALID_EVENT_TYPES.includes(body.eventType)) {
      return NextResponse.json(
        { error: `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Log the event
    const eventId = await logAgentEvent({
      sessionId: body.sessionId,
      agentType: body.agentType,
      agentName: body.agentName,
      eventType: body.eventType,
      description: body.description,
      metadata: body.metadata,
      project: body.project,
    });

    return NextResponse.json({
      success: true,
      eventId,
    });
  } catch (error) {
    console.error('Error logging agent event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to log event' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if observability is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    validAgentTypes: VALID_AGENT_TYPES,
    validEventTypes: VALID_EVENT_TYPES,
  });
}
