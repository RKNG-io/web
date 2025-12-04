'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { ReckoningReport } from '@/types/report';

interface ReportDisplayProps {
  report: ReckoningReport;
  name: string;
}

export function ReportDisplay({ report, name }: ReportDisplayProps) {
  const params = useParams();
  const token = params.token as string;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/reckoning/pdf/${token}`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reckoning-${token.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fall back to browser print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone py-6 px-4 no-print">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="text-sm text-charcoal/60 hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 md:py-12 px-4">
        {/* Opening */}
        <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            {report.sections.opening.headline}
          </h1>
          <p className="text-base md:text-lg text-charcoal/70 leading-relaxed">
            {report.sections.opening.body}
          </p>
        </section>

        {/* Snapshot */}
        <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
            Where you are
          </h2>
          <h3 className="text-2xl font-semibold text-charcoal mb-2">
            {report.sections.snapshot.stage}
          </h3>
          <p className="text-charcoal/70 mb-8">
            {report.sections.snapshot.stage_description}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div>
              <h4 className="text-sm font-medium text-mint mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-mint/20 rounded-full flex items-center justify-center text-xs">✓</span>
                What's working
              </h4>
              <ul className="space-y-3">
                {report.sections.snapshot.strengths.map((strength, i) => (
                  <li key={i} className="text-charcoal/70 pl-8 relative">
                    <span className="absolute left-0 text-mint">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Blockers */}
            <div>
              <h4 className="text-sm font-medium text-fuchsia mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-fuchsia/10 rounded-full flex items-center justify-center text-xs">!</span>
                What's blocking you
              </h4>
              <ul className="space-y-3">
                {report.sections.snapshot.blockers.map((blocker, i) => (
                  <li key={i} className="text-charcoal/70 pl-8 relative">
                    <span className="absolute left-0 text-fuchsia">•</span>
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Diagnosis */}
        <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
            The diagnosis
          </h2>

          {/* Primary blocker */}
          <div className="border-l-4 border-fuchsia pl-6 mb-8">
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              {report.sections.diagnosis.primary_blocker.title}
            </h3>
            <p className="text-charcoal/70 mb-4">
              {report.sections.diagnosis.primary_blocker.explanation}
            </p>
            <p className="text-charcoal/60 text-sm italic">
              {report.sections.diagnosis.primary_blocker.impact}
            </p>
          </div>

          {/* Secondary blockers */}
          {(report.sections.diagnosis.secondary_blockers?.length || 0) > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-charcoal mb-4">Also blocking you:</h4>
              <div className="space-y-4">
                {report.sections.diagnosis.secondary_blockers?.map((blocker, i) => (
                  <div key={i} className="bg-ice rounded-lg p-4">
                    <h5 className="font-medium text-charcoal mb-1">{blocker.title}</h5>
                    <p className="text-sm text-charcoal/60">{blocker.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost of inaction */}
          <div className="bg-charcoal rounded-lg p-6 text-white">
            <h4 className="text-sm font-medium text-white/60 mb-2">If nothing changes:</h4>
            <p className="text-white/90 mb-4">
              {report.sections.diagnosis.cost_of_inaction.narrative}
            </p>
            {report.sections.diagnosis.cost_of_inaction.calculation && (
              <div className="bg-white/10 rounded p-4 text-sm">
                <p className="text-white/80">
                  {report.sections.diagnosis.cost_of_inaction.calculation.hours_per_week} hours/week × 
                  £{report.sections.diagnosis.cost_of_inaction.calculation.hourly_value}/hour × 
                  {report.sections.diagnosis.cost_of_inaction.calculation.weeks_per_year} weeks = 
                  <strong className="text-white ml-2">
                    £{report.sections.diagnosis.cost_of_inaction.calculation.annual_cost.toLocaleString()}/year
                  </strong>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Journey Map */}
        <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
            The path forward
          </h2>
          <p className="text-charcoal/70 mb-8">
            {report.sections.journey_map.overview}
          </p>

          <div className="space-y-6">
            {report.sections.journey_map.phases.map((phase) => (
              <div key={phase.number} className="border border-stone rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="w-8 h-8 bg-fuchsia text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {phase.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-charcoal">{phase.title}</h3>
                    <p className="text-sm text-charcoal/50">{phase.duration}</p>
                  </div>
                </div>
                <p className="text-charcoal/70 mb-4 ml-12">{phase.focus}</p>
                <ul className="ml-12 space-y-2">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === 'must' ? 'bg-fuchsia/10 text-fuchsia' :
                        task.priority === 'should' ? 'bg-amber-100 text-amber-700' :
                        'bg-stone/50 text-charcoal/60'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-charcoal/70">{task.task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Next Step */}
        <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
            Your next step
          </h2>
          <h3 className="text-2xl font-semibold text-charcoal mb-6">
            {report.sections.next_step.headline}
          </h3>

          {/* The One Thing */}
          <div className="bg-mint/10 border border-mint rounded-lg p-6 mb-8">
            <h4 className="text-sm font-medium text-mint mb-2">If you do one thing:</h4>
            <p className="text-lg font-semibold text-charcoal mb-2">
              {report.sections.next_step.the_one_thing.action}
            </p>
            <p className="text-charcoal/70 text-sm mb-2">
              <strong>Why this?</strong> {report.sections.next_step.the_one_thing.why_this}
            </p>
            <p className="text-charcoal/70 text-sm">
              <strong>How to start:</strong> {report.sections.next_step.the_one_thing.how_to_start}
            </p>
          </div>

          {/* Two paths */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* DIY path */}
            <div className="border border-stone rounded-lg p-6">
              <h4 className="font-medium text-charcoal mb-2">Do it yourself</h4>
              <p className="text-sm text-charcoal/70 mb-4">
                {report.sections.next_step.diy_path.description}
              </p>
              <p className="text-sm text-charcoal/70 mb-4">
                <strong>First step:</strong> {report.sections.next_step.diy_path.first_step}
              </p>
              {report.sections.next_step.diy_path.resources.length > 0 && (
                <div>
                  <p className="text-xs text-charcoal/50 mb-2">Resources:</p>
                  <ul className="text-sm text-charcoal/60 space-y-1">
                    {report.sections.next_step.diy_path.resources.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Supported path */}
            <div className="border-2 border-fuchsia rounded-lg p-6">
              <h4 className="font-medium text-charcoal mb-2">Get support</h4>
              <p className="text-sm text-charcoal/70 mb-4">
                {report.sections.next_step.supported_path.description}
              </p>
              <div className="bg-fuchsia/5 rounded p-4">
                <p className="font-medium text-charcoal">
                  {report.sections.next_step.supported_path.recommended_service}
                </p>
                <p className="text-sm text-charcoal/60">
                  From £{report.sections.next_step.supported_path.price_from}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Recommendations */}
        {report.recommendations.services.length > 0 && (
          <section className="bg-white rounded-[10px] p-6 md:p-10 mb-6 md:mb-8">
            <h2 className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
              Recommended for you
            </h2>
            <div className="space-y-4">
              {report.recommendations.services.map((service) => (
                <div 
                  key={service.service_id} 
                  className={`border rounded-lg p-6 flex items-start justify-between ${
                    service.priority === 1 ? 'border-fuchsia' : 'border-stone'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        service.priority === 1 ? 'bg-fuchsia text-white' :
                        service.priority === 2 ? 'bg-charcoal/20 text-charcoal' :
                        'bg-stone text-charcoal/60'
                      }`}>
                        {service.priority}
                      </span>
                      <h3 className="font-medium text-charcoal">{service.service_name}</h3>
                    </div>
                    <p className="text-sm text-charcoal/60 ml-9">{service.relevance}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">From £{service.price_from}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/start/choose"
                className="inline-flex px-8 py-3 rounded-md bg-fuchsia text-white font-medium hover:bg-fuchsia/90 transition-colors"
              >
                Get started with support
              </Link>
              <p className="text-sm text-charcoal/50 mt-3">
                Or take this report and run with it yourself — both paths work.
              </p>
            </div>
          </section>
        )}

        {/* Closing */}
        <section className="bg-charcoal rounded-[10px] p-6 md:p-10 text-center text-white">
          <p className="text-lg text-white/90 mb-4 max-w-2xl mx-auto">
            {report.sections.closing.message}
          </p>
          <p className="text-xl font-semibold">
            {report.sections.closing.sign_off}
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-charcoal/50">
          <p>
            This report was generated on {new Date(report.generated_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-2">
            Questions? <a href="mailto:hello@rkng.com" className="text-fuchsia hover:underline">hello@rkng.com</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
