'use client';

import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
}: TextInputProps) {
  const baseClasses =
    'w-full p-4 rounded-[10px] border border-stone focus:border-fuchsia focus:outline-none transition-colors font-outfit';

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={baseClasses}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}
