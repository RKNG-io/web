# Reckoning Automation Schema

**Version:** 1.0.0
**Last Updated:** December 2025

---

## Overview

This schema defines the data structures and terminology used throughout Reckoning's automation system. It enables:

- **Catalogue authoring** — Define automations in a consistent, machine-readable format
- **Matcher logic** — Select appropriate automations based on customer intake
- **Configurator** — Inject customer-specific variables into automation templates
- **Future: Automated delivery** — Generate deployment configs for Zapier, Make, n8n, or direct API integration

The schema draws from established standards where consensus exists:

| Domain | Sources |
|--------|---------|
| Contacts & Organisations | Schema.org, HubSpot CRM |
| Invoices & Payments | Stripe, Xero, Schema.org |
| Appointments & Scheduling | iCalendar (RFC 5545), Calendly |
| Workflow Automation | Zapier, Make, n8n |

---

## Schema Documents

| Document | Description |
|----------|-------------|
| [Entities](./entities.md) | Core data types: Contact, Appointment, Invoice, Quote, Message, Event, Provider |
| [Automations](./automations.md) | Workflow definitions: Triggers, Steps, Actions, Conditions |
| [Variables](./variables.md) | Variable interpolation syntax and available filters |
| [Integrations](./integrations.md) | Supported tools and their capability mappings |
| [Extension Guide](./extension-guide.md) | How to extend the schema with new entities, actions, or integrations |

---

## Quick Reference

### Entities (Nouns)

```
Contact        A person or organisation (customer, supplier, lead)
Appointment    A scheduled service (PT session, massage, job)
Invoice        A request for payment
Quote          A proposal for work
Message        An email or SMS
Event          A ticketed event (class, show, workshop)
Provider       The business using Reckoning
```

### Triggers (What Starts an Automation)

```
event          Something happened (appointment.created, invoice.paid)
schedule       Time-based (cron expression or interval)
manual         Business owner initiates
```

### Steps (What the Automation Does)

```
wait           Pause for duration or until datetime
condition      Check if a field matches criteria
action         Do something (send_email, create_invoice, etc.)
branch         Split into multiple paths based on conditions
```

### Actions (Verbs)

```
send_email           Send an email using a template
send_sms             Send an SMS message
create_invoice       Create a new invoice
create_payment_link  Generate a Stripe payment link
add_to_linktree      Add a link to Linktree profile
update_record        Update a field on an entity
create_task          Create a task/reminder
webhook              Call an external URL
```

---

## Design Principles

### 1. Use Established Terms

Don't invent terminology when standards exist. We use:

- `customer` not `client` (Stripe, Schema.org)
- `provider` not `business` (Schema.org)
- `start_time` / `end_time` not `startDate` / `endDate` (iCalendar, Calendly)
- `status` not `state` (Universal)

### 2. Snake Case for JSON

All property names use `snake_case` to match JSON conventions and major APIs (Stripe, Calendly, Xero).

```json
{
  "invoice_number": "INV-001",
  "amount_due": 150.00,
  "due_date": "2026-01-15",
  "created_at": "2025-12-11T10:30:00Z"
}
```

### 3. ISO Standards for Values

- **Dates/Times:** ISO 8601 (`2025-12-11T10:30:00Z`)
- **Currency codes:** ISO 4217 (`GBP`, `USD`, `EUR`)
- **Country codes:** ISO 3166-1 alpha-2 (`GB`, `US`)

### 4. Nullable vs Optional

- **Optional fields** may be omitted entirely
- **Nullable fields** must be present but may be `null`
- Document which is which in the entity schemas

### 5. Extensibility Over Completeness

Start minimal. Add fields when needed. Every field should earn its place by being used in at least one automation.

---

## Versioning

The schema follows semantic versioning:

- **Major** (1.0 → 2.0): Breaking changes to existing fields
- **Minor** (1.0 → 1.1): New optional fields or entities
- **Patch** (1.0.0 → 1.0.1): Documentation clarifications

### Deprecation Process

1. Mark field as deprecated in documentation
2. Keep field functional for 2 minor versions
3. Remove in next major version

---

## TypeScript Types

The canonical TypeScript definitions live in:

```
src/types/automation.ts
```

These are generated from this documentation and should be kept in sync. When extending the schema:

1. Update the documentation first
2. Update the TypeScript types to match
3. Run type checking to catch any mismatches

---

## Related Documentation

- [Automation Catalogue](./catalogue.md) — The actual automations defined using this schema
- [Matcher Logic](../technical/matcher.md) — How automations are selected based on intake
- [Brand Voice](../00-brand-voice.md) — Tone for customer-facing messages

---

*Reckoning Schema Documentation — December 2025*
