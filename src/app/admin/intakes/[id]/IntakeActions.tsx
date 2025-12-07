'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IntakeRequest } from '@/lib/db';

interface IntakeActionsProps {
  intakeId: string;
  currentStatus: IntakeRequest['status'];
}

export function IntakeActions({ intakeId, currentStatus }: IntakeActionsProps) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateStatus = async (newStatus: IntakeRequest['status']) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/intakes/${intakeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  // Determine available actions based on current status
  const availableActions: Array<{ status: IntakeRequest['status']; label: string; style: string }> = [];

  if (currentStatus === 'new') {
    availableActions.push({
      status: 'quoted',
      label: 'Mark as Quoted',
      style: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    });
    availableActions.push({
      status: 'closed',
      label: 'Close',
      style: 'border border-charcoal/30 text-charcoal/60 hover:bg-charcoal/5',
    });
  }

  if (currentStatus === 'quoted') {
    availableActions.push({
      status: 'converted',
      label: 'Mark as Converted',
      style: 'bg-mint text-charcoal hover:bg-mint/80',
    });
    availableActions.push({
      status: 'closed',
      label: 'Close',
      style: 'border border-charcoal/30 text-charcoal/60 hover:bg-charcoal/5',
    });
  }

  if (currentStatus === 'closed') {
    availableActions.push({
      status: 'new',
      label: 'Reopen',
      style: 'border border-fuchsia text-fuchsia hover:bg-fuchsia/10',
    });
  }

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[10px] p-6 border border-stone">
      <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
        Actions
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-fuchsia/10 text-fuchsia text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {availableActions.map((action) => (
          <button
            key={action.status}
            onClick={() => updateStatus(action.status)}
            disabled={updating}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${action.style}`}
          >
            {updating ? 'Updating...' : action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
