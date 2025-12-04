'use client';

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  columns?: 1 | 2;
}

export default function SingleSelect({
  options,
  value,
  onChange,
  columns = 1,
}: SingleSelectProps) {
  // TODO: Implement single-select question component
  return (
    <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`p-4 text-left rounded-[10px] border transition-colors ${
            value === option.value
              ? 'border-fuchsia bg-fuchsia/5'
              : 'border-stone hover:border-charcoal/30'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
