import { NextResponse } from 'next/server';
import { updateOrderStatus, type Order } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const validStatuses: Order['status'][] = ['pending', 'paid', 'fulfilled', 'refunded'];

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

    await updateOrderStatus(id, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
