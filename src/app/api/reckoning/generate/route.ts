import { NextResponse } from 'next/server';
import { generateReport, GenerateReportInput } from '@/lib/reckoning/generate';

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

    // Validate required fields
    if (!reckoningId || !token || !persona || !answers || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const input: GenerateReportInput = {
      reckoningId,
      token,
      persona,
      answers,
      email,
    };

    const result = await generateReport(input);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Reckoning generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
