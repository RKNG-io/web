'use client';

import React from 'react';

interface AcknowledgmentProps {
  content: string;
  acknowledged: boolean;
  onAcknowledge: () => void;
}

export default function Acknowledgment({
  content,
  acknowledged,
  onAcknowledge,
}: AcknowledgmentProps) {
  // TODO: Implement acknowledgment screen (welcome, transition moments)
  return (
    <div className="text-center">
      <div
        className="prose prose-charcoal mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        type="button"
        onClick={onAcknowledge}
        className={`px-8 py-3 rounded-md font-medium transition-all ${
          acknowledged
            ? 'bg-mint text-charcoal'
            : 'bg-fuchsia text-white hover:-translate-y-0.5'
        }`}
      >
        {acknowledged ? 'Acknowledged' : 'Continue'}
      </button>
    </div>
  );
}
