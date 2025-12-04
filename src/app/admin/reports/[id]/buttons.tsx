'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveReport, regenerateReport } from './actions';

interface ButtonProps {
  reckoningId: string;
  disabled?: boolean;
}

export function ApproveButton({ reckoningId, disabled }: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (disabled) return;
    
    setLoading(true);
    try {
      await approveReport(reckoningId);
      router.refresh();
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={loading || disabled}
      className={`px-6 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? 'bg-stone/30 text-charcoal/50 cursor-not-allowed'
          : 'bg-mint text-charcoal hover:bg-mint/80'
      }`}
    >
      {loading ? 'Approving...' : disabled ? 'Approved' : 'Approve & Send'}
    </button>
  );
}

export function RegenerateButton({ reckoningId }: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    if (!confirm('This will regenerate the report. Continue?')) return;
    
    setLoading(true);
    try {
      await regenerateReport(reckoningId);
      router.refresh();
    } catch (error) {
      console.error('Failed to regenerate:', error);
      alert('Failed to regenerate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRegenerate}
      disabled={loading}
      className="px-6 py-2 rounded-md border border-charcoal text-charcoal font-medium hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? 'Regenerating...' : 'Regenerate'}
    </button>
  );
}

export function EditButton({ reckoningId }: ButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/admin/reports/${reckoningId}/edit`)}
      className="px-6 py-2 rounded-md border border-stone text-charcoal font-medium hover:border-charcoal transition-colors"
    >
      Edit
    </button>
  );
}
