import React from 'react';
import { Card, Badge } from '@/components/ui';
import type { CostOfWaiting } from '@/types/reckoning';

export interface CostCardProps {
  cost: CostOfWaiting;
  className?: string;
}

const CostCard = React.forwardRef<HTMLDivElement, CostCardProps>(
  ({ cost, className = '' }, ref) => {
    const typeConfig = {
      financial: {
        variant: 'fuchsia' as const,
        label: 'Financial',
        icon: '£',
      },
      time: {
        variant: 'blue' as const,
        label: 'Time',
        icon: '⏱',
      },
      opportunity: {
        variant: 'mint' as const,
        label: 'Opportunity',
        icon: '✦',
      },
    };

    const config = typeConfig[cost.type];

    return (
      <Card ref={ref} variant="white" className={`space-y-4 ${className}`.trim()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ice text-xl">
              {config.icon}
            </div>
            <div>
              <Badge variant={config.variant} className="mb-2">
                {config.label}
              </Badge>
              <h3 className="text-lg font-semibold text-charcoal md:text-xl">
                {cost.title}
              </h3>
            </div>
          </div>
        </div>

        <p className="text-base leading-relaxed text-charcoal/80">
          {cost.description}
        </p>

        {cost.impact && (
          <div className="border-t border-stone pt-4">
            <div className="rounded-lg bg-ice p-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                Impact
              </div>
              <div className="mt-1 text-lg font-semibold text-fuchsia">
                {cost.impact}
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

CostCard.displayName = 'CostCard';

export default CostCard;
export { CostCard };
