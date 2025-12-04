import Link from 'next/link';
import { getSessionEvents } from '@/lib/observability';
import { notFound } from 'next/navigation';

// Skip static generation - admin pages need DB access
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function EventTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    task_completed: 'bg-mint/20 text-mint',
    task_started: 'bg-blue/20 text-blue',
    error: 'bg-red-100 text-red-700',
    file_changed: 'bg-amber-100 text-amber-700',
    decision: 'bg-purple-100 text-purple-700',
    session_started: 'bg-stone/30 text-charcoal',
    session_ended: 'bg-stone/30 text-charcoal',
    api_call: 'bg-stone/20 text-charcoal/70',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${styles[type] || 'bg-stone/30 text-charcoal'}`}>
      {type.replace('_', ' ')}
    </span>
  );
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params;
  const events = await getSessionEvents(sessionId);

  if (events.length === 0) {
    notFound();
  }

  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];
  const errorCount = events.filter(e => e.event_type === 'error').length;
  const completedCount = events.filter(e => e.event_type === 'task_completed').length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/agents" className="text-sm text-charcoal/60 hover:text-charcoal mb-4 inline-block">
          &larr; Back to Agent Activity
        </Link>
        <h1 className="text-3xl font-semibold text-charcoal">
          {firstEvent.agent_name || firstEvent.agent_type}
        </h1>
        <p className="text-charcoal/60 mt-1">
          Session: <code className="text-sm bg-stone/20 px-2 py-0.5 rounded">{sessionId}</code>
        </p>
      </div>

      {/* Session summary */}
      <div className="bg-white border border-stone rounded-[10px] p-6 mb-8">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">Started</p>
            <p className="text-charcoal font-medium">{formatDate(firstEvent.created_at)}</p>
            <p className="text-charcoal/60 text-sm">{formatTime(firstEvent.created_at)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">Duration</p>
            <p className="text-charcoal font-medium">
              {Math.round((new Date(lastEvent.created_at).getTime() - new Date(firstEvent.created_at).getTime()) / 60000)} mins
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">Events</p>
            <p className="text-charcoal font-medium">{events.length}</p>
            <p className="text-charcoal/60 text-sm">{completedCount} completed</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">Errors</p>
            <p className={`font-medium ${errorCount > 0 ? 'text-fuchsia' : 'text-mint'}`}>
              {errorCount}
            </p>
          </div>
        </div>
      </div>

      {/* Event timeline */}
      <h2 className="text-xl font-semibold text-charcoal mb-4">Event Timeline</h2>
      <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
        <div className="divide-y divide-stone">
          {events.map((event, index) => (
            <div key={event.id} className="p-4 hover:bg-stone/5">
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    event.event_type === 'error' ? 'bg-fuchsia' :
                    event.event_type === 'task_completed' ? 'bg-mint' :
                    'bg-stone'
                  }`} />
                  {index < events.length - 1 && (
                    <div className="w-0.5 h-full bg-stone/30 mt-1" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm text-charcoal/60">{formatTime(event.created_at)}</span>
                    <EventTypeBadge type={event.event_type} />
                  </div>
                  <p className="text-charcoal">{event.description}</p>

                  {/* Metadata */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-charcoal/50 cursor-pointer hover:text-charcoal/70">
                        Show metadata
                      </summary>
                      <pre className="mt-2 text-xs bg-stone/10 p-3 rounded overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
