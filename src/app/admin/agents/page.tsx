import Link from 'next/link';
import {
  getAgentStats,
  getActiveSessions,
  getRecentEvents,
  getRecentErrors,
  getFilesChanged,
} from '@/lib/observability';

// Skip static generation - admin pages need DB access
export const dynamic = 'force-dynamic';

interface StatCardProps {
  label: string;
  value: string | number;
  urgent?: boolean;
}

function StatCard({ label, value, urgent }: StatCardProps) {
  return (
    <div className={`bg-white border rounded-[10px] p-6 ${urgent ? 'border-fuchsia' : 'border-stone'}`}>
      <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${urgent ? 'text-fuchsia' : 'text-charcoal'}`}>
        {value}
      </p>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
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

function AgentTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    'claude-code': 'bg-fuchsia/20 text-fuchsia',
    n8n: 'bg-orange-100 text-orange-700',
    script: 'bg-blue/20 text-blue',
    webhook: 'bg-mint/20 text-mint',
    api: 'bg-stone/30 text-charcoal',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${styles[type] || 'bg-stone/30 text-charcoal'}`}>
      {type}
    </span>
  );
}

export default async function AgentsDashboard() {
  const stats = await getAgentStats(24);
  const activeSessions = await getActiveSessions();
  const recentEvents = await getRecentEvents({ limit: 20, hoursAgo: 24 });
  const recentErrors = await getRecentErrors(5);
  const filesChanged = await getFilesChanged(24);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-charcoal">Agent Activity</h1>
        <Link href="/admin" className="text-sm text-charcoal/60 hover:text-charcoal">
          Back to Admin
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-5 gap-4 mb-12">
        <StatCard label="Events (24h)" value={stats.totalEvents} />
        <StatCard label="Active Sessions" value={stats.activeSessions} />
        <StatCard label="Tasks Completed" value={stats.tasksCompleted} />
        <StatCard label="Files Changed" value={stats.filesChanged} />
        <StatCard label="Errors" value={stats.errors} urgent={stats.errors > 0} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Active Sessions */}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Active Sessions</h2>
          {activeSessions.length === 0 ? (
            <div className="bg-white border border-stone rounded-[10px] p-8 text-center text-charcoal/60">
              No active sessions in the last 24 hours
            </div>
          ) : (
            <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Agent</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Type</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Events</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone">
                  {activeSessions.map((session) => (
                    <tr key={session.session_id} className="hover:bg-stone/10">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/agents/${session.session_id}`}
                          className="text-charcoal hover:text-fuchsia font-medium"
                        >
                          {session.agent_name || session.agent_type}
                        </Link>
                        {session.project && (
                          <span className="ml-2 text-xs text-charcoal/50">{session.project}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <AgentTypeBadge type={session.agent_type} />
                      </td>
                      <td className="px-4 py-3 text-charcoal/70">
                        {session.event_count}
                        {session.error_count > 0 && (
                          <span className="ml-1 text-red-600">({session.error_count} errors)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-charcoal/60 text-sm">
                        {formatTimeAgo(session.last_activity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Events */}
          <h2 className="text-xl font-semibold text-charcoal mb-4 mt-8">Recent Events</h2>
          <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-stone/20 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Time</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Type</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Description</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-stone/10">
                      <td className="px-4 py-3 text-charcoal/60 text-sm whitespace-nowrap">
                        {formatTimeAgo(event.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <EventTypeBadge type={event.event_type} />
                      </td>
                      <td className="px-4 py-3 text-charcoal text-sm max-w-md truncate">
                        {event.description}
                      </td>
                      <td className="px-4 py-3 text-charcoal/60 text-sm">
                        {event.agent_name || event.agent_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Errors */}
          <h2 className="text-xl font-semibold text-charcoal mb-4">
            Recent Errors
            {recentErrors.length > 0 && (
              <span className="ml-2 text-sm font-normal text-fuchsia">({recentErrors.length})</span>
            )}
          </h2>
          {recentErrors.length === 0 ? (
            <div className="bg-white border border-stone rounded-[10px] p-6 text-center text-charcoal/60 text-sm">
              No errors in the last 7 days
            </div>
          ) : (
            <div className="bg-white border border-fuchsia/30 rounded-[10px] divide-y divide-stone">
              {recentErrors.map((error) => (
                <div key={error.id} className="p-4">
                  <p className="text-sm text-charcoal font-medium truncate">{error.description}</p>
                  <p className="text-xs text-charcoal/60 mt-1">
                    {error.agent_name || error.agent_type} - {formatTimeAgo(error.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Files Changed */}
          <h2 className="text-xl font-semibold text-charcoal mb-4 mt-8">Files Changed (24h)</h2>
          {filesChanged.length === 0 ? (
            <div className="bg-white border border-stone rounded-[10px] p-6 text-center text-charcoal/60 text-sm">
              No files changed
            </div>
          ) : (
            <div className="bg-white border border-stone rounded-[10px] divide-y divide-stone max-h-64 overflow-y-auto">
              {filesChanged.slice(0, 10).map((file, i) => (
                <div key={i} className="p-3">
                  <p className="text-sm text-charcoal font-mono truncate" title={file.file_path}>
                    {file.file_path.split('/').pop()}
                  </p>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    {file.change_type} - {formatTimeAgo(file.created_at)}
                  </p>
                </div>
              ))}
              {filesChanged.length > 10 && (
                <div className="p-3 text-center text-xs text-charcoal/50">
                  +{filesChanged.length - 10} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
