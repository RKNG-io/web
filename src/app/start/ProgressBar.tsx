'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="h-1 bg-stone rounded-full overflow-hidden">
        <div
          className="h-full bg-fuchsia transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {current > 0 && total > 0 && (
        <div className="text-xs text-charcoal/60 mt-2 text-right">
          {percentage < 30 && "Just getting started"}
          {percentage >= 30 && percentage < 60 && "You're doing great"}
          {percentage >= 60 && percentage < 90 && "Almost there"}
          {percentage >= 90 && "Final questions"}
        </div>
      )}
    </div>
  );
}
