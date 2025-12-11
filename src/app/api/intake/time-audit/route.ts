import { NextRequest, NextResponse } from 'next/server'
import { createDiagnostic } from '@/lib/db'
import { matchAutomations } from '@/lib/matcher'
import { sendEmail, sendAdminNotification } from '@/lib/email/resend'
import type { IntakeAnswers, BusinessStage, Vertical } from '@/types/automation'
import { randomBytes } from 'crypto'

/**
 * Time Audit Intake API
 *
 * Receives intake form answers, runs the matcher, saves the diagnostic,
 * and returns a token for viewing results.
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 * @see src/lib/matcher.ts
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const VALID_STAGES: BusinessStage[] = ['launching', 'building', 'established']
const VALID_VERTICALS: Vertical[] = ['fitness', 'wellness', 'trades', 'events']

function generateToken(): string {
  return randomBytes(16).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IntakeAnswers

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!body.business || typeof body.business !== 'string' || body.business.trim().length < 1) {
      return NextResponse.json({ error: 'Business description is required' }, { status: 400 })
    }

    if (!body.stage || !VALID_STAGES.includes(body.stage)) {
      return NextResponse.json({ error: 'Valid business stage is required' }, { status: 400 })
    }

    if (!body.hours_per_week || typeof body.hours_per_week !== 'number' || body.hours_per_week < 1) {
      return NextResponse.json({ error: 'Hours per week is required' }, { status: 400 })
    }

    if (!Array.isArray(body.time_sinks) || body.time_sinks.length === 0) {
      return NextResponse.json({ error: 'At least one time sink is required' }, { status: 400 })
    }

    if (!Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json({ error: 'At least one tool is required' }, { status: 400 })
    }

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Validate source_vertical if provided
    if (body.source_vertical && !VALID_VERTICALS.includes(body.source_vertical)) {
      return NextResponse.json({ error: 'Invalid source vertical' }, { status: 400 })
    }

    // Run the matcher
    const matches = matchAutomations(body, 3)

    // Generate a token for the diagnostic URL
    const token = generateToken()

    // Prepare match data for storage
    const matchData = matches.map((m) => ({
      automation_id: m.automation.id,
      score: m.score,
      match_reasons: m.match_reasons,
    }))

    // Save to database
    const diagnostic = await createDiagnostic(
      token,
      body.name.trim(),
      body.email.toLowerCase().trim(),
      body.business.trim(),
      body.stage,
      body.hours_per_week,
      body.time_sinks,
      body.biggest_frustration || '',
      body.tools,
      body.source_vertical || null,
      matchData
    )

    // Send emails in the background
    const diagnosticUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/diagnostic/${token}`

    // User confirmation email
    sendEmail({
      to: body.email.toLowerCase().trim(),
      subject: 'Your Time Audit Results Are Ready',
      html: generateUserEmail(body.name.trim(), diagnosticUrl),
    }).catch((err) => {
      console.error('Failed to send user email:', err)
    })

    // Admin notification
    sendAdminNotification({
      subject: `New Time Audit: ${body.name.trim()} (${body.business.trim()})`,
      html: generateAdminEmail(body, matches, diagnosticUrl),
    }).catch((err) => {
      console.error('Failed to send admin notification:', err)
    })

    return NextResponse.json({
      success: true,
      token,
      id: diagnostic.id,
    })
  } catch (error) {
    console.error('Error processing time audit:', error)
    return NextResponse.json({ error: 'Failed to process time audit' }, { status: 500 })
  }
}

function generateUserEmail(name: string, url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d2926; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">Reckoning</h1>
  </div>

  <p>Hey ${name},</p>

  <p>Your time audit is ready. We've matched your answers to our automation catalogue and found some opportunities to get your time back.</p>

  <div style="text-align: center; margin: 32px 0;">
    <a href="${url}" style="display: inline-block; background-color: #D14BA8; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 500;">
      See My Results
    </a>
  </div>

  <p>This link is unique to you. Bookmark it if you want to come back later.</p>

  <p style="color: #666; font-size: 14px; margin-top: 32px;">
    Questions? Just reply to this email.
  </p>

  <p style="margin-top: 32px;">
    Reckoning<br>
    <span style="color: #666;">We find what's costing you time.</span>
  </p>
</body>
</html>
`
}

function generateAdminEmail(
  answers: IntakeAnswers,
  matches: ReturnType<typeof matchAutomations>,
  url: string
): string {
  const matchList = matches
    .map(
      (m) => `
    <li style="margin-bottom: 12px;">
      <strong>${m.automation.name}</strong> (Score: ${m.score})<br>
      <span style="color: #666; font-size: 14px;">${m.match_reasons.join(', ')}</span>
    </li>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d2926; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #D14BA8; margin-bottom: 24px;">New Time Audit Submission</h2>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.email}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Business</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.business}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Stage</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.stage}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Hours/week</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.hours_per_week}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time sinks</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.time_sinks.join(', ')}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tools</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${answers.tools.join(', ')}</td>
    </tr>
    ${answers.source_vertical ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">/for/${answers.source_vertical}</td></tr>` : ''}
  </table>

  ${answers.biggest_frustration ? `<div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;"><strong>Biggest frustration:</strong><br>${answers.biggest_frustration}</div>` : ''}

  <h3 style="margin-bottom: 12px;">Matched Automations</h3>
  <ul style="padding-left: 20px; margin-bottom: 24px;">
    ${matchList || '<li>No matches found</li>'}
  </ul>

  <a href="${url}" style="display: inline-block; background-color: #2d2926; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
    View Diagnostic
  </a>
</body>
</html>
`
}
