import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateToken } from '@/lib/utils';

interface SubmitRequest {
  persona: 'launcher' | 'builder' | 'architect';
  answers: Record<string, string | string[]>;
}

export async function POST(request: Request) {
  try {
    const body: SubmitRequest = await request.json();
    const { persona, answers } = body;

    // Validate required fields
    if (!persona || !['launcher', 'builder', 'architect'].includes(persona)) {
      return NextResponse.json(
        { error: 'Invalid persona' },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Extract name and email from contact field (JSON string)
    let name: string | null = null;
    let email: string | null = null;

    const contactField = answers.contact;
    if (typeof contactField === 'string') {
      try {
        const parsed = JSON.parse(contactField);
        name = parsed.name || null;
        email = parsed.email || null;
      } catch {
        // Fall back to direct fields if contact parsing fails
        name = answers.name as string || null;
        email = answers.email as string || null;
      }
    } else {
      // Legacy: direct name/email fields
      name = answers.name as string || null;
      email = answers.email as string || null;
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = `rk_${generateToken(12)}`;

    // Save submission to database
    const [submission] = await query<{ id: string; token: string }>(
      `INSERT INTO reckonings (token, persona, answers, name, email, status)
       VALUES ($1, $2, $3, $4, $5, 'generating')
       RETURNING id, token`,
      [token, persona, JSON.stringify(answers), name, email]
    );

    // Trigger report generation asynchronously
    // Don't await - let it run in background
    triggerReportGeneration(submission.id, submission.token, persona, answers, email);

    return NextResponse.json({
      success: true,
      token: submission.token,
      message: 'Your Reckoning is being prepared',
    });

  } catch (error) {
    console.error('Questionnaire submit error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Submission failed' },
      { status: 500 }
    );
  }
}

async function triggerReportGeneration(
  id: string,
  token: string,
  persona: string,
  answers: Record<string, string | string[]>,
  email: string
) {
  try {
    // Call the reckoning generation endpoint
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/reckoning/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reckoningId: id,
        token,
        persona,
        answers,
        email,
      }),
    });
  } catch (error) {
    console.error('Failed to trigger report generation:', error);
    // The report page will show appropriate status
  }
}
