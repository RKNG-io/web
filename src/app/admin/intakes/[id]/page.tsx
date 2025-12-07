import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIntakeRequestById, type IntakeRequest } from '@/lib/db';
import { IntakeActions } from './IntakeActions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

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
    <span className={`px-3 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const typeLabels = {
  website: 'Website Build',
  automations: 'Automations',
  social: 'Social Media',
};

export default async function IntakeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const intake = await getIntakeRequestById(id);

  if (!intake) {
    notFound();
  }

  const answers = intake.answers as Record<string, unknown>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/intakes"
        className="text-sm text-charcoal/60 hover:text-charcoal mb-4 inline-block"
      >
        ← Back to intakes
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {typeLabels[intake.type]} Intake
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Submitted {formatDate(intake.created_at)}
          </p>
        </div>
        <StatusBadge status={intake.status} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Contact Info */}
        <div className="bg-white rounded-[10px] p-6 border border-stone">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Contact
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-charcoal/60">Name</dt>
              <dd className="text-charcoal font-medium">{intake.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal/60">Email</dt>
              <dd className="text-charcoal">
                <a
                  href={`mailto:${intake.email}`}
                  className="text-fuchsia hover:underline"
                >
                  {intake.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal/60">Preference</dt>
              <dd className="text-charcoal">
                {intake.contact_preference === 'quote'
                  ? 'Send me a quote via email'
                  : 'I\'d like to book a call'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Request Type */}
        <div className="bg-white rounded-[10px] p-6 border border-stone">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Request Type
          </h2>
          <div className="text-lg font-medium text-charcoal mb-2">
            {typeLabels[intake.type]}
          </div>
          <p className="text-sm text-charcoal/60">
            {intake.type === 'website' && 'Website design and development'}
            {intake.type === 'automations' && 'Business process automation'}
            {intake.type === 'social' && 'Social media management'}
          </p>
        </div>
      </div>

      {/* Answers */}
      <div className="bg-white rounded-[10px] p-6 border border-stone mb-6">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
          Questionnaire Answers
        </h2>
        <dl className="space-y-4">
          {Object.entries(answers).map(([key, value]) => (
            <div key={key} className="border-b border-stone pb-3 last:border-0 last:pb-0">
              <dt className="text-xs text-charcoal/60 uppercase tracking-wider mb-1">
                {key.replace(/_/g, ' ')}
              </dt>
              <dd className="text-charcoal">
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Raw JSON (collapsible) */}
      <details className="bg-white rounded-[10px] border border-stone mb-6">
        <summary className="p-6 cursor-pointer text-sm font-medium text-charcoal/60 hover:text-charcoal">
          View Raw JSON
        </summary>
        <div className="px-6 pb-6">
          <pre className="bg-ice p-4 rounded-md text-xs font-mono overflow-x-auto">
            {JSON.stringify(intake, null, 2)}
          </pre>
        </div>
      </details>

      {/* Actions */}
      <IntakeActions intakeId={intake.id} currentStatus={intake.status} />
    </div>
  );
}
