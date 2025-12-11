# Variable Interpolation

**Version:** 1.0.0

This document defines the syntax for variable interpolation in automation templates.

---

## Syntax

Variables use double curly braces with Liquid-style syntax:

```
{{variable}}
{{variable | filter}}
{{variable | filter: argument}}
{{variable | filter1 | filter2}}
```

---

## Available Variables

Variables are scoped to the entities available in the automation context.

### Trigger Context

The entity that triggered the automation is available directly:

```yaml
# If trigger is appointment.created:
{{appointment.name}}
{{appointment.start_time}}
{{appointment.customer.email}}
```

### Entity Variables

#### Contact / Customer

```
{{customer.id}}
{{customer.name}}
{{customer.given_name}}
{{customer.family_name}}
{{customer.email}}
{{customer.telephone}}
{{customer.address.street_address}}
{{customer.address.address_locality}}
{{customer.address.postal_code}}
```

#### Appointment

```
{{appointment.id}}
{{appointment.name}}
{{appointment.description}}
{{appointment.start_time}}
{{appointment.end_time}}
{{appointment.location}}
{{appointment.status}}
{{appointment.price}}
{{appointment.customer.name}}
{{appointment.customer.email}}
```

#### Invoice

```
{{invoice.id}}
{{invoice.invoice_number}}
{{invoice.amount_due}}
{{invoice.amount_paid}}
{{invoice.amount_remaining}}
{{invoice.currency}}
{{invoice.issue_date}}
{{invoice.due_date}}
{{invoice.status}}
{{invoice.payment_link}}
{{invoice.customer.name}}
{{invoice.customer.email}}
```

#### Quote

```
{{quote.id}}
{{quote.quote_number}}
{{quote.amount}}
{{quote.description}}
{{quote.issue_date}}
{{quote.expiry_date}}
{{quote.status}}
{{quote.customer.name}}
{{quote.customer.email}}
```

#### Event

```
{{event.id}}
{{event.name}}
{{event.description}}
{{event.start_time}}
{{event.end_time}}
{{event.location}}
{{event.price}}
{{event.payment_link}}
{{event.capacity}}
{{event.attendee_count}}
```

#### Provider

The business is always available as `provider`:

```
{{provider.name}}
{{provider.email}}
{{provider.telephone}}
{{provider.website}}
{{provider.booking_link}}
{{provider.payment_link}}
{{provider.review_link}}
{{provider.linktree_url}}
{{provider.cancellation_policy}}
{{provider.late_cancel_fee}}
{{provider.currency}}
```

### Step Outputs

Actions that produce outputs make them available for subsequent steps:

```
# After create_payment_link action:
{{stripe.payment_link_url}}

# After add_to_linktree action:
{{linktree.profile_url}}
```

### Special Variables

```
{{now}}                    # Current datetime
{{today}}                  # Current date
```

---

## Filters

Filters transform variable values.

### Date/Time Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `date` | Format as date | `{{appointment.start_time \| date}}` → "15 January 2026" |
| `date: format` | Custom date format | `{{appointment.start_time \| date: "%d/%m/%Y"}}` → "15/01/2026" |
| `time` | Format as time | `{{appointment.start_time \| time}}` → "2:00 PM" |
| `time: format` | Custom time format | `{{appointment.start_time \| time: "%H:%M"}}` → "14:00" |
| `datetime` | Full datetime | `{{appointment.start_time \| datetime}}` → "15 January 2026 at 2:00 PM" |
| `relative` | Relative time | `{{appointment.start_time \| relative}}` → "in 3 days" |

### Date Arithmetic

| Filter | Description | Example |
|--------|-------------|---------|
| `plus: N unit` | Add time | `{{now \| plus: 7 days}}` |
| `minus: N unit` | Subtract time | `{{appointment.start_time \| minus: 24 hours}}` |

Units: `minutes`, `hours`, `days`, `weeks`, `months`

### Currency Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `currency` | Format with currency symbol | `{{invoice.amount_due \| currency}}` → "£150.00" |
| `currency: code` | Specific currency | `{{invoice.amount_due \| currency: "USD"}}` → "$150.00" |

### String Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `upcase` | Uppercase | `{{customer.name \| upcase}}` → "SOPHIE CHEN" |
| `downcase` | Lowercase | `{{customer.email \| downcase}}` → "sophie@example.com" |
| `capitalize` | Capitalise first letter | `{{status \| capitalize}}` → "Confirmed" |
| `truncate: N` | Truncate to N chars | `{{description \| truncate: 50}}` → "This is a long..." |
| `default: value` | Fallback if empty | `{{customer.telephone \| default: "Not provided"}}` |

### Number Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `round` | Round to integer | `{{amount \| round}}` → "150" |
| `round: N` | Round to N decimals | `{{amount \| round: 2}}` → "150.00" |
| `floor` | Round down | `{{amount \| floor}}` → "149" |
| `ceil` | Round up | `{{amount \| ceil}}` → "150" |

---

## Examples

### Email Subject Lines

```yaml
subject: "Confirmed: {{appointment.name}} on {{appointment.start_time | date}}"
# → "Confirmed: PT Session on 15 January 2026"

subject: "Reminder: Invoice {{invoice.invoice_number}} ({{invoice.amount_due | currency}})"
# → "Reminder: Invoice INV-2025-0042 (£150.00)"

subject: "{{event.name}} — {{event.start_time | date: '%d %b'}}"
# → "Friday Fight Night — 14 Feb"
```

### Message Bodies

```yaml
message: |
  Hi {{customer.given_name | default: customer.name}},

  Just a reminder about your {{appointment.name}} tomorrow
  at {{appointment.start_time | time}}.

  See you there!
  {{provider.name}}
```

### Conditional Timing

```yaml
# Wait until 24 hours before the appointment
- type: wait
  until: "{{appointment.start_time | minus: 24 hours}}"

# Wait until the day after the event
- type: wait
  until: "{{event.end_time | plus: 1 day}}"
```

### Dynamic Values

```yaml
# Create invoice with dynamic amount
- type: action
  action: create_invoice
  config:
    amount: "{{provider.late_cancel_fee}}"
    description: "Late cancellation — {{appointment.name}} on {{appointment.start_time | date}}"
```

---

## Date Format Codes

For custom date/time formatting:

| Code | Description | Example |
|------|-------------|---------|
| `%Y` | 4-digit year | 2026 |
| `%y` | 2-digit year | 26 |
| `%m` | Month (01-12) | 01 |
| `%d` | Day (01-31) | 15 |
| `%H` | Hour 24h (00-23) | 14 |
| `%I` | Hour 12h (01-12) | 02 |
| `%M` | Minute (00-59) | 30 |
| `%p` | AM/PM | PM |
| `%A` | Full weekday | Wednesday |
| `%a` | Short weekday | Wed |
| `%B` | Full month | January |
| `%b` | Short month | Jan |

**Common patterns:**

```
"%d %B %Y"      → "15 January 2026"
"%d/%m/%Y"      → "15/01/2026"
"%A, %d %B"     → "Wednesday, 15 January"
"%H:%M"         → "14:30"
"%I:%M %p"      → "02:30 PM"
```

---

## Escaping

If you need literal curly braces in output:

```
\{\{not a variable\}\}
```

---

## Null Handling

If a variable is null or undefined:

- Without default filter: outputs empty string
- With default filter: outputs the default value

```yaml
# If telephone is null:
{{customer.telephone}}                        # → ""
{{customer.telephone | default: "No phone"}}  # → "No phone"
```

---

*Next: [Integrations](./integrations.md)*
