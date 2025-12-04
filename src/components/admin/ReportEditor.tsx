'use client';

import React, { useState } from 'react';

interface ReportSection {
  key: string;
  title: string;
  content: string;
}

interface ReportEditorProps {
  sections: ReportSection[];
  onSave: (sections: ReportSection[]) => void;
}

export default function ReportEditor({ sections, onSave }: ReportEditorProps) {
  const [editedSections, setEditedSections] = useState(sections);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateSection = (key: string, content: string) => {
    setEditedSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, content } : s))
    );
  };

  return (
    <div className="space-y-6">
      {editedSections.map((section) => (
        <div
          key={section.key}
          className="bg-white border border-stone rounded-[10px] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">{section.title}</h3>
            <button
              type="button"
              onClick={() =>
                setActiveSection(activeSection === section.key ? null : section.key)
              }
              className="text-sm text-fuchsia hover:underline"
            >
              {activeSection === section.key ? 'Preview' : 'Edit'}
            </button>
          </div>

          {activeSection === section.key ? (
            <textarea
              value={section.content}
              onChange={(e) => updateSection(section.key, e.target.value)}
              className="w-full h-48 p-4 border border-stone rounded-[10px] font-outfit text-charcoal/70 focus:border-fuchsia focus:outline-none"
            />
          ) : (
            <div className="prose prose-charcoal text-charcoal/70">
              {section.content}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSave(editedSections)}
          className="px-6 py-3 rounded-md bg-fuchsia text-white font-medium hover:bg-fuchsia/90 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setEditedSections(sections)}
          className="px-6 py-3 rounded-md border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
