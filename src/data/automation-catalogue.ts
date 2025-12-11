/**
 * Reckoning Automation Catalogue
 *
 * This is the source of truth for automations. Each definition is schema-compliant
 * and machine-readable, ready for the matcher to select and the configurator to deploy.
 *
 * @see docs/schema/README.md
 * @see src/types/automation.ts
 */

import type { Automation, AutomationCatalogue } from '@/types/automation'

// =============================================================================
// AUTOMATION DEFINITIONS
// =============================================================================

const eventPaymentLinks: Automation = {
  id: 'event-payment-links',
  name: 'Event Payment Links',
  description:
    'Replace 10% platform fees with direct Stripe links via Linktree.',

  category: 'payments',
  verticals: ['events', 'fitness'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'manual',
    source: 'provider',
    event: 'event.created',
  },

  steps: [
    {
      type: 'action',
      action: 'create_payment_link',
      tool: 'stripe',
      config: {
        name: '{{event.name}}',
        price: '{{event.price}}',
        currency: '{{event.currency}}',
        description: '{{event.description}}',
      },
    },
    {
      type: 'action',
      action: 'add_to_linktree',
      tool: 'linktree',
      config: {
        title: '{{event.name}}',
        url: '{{stripe.payment_link_url}}',
        position: 'top',
      },
    },
  ],

  outputs: [
    { name: 'payment_link_url', value: '{{stripe.payment_link_url}}' },
    { name: 'linktree_url', value: '{{linktree.profile_url}}' },
  ],

  time_sinks: ['payment_processing', 'platform_fees', 'admin'],

  integrations: {
    payments: ['stripe'],
    link_in_bio: ['linktree'],
  },

  time_saved_weekly: 2,
  cost_saved_percentage: 8.5, // 10% platform fee → 1.5% Stripe fee
  service_price: 99,
  service_id: 'event-payments-setup',

  notes: `Gateway automation. Demonstrates immediate value — customer sees fee savings from day one. Customer owns everything — Stripe account, Linktree account, bank connection. No lock-in.`,
}

