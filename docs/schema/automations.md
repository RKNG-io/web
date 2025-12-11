# Automation Schemas

**Version:** 1.0.0

This document defines the structure of automation workflows in the Reckoning system.

---

## Contents

- [Automation](#automation)
- [Triggers](#triggers)
- [Steps](#steps)
- [Actions](#actions)
- [Conditions](#conditions)

---

## Automation

An automation is a complete workflow definition that can be matched to customer needs, configured with their specific details, and deployed to their tools.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier, kebab-case |
| `name` | string | Yes | Human-readable name |
| `description` | string | Yes | One-sentence description |
| `category` | enum | Yes | See categories below |
| `verticals` | enum[] | Yes | Which industries this applies to |
| `business_stages` | enum[] | Yes | Which business stages this suits |
| `trigger` | Trigger | Yes | What starts the automation |
| `steps` | Step[] | Yes | The sequence of actions |
| `outputs` | Output[] | No | Data produced by the automation |
| `time_sinks` | string[] | Yes | Maps to intake question answers |
| `integrations` | object | Yes | Required tools by category |
| `time_saved_weekly` | number | Yes | Estimated hours saved per week |
| `cost_saved_percentage` | number | No | Fee savings (e.g., 8.5 for platform fees) |
| `service_price` | number | Yes | Price in GBP |
| `service_id` | string | Yes | Links to services catalogue |
| `notes` | string | No | Implementation notes |

### Category Values

| Value | Description |
|-------|-------------|
| `scheduling` | Booking, calendar, reminders |
| `payments` | Invoicing, payment collection, fees |
| `communications` | Follow-ups, nurture sequences |
| `admin` | Data entry, record keeping |
| `social` | Content scheduling, link management |

### Vertical Values

| Value | Description |
|-------|-------------|
| `fitness` | PTs, gyms, yoga instructors, coaches |
| `wellness` | Massage, physio, beauty, spas |
| `trades` | Electricians, plumbers, builders |
| `events` | Promoters, DJs, venues, caterers |
| `all` | Applies to all verticals |

### Business Stage Values

| Value | Description |
|-------|-------------|
| `launching` | Pre-revenue or just started |
| `building` | Has customers, growing |
| `established` | Stable, looking to optimise |

### Output (Embedded Object)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Output variable name |
| `value` | string | Yes | Template expression for the value |

### Example

```yaml
id: invoice-reminder-sequence
name: Invoice Reminder Sequence
description: Automatic payment reminders at 7, 14, and 21 days.

category: payments
verticals: [all]
business_stages: [building, established]

trigger:
  type: event
  source: accounting
  event: invoice.created

steps:
  - type: wait
    duration: { value: 7, unit: days }
  - type: condition
    field: invoice.status
    operator: not_equals
    value: paid
  - type: action
    action: send_email
    tool: email
    config:
      to: "{{invoice.customer.email}}"
      subject: "Friendly reminder: Invoice {{invoice.invoice_number}}"
      template: invoice_reminder_1
  # ... more steps

time_sinks: [invoicing, chasing_payments]

integrations:
  accounting: [xero, quickbooks, stripe]
  email: [gmail, smtp]
  automation: [zapier, make]

time_saved_weekly: 2
service_price: 199
service_id: invoice-reminders
```

---

## Triggers

A trigger defines what starts an automation.

### Event Trigger

Fires when something happens in an integrated system.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `event` |
| `source` | string | Yes | The system category |
| `event` | string | Yes | The specific event |

**Source values:** `calendar`, `accounting`, `payments`, `forms`, `crm`

**Event patterns:**

```
# Calendar events
appointment.created
appointment.cancelled
appointment.completed
appointment.no_show

# Accounting events
invoice.created
invoice.sent
invoice.paid
invoice.overdue
quote.created
quote.sent
quote.accepted
quote.expired

# Payment events
payment.received
payment.failed

# Form events
form.submitted
```

**Example:**

```yaml
trigger:
  type: event
  source: calendar
  event: appointment.created
```

### Schedule Trigger

Fires on a time-based schedule.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `schedule` |
| `cron` | string | No | Cron expression |
| `interval` | Duration | No | Simple interval |

One of `cron` or `interval` is required.

**Example (cron):**

```yaml
trigger:
  type: schedule
  cron: "0 9 * * 1"  # Every Monday at 9am
```

**Example (interval):**

```yaml
trigger:
  type: schedule
  interval:
    value: 1
    unit: days
```

### Manual Trigger

Started by the business owner (not automatic).

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `manual` |
| `source` | string | Yes | Always `provider` |
| `event` | string | Yes | Descriptive event name |

**Example:**

```yaml
trigger:
  type: manual
  source: provider
  event: event.created
```

---

## Steps

Steps define what the automation does. They execute in sequence.

### Wait Step

Pause execution for a duration or until a specific time.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `wait` |
| `duration` | Duration | No | Wait for this long |
| `until` | string | No | Wait until this datetime expression |

One of `duration` or `until` is required.

**Duration object:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | number | Yes | Amount |
| `unit` | enum | Yes | `minutes`, `hours`, `days`, `weeks` |

**Examples:**

```yaml
# Wait 7 days
- type: wait
  duration:
    value: 7
    unit: days

# Wait until 24 hours before appointment
- type: wait
  until: "{{appointment.start_time | minus: 24 hours}}"
```

### Condition Step

Check if a condition is met before continuing.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `condition` |
| `field` | string | Yes | The field to check |
| `operator` | enum | Yes | See operators below |
| `value` | any | Yes | The value to compare against |

**Operators:**

| Operator | Description |
|----------|-------------|
| `equals` | Field equals value |
| `not_equals` | Field does not equal value |
| `contains` | Field contains value (strings) |
| `greater_than` | Field is greater than value |
| `less_than` | Field is less than value |
| `is_empty` | Field is null or empty |
| `is_not_empty` | Field has a value |

**Example:**

```yaml
- type: condition
  field: invoice.status
  operator: not_equals
  value: paid
```

### Action Step

Perform an action.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `action` |
| `action` | enum | Yes | The action to perform |
| `tool` | string | No | Which integration to use |
| `config` | object | Yes | Action-specific configuration |
| `optional` | boolean | No | If true, failure doesn't stop workflow |
| `conditional` | boolean | No | If true, only runs if previous condition passed |

See [Actions](#actions) for available actions and their configs.

**Example:**

```yaml
- type: action
  action: send_email
  tool: email
  config:
    to: "{{invoice.customer.email}}"
    subject: "Reminder: Invoice {{invoice.invoice_number}}"
    template: invoice_reminder_1
```

### Branch Step

Split into multiple paths based on conditions.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Always `branch` |
| `branches` | Branch[] | Yes | The possible paths |

**Branch object:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `condition` | Condition | Yes | When to take this branch |
| `steps` | Step[] | Yes | Steps to execute |

**Example:**

```yaml
- type: branch
  branches:
    - condition:
        field: appointment.status
        operator: equals
        value: no_show
      steps:
        - type: action
          action: send_email
          config:
            template: no_show_followup
    - condition:
        field: appointment.status
        operator: equals
        value: completed
      steps:
        - type: action
          action: send_email
          config:
            template: review_request
```

---

## Actions

Actions are the verbs — what the automation actually does.

### send_email

Send an email message.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `to` | string | Yes | Recipient (email or template expression) |
| `subject` | string | Yes | Email subject |
| `body` | string | No | Plain text body (if not using template) |
| `template` | string | No | Template ID |
| `cc` | string | No | CC recipient |
| `bcc` | string | No | BCC recipient |

**Example:**

```yaml
- type: action
  action: send_email
  tool: email
  config:
    to: "{{appointment.customer.email}}"
    subject: "Confirmed: {{appointment.name}} on {{appointment.start_time | date}}"
    template: appointment_confirmation
```

### send_sms

Send an SMS message.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `to` | string | Yes | Phone number or template expression |
| `message` | string | Yes | Message content (160 chars recommended) |

**Example:**

```yaml
- type: action
  action: send_sms
  tool: sms
  optional: true
  config:
    to: "{{appointment.customer.telephone}}"
    message: "Reminder: {{appointment.name}} tomorrow at {{appointment.start_time | time}}. — {{provider.name}}"
```

### create_invoice

Create a new invoice.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `customer` | string | Yes | Contact ID |
| `amount` | number/string | Yes | Invoice amount or template expression |
| `currency` | string | No | Currency code (defaults to provider currency) |
| `description` | string | Yes | What the invoice is for |
| `due_days` | number | No | Days until due (default: 14) |

**Example:**

```yaml
- type: action
  action: create_invoice
  tool: accounting
  conditional: true
  config:
    customer: "{{appointment.customer.id}}"
    amount: "{{provider.late_cancel_fee}}"
    currency: "{{provider.currency}}"
    description: "Late cancellation fee — {{appointment.name}}"
```

### create_payment_link

Generate a Stripe payment link.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `name` | string | Yes | Product/event name |
| `price` | number/string | Yes | Price or template expression |
| `currency` | string | No | Currency code |
| `description` | string | No | Product description |

**Outputs:** `{{stripe.payment_link_url}}`

**Example:**

```yaml
- type: action
  action: create_payment_link
  tool: stripe
  config:
    name: "{{event.name}}"
    price: "{{event.price}}"
    description: "{{event.description}}"
```

### add_to_linktree

Add a link to a Linktree profile.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `title` | string | Yes | Link title |
| `url` | string | Yes | Link URL |
| `position` | enum | No | `top` or `bottom` (default: top) |

**Example:**

```yaml
- type: action
  action: add_to_linktree
  tool: linktree
  config:
    title: "{{event.name}}"
    url: "{{stripe.payment_link_url}}"
    position: top
```

### update_record

Update a field on an entity.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `entity` | string | Yes | Entity type |
| `id` | string | Yes | Entity ID |
| `field` | string | Yes | Field to update |
| `value` | any | Yes | New value |

**Example:**

```yaml
- type: action
  action: update_record
  config:
    entity: contact
    id: "{{appointment.customer.id}}"
    field: tags
    value: ["active"]
```

### create_task

Create a task or reminder.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `title` | string | Yes | Task title |
| `description` | string | No | Task details |
| `due_date` | string | No | When the task is due |
| `assignee` | string | No | Who to assign to |

**Example:**

```yaml
- type: action
  action: create_task
  config:
    title: "Follow up with {{contact.name}}"
    due_date: "{{now | plus: 3 days}}"
```

### webhook

Call an external URL.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `url` | string | Yes | The URL to call |
| `method` | enum | No | `GET`, `POST`, `PUT` (default: POST) |
| `headers` | object | No | HTTP headers |
| `body` | object | No | Request body |

**Example:**

```yaml
- type: action
  action: webhook
  config:
    url: "https://api.example.com/notify"
    method: POST
    body:
      event: appointment_completed
      customer_id: "{{appointment.customer.id}}"
```

---

## Conditions

Conditions are used in both `condition` steps and `branch` steps.

### Field References

Fields are referenced using dot notation:

```
invoice.status
invoice.customer.email
appointment.start_time
provider.late_cancel_fee
```

### Available Operators

| Operator | Types | Example |
|----------|-------|---------|
| `equals` | All | `status equals paid` |
| `not_equals` | All | `status not_equals paid` |
| `contains` | String | `email contains @gmail` |
| `greater_than` | Number, Date | `amount greater_than 100` |
| `less_than` | Number, Date | `amount less_than 50` |
| `is_empty` | All | `notes is_empty` |
| `is_not_empty` | All | `telephone is_not_empty` |

### Combining Conditions

For complex logic, use the `branch` step with multiple conditions. Each branch is evaluated independently.

---

*Next: [Variables](./variables.md)*
