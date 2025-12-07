import { NextResponse } from 'next/server';
import { updateIntakeStatus, type IntakeRequest } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const validStatuses: IntakeRequest['status'][] = ['new', 'quoted', 'converted', 'closed'];

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    await updateIntakeStatus(id, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating intake:', error);
    return NextResponse.json({ error: 'Failed to update intake' }, { status: 500 });
  }
}
