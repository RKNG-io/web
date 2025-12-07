// Email templates for Reckoning
// All templates use brand colours and voice

const BRAND_COLOURS = {
  charcoal: '#2d2926',
  ice: '#F2F6F9',
  fuchsia: '#D14BA8',
  mint: '#B6E2D3',
  white: '#ffffff',
};

const baseStyles = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND_COLOURS.charcoal}; margin: 0; padding: 0; background-color: ${BRAND_COLOURS.ice}; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: ${BRAND_COLOURS.white}; border-radius: 10px; padding: 40px; margin-bottom: 20px; }
  h1 { font-size: 28px; font-weight: 600; margin-bottom: 20px; color: ${BRAND_COLOURS.charcoal}; }
  h2 { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: ${BRAND_COLOURS.charcoal}; }
  p { margin-bottom: 16px; color: ${BRAND_COLOURS.charcoal}; }
  .overline { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: ${BRAND_COLOURS.fuchsia}; font-weight: 600; margin-bottom: 8px; }
  .button { display: inline-block; background: ${BRAND_COLOURS.fuchsia}; color: ${BRAND_COLOURS.white}; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 500; }
  .footer { text-align: center; font-size: 14px; color: #666; padding: 20px; }
  .list-item { padding: 8px 0; border-bottom: 1px solid ${BRAND_COLOURS.ice}; }
  .highlight { background: ${BRAND_COLOURS.mint}; padding: 20px; border-radius: 8px; margin: 20px 0; }
`;

// ============================================
// Intake Confirmation (to user)
// ============================================

interface IntakeConfirmationData {
  name: string;
  type: 'website' | 'automations' | 'social';
  contactPreference: 'quote' | 'call';
}

export function intakeConfirmationEmail(data: IntakeConfirmationData): string {
  const typeLabels = {
    website: 'website',
    automations: 'automation',
    social: 'social media',
  };

  const nextStep = data.contactPreference === 'quote'
    ? "We'll send you a quote within 24 hours."
    : "We'll reach out within 24 hours to schedule a quick call.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We've got your request</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="overline">Got it</div>
      <h1>Thanks, ${data.name}.</h1>
      <p>We've received your ${typeLabels[data.type]} enquiry and we're on it.</p>
      <div class="highlight">
        <strong>What happens next:</strong>
        <p style="margin-bottom: 0;">${nextStep}</p>
      </div>
      <p>In the meantime, if you've got questions or want to add more details, just reply to this email.</p>
      <p> - The Reckoning team</p>
    </div>
    <div class="footer">
      <p>Reckoning | <a href="https://rkng.com" style="color: ${BRAND_COLOURS.fuchsia};">rkng.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================
// Admin Notification (to team)
// ============================================

interface AdminIntakeNotificationData {
  name: string;
  email: string;
  type: 'website' | 'automations' | 'social';
  contactPreference: 'quote' | 'call';
  answers: Record<string, unknown>;
  intakeId: string;
}

export function adminIntakeNotificationEmail(data: AdminIntakeNotificationData): string {
  const typeLabels = {
    website: 'Website',
    automations: 'Automation',
    social: 'Social Media',
  };

  const answersHtml = Object.entries(data.answers)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
      return `<div class="list-item"><strong>${key}:</strong> ${formattedValue}</div>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New ${typeLabels[data.type]} Intake</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="overline">New Intake</div>
      <h1>${typeLabels[data.type]} Request</h1>

      <h2>Contact</h2>
      <div class="list-item"><strong>Name:</strong> ${data.name}</div>
      <div class="list-item"><strong>Email:</strong> ${data.email}</div>
      <div class="list-item"><strong>Preference:</strong> ${data.contactPreference === 'quote' ? 'Send quote' : 'Book a call'}</div>

      <h2 style="margin-top: 24px;">Answers</h2>
      ${answersHtml}

      <p style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://rkng.com'}/admin/intakes/${data.intakeId}" class="button">View in Admin</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================
// Reckoning Complete (to user)
// ============================================

interface ReckoningCompleteData {
  name: string;
  token: string;
  headline?: string;
}

export function reckoningCompleteEmail(data: ReckoningCompleteData): string {
  const reportUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://rkng.com'}/reckoning/${data.token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Reckoning is ready</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="overline">It's ready</div>
      <h1>Your Reckoning, ${data.name}.</h1>
      <p>We've analysed your answers and put together a personalised diagnostic report for your business.</p>
      ${data.headline ? `<div class="highlight"><p style="margin: 0; font-style: italic;">"${data.headline}"</p></div>` : ''}
      <p>Your report includes:</p>
      <ul style="color: ${BRAND_COLOURS.charcoal}; padding-left: 20px;">
        <li>Where you are now (and what's working)</li>
        <li>What's blocking you from progress</li>
        <li>A clear path forward with prioritised steps</li>
        <li>The one thing to do first</li>
      </ul>
      <p style="margin-top: 24px;">
        <a href="${reportUrl}" class="button">View Your Report</a>
      </p>
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        This link is unique to you and doesn't expire. Save it somewhere safe.
      </p>
    </div>
    <div class="footer">
      <p>Questions? Reply to this email or contact <a href="mailto:hello@rkng.com" style="color: ${BRAND_COLOURS.fuchsia};">hello@rkng.com</a></p>
      <p>Reckoning | <a href="https://rkng.com" style="color: ${BRAND_COLOURS.fuchsia};">rkng.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================
// Admin: Reckoning Flagged for Review
// ============================================

interface ReckoningFlaggedData {
  id: string;
  token: string;
  name?: string;
  email?: string;
  persona: string;
  confidenceScore: number;
  validationFlags: string[];
}

export function reckoningFlaggedEmail(data: ReckoningFlaggedData): string {
  const flagsHtml = data.validationFlags
    .map(flag => `<div class="list-item" style="color: #c45d5d;">${flag}</div>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Flagged for Review</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card" style="border-left: 4px solid #c45d5d;">
      <div class="overline" style="color: #c45d5d;">Needs Review</div>
      <h1>Report Flagged</h1>

      <div class="list-item"><strong>Confidence Score:</strong> ${data.confidenceScore}%</div>
      <div class="list-item"><strong>Persona:</strong> ${data.persona}</div>
      ${data.name ? `<div class="list-item"><strong>Name:</strong> ${data.name}</div>` : ''}
      ${data.email ? `<div class="list-item"><strong>Email:</strong> ${data.email}</div>` : ''}

      <h2 style="margin-top: 24px;">Validation Issues</h2>
      ${flagsHtml || '<p>No specific flags recorded</p>'}

      <p style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://rkng.com'}/admin/reports/${data.id}" class="button">Review Report</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
