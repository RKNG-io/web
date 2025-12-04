'use client';

import React, { useState } from 'react';

interface PdfDownloadProps {
  reckoningId: string;
}

export default function PdfDownload({ reckoningId }: PdfDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // TODO: Implement PDF generation API call
      const response = await fetch(`/api/report/${reckoningId}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reckoning-${reckoningId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Generating...
        </>
      ) : (
        <>
          <span>📄</span>
          Download PDF
        </>
      )}
    </button>
  );
}
