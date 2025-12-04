import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReckoningByToken } from '@/lib/db';
import { ReportDisplay } from './ReportDisplay';
import { GeneratingState } from './GeneratingState';
import type { ReckoningReport } from '@/types/report';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ReckoningPage({ params }: PageProps) {
  const { token } = await params;
  const reckoning = await getReckoningByToken(token);

  if (!reckoning) {
    notFound();
  }

  const report = reckoning.report as ReckoningReport | null;

  // Still generating
  if (reckoning.status === 'generating' || reckoning.status === 'pending') {
    return <GeneratingState token={token} name={reckoning.name} />;
  }

  // Failed generation
  if (reckoning.status === 'failed') {
    return (
      <div className="min-h-screen bg-ice py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-12">
            <Link href="/" className="text-2xl font-semibold text-charcoal">
              Reckoning
            </Link>
          </header>

          <div className="bg-white rounded-[10px] p-10 text-center">
            <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-semibold text-charcoal mb-4">
              Something went wrong
            </h1>
            <p className="text-charcoal/60 mb-8">
              We had trouble generating your report. Our team has been notified
              and will be in touch within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 rounded-md bg-charcoal text-white font-medium hover:bg-charcoal/90 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending review (show report but with notice)
  if (reckoning.status === 'pending_review' && report) {
    return (
      <div className="min-h-screen bg-ice">
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
          <p className="text-sm text-amber-800">
            Your report is being reviewed by our team. You'll receive an email once it's ready.
          </p>
        </div>
        <ReportDisplay report={report} name={reckoning.name || 'there'} />
      </div>
    );
  }

  // Ready to view
  if ((reckoning.status === 'ready' || reckoning.status === 'reviewed') && report) {
    return <ReportDisplay report={report} name={reckoning.name || 'there'} />;
  }

  // Fallback
  return <GeneratingState token={token} name={reckoning.name} />;
}
