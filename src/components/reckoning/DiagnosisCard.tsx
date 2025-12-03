import React from 'react';
import { Card, Badge } from '@/components/ui';
import type { DiagnosisIssue } from '@/types/reckoning';

export interface DiagnosisCardProps {
  diagnosis: DiagnosisIssue;
  className?: string;
}

const DiagnosisCard = React.forwardRef<HTMLDivElement, DiagnosisCardProps>(
  ({ diagnosis, className = '' }, ref) => {
    const impactConfig = {
      high: {
        variant: 'fuchsia' as const,
        label: 'High Impact',
      },
      medium: {
        variant: 'blue' as const,
        label: 'Medium Impact',
      },
      low: {
        variant: 'mint' as const,
        label: 'Low Impact',
      },
    };

    const config = impactConfig[diagnosis.impact];

    return (
      <Card ref={ref} variant="white" className={`space-y-4 ${className}`.trim()}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-charcoal md:text-2xl">
            {diagnosis.title}
          </h3>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        <p className="text-base leading-relaxed text-charcoal/80">
          {diagnosis.description}
        </p>

        {diagnosis.evidence && diagnosis.evidence.length > 0 && (
          <div className="space-y-2 border-t border-stone pt-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">
              Evidence
            </h4>
            <ul className="space-y-2">
              {diagnosis.evidence.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-charcoal/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fuchsia" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    );
  }
);

DiagnosisCard.displayName = 'DiagnosisCard';

export default DiagnosisCard;
export { DiagnosisCard };
