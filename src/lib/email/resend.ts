import { Resend } from 'resend';

// Default sender
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Reckoning <hello@rkng.io>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@rkng.io';

// Lazy-initialize Resend client (only when API key is available)
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const client = getResendClient();

  // Log email in dev mode without Resend
  if (!client) {
    console.log('Sending email:', {
      to: options.to,
      subject: options.subject,
      from: FROM_EMAIL,
    });
    console.log('HTML length:', options.html.length);
    return { success: true, id: 'dev-mode-no-resend' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || ADMIN_EMAIL,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Error sending email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendAdminNotification(options: Omit<EmailOptions, 'to'>): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmail({
    ...options,
    to: ADMIN_EMAIL,
  });
}

export { getResendClient };
