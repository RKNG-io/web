import React from 'react';
import { Card } from '@/components/ui';
import type { JourneyPhase as JourneyPhaseType } from '@/types/reckoning';

export interface JourneyPhaseProps {
  phase: JourneyPhaseType;
  index: number;
  className?: string;
}

const JourneyPhase = React.forwardRef<HTMLDivElement, JourneyPhaseProps>(
  ({ phase, index, className = '' }, ref) => {
    return (
      <div ref={ref} className={`relative ${className}`.trim()}>
        {/* Phase number and connecting line */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia text-lg font-bold text-white">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-fuchsia">
              {phase.phase}
            </div>
            <div className="mt-1 text-sm font-medium text-charcoal/70">
              {phase.timeline}
            </div>
          </div>
        </div>

        <Card variant="white" className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-charcoal md:text-2xl">
              {phase.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-charcoal/80">
              {phase.description}
            </p>
          </div>

          {phase.actions && phase.actions.length > 0 && (
            <div className="space-y-3 border-t border-stone pt-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                Key Actions
              </h4>
              <ul className="space-y-3">
                {phase.actions.map((action) => (
                  <li key={action.id} className="flex gap-3">
                    <div className="mt-1.5 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-mint" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">
                        {action.title}
                      </div>
                      {action.description && (
                        <p className="mt-1 text-sm text-charcoal/70">
                          {action.description}
                        </p>
                      )}
                      {action.duration && (
                        <div className="mt-1 text-xs font-medium text-fuchsia">
                          {action.duration}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Connecting line to next phase (hidden for last item) */}
        <div className="absolute left-6 top-16 -z-10 h-full w-0.5 bg-stone" />
      </div>
    );
  }
);

JourneyPhase.displayName = 'JourneyPhase';

export default JourneyPhase;
export { JourneyPhase };
