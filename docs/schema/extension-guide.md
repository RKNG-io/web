# Schema Extension Guide

**Version:** 1.0.0

This document explains how to extend the Reckoning automation schema with new entities, actions, triggers, and integrations.

---

## Principles

Before extending the schema, consider:

1. **Is there an existing standard?** Check Schema.org, Stripe, Xero, HubSpot, iCalendar for established terminology.

2. **Is it needed by an automation?** Don't add fields speculatively. Every addition should be used by at least one automation in the catalogue.

3. **Is it generalised enough?** Extensions should work across verticals where possible, not be specific to one customer.

4. **Does it break existing automations?** Additions are fine; changes to existing fields require migration.

---

## Adding a New Entity

### When to Add

Add a new entity when you encounter a concept that:
- Is not covered by existing entities (Contact, Appointment, Invoice, Quote, Message, Event)
- Has multiple fields that belong together
- Will be referenced by multiple automations

### Process

1. **Research existing standards**

   Check how these systems model the concept:
   - Schema.org (https://schema.org)
   - Stripe API (https://stripe.com/docs/api)
   - Xero API (https://developer.xero.com)
   - HubSpot API (https://developers.hubspot.com)

2. **Define the entity**

   Document in `docs/schema/entities.md`:

   ```markdown
   ## NewEntity

   Description of what this entity represents.

   **Source terminology:** Where the naming comes from

   ### Properties

   | Property | Type | Required | Description |
   |----------|------|----------|-------------|
   | `id` | string | Yes | Unique identifier |
   | ... | ... | ... | ... |

   ### Status Values (if applicable)

   | Value | Description |
   |-------|-------------|
   | ... | ... |

   ### Example

   ```json
   { ... }
   ```
   ```

3. **Add TypeScript types**

   Update `src/types/automation.ts`:

   ```typescript
   export type NewEntity = {
     id: string
     // ... fields
   }
   ```

4. **Document variables**

   Update `docs/schema/variables.md` with available variable paths:

   ```
   {{new_entity.field}}
   {{new_entity.nested.field}}
   ```

5. **Create at least one automation**

   Add an automation to the catalogue that uses the new entity.

### Example: Adding a Subscription Entity

```markdown
## Subscription

A recurring payment arrangement with a customer.

**Source terminology:** Stripe `subscription`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `customer` | string | Yes | Contact ID |
| `plan_name` | string | Yes | Name of the plan |
| `amount` | number | Yes | Recurring amount |
| `currency` | string | Yes | ISO 4217 currency code |
| `interval` | enum | Yes | `weekly`, `monthly`, `yearly` |
| `start_date` | date | Yes | When subscription started |
| `next_billing_date` | date | Yes | Next payment date |
| `status` | enum | Yes | `active`, `paused`, `cancelled`, `past_due` |
| `created_at` | datetime | Yes | ISO 8601 timestamp |

### Example

```json
{
  "id": "sub_abc123",
  "customer": "contact_xyz",
  "plan_name": "Monthly PT Package",
  "amount": 200.00,
  "currency": "GBP",
  "interval": "monthly",
  "start_date": "2025-01-01",
  "next_billing_date": "2026-02-01",
  "status": "active",
  "created_at": "2025-01-01T10:00:00Z"
}
```
```

---

## Adding a New Action

### When to Add

Add a new action when you need to:
- Interact with a new type of system
- Perform an operation not covered by existing actions

### Process

1. **Define the action**

   Document in `docs/schema/automations.md` under Actions:

   ```markdown
   ### action_name

   Description of what this action does.

   | Config Property | Type | Required | Description |
   |-----------------|------|----------|-------------|
   | ... | ... | ... | ... |

   **Example:**

   ```yaml
   - type: action
     action: action_name
     tool: category
     config:
       property: value
   ```
   ```

2. **Define outputs (if any)**

   If the action produces data for subsequent steps:

   ```markdown
   **Outputs:** `{{tool.output_name}}`
   ```

3. **Add to TypeScript types**

   Update `src/types/automation.ts`:

   ```typescript
   export type ActionType =
     | 'send_email'
     | 'send_sms'
     // ... existing
     | 'new_action'  // Add new action
   ```

4. **Document required integrations**

   If this action requires a specific tool, add it to `docs/schema/integrations.md`.

### Example: Adding a Create Task Action

```markdown
### create_task

Create a task or reminder in the provider's task system.

| Config Property | Type | Required | Description |
|-----------------|------|----------|-------------|
| `title` | string | Yes | Task title |
| `description` | string | No | Task details |
| `due_date` | string | No | When the task is due |
| `assignee` | string | No | Who to assign to |
| `priority` | enum | No | `low`, `normal`, `high` |

**Example:**

```yaml
- type: action
  action: create_task
  tool: tasks
  config:
    title: "Follow up with {{contact.name}}"
    description: "Re: quote {{quote.quote_number}}"
    due_date: "{{now | plus: 3 days}}"
    priority: high
```
```

---

## Adding a New Trigger

### When to Add

Add a new trigger when:
- A new integration supports webhook events
- You need to react to a new type of event

### Process

1. **Define the trigger event**

   Document in `docs/schema/automations.md` under Event Triggers:

   Add to the event patterns list:

   ```markdown
   # New category events
   new_entity.created
   new_entity.updated
   new_entity.status_changed
   ```

2. **Map from integration events**

   In `docs/schema/integrations.md`, document how the integration's native events map to Reckoning events:

   ```markdown
   | Integration Event | Reckoning Event |
   |-------------------|-----------------|
   | `native.event.name` | `entity.event` |
   ```

3. **Add to TypeScript types**

   The trigger type string should follow the pattern `{entity}.{event}`.

### Example: Adding Subscription Triggers

```markdown
# Subscription events
subscription.created
subscription.renewed
subscription.cancelled
subscription.payment_failed
```

In integrations.md (Stripe section):

```markdown
| Stripe Event | Reckoning Event |
|--------------|-----------------|
| `customer.subscription.created` | `subscription.created` |
| `invoice.paid` (for subscription) | `subscription.renewed` |
| `customer.subscription.deleted` | `subscription.cancelled` |
| `invoice.payment_failed` | `subscription.payment_failed` |
```

---

## Adding a New Integration

### When to Add

Add a new integration when:
- Customers commonly use a tool not currently supported
- An automation requires a capability only this tool provides

### Process

1. **Determine the category**

   Does it fit an existing category (calendar, accounting, etc.) or need a new one?

2. **Document capabilities**

   In `docs/schema/integrations.md`:

   ```markdown
   ### ToolName

   **Capabilities:**
   - Trigger on: list events
   - Actions: list supported actions
   - Read: what data can be read
   - Write: what can be created/updated

   **Required scopes/permissions:** list them

   **Entity mapping:**

   | Tool Field | Reckoning Field |
   |------------|-----------------|
   | ... | ... |

   **Status mapping:** (if applicable)

   | Tool Status | Reckoning Status |
   |-------------|------------------|
   | ... | ... |
   ```

3. **Add to automation templates**

   Update any automations that can now use this integration:

   ```yaml
   integrations:
     category: [existing_tool, new_tool]
   ```

### Example: Adding Acuity to Calendar Category

```markdown
### Acuity Scheduling

**Capabilities:**
- Trigger on: `appointment.created`, `appointment.cancelled`, `appointment.completed`, `appointment.no_show`
- Read: appointment details, customer info
- Write: update appointment status

**Required scopes:** Read appointments, webhooks, update appointments

**Entity mapping:**

| Acuity Field | Reckoning Field |
|--------------|-----------------|
| `id` | `id` |
| `type` | `name` |
| `datetime` | `start_time` |
| `endTime` | `end_time` |
| `firstName` + `lastName` | `customer.name` |
| `email` | `customer.email` |
| `phone` | `customer.telephone` |

**Status mapping:**

| Acuity Status | Reckoning Status |
|---------------|------------------|
| `scheduled` | `confirmed` |
| `canceled` | `cancelled` |
| `completed` | `completed` |
| `no-show` | `no_show` |
```

---

## Adding a New Filter

### When to Add

Add a new variable filter when you need to transform data in a way not covered by existing filters.

### Process

1. **Document in variables.md**

   Add to the appropriate filter category:

   ```markdown
   | `filter_name` | Description | `{{value \| filter_name}}` → "result" |
   ```

2. **Implement in code**

   Add the filter function to the variable interpolation system.

### Example: Adding a Pluralise Filter

```markdown
### String Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `pluralize` | Pluralise based on count | `{{count}} {{unit \| pluralize: count}}` → "3 days" |
```

---

## Versioning Extensions

### Minor Version (1.0 → 1.1)

For additions that don't break existing automations:
- New optional fields on entities
- New actions
- New triggers
- New integrations
- New filters

Update the version in all schema docs:
```markdown
**Version:** 1.1.0
```

### Major Version (1.x → 2.0)

For changes that break existing automations:
- Renaming existing fields
- Removing fields
- Changing field types
- Changing required/optional status

Process:
1. Document the breaking changes
2. Update all affected automations in the catalogue
3. Update TypeScript types
4. Run validation against existing automations
5. Update version to 2.0.0

---

## Checklist for Extensions

### New Entity
- [ ] Research existing standards
- [ ] Document in entities.md
- [ ] Add TypeScript types
- [ ] Document variables
- [ ] Create using automation

### New Action
- [ ] Document in automations.md
- [ ] Define config properties
- [ ] Document outputs (if any)
- [ ] Add to ActionType
- [ ] Add to integrations.md (if new tool)

### New Trigger
- [ ] Add event pattern
- [ ] Map from integration events
- [ ] Document in automations.md

### New Integration
- [ ] Determine category
- [ ] Document capabilities
- [ ] Map fields to schema
- [ ] Map status values
- [ ] Update automation integrations

---

## Questions?

If you're unsure whether an extension is needed or how to implement it:

1. Check if an existing entity/action can be adapted
2. Look at how similar tools model the concept
3. Start minimal — you can always add fields later

The goal is a schema that's useful for real automations, not theoretically complete.

---

*Back to: [Schema Overview](./README.md)*
