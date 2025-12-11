# Automation Catalogue

**Version:** 1.0.0

This document lists all automations currently available in the Reckoning system.

For the TypeScript implementation, see `src/data/automation-catalogue.ts`.

---

## Overview

| ID | Name | Category | Verticals | Price |
|----|------|----------|-----------|-------|
| `event-payment-links` | Event Payment Links | payments | events, fitness | £99 |
| `invoice-reminder-sequence` | Invoice Reminder Sequence | payments | all | £199 |
| `appointment-confirmation-reminder` | Appointment Confirmation + Reminder | scheduling | fitness, wellness | £149 |
| `no-show-followup` | No-Show Follow-up | communications | fitness, wellness | £99 |
| `quote-followup-sequence` | Quote Follow-up Sequence | communications | trades, events | £149 |
| `rebooking-prompt` | Rebooking Prompt | scheduling | fitness, wellness | £79 |
| `review-request` | Review Request | communications | all | £79 |
| `client-inactive-reengagement` | Client Re-engagement | communications | fitness, wellness | £149 |
| `session-complete-invoice` | Session Complete → Invoice | payments | fitness, wellness, trades | £179 |
| `deposit-reminder-sequence` | Deposit Reminder Sequence | payments | events, trades | £149 |

---

## By Category

### Scheduling

| Automation | Time Saved | Price |
|------------|------------|-------|
| Appointment Confirmation + Reminder | 3 hrs/week | £149 |
| Rebooking Prompt | 1 hr/week | £79 |

### Payments

| Automation | Time Saved | Price |
|------------|------------|-------|
| Event Payment Links | 2 hrs/week | £99 |
| Invoice Reminder Sequence | 2 hrs/week | £199 |
| Session Complete → Invoice | 2 hrs/week | £179 |
| Deposit Reminder Sequence | 2 hrs/week | £149 |

### Communications

| Automation | Time Saved | Price |
|------------|------------|-------|
| No-Show Follow-up | 1 hr/week | £99 |
| Quote Follow-up Sequence | 2 hrs/week | £149 |
| Review Request | 1 hr/week | £79 |
| Client Re-engagement | 1 hr/week | £149 |

---

## By Vertical

### Fitness

- Event Payment Links (£99)
- Appointment Confirmation + Reminder (£149)
- No-Show Follow-up (£99)
- Rebooking Prompt (£79)
- Client Re-engagement (£149)
- Session Complete → Invoice (£179)
- Invoice Reminder Sequence (£199)
- Review Request (£79)

### Wellness

- Appointment Confirmation + Reminder (£149)
- No-Show Follow-up (£99)
- Rebooking Prompt (£79)
- Client Re-engagement (£149)
- Session Complete → Invoice (£179)
- Invoice Reminder Sequence (£199)
- Review Request (£79)

### Trades

- Quote Follow-up Sequence (£149)
- Session Complete → Invoice (£179)
- Deposit Reminder Sequence (£149)
- Invoice Reminder Sequence (£199)
- Review Request (£79)

### Events

- Event Payment Links (£99)
- Quote Follow-up Sequence (£149)
- Deposit Reminder Sequence (£149)
- Invoice Reminder Sequence (£199)
- Review Request (£79)

---

## Automation Details

### Event Payment Links

**ID:** `event-payment-links`

Replace 10% platform fees with direct Stripe links via Linktree. Same payment flow, 1.5% instead of 10%.

| Property | Value |
|----------|-------|
| Category | payments |
| Verticals | events, fitness |
| Stages | building, established |
| Time Saved | 2 hrs/week |
| Cost Saved | 8.5% (platform fees) |
| Price | £99 |

**Trigger:** Manual (when creating an event)

**Steps:**
1. Create Stripe payment link
2. Add link to Linktree

**Integrations:** Stripe, Linktree

---

### Invoice Reminder Sequence

**ID:** `invoice-reminder-sequence`

Automatic payment reminders at 7, 14, and 21 days after invoice is created.

| Property | Value |
|----------|-------|
| Category | payments |
| Verticals | all |
| Stages | building, established |
| Time Saved | 2 hrs/week |
| Price | £199 |

**Trigger:** `invoice.created`

**Steps:**
1. Wait 7 days
2. If not paid → send reminder 1
3. Wait 7 days
4. If not paid → send reminder 2
5. Wait 7 days
6. If not paid → send final reminder

**Integrations:** Xero/QuickBooks/Stripe, Gmail/SMTP, Zapier/Make

---

### Appointment Confirmation + Reminder

**ID:** `appointment-confirmation-reminder`

Automatic confirmation when booked, reminder 24 hours before.

| Property | Value |
|----------|-------|
| Category | scheduling |
| Verticals | fitness, wellness |
| Stages | building, established |
| Time Saved | 3 hrs/week |
| Price | £149 |

