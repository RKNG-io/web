import Link from 'next/link';
import { getReckoningsByStatus, getRecentReports } from '@/lib/db';

// Skip static generation - admin pages need DB access
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ReportsListPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  
  const reports = status 
    ? await getReckoningsByStatus(status)
    : await getRecentReports(50);

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'ready', label: 'Ready' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-charcoal">Reports</h1>
        <Link href="/admin" className="text-fuchsia hover:underline">
          ← Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {statusOptions.map((option) => (
          <Link
            key={option.value}
            href={option.value ? `/admin/reports?status=${option.value}` : '/admin/reports'}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              (status || '') === option.value
                ? 'bg-charcoal text-white'
                : 'bg-stone/30 text-charcoal hover:bg-stone/50'
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {/* Reports table */}
      <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Name</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Persona</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Status</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Confidence</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Flags</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-charcoal/60">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-stone/10">
                  <td className="px-6 py-4 text-charcoal font-medium">
                    {report.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-charcoal/70 capitalize">
                    {report.persona}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4">
                    <ConfidenceBadge score={report.confidence_score || 0} />
                  </td>
                  <td className="px-6 py-4 text-charcoal/60 text-sm">
                    {report.validation_flags?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-charcoal/60 text-sm">
                    {new Date(report.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="text-fuchsia hover:underline text-sm"
                    >
                      {report.status === 'pending_review' ? 'Review' : 'View'}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-charcoal/60">
        Showing {reports.length} report{reports.length === 1 ? '' : 's'}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ready: 'bg-mint/20 text-mint',
    pending_review: 'bg-amber-100 text-amber-700',
    pending: 'bg-stone/30 text-charcoal',
    generating: 'bg-blue/20 text-blue',
    failed: 'bg-red-100 text-red-700',
    reviewed: 'bg-blue/20 text-blue',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-stone/30 text-charcoal'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-mint' : score >= 70 ? 'text-amber-500' : 'text-fuchsia';
  
  return (
    <span className={`font-medium ${color}`}>
      {score}%
    </span>
  );
}
