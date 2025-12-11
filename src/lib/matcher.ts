/**
 * Automation Matcher
 *
 * Selects the most relevant automations from the catalogue based on intake answers.
 * Uses a scoring system to rank automations by fit.
 *
 * @see docs/schema/README.md
 * @see src/data/automation-catalogue.ts
 */

import type {
  Automation,
  AutomationMatch,
  IntakeAnswers,
  BusinessStage,
  Vertical,
} from '@/types/automation'
import { getAllAutomations } from '@/data/automation-catalogue'

// =============================================================================
// SCORING WEIGHTS
// =============================================================================

/**
 * Weights for different matching criteria
 * Higher weight = more important in final score
 */
const WEIGHTS = {
  // Direct matches
  TIME_SINK_MATCH: 30, // Each matching time sink
  VERTICAL_MATCH: 20, // Matches their vertical
  STAGE_MATCH: 15, // Matches their business stage
  TOOL_MATCH: 10, // Each tool they already have

  // Bonuses
  ALL_VERTICALS_BONUS: 5, // Automation works for all verticals
  HIGH_TIME_SAVINGS_BONUS: 10, // Saves 3+ hours/week
  LOW_PRICE_BONUS: 10, // Under £100 (entry-level automation)

  // Penalties
  MISSING_TOOLS_PENALTY: -5, // Each required tool category they don't have
}

// =============================================================================
// TIME SINK MAPPING
// =============================================================================

/**
 * Maps intake answer options to catalogue time_sinks
 * Intake options are user-friendly; catalogue uses internal identifiers
 */
const TIME_SINK_MAP: Record<string, string[]> = {
  // Intake option → catalogue time_sinks
  'emails_and_messages': ['client_communication', 'admin'],
  'invoicing_and_payments': ['invoicing', 'chasing_payments', 'admin'],
  'scheduling_and_calendar': ['scheduling', 'calendar', 'no_shows'],
  'social_media': ['social', 'marketing', 'content'],
  'admin_and_data_entry': ['admin', 'data_entry'],
  'client_onboarding': ['client_communication', 'onboarding', 'admin'],
  'creating_content': ['content', 'marketing', 'social'],
  'chasing_clients': ['chasing_clients', 'chasing_payments', 'quotes'],
  'quotes_and_proposals': ['quotes', 'sales', 'admin'],
  'no_shows': ['no_shows', 'scheduling'],
  'reviews': ['reviews', 'marketing'],
  'retention': ['retention', 'client_communication'],
}

// =============================================================================
// TOOL MAPPING
// =============================================================================

/**
 * Maps intake tool options to integration categories
 */
const TOOL_TO_CATEGORY: Record<string, string[]> = {
  'google_workspace': ['email', 'calendar', 'storage'],
  'microsoft_365': ['email', 'calendar', 'storage'],
  'xero': ['accounting'],
  'quickbooks': ['accounting'],
  'calendly': ['calendar'],
  'acuity': ['calendar'],
  'stripe': ['payments', 'accounting'],
  'paypal': ['payments'],
  'mailchimp': ['email'],
  'convertkit': ['email'],
  'notion': ['storage'],
  'trello': ['storage'],
  'asana': ['storage'],
  'instagram': ['social'],
  'facebook': ['social'],
  'linkedin': ['social'],
}

// =============================================================================
// MATCHER FUNCTION
// =============================================================================

/**
 * Match automations to intake answers
 *
 * @param answers - The intake form answers
 * @param limit - Maximum number of matches to return (default: 3)
 * @returns Sorted array of matches with scores
 */
