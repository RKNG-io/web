'use client';

import React from 'react';

interface QuestionCardProps {
  question: string;
  subtext?: string;
  children: React.ReactNode;
}

export default function QuestionCard({
  question,
  subtext,
  children,
}: QuestionCardProps) {
  return (
    <div className="max-w-[600px] mx-auto">
      <h2 className="text-2xl font-semibold text-charcoal mb-2">{question}</h2>
      {subtext && (
        <p className="text-charcoal/60 mb-8">{subtext}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