**Trigger:** `appointment.created`

**Steps:**
1. Send confirmation email
2. Wait until 24h before appointment
3. Send reminder email
4. (Optional) Send reminder SMS

**Integrations:** Calendly/Acuity/Google Calendar, Gmail/SMTP, Twilio (optional), Zapier/Make

---

### No-Show Follow-up

**ID:** `no-show-followup`

Automatic follow-up when client doesn't show. Offers rebooking; optionally applies late-cancel fee.

| Property | Value |
|----------|-------|
| Category | communications |
| Verticals | fitness, wellness |
| Stages | building, established |
| Time Saved | 1 hr/week |
| Price | £99 |

**Trigger:** `appointment.no_show`

**Steps:**
1. Wait 1 hour
2. Send "we missed you" email
3. If late-cancel fee configured → create invoice

**Integrations:** Calendly/Acuity, Gmail/SMTP, Xero/Stripe (optional), Zapier/Make

---

### Quote Follow-up Sequence

**ID:** `quote-followup-sequence`

Automatic follow-ups at 2, 5, and 10 days after sending a quote.

| Property | Value |
|----------|-------|
| Category | communications |
| Verticals | trades, events |
| Stages | building, established |
| Time Saved | 2 hrs/week |
| Price | £149 |

**Trigger:** `quote.sent`

**Steps:**
1. Wait 2 days
2. If still open → send follow-up 1
3. Wait 3 days
4. If still open → send follow-up 2
5. Wait 5 days
6. If still open → send final follow-up

**Integrations:** Xero/QuickBooks, Gmail/SMTP, Zapier/Make

---

### Rebooking Prompt

**ID:** `rebooking-prompt`

Automatic "book your next session" email after appointment completes.

| Property | Value |
|----------|-------|
| Category | scheduling |
| Verticals | fitness, wellness |
| Stages | building, established |
| Time Saved | 1 hr/week |
| Price | £79 |

**Trigger:** `appointment.completed`

**Steps:**
1. Wait 2 hours
2. Send rebooking prompt email

**Integrations:** Calendly/Acuity/Google Calendar, Gmail/SMTP, Zapier/Make

---

### Review Request

**ID:** `review-request`

Automatic review request after service completion.

| Property | Value |
|----------|-------|
| Category | communications |
| Verticals | all |
| Stages | building, established |
| Time Saved | 1 hr/week |
| Price | £79 |

**Trigger:** `appointment.completed`

**Steps:**
1. Wait 1 day
2. Send review request email with link

**Integrations:** Calendly/Acuity/Google Calendar, Gmail/SMTP, Zapier/Make

---

### Client Re-engagement

**ID:** `client-inactive-reengagement`

Automatic "we miss you" email when client hasn't booked in 4+ weeks.

| Property | Value |
|----------|-------|
| Category | communications |
| Verticals | fitness, wellness |
| Stages | building, established |
| Time Saved | 1 hr/week |
| Price | £149 |

**Trigger:** Weekly schedule

**Steps:**
1. Find clients with no appointment in 4+ weeks
2. Send re-engagement email

**Integrations:** Calendly/Acuity, Gmail/SMTP, Zapier/Make

---

### Session Complete → Invoice

**ID:** `session-complete-invoice`

Automatic invoice sent immediately when session completes.

| Property | Value |
|----------|-------|
| Category | payments |
| Verticals | fitness, wellness, trades |
| Stages | building, established |
| Time Saved | 2 hrs/week |
| Price | £179 |

**Trigger:** `appointment.completed`

**Steps:**
1. Create invoice in accounting system
2. Send invoice email to customer

**Integrations:** Calendly/Acuity/Google Calendar, Xero/QuickBooks/Stripe, Gmail/SMTP, Zapier/Make

---

### Deposit Reminder Sequence

**ID:** `deposit-reminder-sequence`

Automatic reminders for deposit invoices until paid.

| Property | Value |
|----------|-------|
| Category | payments |
| Verticals | events, trades |
| Stages | building, established |
| Time Saved | 2 hrs/week |
| Price | £149 |

**Trigger:** `invoice.created` (when description contains "deposit")

**Steps:**
1. Wait 3 days
2. If not paid → send deposit reminder 1
3. Wait 4 days
4. If not paid → send final deposit reminder

**Integrations:** Xero/QuickBooks/Stripe, Gmail/SMTP, Zapier/Make

---

## Adding New Automations

See [Extension Guide](./extension-guide.md) for how to add new automations to the catalogue.

Key steps:
1. Define the automation in `src/data/automation-catalogue.ts`
2. Add documentation to this file
3. Ensure time_sinks map to intake options in `src/lib/matcher.ts`
4. Test matching with sample intake answers

---

*Back to: [Schema Overview](./README.md)*
