'use client';

import React from 'react';

interface ServiceFilterProps {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

export default function ServiceFilter({
  categories,
  selected,
  onChange,
}: ServiceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-md text-sm transition-colors ${
          selected === null
            ? 'bg-charcoal text-white'
            : 'bg-stone/30 text-charcoal hover:bg-stone/50'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            selected === category
              ? 'bg-charcoal text-white'
              : 'bg-stone/30 text-charcoal hover:bg-stone/50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
