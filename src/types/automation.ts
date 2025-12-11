/**
 * Reckoning Automation Schema — TypeScript Types
 *
 * Version: 1.0.0
 *
 * These types are the canonical TypeScript representation of the schema
 * documented in docs/schema/. Keep them in sync.
 *
 * @see docs/schema/README.md
 * @see docs/schema/entities.md
 * @see docs/schema/automations.md
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * ISO 8601 datetime string
 * @example "2025-12-11T10:30:00Z"
 */
export type ISODateTime = string

/**
 * ISO 8601 date string (no time component)
 * @example "2025-12-11"
 */
export type ISODate = string

/**
 * ISO 4217 currency code
 * @example "GBP", "USD", "EUR"
 */
export type CurrencyCode = string

// =============================================================================
// ENTITIES — The nouns in a small business
// =============================================================================

/**
 * Postal address following Schema.org PostalAddress pattern
 * @see https://schema.org/PostalAddress
 */
export type Address = {
  street_address?: string
  address_locality?: string // City/town
  address_region?: string // State/county
  postal_code?: string
  address_country?: string // ISO 3166-1 alpha-2
}

/**
 * A person or organisation that interacts with the business
 * @see docs/schema/entities.md#contact
 */
export type Contact = {
  id: string
  type: 'person' | 'organization'

  // Names — Schema.org pattern
  name: string
  given_name?: string
  family_name?: string

  // Contact — Universal
  email: string
  telephone?: string

  // Address
  address?: Address

  // Classification
  tags?: string[]

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

/**
 * Appointment status values
 * Based on Calendly patterns
 */
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show'

/**
 * A scheduled service delivery
 * @see docs/schema/entities.md#appointment
 */
export type Appointment = {
  id: string

  // What
  name: string
  description?: string

  // When — iCalendar pattern
  start_time: ISODateTime
  end_time: ISODateTime

  // Where
  location?: string

  // Who
  provider: string // Provider ID
  customer: string // Contact ID

  // Status
  status: AppointmentStatus

  // Service details
  service_type?: string
  price?: number
  currency?: CurrencyCode

  // Notes
  notes?: string

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

/**
 * Line item on an invoice or quote
 * Based on Xero/Stripe patterns
 */
export type LineItem = {
  description: string
  quantity: number
  unit_amount: number
  amount: number
  tax_amount?: number
}

/**
 * Invoice status values
 * Based on Stripe patterns
 */
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'

/**
 * A request for payment
 * @see docs/schema/entities.md#invoice
 */
export type Invoice = {
  id: string

  // Identity
  invoice_number: string

  // Who
  customer: string // Contact ID
  provider: string // Provider ID

  // Money — Stripe pattern
  currency: CurrencyCode
  amount_due: number
  amount_paid: number
  amount_remaining: number

  // Content
  line_items: LineItem[]

  // Dates
  issue_date: ISODate
  due_date: ISODate
  paid_date?: ISODate

  // Status
  status: InvoiceStatus

  // Links
  payment_link?: string
  hosted_url?: string

  // Notes
  notes?: string

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

/**
 * Quote status values
 */
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'

/**
 * A proposal for work
 * @see docs/schema/entities.md#quote
 */
export type Quote = {
  id: string

  // Identity
  quote_number: string

  // Who
  customer: string
  provider: string

  // Money
  currency: CurrencyCode
  amount: number

  // Content
  description: string
  line_items?: LineItem[]

  // Dates
  issue_date: ISODate
  expiry_date: ISODate
  accepted_date?: ISODate

  // Status
  status: QuoteStatus

  // Notes
  notes?: string

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

/**
 * Message status values
 */
export type MessageStatus =
  | 'draft'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'opened'

/**
 * Message channel types
 */
export type MessageChannel = 'email' | 'sms'

/**
 * A communication sent to a contact
 * @see docs/schema/entities.md#message
 */
export type Message = {
  id: string

  // Type
  channel: MessageChannel

  // Who
  recipient: string // Contact ID, email, or phone
  sender?: string

  // Content
  subject?: string // Email only
  body: string
  template?: string

  // Status
  status: MessageStatus
  sent_at?: ISODateTime
  opened_at?: ISODateTime

  // Timestamps
  created_at: ISODateTime
}

/**
 * Event status values
 */
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

/**
 * A ticketed event
 * @see docs/schema/entities.md#event
 */
export type Event = {
  id: string

  // What
  name: string
  description?: string

  // When/Where
  start_time: ISODateTime
  end_time?: ISODateTime
  location?: string

  // Money
  price?: number
  currency?: CurrencyCode

  // Links
  payment_link?: string
  ticket_link?: string

  // Capacity
  capacity?: number
  attendee_count?: number

  // Status
  status: EventStatus

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

/**
 * Business vertical categories
 */
export type Vertical = 'fitness' | 'wellness' | 'trades' | 'events'

/**
 * The business using Reckoning
 * @see docs/schema/entities.md#provider
 */
export type Provider = {
  id: string

  // Identity
  name: string

  // Contact
  email: string
  telephone?: string
  website?: string

  // Links
  booking_link?: string
  payment_link?: string
  review_link?: string
  linktree_url?: string

  // Policies
  cancellation_policy?: string
  late_cancel_fee?: number

  // Defaults
  currency?: CurrencyCode

  // Branding
  logo_url?: string

  // Classification
  vertical?: Vertical

  // Timestamps
  created_at: ISODateTime
  updated_at: ISODateTime
}

// =============================================================================
// AUTOMATIONS — Workflow definitions
// =============================================================================

/**
 * Automation categories
 */
export type AutomationCategory =
  | 'scheduling'
  | 'payments'
  | 'communications'
  | 'admin'
  | 'social'

/**
 * Business stages
 */
export type BusinessStage = 'launching' | 'building' | 'established'

/**
 * Vertical with 'all' option for automations
 */
export type AutomationVertical = Vertical | 'all'

// -----------------------------------------------------------------------------
// Triggers
// -----------------------------------------------------------------------------

/**
 * Event-based trigger
 */
export type EventTrigger = {
  type: 'event'
  source: string // e.g., 'calendar', 'accounting', 'payments'
  event: string // e.g., 'appointment.created', 'invoice.paid'
}

/**
 * Duration for waits and schedules
 */
export type Duration = {
  value: number
  unit: 'minutes' | 'hours' | 'days' | 'weeks'
}

/**
 * Schedule-based trigger
 */
export type ScheduleTrigger = {
  type: 'schedule'
  cron?: string // Cron expression
  interval?: Duration
}

/**
 * Manual trigger (business owner initiates)
 */
export type ManualTrigger = {
  type: 'manual'
  source: 'provider'
  event: string
}

/**
 * All trigger types
 */
export type Trigger = EventTrigger | ScheduleTrigger | ManualTrigger

// -----------------------------------------------------------------------------
// Steps
// -----------------------------------------------------------------------------

/**
 * Wait step — pause execution
 */
export type WaitStep = {
  type: 'wait'
  duration?: Duration
  until?: string // Template expression for datetime
}

/**
 * Condition operators
 */
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'

/**
 * Condition step — check before continuing
 */
export type ConditionStep = {
  type: 'condition'
  field: string
  operator: ConditionOperator
  value: unknown
}

/**
 * Available action types
 */
export type ActionType =
  | 'send_email'
  | 'send_sms'
  | 'create_invoice'
  | 'create_payment_link'
  | 'add_to_linktree'
  | 'update_record'
  | 'create_task'
  | 'webhook'

/**
 * Action step — do something
 */
export type ActionStep = {
  type: 'action'
  action: ActionType
  tool?: string
  config: Record<string, unknown>
  optional?: boolean
  conditional?: boolean
}

/**
 * Branch step — split into paths
 */
export type BranchStep = {
  type: 'branch'
  branches: Array<{
    condition: ConditionStep
    steps: Step[]
  }>
}

/**
 * All step types
 */
export type Step = WaitStep | ConditionStep | ActionStep | BranchStep

// -----------------------------------------------------------------------------
// Outputs
// -----------------------------------------------------------------------------

/**
 * Output produced by an automation
 */
export type AutomationOutput = {
  name: string
  value: string // Template expression
}

// -----------------------------------------------------------------------------
// Integration Requirements
// -----------------------------------------------------------------------------

/**
 * Integration categories and their supported tools
 */
export type IntegrationRequirements = {
  calendar?: string[]
  accounting?: string[]
  payments?: string[]
  email?: string[]
  sms?: string[]
  automation?: string[]
  crm?: string[]
  link_in_bio?: string[]
  forms?: string[]
  storage?: string[]
  [category: string]: string[] | undefined
}

// -----------------------------------------------------------------------------
// Full Automation Definition
// -----------------------------------------------------------------------------

/**
 * Complete automation definition
 * @see docs/schema/automations.md
 */
export type Automation = {
  id: string
  name: string
  description: string

  // Classification
  category: AutomationCategory
  verticals: AutomationVertical[]
  business_stages: BusinessStage[]

  // Workflow
  trigger: Trigger
  steps: Step[]

  // Outputs
  outputs?: AutomationOutput[]

  // Matching metadata
  time_sinks: string[]

  // Integrations
  integrations: IntegrationRequirements

  // Pricing
  time_saved_weekly: number
  cost_saved_percentage?: number
  service_price: number
  service_id: string

  // Notes
  notes?: string
}

// =============================================================================
// CATALOGUE TYPES — For the automation catalogue
// =============================================================================

/**
 * The full automation catalogue
 */
export type AutomationCatalogue = {
  version: string
  automations: Automation[]
}

// =============================================================================
// MATCHER TYPES — For selecting automations
// =============================================================================

/**
 * Intake answers used for matching
 */
export type IntakeAnswers = {
  name: string
  business: string
  stage: BusinessStage
  hours_per_week: number
  time_sinks: string[]
  biggest_frustration: string
  tools: string[]
  email: string
  source_vertical?: Vertical
}

/**
 * Match result with score
 */
export type AutomationMatch = {
  automation: Automation
  score: number
  match_reasons: string[]
}

// =============================================================================
// DIAGNOSTIC TYPES — For the output
// =============================================================================

/**
 * A single opportunity in the diagnostic
 */
export type DiagnosticOpportunity = {
  automation: Automation
  headline: string
  description: string
  time_saved_display: string
  service_cta?: {
    price_display: string
    service_id: string
  }
}

/**
 * The full diagnostic output
 */
export type Diagnostic = {
  id: string
  token: string

  // Recipient
  recipient: {
    name: string
    business: string
    stage: BusinessStage
  }

  // Summary
  summary: {
    hours_per_week: number
    top_time_sink: string
    total_recoverable_hours: number
  }

  // The opportunities
  opportunities: DiagnosticOpportunity[]

  // The maths
  calculation?: {
    hours_per_week: number
    weeks_per_year: number
    annual_hours: number
    hourly_value?: number
    annual_value?: number
  }

  // Next step
  next_step: {
    action: string
    why: string
  }

  // Metadata
  source_vertical?: Vertical
  created_at: ISODateTime
}
