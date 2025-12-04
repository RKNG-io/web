import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/config';
import { query } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email/send';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    const { metadata, customer_details, amount_total, id: sessionId } = session;

    if (!metadata) {
      console.error('No metadata in session');
      return;
    }

    const itemIds = metadata.itemIds?.split(',') || [];
    const itemTypes = metadata.itemTypes?.split(',') || [];
    const customerName = metadata.customerName || customer_details?.name || 'Customer';
    const customerEmail = customer_details?.email;

    if (!customerEmail) {
      console.error('No customer email in session');
      return;
    }

    // Generate order ID
    const orderId = `RK-${Date.now().toString(36).toUpperCase()}`;

    // Save order to database
    await query(
      `INSERT INTO orders (
        id, stripe_session_id, customer_name, customer_email,
        item_ids, item_types, amount_total, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', NOW())`,
      [
        orderId,
        sessionId,
        customerName,
        customerEmail,
        JSON.stringify(itemIds),
        JSON.stringify(itemTypes),
        amount_total,
      ]
    );

    // Build items for email
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const items = lineItems.data.map(item => ({
      name: item.description || 'Service',
      price: (item.amount_total || 0) / 100,
    }));

    // Send confirmation email
    await sendOrderConfirmationEmail({
      name: customerName,
      email: customerEmail,
      orderId,
      items,
      total: (amount_total || 0) / 100,
    });

    console.log(`Order ${orderId} created for ${customerEmail}`);
  } catch (error) {
    console.error('Error handling checkout complete:', error);
  }
}
