import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompts/builder';
import { calculateConfidence } from '@/lib/validation/confidence';
import { sendReportReadyEmail } from '@/lib/email/send';
import { query } from '@/lib/db';
import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

const MAX_ATTEMPTS = 3;

interface GenerateRequest {
  reckoningId: string;
  token: string;
  persona: 'launcher' | 'builder' | 'architect';
  answers: Record<string, string | string[]>;
  email: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { reckoningId, token, persona, answers, email } = body;

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

    // Initialize Anthropic client
    const anthropic = new Anthropic();

    let report: ReckoningReport | null = null;
    let attempts = 0;
    let lastError: string | null = null;

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
        let jsonText = content.text.trim();
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        report = JSON.parse(jsonText) as ReckoningReport;

        // Validate and calculate confidence
        const confidence = calculateConfidence(report, submission);

        if (confidence.score === 0 && attempts < MAX_ATTEMPTS) {
          console.log(`Attempt ${attempts} failed validation:`, confidence.flags);
          lastError = confidence.flags.join('; ');
          continue;
        }

        // Update database with report
        const status = confidence.autoApprove ? 'ready' : 'pending_review';
        
        await query(
          `UPDATE reckonings 
           SET report = $1, 
               confidence_score = $2, 
               validation_flags = $3,
               status = $4, 
               completed_at = NOW()
           WHERE id = $5`,
          [
            JSON.stringify(report),
            confidence.score,
            JSON.stringify(confidence.flags),
            status,
            reckoningId
          ]
        );

        // If auto-approved, send email
        if (confidence.autoApprove) {
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

        return NextResponse.json({
          success: true,
          token,
          status,
          confidence: confidence.score,
        });

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

          return NextResponse.json(
            { error: 'Generation failed', details: lastError },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: 'Generation failed', details: lastError },
      { status: 500 }
    );

  } catch (error) {
    console.error('Reckoning generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
