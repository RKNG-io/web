import { NextResponse } from 'next/server';
import { getReckoningByToken } from '@/lib/db';

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const reckoning = await getReckoningByToken(token);

    if (!reckoning) {
      return NextResponse.json(
        { error: 'Reckoning not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: reckoning.status,
      hasReport: !!reckoning.report,
      confidenceScore: reckoning.confidence_score,
      createdAt: reckoning.created_at,
      completedAt: reckoning.completed_at,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
