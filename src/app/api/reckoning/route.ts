import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompts/builder';
import { calculateConfidence } from '@/lib/validation/confidence';
import { generateReportPdf } from '@/lib/pdf/generator';
import { sendReportReadyEmail } from '@/lib/email/send';
import { 
  createReckoning, 
  getReckoningByToken, 
  updateReckoningReport,
  getSubmissionById,
} from '@/lib/db';
import { generateToken } from '@/lib/utils';
import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, regenerate, previousReckoningId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      );
    }

    // Fetch submission from database
    const submission = await getSubmissionById(submissionId);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Build the prompt
    const { systemPrompt, userMessage } = buildPrompt(submission as QuestionnaireSubmission);

    // Initialize Anthropic client
    const anthropic = new Anthropic();

    let report: ReckoningReport | null = null;
    let attempts = 0;
    let lastError: string | null = null;

    // Retry loop
    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from Claude');
        }

        // Parse JSON response
        // Handle potential markdown code blocks
        let jsonText = content.text.trim();
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        report = JSON.parse(jsonText) as ReckoningReport;

        // Validate and calculate confidence
        const confidence = calculateConfidence(report, submission as QuestionnaireSubmission);

        if (confidence.score === 0 && attempts < MAX_ATTEMPTS) {
          // Hard failure — retry
          console.log(`Attempt ${attempts} failed validation:`, confidence.flags);
          lastError = confidence.flags.join('; ');
          continue;
        }

        // Generate share token
        const shareToken = regenerate && previousReckoningId 
          ? (await getReckoningByToken(previousReckoningId))?.token || generateShareToken()
          : generateShareToken();

        // Store in database
        const reckoning = await createReckoning(
          shareToken,
          report.meta.persona,
          submission.answers as Record<string, unknown>,
          submission.answers.name as string,
          submission.email
        );

        // Update with report data
        await updateReckoningReport(
          shareToken,
          report as unknown as Record<string, unknown>,
          confidence.score
        );

        // If auto-approved, generate PDF and send email
        if (confidence.autoApprove) {
          try {
            // Generate PDF (async, don't wait)
            generateReportPdf(
              report,
              report.recipient.name,
              { includeServices: true }
            ).catch(err => console.error('PDF generation failed:', err));

            // Send email
            await sendReportReadyEmail({
              name: report.recipient.name,
              email: submission.email,
              reportUrl: `${process.env.NEXT_PUBLIC_URL}/reckoning/${shareToken}`,
            });
          } catch (emailError) {
            console.error('Email/PDF failed:', emailError);
            // Don't fail the request for email issues
          }
        } else {
          // Queue for admin review
          await notifyAdminPendingReview(shareToken, confidence.flags);
        }

        return NextResponse.json({
          success: true,
          reckoningId: reckoning.id,
          shareToken,
          status: confidence.autoApprove ? 'ready' : 'pending_review',
          confidence: confidence.score,
          autoApproved: confidence.autoApprove,
          flags: confidence.flags,
        });

      } catch (parseError) {
        console.error(`Attempt ${attempts} parse error:`, parseError);
        lastError = parseError instanceof Error ? parseError.message : 'Parse error';
        
        if (attempts >= MAX_ATTEMPTS) {
          // Store failed attempt
          const failToken = generateShareToken();
          await createReckoning(
            failToken,
            submission.persona,
            submission.answers as Record<string, unknown>,
            submission.answers.name as string,
            submission.email
          );
          
          // Mark as failed with error log
          // TODO: Add error_log column update

          return NextResponse.json(
            { 
              error: 'Generation failed after maximum attempts',
              lastError,
            },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: 'Generation failed', lastError },
      { status: 500 }
    );

  } catch (error) {
    console.error('Reckoning API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateShareToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'rk_';
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

async function notifyAdminPendingReview(reckoningId: string, flags: string[]): Promise<void> {
  // TODO: Implement admin notification
  // Could use Resend, Slack webhook, etc.
  console.log(`Report ${reckoningId} needs review. Flags:`, flags);
}
