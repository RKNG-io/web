'use client';

interface BackConfirmModalProps {
  isOpen: boolean;
  affectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BackConfirmModal({
  isOpen,
  affectedCount,
  onConfirm,
  onCancel,
}: BackConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[10px] p-8 max-w-md mx-4 border border-stone"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3
          id="modal-title"
          className="text-xl font-semibold text-charcoal mb-3"
        >
          Going back will reset some answers
        </h3>
        <p className="text-charcoal/60 mb-6">
          {affectedCount === 1
            ? 'One of your later answers depends on what you chose here. Going back will clear it so you can answer fresh.'
            : `${affectedCount} of your later answers depend on what you chose here. Going back will clear them so you can answer fresh.`}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3 rounded-lg border-2 border-stone text-charcoal font-medium hover:border-charcoal transition-colors"
          >
            Stay here
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity"
          >
            Go back anyway
          </button>
        </div>
      </div>
    </div>
  );
}
