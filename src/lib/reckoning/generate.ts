// Core report generation logic
// Used by both /api/reckoning and /api/reckoning/generate routes

import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompts/builder';
import { calculateConfidence } from '@/lib/validation/confidence';
import { generateReportPdf } from '@/lib/pdf/generator';
import { sendReportReadyEmail, sendReportFlaggedNotification } from '@/lib/email/send';
import {
  updateReckoningReport,
  setReckoningPdfUrl,
  setReckoningPdfStatus,
  query,
} from '@/lib/db';
import type { ReckoningReport, QuestionnaireSubmission, ConfidenceResult } from '@/types/report';

// AI model  - configurable via env var
const AI_MODEL = process.env.AI_MODEL || 'claude-sonnet-4-20250514';
const MAX_ATTEMPTS = 3;

export interface GenerateReportInput {
  reckoningId: string;
  token: string;
  persona: 'launcher' | 'builder' | 'architect';
  answers: Record<string, string | string[]>;
  email: string;
  name?: string;
}

export interface GenerateReportResult {
  success: boolean;
  token: string;
  status: 'ready' | 'pending_review' | 'failed';
  confidence?: number;
  flags?: string[];
  error?: string;
}

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportResult> {
  const { reckoningId, token, persona, answers, email, name } = input;

  // Create submission object for prompt builder
  const submission: QuestionnaireSubmission = {
    id: reckoningId,
    persona,
    answers,
    email,
    created_at: new Date().toISOString(),
  };

  // Build the prompt
  const { systemPrompt, userMessage } = buildPrompt(submission);

  // Initialise Anthropic client
  const anthropic = new Anthropic();

  let report: ReckoningReport | null = null;
  let attempts = 0;
  let lastError: string | null = null;
  let confidence: ConfidenceResult | null = null;

  // Retry loop
  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    // Update attempt count
    await query(
      'UPDATE reckonings SET generation_attempts = $1 WHERE id = $2',
      [attempts, reckoningId]
    );

    try {
      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Parse JSON response
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      report = JSON.parse(jsonText) as ReckoningReport;

      // Validate and calculate confidence
      confidence = calculateConfidence(report, submission);

      if (confidence.score === 0 && attempts < MAX_ATTEMPTS) {
        console.log(`Attempt ${attempts} failed validation:`, confidence.flags);
        lastError = confidence.flags.join('; ');
        continue;
      }

      // Update database with report
      const status = confidence.autoApprove ? 'ready' : 'pending_review';

      await updateReckoningReport(
        token,
        report as unknown as Record<string, unknown>,
        confidence.score
      );

      // Also update validation flags
      await query(
        'UPDATE reckonings SET validation_flags = $1 WHERE token = $2',
        [JSON.stringify(confidence.flags), token]
      );

      // Handle post-generation tasks
      if (confidence.autoApprove) {
        await handleAutoApproved(reckoningId, token, report, email);
      } else {
        await handlePendingReview(reckoningId, token, report, email, persona, confidence);
      }

      return {
        success: true,
        token,
        status,
        confidence: confidence.score,
        flags: confidence.flags,
      };

    } catch (parseError) {
      console.error(`Attempt ${attempts} error:`, parseError);
      lastError = parseError instanceof Error ? parseError.message : 'Parse error';

      if (attempts >= MAX_ATTEMPTS) {
        // Mark as failed
        await query(
          `UPDATE reckonings
           SET status = 'failed', error_log = $1
           WHERE id = $2`,
          [lastError, reckoningId]
        );

        return {
          success: false,
          token,
          status: 'failed',
          error: lastError,
        };
      }
    }
  }

  return {
    success: false,
    token,
    status: 'failed',
    error: lastError || 'Generation failed after maximum attempts',
  };
}

async function handleAutoApproved(
  reckoningId: string,
  token: string,
  report: ReckoningReport,
  email: string
): Promise<void> {
  // Generate PDF with proper error tracking
  setReckoningPdfStatus(reckoningId, 'generating').catch(() => {});

  generateReportPdf(report, report.recipient.name, { includeServices: true })
    .then(async () => {
      // TODO: Upload to storage and get URL
      const pdfUrl = `${process.env.NEXT_PUBLIC_URL}/api/reckoning/pdf/${token}`;
      await setReckoningPdfUrl(reckoningId, pdfUrl);
    })
    .catch(async (err) => {
      console.error('PDF generation failed:', err);
      await setReckoningPdfStatus(
        reckoningId,
        'failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    });

  // Send email regardless of PDF status
  try {
    await sendReportReadyEmail({
      name: report.recipient.name,
      email,
      reportUrl: `${process.env.NEXT_PUBLIC_URL}/reckoning/${token}`,
    });
  } catch (emailError) {
    console.error('Email send failed:', emailError);
  }
}

async function handlePendingReview(
  reckoningId: string,
  token: string,
  report: ReckoningReport,
  email: string,
  persona: string,
  confidence: ConfidenceResult
): Promise<void> {
  try {
    await sendReportFlaggedNotification({
      id: reckoningId,
      token,
      name: report.recipient.name,
      email,
      persona,
      confidenceScore: Math.round(confidence.score),
      validationFlags: confidence.flags,
    });
  } catch (error) {
    console.error('Failed to notify admin:', error);
  }
}