export function matchAutomations(
  answers: IntakeAnswers,
  limit: number = 3
): AutomationMatch[] {
  const automations = getAllAutomations()
  const matches: AutomationMatch[] = []

  for (const automation of automations) {
    const { score, reasons } = calculateScore(automation, answers)

    if (score > 0) {
      matches.push({
        automation,
        score,
        match_reasons: reasons,
      })
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score)

  // Return top N
  return matches.slice(0, limit)
}

// =============================================================================
// SCORING LOGIC
// =============================================================================

/**
 * Calculate match score for a single automation
 */
function calculateScore(
  automation: Automation,
  answers: IntakeAnswers
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // ---------------------------------------------
  // 1. TIME SINK MATCHING (most important)
  // ---------------------------------------------
  const matchedTimeSinks = getMatchingTimeSinks(
    answers.time_sinks,
    automation.time_sinks
  )

  if (matchedTimeSinks.length > 0) {
    score += matchedTimeSinks.length * WEIGHTS.TIME_SINK_MATCH
    reasons.push(`Addresses: ${matchedTimeSinks.join(', ')}`)
  }

  // ---------------------------------------------
  // 2. VERTICAL MATCHING
  // ---------------------------------------------
  if (automation.verticals.includes('all')) {
    score += WEIGHTS.ALL_VERTICALS_BONUS
    reasons.push('Works for all business types')
  } else if (
    answers.source_vertical &&
    automation.verticals.includes(answers.source_vertical)
  ) {
    score += WEIGHTS.VERTICAL_MATCH
    reasons.push(`Designed for ${answers.source_vertical}`)
  }

  // ---------------------------------------------
  // 3. BUSINESS STAGE MATCHING
  // ---------------------------------------------
  if (automation.business_stages.includes(answers.stage)) {
    score += WEIGHTS.STAGE_MATCH
    reasons.push(`Right for ${answers.stage} businesses`)
  }

  // ---------------------------------------------
  // 4. TOOL MATCHING
  // ---------------------------------------------
  const { matchingTools, missingCategories } = checkToolCompatibility(
    answers.tools,
    automation.integrations
  )

  if (matchingTools.length > 0) {
    score += matchingTools.length * WEIGHTS.TOOL_MATCH
    reasons.push(`Works with: ${matchingTools.join(', ')}`)
  }

  // Penalty for missing required tools
  score += missingCategories.length * WEIGHTS.MISSING_TOOLS_PENALTY

  // ---------------------------------------------
  // 5. BONUSES
  // ---------------------------------------------

  // High time savings
  if (automation.time_saved_weekly >= 3) {
    score += WEIGHTS.HIGH_TIME_SAVINGS_BONUS
    reasons.push(`Saves ${automation.time_saved_weekly}+ hours/week`)
  }

  // Low price / entry-level automation
  if (automation.service_price > 0 && automation.service_price < 100) {
    score += WEIGHTS.LOW_PRICE_BONUS
    reasons.push('Entry-level pricing')
  }

  // Cost savings (e.g., platform fees)
  if (automation.cost_saved_percentage && automation.cost_saved_percentage > 5) {
    score += 10
    reasons.push(`Saves ${automation.cost_saved_percentage}% in fees`)
  }

  return { score, reasons }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get time sinks that match between intake and automation
 */
function getMatchingTimeSinks(
  intakeTimeSinks: string[],
  automationTimeSinks: string[]
): string[] {
  const matches: string[] = []

  for (const intakeSink of intakeTimeSinks) {
    const mappedSinks = TIME_SINK_MAP[intakeSink] || [intakeSink]

    for (const mappedSink of mappedSinks) {
      if (automationTimeSinks.includes(mappedSink)) {
        // Return user-friendly name, not internal one
        if (!matches.includes(intakeSink)) {
          matches.push(intakeSink.replace(/_/g, ' '))
        }
        break
      }
    }
  }

  return matches
}

/**
 * Check if user's tools are compatible with automation requirements
 */
function checkToolCompatibility(
  userTools: string[],
  automationIntegrations: Automation['integrations']
): { matchingTools: string[]; missingCategories: string[] } {
  const matchingTools: string[] = []
  const missingCategories: string[] = []

  // Get all categories the user's tools provide
  const userCategories = new Set<string>()
  for (const tool of userTools) {
    const categories = TOOL_TO_CATEGORY[tool] || []
    for (const cat of categories) {
      userCategories.add(cat)
    }
  }

  // Check each required category
  for (const [category, tools] of Object.entries(automationIntegrations)) {
    if (!tools || tools.length === 0) continue

    // Check if user has any tool in this category
    const userHasCategory = userCategories.has(category)

    // Or if they have a specific tool the automation supports
    const userHasSpecificTool = userTools.some((userTool) => {
      const normalised = userTool.toLowerCase().replace(/\s+/g, '_')
      return tools.some((t) => t.toLowerCase() === normalised)
    })

    if (userHasCategory || userHasSpecificTool) {
      const matchedTool = userTools.find((t) => {
        const categories = TOOL_TO_CATEGORY[t] || []
        return categories.includes(category)
      })
      if (matchedTool) {
        matchingTools.push(matchedTool.replace(/_/g, ' '))
      }
    } else {
      // Skip 'automation' category — we provide this
      if (category !== 'automation') {
        missingCategories.push(category)
      }
    }
  }

  return { matchingTools, missingCategories }
}

// =============================================================================
// FORMATTING HELPERS
// =============================================================================

/**
 * Format time saved for display
 */
export function formatTimeSaved(hours: number): string {
  if (hours === 1) return '~1 hour/week'
  return `~${hours} hours/week`
}

/**
 * Format service price for display
 */
export function formatServicePrice(price: number): string {
  if (price === 0) return 'Free setup'
  return `£${price}`
}

/**
 * Get the primary time sink from intake answers
 */
export function getPrimaryTimeSink(timeSinks: string[]): string {
  if (timeSinks.length === 0) return 'admin tasks'

  // Return the first one (most important to user)
  return timeSinks[0].replace(/_/g, ' ')
}

/**
 * Calculate annual time savings
 */
export function calculateAnnualSavings(
  hoursPerWeek: number,
  weeksPerYear: number = 48
): { hours: number; display: string } {
  const hours = hoursPerWeek * weeksPerYear
  return {
    hours,
    display: `${hours} hours/year`,
  }
}

/**
 * Calculate value of time saved
 */
export function calculateTimeValue(
  hoursPerYear: number,
  hourlyRate: number
): { value: number; display: string } {
  const value = hoursPerYear * hourlyRate
  return {
    value,
    display: `£${value.toLocaleString()}`,
  }
}

// =============================================================================
// INTAKE OPTION DEFINITIONS
// =============================================================================

/**
 * Time sink options for the intake form
 * These map to the TIME_SINK_MAP keys
 */
export const TIME_SINK_OPTIONS = [
  { value: 'emails_and_messages', label: 'Emails and messages' },
  { value: 'invoicing_and_payments', label: 'Invoicing and chasing payments' },
  { value: 'scheduling_and_calendar', label: 'Scheduling and calendar' },
  { value: 'social_media', label: 'Social media' },
  { value: 'admin_and_data_entry', label: 'Admin and data entry' },
  { value: 'client_onboarding', label: 'Client onboarding' },
  { value: 'creating_content', label: 'Creating content' },
]

/**
 * Tool options for the intake form
 * These map to the TOOL_TO_CATEGORY keys
 */
export const TOOL_OPTIONS = [
  { value: 'google_workspace', label: 'Google Workspace' },
  { value: 'microsoft_365', label: 'Microsoft 365' },
  { value: 'xero', label: 'Xero' },
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'calendly', label: 'Calendly' },
  { value: 'acuity', label: 'Acuity' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'mailchimp', label: 'Mailchimp' },
  { value: 'convertkit', label: 'ConvertKit' },
  { value: 'notion', label: 'Notion' },
  { value: 'trello', label: 'Trello' },
  { value: 'asana', label: 'Asana' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
]

/**
 * Business stage options for the intake form
 */
export const STAGE_OPTIONS: Array<{ value: BusinessStage; label: string; description: string }> = [
  {
    value: 'launching',
    label: 'Just getting started',
    description: 'No customers yet',
  },
  {
    value: 'building',
    label: 'Got some customers',
    description: 'Building momentum',
  },
  {
    value: 'established',
    label: 'Established',
    description: 'Looking to scale or streamline',
  },
]
