'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="h-1 bg-stone rounded-full overflow-hidden">
        <div
          className="h-full bg-fuchsia transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-charcoal/50 mt-2 text-right">
          {current} of {total}
        </p>
      )}
    </div>
  );
}
