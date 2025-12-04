'use client';

import React from 'react';

interface ServiceCardProps {
  name: string;
  description: string;
  price: number;
  recommended?: boolean;
  onAdd?: () => void;
}

export default function ServiceCard({
  name,
  description,
  price,
  recommended = false,
  onAdd,
}: ServiceCardProps) {
  return (
    <article
      className={`bg-white border rounded-[10px] p-6 ${
        recommended ? 'border-fuchsia' : 'border-stone'
      }`}
    >
      {recommended && (
        <span className="inline-block text-xs uppercase tracking-wider text-fuchsia font-medium mb-2">
          Recommended for you
        </span>
      )}
      <h4 className="text-lg font-semibold text-charcoal mb-2">{name}</h4>
      <p className="text-sm text-charcoal/60 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-charcoal font-medium">£{price}</span>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="px-4 py-2 text-sm rounded-md border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