const invoiceReminderSequence: Automation = {
  id: 'invoice-reminder-sequence',
  name: 'Invoice Reminder Sequence',
  description: 'Automatic payment reminders at 7, 14, and 21 days.',

  category: 'payments',
  verticals: ['all'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'accounting',
    event: 'invoice.created',
  },

  steps: [
    {
      type: 'wait',
      duration: { value: 7, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'invoice.status',
      operator: 'not_equals',
      value: 'paid',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{invoice.customer.email}}',
        subject: 'Friendly reminder: Invoice {{invoice.invoice_number}}',
        template: 'invoice_reminder_1',
      },
    },
    {
      type: 'wait',
      duration: { value: 7, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'invoice.status',
      operator: 'not_equals',
      value: 'paid',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{invoice.customer.email}}',
        subject: 'Following up: Invoice {{invoice.invoice_number}}',
        template: 'invoice_reminder_2',
      },
    },
    {
      type: 'wait',
      duration: { value: 7, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'invoice.status',
      operator: 'not_equals',
      value: 'paid',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{invoice.customer.email}}',
        subject: 'Final reminder: Invoice {{invoice.invoice_number}}',
        template: 'invoice_reminder_3',
      },
    },
  ],

  time_sinks: ['invoicing', 'chasing_payments', 'admin'],

  integrations: {
    accounting: ['xero', 'quickbooks', 'stripe'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 2,
  service_price: 199,
  service_id: 'invoice-reminders',
}

const appointmentConfirmationReminder: Automation = {
  id: 'appointment-confirmation-reminder',
  name: 'Appointment Confirmation + Reminder',
  description: 'Automatic confirmation when booked, reminder 24h before.',

  category: 'scheduling',
  verticals: ['fitness', 'wellness'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'calendar',
    event: 'appointment.created',
  },

  steps: [
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject:
          'Confirmed: {{appointment.name}} on {{appointment.start_time | date}}',
        template: 'appointment_confirmation',
      },
    },
    {
      type: 'wait',
      until: '{{appointment.start_time | minus: 24 hours}}',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject: 'Reminder: {{appointment.name}} tomorrow',
        template: 'appointment_reminder',
      },
    },
    {
      type: 'action',
      action: 'send_sms',
      tool: 'sms',
      optional: true,
      config: {
        to: '{{appointment.customer.telephone}}',
        message:
          'Reminder: {{appointment.name}} tomorrow at {{appointment.start_time | time}}. See you there! — {{provider.name}}',
      },
    },
  ],

  time_sinks: ['scheduling', 'calendar', 'no_shows', 'client_communication'],

  integrations: {
    calendar: ['calendly', 'acuity', 'google_calendar'],
    email: ['gmail', 'smtp'],
    sms: ['twilio'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 3,
  service_price: 149,
  service_id: 'appointment-reminders',
}

const noShowFollowup: Automation = {
  id: 'no-show-followup',
  name: 'No-Show Follow-up',
  description:
    'Automatic follow-up when client doesn\'t show. Rebook or apply fee.',

  category: 'communications',
  verticals: ['fitness', 'wellness'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'calendar',
    event: 'appointment.no_show',
  },

  steps: [
    {
      type: 'wait',
      duration: { value: 1, unit: 'hours' },
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject: 'We missed you today',
        template: 'no_show_followup',
      },
    },
    {
      type: 'condition',
      field: 'provider.late_cancel_fee',
      operator: 'greater_than',
      value: 0,
    },
    {
      type: 'action',
      action: 'create_invoice',
      tool: 'accounting',
      conditional: true,
      config: {
        customer: '{{appointment.customer.id}}',
        amount: '{{provider.late_cancel_fee}}',
        currency: '{{provider.currency}}',
        description:
          'Late cancellation fee — {{appointment.name}} on {{appointment.start_time | date}}',
      },
    },
  ],

  time_sinks: ['no_shows', 'chasing_clients', 'scheduling'],

  integrations: {
    calendar: ['calendly', 'acuity'],
    email: ['gmail', 'smtp'],
    accounting: ['xero', 'stripe'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 1,
  service_price: 99,
  service_id: 'no-show-automation',
}

const quoteFollowupSequence: Automation = {
  id: 'quote-followup-sequence',
  name: 'Quote Follow-up Sequence',
  description:
    'Automatic follow-ups at 2, 5, and 10 days after sending a quote.',

  category: 'communications',
  verticals: ['trades', 'events'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'accounting',
    event: 'quote.sent',
  },

  steps: [
    {
      type: 'wait',
      duration: { value: 2, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'quote.status',
      operator: 'equals',
      value: 'sent',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{quote.customer.email}}',
        subject: 'Following up on your quote',
        template: 'quote_followup_1',
      },
    },
    {
      type: 'wait',
      duration: { value: 3, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'quote.status',
      operator: 'equals',
      value: 'sent',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{quote.customer.email}}',
        subject: 'Any questions about the quote?',
        template: 'quote_followup_2',
      },
    },
    {
      type: 'wait',
      duration: { value: 5, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'quote.status',
      operator: 'equals',
      value: 'sent',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{quote.customer.email}}',
        subject: 'Last chance: Your quote expires soon',
        template: 'quote_followup_3',
      },
    },
  ],

  time_sinks: ['quotes', 'chasing_clients', 'admin', 'sales'],

  integrations: {
    accounting: ['xero', 'quickbooks'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 2,
  service_price: 149,
  service_id: 'quote-followup',
}

const rebookingPrompt: Automation = {
  id: 'rebooking-prompt',
  name: 'Rebooking Prompt',
  description:
    'Automatic "book your next session" email after appointment completes.',

  category: 'scheduling',
  verticals: ['fitness', 'wellness'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'calendar',
    event: 'appointment.completed',
  },

  steps: [
    {
      type: 'wait',
      duration: { value: 2, unit: 'hours' },
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject: 'Book your next {{appointment.name}}',
        template: 'rebooking_prompt',
      },
    },
  ],

  time_sinks: ['scheduling', 'client_communication', 'retention'],

  integrations: {
    calendar: ['calendly', 'acuity', 'google_calendar'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 1,
  service_price: 79,
  service_id: 'rebooking-automation',
}

const reviewRequest: Automation = {
  id: 'review-request',
  name: 'Review Request',
  description: 'Automatic review request after service completion.',

  category: 'communications',
  verticals: ['all'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'calendar',
    event: 'appointment.completed',
  },

  steps: [
    {
      type: 'wait',
      duration: { value: 1, unit: 'days' },
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject: 'How was your experience with {{provider.name}}?',
        template: 'review_request',
      },
    },
  ],

  time_sinks: ['reviews', 'marketing', 'client_communication'],

  integrations: {
    calendar: ['calendly', 'acuity', 'google_calendar'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 1,
  service_price: 79,
  service_id: 'review-automation',
}

const clientInactiveReengagement: Automation = {
  id: 'client-inactive-reengagement',
  name: 'Client Re-engagement',
  description:
    'Automatic "we miss you" email when client hasn\'t booked in 4+ weeks.',

  category: 'communications',
  verticals: ['fitness', 'wellness'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'schedule',
    interval: { value: 1, unit: 'weeks' },
  },

  steps: [
    {
      type: 'condition',
      field: 'customer.last_appointment_date',
      operator: 'less_than',
      value: '{{now | minus: 4 weeks}}',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{customer.email}}',
        subject: 'We miss you at {{provider.name}}',
        template: 'client_reengagement',
      },
    },
  ],

  time_sinks: ['retention', 'client_communication', 'marketing'],

  integrations: {
    calendar: ['calendly', 'acuity'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 1,
  service_price: 149,
  service_id: 'reengagement-automation',
}

const sessionCompleteInvoice: Automation = {
  id: 'session-complete-invoice',
  name: 'Session Complete → Invoice',
  description: 'Automatic invoice sent immediately when session completes.',

  category: 'payments',
  verticals: ['fitness', 'wellness', 'trades'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'calendar',
    event: 'appointment.completed',
  },

  steps: [
    {
      type: 'action',
      action: 'create_invoice',
      tool: 'accounting',
      config: {
        customer: '{{appointment.customer.id}}',
        amount: '{{appointment.price}}',
        currency: '{{provider.currency}}',
        description:
          '{{appointment.name}} — {{appointment.start_time | date}}',
      },
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{appointment.customer.email}}',
        subject: 'Invoice for {{appointment.name}}',
        template: 'invoice_sent',
      },
    },
  ],

  time_sinks: ['invoicing', 'admin', 'chasing_payments'],

  integrations: {
    calendar: ['calendly', 'acuity', 'google_calendar'],
    accounting: ['xero', 'quickbooks', 'stripe'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 2,
  service_price: 179,
  service_id: 'auto-invoice',
}

const depositReminderSequence: Automation = {
  id: 'deposit-reminder-sequence',
  name: 'Deposit Reminder Sequence',
  description: 'Automatic reminders until deposit is paid.',

  category: 'payments',
  verticals: ['events', 'trades'],
  business_stages: ['building', 'established'],

  trigger: {
    type: 'event',
    source: 'accounting',
    event: 'invoice.created',
  },

  steps: [
    {
      type: 'condition',
      field: 'invoice.description',
      operator: 'contains',
      value: 'deposit',
    },
    {
      type: 'wait',
      duration: { value: 3, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'invoice.status',
      operator: 'not_equals',
      value: 'paid',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{invoice.customer.email}}',
        subject: 'Deposit reminder for {{provider.name}}',
        template: 'deposit_reminder_1',
      },
    },
    {
      type: 'wait',
      duration: { value: 4, unit: 'days' },
    },
    {
      type: 'condition',
      field: 'invoice.status',
      operator: 'not_equals',
      value: 'paid',
    },
    {
      type: 'action',
      action: 'send_email',
      tool: 'email',
      config: {
        to: '{{invoice.customer.email}}',
        subject: 'Final reminder: Deposit needed to secure your booking',
        template: 'deposit_reminder_2',
      },
    },
  ],

  time_sinks: ['deposits', 'chasing_payments', 'admin'],

  integrations: {
    accounting: ['xero', 'quickbooks', 'stripe'],
    email: ['gmail', 'smtp'],
    automation: ['zapier', 'make'],
  },

  time_saved_weekly: 2,
  service_price: 149,
  service_id: 'deposit-reminders',
}

// =============================================================================
// CATALOGUE EXPORT
// =============================================================================

export const automationCatalogue: AutomationCatalogue = {
  version: '1.0.0',
  automations: [
    eventPaymentLinks,
    invoiceReminderSequence,
    appointmentConfirmationReminder,
    noShowFollowup,
    quoteFollowupSequence,
    rebookingPrompt,
    reviewRequest,
    clientInactiveReengagement,
    sessionCompleteInvoice,
    depositReminderSequence,
  ],
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all automations in the catalogue
 */
export function getAllAutomations(): Automation[] {
  return automationCatalogue.automations
}

/**
 * Get automation by ID
 */
export function getAutomationById(id: string): Automation | undefined {
  return automationCatalogue.automations.find((a) => a.id === id)
}

/**
 * Get automations by category
 */
export function getAutomationsByCategory(
  category: Automation['category']
): Automation[] {
  return automationCatalogue.automations.filter((a) => a.category === category)
}

/**
 * Get automations by vertical
 */
export function getAutomationsByVertical(vertical: string): Automation[] {
  return automationCatalogue.automations.filter(
    (a) => a.verticals.includes('all') || a.verticals.includes(vertical as any)
  )
}

/**
 * Get automations by time sink
 */
export function getAutomationsByTimeSink(timeSink: string): Automation[] {
  return automationCatalogue.automations.filter((a) =>
    a.time_sinks.includes(timeSink)
  )
}
