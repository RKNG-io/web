import { NextResponse } from 'next/server';
import { generateReport, GenerateReportInput } from '@/lib/reckoning/generate';
import { getSubmissionById, getReckoningByToken } from '@/lib/db';

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

    // Get existing token if regenerating, otherwise use submission id
    let token: string;
    if (regenerate && previousReckoningId) {
      const existing = await getReckoningByToken(previousReckoningId);
      token = existing?.token || generateShareToken();
    } else {
      token = generateShareToken();
    }

    const input: GenerateReportInput = {
      reckoningId: submission.id,
      token,
      persona: submission.persona as 'launcher' | 'builder' | 'architect',
      answers: submission.answers as Record<string, string | string[]>,
      email: submission.email,
    };

    const result = await generateReport(input);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reckoningId: submission.id,
      shareToken: result.token,
      status: result.status,
      confidence: result.confidence,
      autoApproved: result.status === 'ready',
      flags: result.flags,
    });

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
