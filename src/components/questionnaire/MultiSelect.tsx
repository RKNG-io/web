'use client';

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
}

export default function MultiSelect({
  options,
  values,
  onChange,
  max,
}: MultiSelectProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else if (!max || values.length < max) {
      onChange([...values, value]);
    }
  };

  // TODO: Implement multi-select question component
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggle(option.value)}
          className={`p-4 text-left rounded-[10px] border transition-colors ${
            values.includes(option.value)
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
