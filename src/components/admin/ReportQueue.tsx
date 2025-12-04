'use client';

import React from 'react';
import Link from 'next/link';

interface QueuedReport {
  id: string;
  name: string;
  persona: string;
  confidenceScore: number;
  createdAt: string;
  status: string;
}

interface ReportQueueProps {
  reports: QueuedReport[];
}

export default function ReportQueue({ reports }: ReportQueueProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-mint';
    if (score >= 0.7) return 'text-amber-500';
    return 'text-fuchsia';
  };

  return (
    <div className="bg-white border border-stone rounded-[10px] overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">
              Persona
            </th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">
              Confidence
            </th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-charcoal/60">
              Date
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-stone/10">
              <td className="px-6 py-4 text-charcoal">{report.name}</td>
              <td className="px-6 py-4 text-charcoal/70 capitalize">{report.persona}</td>
              <td className={`px-6 py-4 font-medium ${getConfidenceColor(report.confidenceScore)}`}>
                {(report.confidenceScore * 100).toFixed(0)}%
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex px-2 py-1 text-xs rounded-full bg-stone/30 text-charcoal">
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 text-charcoal/60 text-sm">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/reports/${report.id}`}
                  className="text-fuchsia hover:underline text-sm"
                >
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
