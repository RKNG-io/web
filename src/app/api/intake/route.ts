import { NextRequest, NextResponse } from 'next/server';
import { createIntakeRequest, IntakeRequest } from '@/lib/db';
import { sendEmail, sendAdminNotification } from '@/lib/email/resend';
import { intakeConfirmationEmail, adminIntakeNotificationEmail } from '@/lib/email/templates';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IntakeSubmission {
  type: 'website' | 'automations' | 'social';
  answers: Record<string, unknown>;
  name: string;
  email: string;
  contactPreference: 'quote' | 'call';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as IntakeSubmission;

    // Validate required fields
    if (!body.type || !body.answers || !body.name || !body.email || !body.contactPreference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate intake type
    if (!['website', 'automations', 'social'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid intake type' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate contact preference
    if (!['quote', 'call'].includes(body.contactPreference)) {
      return NextResponse.json(
        { error: 'Invalid contact preference' },
        { status: 400 }
      );
    }

    // Validate name length
    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name is too short' },
        { status: 400 }
      );
    }

    // Create the intake request
    const intake = await createIntakeRequest(
      body.type,
      body.answers,
      body.name.trim(),
      body.email.toLowerCase().trim(),
      body.contactPreference
    );

    // Send emails in the background (don't block response)
    const typeLabels = {
      website: 'Website',
      automations: 'Automation',
      social: 'Social Media',
    };

    // Send confirmation email to user
    sendEmail({
      to: body.email.toLowerCase().trim(),
      subject: `Got it  - we'll be in touch soon`,
      html: intakeConfirmationEmail({
        name: body.name.trim(),
        type: body.type,
        contactPreference: body.contactPreference,
      }),
    }).catch((err) => {
      console.error('Failed to send confirmation email:', err);
    });

    // Send notification to admin
    sendAdminNotification({
      subject: `New ${typeLabels[body.type]} Intake: ${body.name.trim()}`,
      html: adminIntakeNotificationEmail({
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        type: body.type,
        contactPreference: body.contactPreference,
        answers: body.answers,
        intakeId: intake.id,
      }),
    }).catch((err) => {
      console.error('Failed to send admin notification:', err);
    });

    return NextResponse.json({
      success: true,
      id: intake.id,
    });

  } catch (error) {
    console.error('Error creating intake request:', error);
    return NextResponse.json(
      { error: 'Failed to submit intake request' },
      { status: 500 }
    );
  }
}
