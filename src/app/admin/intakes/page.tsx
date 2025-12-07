import Link from 'next/link';
import { getRecentIntakes, getIntakeStats, type IntakeRequest } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function StatusBadge({ status }: { status: IntakeRequest['status'] }) {
  const styles = {
    new: 'bg-fuchsia/20 text-fuchsia',
    quoted: 'bg-amber-100 text-amber-800',
    converted: 'bg-mint/20 text-mint',
    closed: 'bg-charcoal/10 text-charcoal/60',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: IntakeRequest['type'] }) {
  const labels = {
    website: 'Website',
    automations: 'Automations',
    social: 'Social Media',
  };

  return (
    <span className="px-2 py-1 rounded text-xs font-medium bg-charcoal/5 text-charcoal">
      {labels[type]}
    </span>
  );
}

export default async function IntakesPage() {
  const [intakes, stats] = await Promise.all([
    getRecentIntakes(50),
    getIntakeStats(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Intake Requests</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Bypass intake submissions from /start routes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">New</div>
          <div className="text-2xl font-semibold text-fuchsia">{stats.new}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Quoted</div>
          <div className="text-2xl font-semibold text-amber-600">{stats.quoted}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Converted</div>
          <div className="text-2xl font-semibold text-mint">{stats.converted}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Total</div>
          <div className="text-2xl font-semibold text-charcoal">{stats.total}</div>
        </div>
      </div>

      {/* Intakes Table */}
      <div className="bg-white rounded-[10px] border border-stone overflow-hidden">
        <table className="w-full">
          <thead className="bg-ice border-b border-stone">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Preference
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {intakes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-charcoal/60">
                  No intake requests yet
                </td>
              </tr>
            ) : (
              intakes.map((intake) => (
                <tr key={intake.id} className="hover:bg-ice/50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-charcoal">
                      {intake.name}
                    </div>
                    <div className="text-xs text-charcoal/60">
                      {intake.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={intake.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal capitalize">
                    {intake.contact_preference === 'quote' ? 'Email quote' : 'Book a call'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={intake.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">
                    {formatDate(intake.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/intakes/${intake.id}`}
                      className="text-sm text-fuchsia hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
