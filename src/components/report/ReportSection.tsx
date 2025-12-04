'use client';

import React from 'react';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  variant?: 'blocked' | 'unlocked' | 'neutral';
}

export default function ReportSection({
  title,
  children,
  variant = 'neutral',
}: ReportSectionProps) {
  const borderColor = {
    blocked: 'border-l-fuchsia',
    unlocked: 'border-l-mint',
    neutral: 'border-l-stone',
  }[variant];

  return (
    <section className={`border-l-4 ${borderColor} pl-6 py-4 mb-8`}>
      <h3 className="text-xl font-semibold text-charcoal mb-4">{title}</h3>
      <div className="text-charcoal/70">{children}</div>
    </section>
  );
}
