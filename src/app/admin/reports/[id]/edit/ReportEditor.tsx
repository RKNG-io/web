'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReckoningReport } from '@/types/report';

interface ReportEditorProps {
  reckoningId: string;
  initialReport: ReckoningReport;
}

export function ReportEditor({ reckoningId, initialReport }: ReportEditorProps) {
  const [report, setReport] = useState(initialReport);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const updateSection = <K extends keyof ReckoningReport['sections']>(
    section: K,
    field: keyof ReckoningReport['sections'][K],
    value: unknown
  ) => {
    setReport(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [field]: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/reports/${reckoningId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndApprove = async () => {
    setSaving(true);
    setError(null);

    try {
      // Save first
      const saveResponse = await fetch(`/api/admin/reports/${reckoningId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, approve: true }),
      });

      if (!saveResponse.ok) {
        const data = await saveResponse.json();
        throw new Error(data.error || 'Failed to save and approve');
      }

      router.push(`/admin/reports/${reckoningId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save and approve');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-10 bg-ice py-4 border-b border-stone -mx-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {error && (
            <span className="text-sm text-fuchsia">{error}</span>
          )}
          {saved && (
            <span className="text-sm text-mint">Changes saved</span>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-md border border-charcoal text-charcoal font-medium hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleSaveAndApprove}
            disabled={saving}
            className="px-6 py-2 rounded-md bg-mint text-charcoal font-medium hover:bg-mint/80 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Approve'}
          </button>
        </div>
      </div>

      {/* Opening Section */}
      <section className="bg-white rounded-[10px] p-6 border border-stone">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">Opening</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Headline</label>
            <input
              type="text"
              value={report.sections.opening.headline}
              onChange={(e) => updateSection('opening', 'headline', e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Body</label>
            <textarea
              value={report.sections.opening.body}
              onChange={(e) => updateSection('opening', 'body', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y"
            />
          </div>
        </div>
      </section>

      {/* Snapshot Section */}
      <section className="bg-white rounded-[10px] p-6 border border-stone">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">Snapshot</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Stage</label>
              <input
                type="text"
                value={report.sections.snapshot.stage}
                onChange={(e) => updateSection('snapshot', 'stage', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Stage Description</label>
              <input
                type="text"
                value={report.sections.snapshot.stage_description}
                onChange={(e) => updateSection('snapshot', 'stage_description', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Strengths (one per line)
            </label>
            <textarea
              value={report.sections.snapshot.strengths.join('\n')}
              onChange={(e) => updateSection('snapshot', 'strengths', e.target.value.split('\n').filter(Boolean))}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y font-mono text-sm"
            />
          </div>
        </div>
      </section>

      {/* Diagnosis Section */}
      <section className="bg-white rounded-[10px] p-6 border border-stone">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">Diagnosis</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Primary Blocker Title</label>
            <input
              type="text"
              value={report.sections.diagnosis.primary_blocker.title}
              onChange={(e) => setReport(prev => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  diagnosis: {
                    ...prev.sections.diagnosis,
                    primary_blocker: {
                      ...prev.sections.diagnosis.primary_blocker,
                      title: e.target.value,
                    },
                  },
                },
              }))}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Primary Blocker Explanation</label>
            <textarea
              value={report.sections.diagnosis.primary_blocker.explanation}
              onChange={(e) => setReport(prev => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  diagnosis: {
                    ...prev.sections.diagnosis,
                    primary_blocker: {
                      ...prev.sections.diagnosis.primary_blocker,
                      explanation: e.target.value,
                    },
                  },
                },
              }))}
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Cost of Inaction Narrative</label>
            <textarea
              value={report.sections.diagnosis.cost_of_inaction.narrative}
              onChange={(e) => setReport(prev => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  diagnosis: {
                    ...prev.sections.diagnosis,
                    cost_of_inaction: {
                      ...prev.sections.diagnosis.cost_of_inaction,
                      narrative: e.target.value,
                    },
                  },
                },
              }))}
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y"
            />
          </div>
        </div>
      </section>

      {/* Next Step Section */}
      <section className="bg-white rounded-[10px] p-6 border border-stone">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">Next Step</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Headline</label>
            <input
              type="text"
              value={report.sections.next_step.headline}
              onChange={(e) => updateSection('next_step', 'headline', e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">The One Thing  - Action</label>
            <input
              type="text"
              value={report.sections.next_step.the_one_thing.action}
              onChange={(e) => setReport(prev => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  next_step: {
                    ...prev.sections.next_step,
                    the_one_thing: {
                      ...prev.sections.next_step.the_one_thing,
                      action: e.target.value,
                    },
                  },
                },
              }))}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none"
            />
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="bg-white rounded-[10px] p-6 border border-stone">
        <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">Closing</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Message</label>
            <textarea
              value={report.sections.closing.message}
              onChange={(e) => updateSection('closing', 'message', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Sign-off</label>
            <textarea
              value={report.sections.closing.sign_off}
              onChange={(e) => updateSection('closing', 'sign_off', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y"
            />
          </div>
        </div>
      </section>

      {/* Raw JSON Editor (Advanced) */}
      <details className="bg-white rounded-[10px] border border-stone">
        <summary className="p-6 cursor-pointer text-sm font-medium text-charcoal/60 hover:text-charcoal">
          Advanced: Edit Raw JSON
        </summary>
        <div className="px-6 pb-6">
          <textarea
            value={JSON.stringify(report, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setReport(parsed);
                setSaved(false);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            rows={20}
            className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none resize-y font-mono text-xs"
          />
        </div>
      </details>
    </div>
  );
}
