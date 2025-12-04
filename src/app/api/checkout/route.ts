import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { getServiceById } from '@/lib/data/service-catalogue';
import { BUNDLES } from '@/lib/data/bundles';

interface CartItem {
  id: string;
  type: 'service' | 'bundle';
  name: string;
  price: number;
  serviceIds?: string[];
}

interface CheckoutRequest {
  items: CartItem[];
  customerEmail?: string;
  customerName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, customerEmail, customerName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate and build line items
    const lineItems = items.map(item => {
      // Validate pricing matches our catalogue
      if (item.type === 'bundle') {
        const bundle = BUNDLES.find(b => b.id === item.id);
        if (!bundle) {
          throw new Error(`Invalid bundle: ${item.id}`);
        }
        if (bundle.bundlePrice !== item.price) {
          throw new Error(`Price mismatch for bundle: ${item.id}`);
        }
        return {
          price_data: {
            currency: 'gbp' as const,
            product_data: {
              name: bundle.name,
              description: `Bundle: ${bundle.tagline}`,
            },
            unit_amount: bundle.bundlePrice * 100, // Stripe uses pence
          },
          quantity: 1,
        };
      } else {
        const service = getServiceById(item.id);
        if (!service) {
          throw new Error(`Invalid service: ${item.id}`);
        }
        if (service.basePrice !== item.price) {
          throw new Error(`Price mismatch for service: ${item.id}`);
        }
        return {
          price_data: {
            currency: 'gbp' as const,
            product_data: {
              name: service.name,
              description: service.description,
            },
            unit_amount: service.basePrice * 100,
          },
          quantity: 1,
        };
      }
    });

    // Calculate discount if applicable
    const serviceCount = items.filter(i => i.type === 'service').length;
    let discountPercent = 0;
    if (serviceCount >= 6) discountPercent = 15;
    else if (serviceCount >= 4) discountPercent = 10;
    else if (serviceCount >= 2) discountPercent = 5;

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Apply discount coupon if eligible
    let discounts: { coupon: string }[] | undefined;
    if (discountPercent > 0) {
      const couponId = `MULTI_${discountPercent}`;
      try {
        await stripe.coupons.retrieve(couponId);
      } catch {
        // Coupon doesn't exist, create it
        await stripe.coupons.create({
          id: couponId,
          percent_off: discountPercent,
          duration: 'once',
          name: `Multi-service discount (${discountPercent}% off)`,
        });
      }
      discounts = [{ coupon: couponId }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/services`,
      metadata: {
        itemIds: items.map(i => i.id).join(','),
        itemTypes: items.map(i => i.type).join(','),
        customerName: customerName || '',
      },
      billing_address_collection: 'required',
      customer_email: customerEmail,
      discounts,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
