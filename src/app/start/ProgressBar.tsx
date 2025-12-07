'use client';

import type { JourneyPhase } from './useQuestionnaire';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  phaseIndex?: number;
  phase?: JourneyPhase;
}

export function ProgressBar({ percentage, phaseIndex = 0, phase }: ProgressBarProps) {
  // Phase dots (5 phases)
  const totalPhases = 5;

  return (
    <div className="mb-8" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      {/* Phase dots */}
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: totalPhases }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i <= phaseIndex ? 'bg-fuchsia' : 'bg-stone'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-stone rounded-full overflow-hidden">
        <div
          className="h-full bg-fuchsia transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Phase label (no numbers shown) */}
      {phase && (
        <div className="mt-3">
          <span className="text-sm font-medium text-charcoal">{phase.name}</span>
          <span className="text-sm text-charcoal/50 ml-2">{phase.description}</span>
        </div>
      )}
    </div>
  );
}
