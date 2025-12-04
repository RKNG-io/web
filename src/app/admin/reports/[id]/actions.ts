'use server';

import { revalidatePath } from 'next/cache';
import { 
  getReckoningById, 
  updateReckoningStatus, 
  markReckoningReviewed,
  updateReckoningReport2,
  setReckoningPdfUrl,
  getSubmissionById,
} from '@/lib/db';
import { generateReportPdf } from '@/lib/pdf/generator';
import { sendReportReadyEmail } from '@/lib/email/send';
import { calculateConfidence } from '@/lib/validation/confidence';
import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

export async function approveReport(reckoningId: string) {
  const reckoning = await getReckoningById(reckoningId);
  
  if (!reckoning) {
    throw new Error('Reckoning not found');
  }

  const report = reckoning.report as unknown as ReckoningReport;

  // Generate PDF if not exists
  if (!reckoning.pdf_url) {
    try {
      const pdfBuffer = await generateReportPdf(
        report,
        report.recipient.name,
        { includeServices: true }
      );
      // TODO: Upload PDF to storage and get URL
      // For now, just mark as generated
      console.log('PDF generated, size:', pdfBuffer.length);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }

  // Update status
  await updateReckoningStatus(reckoningId, 'ready');
  await markReckoningReviewed(reckoningId, 'admin');

  // Send email
  if (reckoning.email) {
    try {
      await sendReportReadyEmail({
        name: report.recipient.name,
        email: reckoning.email,
        reportUrl: `${process.env.NEXT_PUBLIC_URL}/reckoning/${reckoning.token}`,
      });
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }

  revalidatePath('/admin/reports');
  revalidatePath(`/admin/reports/${reckoningId}`);
}

export async function regenerateReport(reckoningId: string) {
  const reckoning = await getReckoningById(reckoningId);
  
  if (!reckoning) {
    throw new Error('Reckoning not found');
  }

  // Mark as regenerating
  await updateReckoningStatus(reckoningId, 'generating');

  // Trigger regeneration via API
  // This is a simplified version - in production you might use a queue
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reckoning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: reckoning.id, // Assuming reckoning ID can be used
        regenerate: true,
        previousReckoningId: reckoningId,
      }),
    });

    if (!response.ok) {
      throw new Error('Regeneration API failed');
    }
  } catch (error) {
    console.error('Regeneration failed:', error);
    await updateReckoningStatus(reckoningId, 'failed');
    throw error;
  }

  revalidatePath('/admin/reports');
  revalidatePath(`/admin/reports/${reckoningId}`);
}

export async function updateReport(
  reckoningId: string, 
  updates: Partial<ReckoningReport>
) {
  const reckoning = await getReckoningById(reckoningId);
  
  if (!reckoning) {
    throw new Error('Reckoning not found');
  }

  const currentReport = reckoning.report as unknown as ReckoningReport;
  
  // Merge updates
  const updatedReport: ReckoningReport = {
    ...currentReport,
    ...updates,
    sections: {
      ...currentReport.sections,
      ...(updates.sections || {}),
    },
    recommendations: {
      ...currentReport.recommendations,
      ...(updates.recommendations || {}),
    },
  };

  // Re-validate
  // Note: We'd need the original submission for proper validation
  // For now, we'll just save the update
  await updateReckoningReport2(
    reckoningId, 
    updatedReport as unknown as Record<string, unknown>,
    'admin'
  );

  revalidatePath(`/admin/reports/${reckoningId}`);
}

export async function archiveReport(reckoningId: string) {
  await updateReckoningStatus(reckoningId, 'failed'); // Using 'failed' as archived
  
  revalidatePath('/admin/reports');
  revalidatePath(`/admin/reports/${reckoningId}`);
}
