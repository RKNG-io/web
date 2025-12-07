import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { report, approve } = body;

    if (!report) {
      return NextResponse.json({ error: 'Report data required' }, { status: 400 });
    }

    // Update the report
    const updateFields = [
      'report = $2',
      'edited_at = NOW()',
      "edited_by = 'admin'",
    ];

    if (approve) {
      updateFields.push("status = 'ready'");
    }

    await query(
      `UPDATE reckonings SET ${updateFields.join(', ')} WHERE id = $1`,
      [id, JSON.stringify(report)]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
