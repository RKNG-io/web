# Entity Schemas

**Version:** 1.0.0

This document defines the core data entities in the Reckoning automation system.

---

## Contents

- [Contact](#contact)
- [Appointment](#appointment)
- [Invoice](#invoice)
- [Quote](#quote)
- [Message](#message)
- [Event](#event)
- [Provider](#provider)

---

## Contact

A person or organisation that interacts with the business. May be a customer, supplier, or lead.

**Source terminology:** Schema.org `Person`/`Organization`, HubSpot `contact`, Stripe `customer`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `type` | enum | Yes | `person` or `organization` |
| `name` | string | Yes | Full name (person) or business name (org) |
| `given_name` | string | No | First name (Schema.org term) |
| `family_name` | string | No | Last name (Schema.org term) |
| `email` | string | Yes | Primary email address |
| `telephone` | string | No | Primary phone number (Schema.org term) |
| `address` | Address | No | Postal address |
| `tags` | string[] | No | Classification tags, e.g., `['vip', 'late-payer']` |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### Address (Embedded Object)

Based on Schema.org `PostalAddress`:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `street_address` | string | No | Street and number |
| `address_locality` | string | No | City/town |
| `address_region` | string | No | State/county/region |
| `postal_code` | string | No | Postcode/ZIP |
| `address_country` | string | No | ISO 3166-1 alpha-2 code |

### Example

```json
{
  "id": "contact_abc123",
  "type": "person",
  "name": "Sophie Chen",
  "given_name": "Sophie",
  "family_name": "Chen",
  "email": "sophie@example.com",
  "telephone": "+44 7700 900123",
  "address": {
    "street_address": "123 High Street",
    "address_locality": "London",
    "postal_code": "E1 6AN",
    "address_country": "GB"
  },
  "tags": ["regular", "fitness"],
  "created_at": "2025-06-15T10:30:00Z",
  "updated_at": "2025-12-01T14:22:00Z"
}
```

### Notes

- Use `name` for display purposes; `given_name` + `family_name` for personalisation
- `telephone` follows Schema.org naming (HubSpot uses `phone` — we chose Schema.org for consistency)
- Tags are freeform but should follow conventions documented in the catalogue

---

## Appointment

A scheduled service delivery. Covers PT sessions, treatments, consultations, jobs, etc.

**Source terminology:** Schema.org `Reservation`, iCalendar `VEVENT`, Calendly `scheduled_event`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Service name, e.g., "PT Session", "Deep Tissue Massage" |
| `description` | string | No | Additional details |
| `start_time` | datetime | Yes | ISO 8601 start timestamp |
| `end_time` | datetime | Yes | ISO 8601 end timestamp |
| `location` | string | No | Where the appointment takes place |
| `provider` | string | Yes | Provider ID (the business) |
| `customer` | string | Yes | Contact ID |
| `status` | enum | Yes | See status values below |
| `service_type` | string | No | Links to service catalogue |
| `price` | number | No | Price in minor units or decimal |
| `currency` | string | No | ISO 4217 currency code |
| `notes` | string | No | Internal notes |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### Status Values

| Value | Description |
|-------|-------------|
| `confirmed` | Appointment is scheduled and confirmed |
| `cancelled` | Appointment was cancelled |
| `completed` | Appointment happened successfully |
| `no_show` | Customer did not attend |

### Example

```json
{
  "id": "apt_xyz789",
  "name": "PT Session",
  "description": "Upper body focus",
  "start_time": "2026-01-15T10:00:00Z",
  "end_time": "2026-01-15T11:00:00Z",
  "location": "Gym Floor 2",
  "provider": "provider_rival",
  "customer": "contact_abc123",
  "status": "confirmed",
  "service_type": "pt_session",
  "price": 50.00,
  "currency": "GBP",
  "created_at": "2025-12-10T09:00:00Z",
  "updated_at": "2025-12-10T09:00:00Z"
}
```

### Notes

- We use `appointment` rather than `booking` or `reservation` — clearer for service businesses
- `start_time`/`end_time` follow iCalendar and Calendly patterns
- `customer` not `client` — aligns with Stripe and Schema.org `Invoice.customer`

---

## Invoice

A request for payment for goods or services rendered.

**Source terminology:** Stripe `invoice`, Xero `Invoice`, Schema.org `Invoice`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `invoice_number` | string | Yes | Human-readable invoice number |
| `customer` | string | Yes | Contact ID |
| `provider` | string | Yes | Provider ID |
| `currency` | string | Yes | ISO 4217 currency code |
| `amount_due` | number | Yes | Total amount due |
| `amount_paid` | number | Yes | Amount already paid |
| `amount_remaining` | number | Yes | Amount still owed |
| `line_items` | LineItem[] | Yes | Itemised charges |
| `issue_date` | date | Yes | When invoice was issued |
| `due_date` | date | Yes | When payment is due |
| `paid_date` | date | No | When invoice was paid |
| `status` | enum | Yes | See status values below |
| `payment_link` | string | No | Stripe payment link URL |
| `hosted_url` | string | No | Hosted invoice page URL |
| `notes` | string | No | Notes to customer |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### LineItem (Embedded Object)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `description` | string | Yes | What the charge is for |
| `quantity` | number | Yes | Number of units |
| `unit_amount` | number | Yes | Price per unit |
| `amount` | number | Yes | Total (quantity × unit_amount) |
| `tax_amount` | number | No | Tax portion if applicable |

### Status Values

Aligned with Stripe:

| Value | Description |
|-------|-------------|
| `draft` | Not yet sent to customer |
| `open` | Sent, awaiting payment |
| `paid` | Payment received in full |
| `void` | Cancelled, no longer valid |
| `uncollectible` | Written off as bad debt |

### Example

```json
{
  "id": "inv_def456",
  "invoice_number": "INV-2025-0042",
  "customer": "contact_abc123",
  "provider": "provider_rival",
  "currency": "GBP",
  "amount_due": 150.00,
  "amount_paid": 0,
  "amount_remaining": 150.00,
  "line_items": [
    {
      "description": "PT Session (1 hour)",
      "quantity": 3,
      "unit_amount": 50.00,
      "amount": 150.00
    }
  ],
  "issue_date": "2025-12-11",
  "due_date": "2025-12-25",
  "status": "open",
  "payment_link": "https://pay.stripe.com/abc123",
  "created_at": "2025-12-11T10:00:00Z",
  "updated_at": "2025-12-11T10:00:00Z"
}
```

### Notes

- `invoice_number` is the human-readable reference (Xero pattern)
- Amounts can be decimal or minor units — be consistent within your implementation
- `amount_due`, `amount_paid`, `amount_remaining` mirror Stripe's pattern

---

## Quote

A proposal for work, sent before the work is agreed.

**Source terminology:** Xero `Quote`, common CRM patterns

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `quote_number` | string | Yes | Human-readable quote number |
| `customer` | string | Yes | Contact ID |
| `provider` | string | Yes | Provider ID |
| `currency` | string | Yes | ISO 4217 currency code |
| `amount` | number | Yes | Total quoted amount |
| `description` | string | Yes | Summary of work proposed |
| `line_items` | LineItem[] | No | Itemised breakdown |
| `issue_date` | date | Yes | When quote was sent |
| `expiry_date` | date | Yes | When quote expires |
| `accepted_date` | date | No | When customer accepted |
| `status` | enum | Yes | See status values below |
| `notes` | string | No | Terms, conditions, notes |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### Status Values

| Value | Description |
|-------|-------------|
| `draft` | Not yet sent |
| `sent` | Sent to customer, awaiting response |
| `accepted` | Customer accepted |
| `declined` | Customer declined |
| `expired` | Expiry date passed without response |

### Example

```json
{
  "id": "quote_ghi789",
  "quote_number": "QUO-2025-0015",
  "customer": "contact_abc123",
  "provider": "provider_sparks",
  "currency": "GBP",
  "amount": 450.00,
  "description": "Full rewire of ground floor, including consumer unit upgrade",
  "issue_date": "2025-12-10",
  "expiry_date": "2025-12-24",
  "status": "sent",
  "created_at": "2025-12-10T14:00:00Z",
  "updated_at": "2025-12-10T14:00:00Z"
}
```

---

## Message

A communication sent to a contact. Covers emails and SMS.

**Source terminology:** Schema.org `EmailMessage`, common messaging patterns

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `channel` | enum | Yes | `email` or `sms` |
| `recipient` | string | Yes | Contact ID, email address, or phone number |
| `sender` | string | No | Sender identifier or address |
| `subject` | string | No | Email subject (email only) |
| `body` | string | Yes | Message content |
| `template` | string | No | Template ID if using templates |
| `status` | enum | Yes | See status values below |
| `sent_at` | datetime | No | When message was sent |
| `opened_at` | datetime | No | When message was opened (if tracked) |
| `created_at` | datetime | Yes | ISO 8601 timestamp |

### Status Values

| Value | Description |
|-------|-------------|
| `draft` | Not yet queued |
| `queued` | Scheduled for sending |
| `sent` | Handed off to delivery provider |
| `delivered` | Confirmed delivered |
| `failed` | Delivery failed |
| `opened` | Recipient opened (email with tracking) |

### Example

```json
{
  "id": "msg_jkl012",
  "channel": "email",
  "recipient": "contact_abc123",
  "subject": "Reminder: PT Session tomorrow",
  "body": "Hi Sophie, just a reminder about your PT session tomorrow at 10am...",
  "template": "appointment_reminder",
  "status": "delivered",
  "sent_at": "2026-01-14T10:00:00Z",
  "created_at": "2026-01-14T09:55:00Z"
}
```

---

## Event

A ticketed event such as a class, show, workshop, or fight night.

**Source terminology:** Schema.org `Event`, Eventbrite patterns

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Event name |
| `description` | string | No | Event description |
| `start_time` | datetime | Yes | When the event starts |
| `end_time` | datetime | No | When the event ends |
| `location` | string | No | Venue or address |
| `price` | number | No | Ticket price |
| `currency` | string | No | ISO 4217 currency code |
| `payment_link` | string | No | Stripe payment link |
| `ticket_link` | string | No | External ticketing link |
| `capacity` | number | No | Maximum attendees |
| `attendee_count` | number | No | Current attendee count |
| `status` | enum | Yes | See status values below |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### Status Values

| Value | Description |
|-------|-------------|
| `draft` | Not yet published |
| `published` | Live and accepting tickets |
| `cancelled` | Event cancelled |
| `completed` | Event has happened |

### Example

```json
{
  "id": "event_mno345",
  "name": "Friday Fight Night",
  "description": "Amateur boxing showcase",
  "start_time": "2026-02-14T19:00:00Z",
  "end_time": "2026-02-14T23:00:00Z",
  "location": "York Hall, Bethnal Green",
  "price": 25.00,
  "currency": "GBP",
  "payment_link": "https://pay.stripe.com/event123",
  "capacity": 500,
  "attendee_count": 342,
  "status": "published",
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-11T15:30:00Z"
}
```

---

## Provider

The business using Reckoning. This is the customer's business, not Reckoning itself.

**Source terminology:** Schema.org `provider`, `Organization`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Business name |
| `email` | string | Yes | Primary business email |
| `telephone` | string | No | Business phone |
| `website` | string | No | Business website URL |
| `booking_link` | string | No | Calendly, Acuity, or booking page URL |
| `payment_link` | string | No | Default Stripe payment link |
| `review_link` | string | No | Google, Trustpilot review page |
| `linktree_url` | string | No | Link-in-bio URL |
| `cancellation_policy` | string | No | Cancellation policy text |
| `late_cancel_fee` | number | No | Fee charged for late cancellations |
| `currency` | string | No | Default currency (ISO 4217) |
| `logo_url` | string | No | Logo image URL |
| `vertical` | enum | No | Primary vertical |
| `created_at` | datetime | Yes | ISO 8601 timestamp |
| `updated_at` | datetime | Yes | ISO 8601 timestamp |

### Vertical Values

| Value | Description |
|-------|-------------|
| `fitness` | PTs, gyms, yoga, coaches |
| `wellness` | Massage, physio, beauty, spas |
| `trades` | Electricians, plumbers, builders |
| `events` | Promoters, DJs, venues, caterers |

### Example

```json
{
  "id": "provider_rival",
  "name": "Rival Boxing",
  "email": "hello@rivalboxing.com",
  "telephone": "+44 20 7123 4567",
  "website": "https://rivalboxing.com",
  "booking_link": "https://calendly.com/rivalboxing",
  "payment_link": "https://pay.stripe.com/rival",
  "review_link": "https://g.page/rivalboxing/review",
  "linktree_url": "https://linktr.ee/rivalboxing",
  "cancellation_policy": "24 hours notice required",
  "late_cancel_fee": 25.00,
  "currency": "GBP",
  "vertical": "fitness",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-12-01T10:00:00Z"
}
```

---

## Datetime Conventions

All datetime fields use ISO 8601 format:

```
Full datetime:  2025-12-11T10:30:00Z
Date only:      2025-12-11
Time only:      10:30:00
```

- Always include timezone (prefer `Z` for UTC)
- Use `date` type for fields that don't need time precision (due_date, issue_date)
- Use `datetime` type for timestamps and scheduled times

---

## ID Conventions

Entity IDs follow the pattern `{type}_{random}`:

```
contact_abc123
appointment_xyz789
invoice_def456
```

This makes IDs self-describing and avoids collision across entity types.

---

*Next: [Automations](./automations.md)*
