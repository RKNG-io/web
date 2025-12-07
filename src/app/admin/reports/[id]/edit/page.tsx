import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReckoningById } from '@/lib/db';
import { ReportEditor } from './ReportEditor';
import type { ReckoningReport } from '@/types/report';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReportPage({ params }: PageProps) {
  const { id } = await params;
  const reckoning = await getReckoningById(id);

  if (!reckoning) {
    notFound();
  }

  const report = reckoning.report as ReckoningReport | null;

  if (!report) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link href={`/admin/reports/${id}`} className="text-sm text-charcoal/60 hover:text-charcoal mb-4 inline-block">
          ← Back to report
        </Link>
        <div className="bg-white rounded-[10px] p-8 border border-stone text-center">
          <p className="text-charcoal/60">No report to edit. Generate a report first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href={`/admin/reports/${id}`} className="text-sm text-charcoal/60 hover:text-charcoal mb-2 inline-block">
            ← Back to report
          </Link>
          <h1 className="text-2xl font-semibold text-charcoal">
            Edit Report for {reckoning.name || 'Unknown'}
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Make changes and save. The client will see the updated version.
          </p>
        </div>
      </div>

      <ReportEditor reckoningId={id} initialReport={report} />
    </div>
  );
}
