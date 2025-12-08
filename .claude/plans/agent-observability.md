# Agent Observability System - Implementation Plan

## Overview

Unified backend for tracking all agent activity (Claude agents, n8n workflows, future automations). Single source of truth using existing Postgres database with admin dashboard for visibility.

## Architecture

```
Claude Agents  ─┐
n8n Workflows  ─┼──► agent_events table ──► /admin/agents dashboard
Custom Scripts ─┘
```

---

## Phase 1: Database Schema

**New migration:** `database/005_agent_observability.sql`

```sql
-- Agent event log
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),           -- groups related events
  agent_type VARCHAR(50) NOT NULL,   -- 'claude-code', 'n8n', 'script', 'webhook'
  agent_name VARCHAR(100),           -- 'questionnaire-builder', 'stripe-webhook', etc.
  event_type VARCHAR(50) NOT NULL,   -- 'task_started', 'task_completed', 'file_changed', 'error', 'decision'
  description TEXT,
  metadata JSONB DEFAULT '{}',       -- flexible: files, tokens, duration, etc.
  project VARCHAR(100),              -- 'reckoning', 'website-builder', 'client-xyz'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_agent_events_session ON agent_events(session_id);
CREATE INDEX idx_agent_events_type ON agent_events(event_type);
CREATE INDEX idx_agent_events_created ON agent_events(created_at DESC);
CREATE INDEX idx_agent_events_project ON agent_events(project);

-- Active sessions view
CREATE VIEW active_sessions AS
SELECT
  session_id,
  agent_type,
  agent_name,
  project,
  MIN(created_at) as started_at,
  MAX(created_at) as last_activity,
  COUNT(*) as event_count,
  COUNT(*) FILTER (WHERE event_type = 'error') as error_count
FROM agent_events
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY session_id, agent_type, agent_name, project;
```

---

## Phase 2: Event Logging Library

**New file:** `src/lib/observability/events.ts`

```typescript
interface AgentEvent {
  sessionId?: string;
  agentType: 'claude-code' | 'n8n' | 'script' | 'webhook' | 'api';
  agentName?: string;
  eventType: 'task_started' | 'task_completed' | 'file_changed' | 'error' | 'decision' | 'api_call';
  description: string;
  metadata?: Record<string, unknown>;
  project?: string;
}

export async function logAgentEvent(event: AgentEvent): Promise<void>
export async function startSession(agentType: string, agentName: string): Promise<string>
export async function endSession(sessionId: string, summary?: string): Promise<void>
export async function logError(sessionId: string, error: Error, context?: Record<string, unknown>): Promise<void>
```

---

## Phase 3: Admin Dashboard

**New route:** `src/app/admin/agents/page.tsx`

### Features:
- **Active sessions** - Currently running agents/workflows
- **Recent events** - Timeline of last 24h activity
- **Files changed** - What was modified today
- **Errors** - Any failures needing attention
- **Session drill-down** - Click session to see all events

### UI Layout:
```
┌─────────────────────────────────────────────────────┐
│ Agent Activity                         [24h ▼]     │
├─────────────────────────────────────────────────────┤
│ Active Sessions (2)                                 │
│ ┌─────────────────────────────────────────────────┐│
│ │ 🟢 questionnaire-builder  │ 47 events │ 2h ago  ││
│ │ 🟢 stripe-webhook         │ 3 events  │ 5m ago  ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ Recent Events                                       │
│ 14:32  task_completed  PDF generation implemented   │
│ 14:28  file_changed    src/lib/pdf/generator.ts     │
│ 14:15  task_started    Implement PDF generation     │
│ 13:45  decision        Using Puppeteer for PDF      │
├─────────────────────────────────────────────────────┤
│ Errors (1)                                          │
│ ⚠️ 12:30  Stripe webhook signature invalid          │
└─────────────────────────────────────────────────────┘
```

---

## Phase 4: Integration Points

### 4.1 Claude Code Hooks (Manual for now)

Agents update `.claude/agents/` files which can trigger logging:
- `CURRENT-TASKS.md` changes → log task events
- `SESSION-LOG.md` updates → log completions

### 4.2 API Route Middleware

**New file:** `src/lib/observability/middleware.ts`

Wrap API routes to auto-log:
```typescript
export function withObservability(handler: NextHandler, config: { name: string }) {
  return async (req: NextRequest) => {
    const sessionId = req.headers.get('x-session-id') || crypto.randomUUID();
    await logAgentEvent({ eventType: 'api_call', ... });
    // ... execute handler, log result/error
  };
}
```

### 4.3 n8n Integration (Future)

n8n workflows call `/api/observability/log` endpoint:
```typescript
// POST /api/observability/log
export async function POST(req: NextRequest) {
  const event = await req.json();
  await logAgentEvent(event);
  return NextResponse.json({ success: true });
}
```

---

## Phase 5: Alerts (Optional)

**New file:** `src/lib/observability/alerts.ts`

- Email admin on errors
- Slack webhook for critical events
- Daily summary email

---

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Database migration | `database/005_agent_observability.sql` |
| 2 | Event logging library | `src/lib/observability/events.ts` |
| 3 | DB query functions | `src/lib/observability/queries.ts` |
| 4 | Admin dashboard page | `src/app/admin/agents/page.tsx` |
| 5 | API logging endpoint | `src/app/api/observability/log/route.ts` |
| 6 | API middleware wrapper | `src/lib/observability/middleware.ts` |
| 7 | Alerts (optional) | `src/lib/observability/alerts.ts` |

---

## Environment Variables

```env
# Optional - for Slack alerts
SLACK_WEBHOOK_URL=
```

---

## Usage Examples

### From a script:
```typescript
import { logAgentEvent, startSession, endSession } from '@/lib/observability/events';

const sessionId = await startSession('script', 'data-migration');
await logAgentEvent({
  sessionId,
  agentType: 'script',
  eventType: 'task_started',
  description: 'Migrating user data to new schema',
});
// ... do work
await endSession(sessionId, 'Migrated 500 records');
```

### From n8n (HTTP Request node):
```json
{
  "url": "https://reckoning.app/api/observability/log",
  "method": "POST",
  "body": {
    "agentType": "n8n",
    "agentName": "client-onboarding",
    "eventType": "task_completed",
    "description": "Sent welcome email to client@example.com",
    "project": "synatra"
  }
}
```

---

## Benefits

1. **Single source of truth** - All activity in one place
2. **No new infrastructure** - Uses existing Postgres
3. **Extensible** - JSONB metadata handles any event shape
4. **Queryable** - SQL for custom reports
5. **Future-proof** - Ready for n8n, webhooks, any agent type
6. **Admin visibility** - Dashboard shows what's happening
