import Link from 'next/link';
import { getReportStats, getPendingReports, getRecentReports } from '@/lib/db';

// Skip static generation - admin pages need DB access
export const dynamic = 'force-dynamic';

interface StatCardProps {
  label: string;
  value: string | number;
  href?: string;
  urgent?: boolean;
}

function StatCard({ label, value, href, urgent }: StatCardProps) {
  const card = (
    <div className={`bg-white border rounded-[10px] p-6 ${urgent ? 'border-fuchsia' : 'border-stone'}`}>
      <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${urgent ? 'text-fuchsia' : 'text-charcoal'}`}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }
  return card;
}

export default async function AdminDashboard() {
  const stats = await getReportStats();
  const pendingReports = await getPendingReports();
  const recentReports = await getRecentReports(10);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-charcoal mb-8">Reckoning Admin</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Pending Review"
          value={stats.pending}
          href="/admin/reports?status=pending_review"
          urgent={stats.pending > 0}
        />
        <StatCard
          label="Auto-Approved (24h)"
          value={stats.autoApproved24h}
        />
        <StatCard
          label="Total Generated"
          value={stats.total}
        />
        <StatCard
          label="Avg Confidence"
          value={`${stats.avgConfidence}%`}
        />
      </div>

      {/* Pending reviews */}
      {pendingReports.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Needs Your Attention</h2>
          <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Name</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Persona</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {pendingReports.slice(0, 5).map((report) => (
                  <tr key={report.id} className="hover:bg-stone/10">
                    <td className="px-6 py-4 text-charcoal">{report.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-charcoal/70 capitalize">{report.persona}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        (report.confidence_score || 0) >= 80 ? 'text-mint' :
                        (report.confidence_score || 0) >= 70 ? 'text-amber-500' : 'text-fuchsia'
                      }`}>
                        {report.confidence_score || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60 text-sm">
                      {new Date(report.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="text-fuchsia hover:underline text-sm"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingReports.length > 5 && (
            <p className="mt-4 text-sm text-charcoal/60">
              <Link href="/admin/reports?status=pending_review" className="text-fuchsia hover:underline">
                View all {pendingReports.length} pending reports
              </Link>
            </p>
          )}
        </section>
      )}

      {/* Recent reports */}
      <section>
        <h2 className="text-xl font-semibold text-charcoal mb-4">Recent Reports</h2>
        <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Name</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Persona</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Status</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Confidence</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-stone/10">
                  <td className="px-6 py-4 text-charcoal">{report.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-charcoal/70 capitalize">{report.persona}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-charcoal/60">
                    {report.confidence_score ? `${report.confidence_score}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-charcoal/60 text-sm">
                    {new Date(report.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="text-fuchsia hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ready: 'bg-mint/20 text-mint',
    pending_review: 'bg-amber-100 text-amber-700',
    pending: 'bg-stone/30 text-charcoal',
    failed: 'bg-red-100 text-red-700',
    reviewed: 'bg-blue/20 text-blue',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-stone/30 text-charcoal'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
