# Integrations

**Version:** 1.0.0

This document defines the integration categories and supported tools in the Reckoning automation system.

---

## Overview

Integrations are grouped by category. Each automation specifies which categories it needs, and which specific tools within those categories are supported.

```yaml
integrations:
  accounting: [xero, quickbooks, stripe]
  email: [gmail, smtp]
  automation: [zapier, make]
```

---

## Integration Categories

| Category | Purpose | Common Tools |
|----------|---------|--------------|
| `calendar` | Bookings, scheduling | Calendly, Acuity, Google Calendar |
| `accounting` | Invoices, quotes, payments | Xero, QuickBooks, FreshBooks |
| `payments` | Payment processing | Stripe |
| `email` | Sending emails | Gmail, SMTP, Mailchimp |
| `sms` | Sending SMS | Twilio, MessageBird |
| `automation` | Workflow orchestration | Zapier, Make, n8n |
| `crm` | Contact management | HubSpot, Pipedrive |
| `link_in_bio` | Link pages | Linktree, Beacons |
| `forms` | Form submissions | Typeform, Google Forms |
| `storage` | Data storage | Google Sheets, Airtable, Notion |

---

## Calendar Integrations

Tools for booking and scheduling.

### Calendly

**Capabilities:**
- Trigger on: `appointment.created`, `appointment.cancelled`
- Read: appointment details, customer info
- Not supported: creating appointments via API

**Required scopes:** Read events, webhooks

**Event mapping:**

| Calendly Event | Reckoning Event |
|----------------|-----------------|
| `invitee.created` | `appointment.created` |
| `invitee.canceled` | `appointment.cancelled` |

### Acuity Scheduling

**Capabilities:**
- Trigger on: `appointment.created`, `appointment.cancelled`, `appointment.completed`, `appointment.no_show`
- Read: appointment details, customer info
- Write: update appointment status

**Required scopes:** Read appointments, webhooks, update appointments

### Google Calendar

**Capabilities:**
- Trigger on: `appointment.created`, `appointment.updated`
- Read: event details
- Write: create events, update events

**Required scopes:** `calendar.events`, `calendar.events.readonly`

---

## Accounting Integrations

Tools for invoicing and financial management.

### Xero

**Capabilities:**
- Trigger on: `invoice.created`, `invoice.sent`, `invoice.paid`, `quote.sent`, `quote.accepted`
- Read: invoices, quotes, contacts
- Write: create invoices, create quotes, update status

**Required scopes:** `accounting.transactions`, `accounting.contacts`

**Entity mapping:**

| Xero Field | Reckoning Field |
|------------|-----------------|
| `InvoiceNumber` | `invoice_number` |
| `Contact` | `customer` |
| `AmountDue` | `amount_due` |
| `DueDate` | `due_date` |
| `Status` | `status` |

**Status mapping:**

| Xero Status | Reckoning Status |
|-------------|------------------|
| `DRAFT` | `draft` |
| `SUBMITTED` | `open` |
| `AUTHORISED` | `open` |
| `PAID` | `paid` |
| `VOIDED` | `void` |

### QuickBooks Online

**Capabilities:**
- Trigger on: `invoice.created`, `invoice.paid`
- Read: invoices, customers
- Write: create invoices

**Required scopes:** `com.intuit.quickbooks.accounting`

### Stripe Invoicing

**Capabilities:**
- Trigger on: `invoice.created`, `invoice.paid`, `invoice.payment_failed`
- Read: invoices, customers
- Write: create invoices, create payment links

**Entity mapping:**

| Stripe Field | Reckoning Field |
|--------------|-----------------|
| `number` | `invoice_number` |
| `customer` | `customer` |
| `amount_due` | `amount_due` |
| `due_date` | `due_date` |
| `status` | `status` |

---

## Payment Integrations

### Stripe

**Capabilities:**
- Actions: `create_payment_link`
- Trigger on: `payment.received`, `payment.failed`
- Read: payment status, customer info

**Outputs from actions:**

| Action | Output Variable |
|--------|-----------------|
| `create_payment_link` | `{{stripe.payment_link_url}}` |

**Required scopes:** `payment_links.write`, `payments.read`

---

## Email Integrations

### Gmail

**Capabilities:**
- Actions: `send_email`
- Read: (not typically needed)

**Requirements:** OAuth connection, send-as permissions

### SMTP

**Capabilities:**
- Actions: `send_email`

**Configuration:**
- SMTP host
- Port
- Username
- Password or API key
- From address

### Mailchimp Transactional (Mandrill)

**Capabilities:**
- Actions: `send_email`
- Templates: Supports Mailchimp template IDs

---

## SMS Integrations

### Twilio

**Capabilities:**
- Actions: `send_sms`
- Read: delivery status

**Configuration:**
- Account SID
- Auth token
- From number

**Constraints:**
- Message length: 160 chars (standard), 1600 chars (concatenated)
- Rate limits apply

---

## Automation Platforms

These are orchestration tools that connect other integrations.

### Zapier

**Use case:** When native integration isn't available, build the automation as a Zap.

**Reckoning outputs:**
- Automation definitions can be exported as Zap templates
- Customer variables are mapped to Zap input fields

### Make (formerly Integromat)

**Use case:** More complex automation logic, better for multi-step workflows.

**Reckoning outputs:**
- Automation definitions can be exported as Make scenarios
- Supports branching and complex conditions

### n8n

**Use case:** Self-hosted option, full control over data.

**Reckoning outputs:**
- Automation definitions can be exported as n8n workflow JSON

---

## Link-in-Bio Integrations

### Linktree

**Capabilities:**
- Actions: `add_to_linktree`
- Read: current links

**Outputs from actions:**

| Action | Output Variable |
|--------|-----------------|
| `add_to_linktree` | `{{linktree.profile_url}}` |

**Configuration:**
- API token
- Profile ID

---

## Form Integrations

### Typeform

**Capabilities:**
- Trigger on: `form.submitted`
- Read: form responses

### Google Forms

**Capabilities:**
- Trigger on: `form.submitted`
- Read: form responses

---

## Storage Integrations

### Google Sheets

**Capabilities:**
- Actions: `update_record` (add row, update row)
- Read: sheet data

**Use case:** Simple CRM, tracking log, export destination

### Airtable

**Capabilities:**
- Actions: `update_record`
- Trigger on: record created/updated
- Read: table data

### Notion

**Capabilities:**
- Actions: `update_record` (create page, update properties)
- Read: database items

---

## Integration Requirements

When defining an automation, specify integrations like this:

```yaml
integrations:
  # Category: list of supported tools
  accounting: [xero, quickbooks]
  email: [gmail, smtp]
  automation: [zapier, make]
```

The automation can be deployed if the customer has **at least one** tool from each required category.

### Optional Integrations

Some steps may be optional:

```yaml
- type: action
  action: send_sms
  tool: sms
  optional: true  # Automation still works without SMS
  config:
    to: "{{customer.telephone}}"
    message: "Reminder..."
```

---

## Adding New Integrations

See the [Extension Guide](./extension-guide.md) for how to add support for new tools.

Key steps:
1. Define the category (or use existing)
2. Document capabilities (triggers, actions, read/write)
3. Map fields to Reckoning schema
4. Add to the catalogue of supported tools

---

*Next: [Extension Guide](./extension-guide.md)*
