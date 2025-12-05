// Email sending via Resend
import { sendEmail as sendResendEmail, sendAdminNotification } from './resend';
import { reckoningCompleteEmail, reckoningFlaggedEmail } from './templates';

interface ReportEmailData {
  name: string;
  email: string;
  reportUrl: string;
}

interface OrderConfirmationData {
  name: string;
  email: string;
  orderId: string;
  items: Array<{ name: string; price: number }>;
  total: number;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const result = await sendResendEmail(options);
  return result.success;
}

export async function sendReportReadyEmail(data: ReportEmailData): Promise<boolean> {
  const { name, email, reportUrl } = data;

  // Extract token from URL
  const token = reportUrl.split('/reckoning/')[1] || '';

  const result = await sendResendEmail({
    to: email,
    subject: `${name}, your Reckoning is ready`,
    html: reckoningCompleteEmail({
      name,
      token,
    }),
  });

  return result.success;
}

export async function sendReportFlaggedNotification(data: {
  id: string;
  token: string;
  name?: string;
  email?: string;
  persona: string;
  confidenceScore: number;
  validationFlags: string[];
}): Promise<boolean> {
  const result = await sendAdminNotification({
    subject: `Report flagged for review (${data.confidenceScore}% confidence)`,
    html: reckoningFlaggedEmail(data),
  });

  return result.success;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData
): Promise<boolean> {
  const { name, email, orderId, items, total } = data;

  const itemsHtml = items
    .map((item) => `<li style="padding: 8px 0; border-bottom: 1px solid #F2F6F9;">${item.name} — £${item.price}</li>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #2d2926; margin: 0; padding: 0; background-color: #F2F6F9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: #ffffff; border-radius: 10px; padding: 40px; margin-bottom: 20px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #D14BA8; font-weight: 600; margin-bottom: 8px;">Order confirmed</div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 20px; color: #2d2926;">Thanks, ${name}.</h1>
      <p style="color: #666; margin-bottom: 16px;">Order #${orderId}</p>

      <h2 style="font-size: 18px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #2d2926;">What you ordered:</h2>
      <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">${itemsHtml}</ul>

      <div style="background: #B6E2D3; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: 600; font-size: 18px; color: #2d2926;">Total: £${total}</p>
      </div>

      <p style="color: #666; margin-top: 24px;">We'll be in touch within 24 hours to kick things off.</p>
    </div>
    <div style="text-align: center; font-size: 14px; color: #666; padding: 20px;">
      <p>Questions? Reply to this email or contact <a href="mailto:hello@rkng.io" style="color: #D14BA8;">hello@rkng.io</a></p>
      <p>Reckoning | <a href="https://rkng.io" style="color: #D14BA8;">rkng.io</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const result = await sendResendEmail({
    to: email,
    subject: `Order confirmed: #${orderId}`,
    html,
  });

  return result.success;
}
