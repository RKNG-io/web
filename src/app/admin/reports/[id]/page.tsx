import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReckoningById } from '@/lib/db';
import { ApproveButton, RegenerateButton, EditButton } from './buttons';
import type { ReckoningReport } from '@/types/report';

// Skip static generation - admin pages need DB access
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportReviewPage({ params }: PageProps) {
  const { id } = await params;
  const reckoning = await getReckoningById(id);

  if (!reckoning) {
    notFound();
  }

  const report = reckoning.report as ReckoningReport | null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with actions */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/admin/reports" className="text-sm text-charcoal/60 hover:text-charcoal mb-2 inline-block">
            ← Back to reports
          </Link>
          <h1 className="text-2xl font-semibold text-charcoal">
            Report for {reckoning.name || 'Unknown'}
          </h1>
          <p className="text-charcoal/60">
            {reckoning.persona} • Confidence: {reckoning.confidence_score || 0}%
          </p>
        </div>

        <div className="flex gap-4">
          <EditButton reckoningId={id} />
          <RegenerateButton reckoningId={id} />
          <ApproveButton reckoningId={id} disabled={reckoning.status === 'ready'} />
        </div>
      </div>

      {/* Validation flags */}
      {reckoning.validation_flags && reckoning.validation_flags.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">Flagged Issues</h3>
          <ul className="list-disc list-inside text-sm text-amber-700">
            {reckoning.validation_flags.map((flag: string, i: number) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Error log if failed */}
      {reckoning.status === 'failed' && reckoning.error_log && (
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-8">
          <h3 className="font-semibold text-red-800 mb-2">Generation Failed</h3>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{reckoning.error_log}</pre>
        </div>
      )}

      {/* Two-column layout: Answers | Report */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Original answers */}
        <div className="bg-ice rounded-[10px] p-6">
          <h2 className="font-semibold text-charcoal mb-4">Questionnaire Answers</h2>
          <AnswersDisplay answers={reckoning.answers} />
        </div>

        {/* Right: Generated report */}
        <div className="bg-white border border-stone rounded-[10px] p-6 overflow-auto max-h-[80vh]">
          <h2 className="font-semibold text-charcoal mb-4">Generated Report</h2>
          {report ? (
            <ReportPreview report={report} />
          ) : (
            <p className="text-charcoal/60">No report generated yet</p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-8 p-4 bg-stone/20 rounded-[10px] text-sm text-charcoal/60">
        <p>Created: {new Date(reckoning.created_at).toLocaleString('en-GB')}</p>
        {reckoning.completed_at && (
          <p>Completed: {new Date(reckoning.completed_at).toLocaleString('en-GB')}</p>
        )}
        {reckoning.edited_at && (
          <p>Last edited: {new Date(reckoning.edited_at).toLocaleString('en-GB')} by {reckoning.edited_by}</p>
        )}
        <p>Attempts: {reckoning.generation_attempts}</p>
        <p>Token: {reckoning.token}</p>
      </div>
    </div>
  );
}

function AnswersDisplay({ answers }: { answers: Record<string, unknown> }) {
  return (
    <dl className="space-y-4">
      {Object.entries(answers).map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs uppercase tracking-wider text-charcoal/60 mb-1">
            {key.replace(/_/g, ' ')}
          </dt>
          <dd className="text-charcoal">
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside">
                {value.map((v, i) => <li key={i}>{String(v)}</li>)}
              </ul>
            ) : typeof value === 'object' ? (
              <pre className="text-sm">{JSON.stringify(value, null, 2)}</pre>
            ) : (
              String(value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ReportPreview({ report }: { report: ReckoningReport }) {
  return (
    <div className="space-y-6">
      {/* Meta */}
      <div className="text-xs text-charcoal/50">
        v{report.version} • {report.meta.persona} • {report.meta.model}
      </div>

      {/* Opening */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Opening</h3>
        <p className="text-lg font-medium text-charcoal">{report.sections.opening.headline}</p>
        <p className="text-charcoal/70 mt-2">{report.sections.opening.body}</p>
      </section>

      {/* Snapshot */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Snapshot</h3>
        <p className="text-charcoal/70 mb-2">Stage: {report.sections.snapshot.stage}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase text-mint mb-1">Strengths</p>
            <ul className="text-sm text-charcoal/70 list-disc list-inside">
              {report.sections.snapshot.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase text-fuchsia mb-1">Blockers</p>
            <ul className="text-sm text-charcoal/70 list-disc list-inside">
              {report.sections.snapshot.blockers.map((b, i) => <li key={i}>{b.blocker}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Diagnosis */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Diagnosis</h3>
        <div className="border-l-4 border-fuchsia pl-4 mb-4">
          <p className="font-medium text-charcoal">{report.sections.diagnosis.primary_blocker.title}</p>
          <p className="text-sm text-charcoal/70">{report.sections.diagnosis.primary_blocker.explanation}</p>
        </div>
        {report.sections.diagnosis.cost_of_inaction.calculation && (
          <div className="bg-stone/20 p-3 rounded text-sm">
            <p className="font-medium">Cost of inaction:</p>
            <p>
              {report.sections.diagnosis.cost_of_inaction.calculation.hours_per_week} hrs/week × 
              £{report.sections.diagnosis.cost_of_inaction.calculation.hourly_value} × 
              {report.sections.diagnosis.cost_of_inaction.calculation.weeks_per_year} weeks = 
              <strong> £{report.sections.diagnosis.cost_of_inaction.calculation.annual_cost}/year</strong>
            </p>
          </div>
        )}
      </section>

      {/* Journey Map */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Journey Map</h3>
        <div className="space-y-4">
          {report.sections.journey_map.phases.map((phase) => (
            <div key={phase.number} className="border border-stone rounded p-3">
              <p className="font-medium text-charcoal">Phase {phase.number}: {phase.title}</p>
              <p className="text-xs text-charcoal/60">{phase.duration}  - {phase.focus}</p>
              <ul className="mt-2 text-sm text-charcoal/70 list-disc list-inside">
                {phase.tasks.map((t, i) => (
                  <li key={i}>
                    {t.task}
                    <span className={`ml-2 text-xs ${
                      t.priority === 'must' ? 'text-fuchsia' :
                      t.priority === 'should' ? 'text-amber-600' : 'text-charcoal/50'
                    }`}>
                      [{t.priority}]
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Next Step */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Next Step</h3>
        <p className="text-lg font-medium text-charcoal mb-2">{report.sections.next_step.headline}</p>
        <div className="bg-mint/10 border border-mint rounded p-3 mb-3">
          <p className="font-medium text-charcoal">The One Thing: {report.sections.next_step.the_one_thing.action}</p>
          <p className="text-sm text-charcoal/70">{report.sections.next_step.the_one_thing.why_this}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="border border-stone rounded p-3">
            <p className="font-medium mb-1">DIY Path</p>
            <p className="text-charcoal/70">{report.sections.next_step.diy_path.description}</p>
          </div>
          <div className="border border-stone rounded p-3">
            <p className="font-medium mb-1">Supported Path</p>
            <p className="text-charcoal/70">{report.sections.next_step.supported_path.description}</p>
            <p className="text-fuchsia text-xs mt-1">
              {report.sections.next_step.supported_path.recommended_service}  - from £{report.sections.next_step.supported_path.price_from}
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Closing</h3>
        <p className="text-charcoal/70">{report.sections.closing.message}</p>
        <p className="font-medium text-charcoal mt-2">{report.sections.closing.sign_off}</p>
      </section>

      {/* Recommendations */}
      <section>
        <h3 className="font-semibold text-charcoal mb-2">Service Recommendations</h3>
        <div className="space-y-2">
          {report.recommendations.services.map((s) => (
            <div key={s.service_id} className="flex justify-between items-center border border-stone rounded p-2 text-sm">
              <div>
                <span className={`inline-block w-6 h-6 text-center rounded-full mr-2 ${
                  s.priority === 1 ? 'bg-fuchsia text-white' :
                  s.priority === 2 ? 'bg-charcoal/20 text-charcoal' : 'bg-stone text-charcoal/60'
                }`}>
                  {s.priority}
                </span>
                <span className="font-medium">{s.service_name}</span>
              </div>
              <span className="text-charcoal/60">£{s.price_from}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Input Echo */}
      <section className="border-t border-stone pt-4">
        <h3 className="text-xs uppercase tracking-wider text-charcoal/60 mb-2">Input Echo (Validation)</h3>
        <p className="text-sm text-charcoal/70">
          Quoted phrases: {report.input_echo.quoted_phrases.length}
        </p>
        <ul className="text-xs text-charcoal/50 list-disc list-inside">
          {report.input_echo.quoted_phrases.map((p, i) => (
            <li key={i}>"{p}"</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
