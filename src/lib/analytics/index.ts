/**
 * Privacy-Respecting Analytics
 *
 * Lightweight analytics tracking that:
 * - Respects Do Not Track
 * - Doesn't use cookies for tracking
 * - Can integrate with Plausible, Fathom, or custom backend
 * - Tracks funnel events for business metrics
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 */

export type AnalyticsEvent =
  // Page views
  | { type: 'page_view'; path: string; referrer?: string }
  // Funnel events
  | { type: 'intake_started'; vertical?: string }
  | { type: 'intake_step'; step: string; vertical?: string }
  | { type: 'intake_completed'; vertical?: string; email_hash?: string }
  | { type: 'results_viewed'; token: string; automation_count: number }
  // Engagement events
  | { type: 'cta_clicked'; location: string; destination: string }
  | { type: 'automation_expanded'; automation_id: string }
  | { type: 'service_added_to_cart'; service_id: string }
  | { type: 'checkout_started'; cart_total: number }
  | { type: 'checkout_completed'; order_id: string }

interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  endpoint?: string
  // Third-party integrations
  plausibleDomain?: string
  fathomSiteId?: string
}

const defaultConfig: AnalyticsConfig = {
  enabled: typeof window !== 'undefined' && process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
}

let config: AnalyticsConfig = { ...defaultConfig }

/**
 * Initialize analytics with optional config
 */
export function initAnalytics(customConfig?: Partial<AnalyticsConfig>) {
  config = { ...defaultConfig, ...customConfig }
}

/**
 * Check if user has Do Not Track enabled
 */
function hasDoNotTrack(): boolean {
  if (typeof window === 'undefined') return true

  const dnt =
    navigator.doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack ||
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack

  return dnt === '1' || dnt === 'yes'
}

/**
 * Track an analytics event
 */
export function track(event: AnalyticsEvent) {
  // Respect Do Not Track
  if (hasDoNotTrack()) {
    if (config.debug) {
      console.log('[Analytics] DNT enabled, skipping:', event.type)
    }
    return
  }

  // Debug logging in development
  if (config.debug) {
    console.log('[Analytics]', event)
  }

  // Don't track in development unless explicitly enabled
  if (!config.enabled) {
    return
  }

  // Send to custom endpoint if configured
  if (config.endpoint) {
    sendToEndpoint(event)
  }

  // Send to Plausible if configured
  if (config.plausibleDomain && typeof window !== 'undefined') {
    sendToPlausible(event)
  }

  // Send to Fathom if configured
  if (config.fathomSiteId && typeof window !== 'undefined') {
    sendToFathom(event)
  }
}

/**
 * Send event to custom backend endpoint
 */
async function sendToEndpoint(event: AnalyticsEvent) {
  if (!config.endpoint) return

  try {
    await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
      // Don't wait for response, fire and forget
      keepalive: true,
    })
  } catch {
    // Silently fail - analytics shouldn't break the app
    if (config.debug) {
      console.warn('[Analytics] Failed to send event')
    }
  }
}

/**
 * Send event to Plausible Analytics
 */
function sendToPlausible(event: AnalyticsEvent) {
  // Plausible expects events in a specific format
  const plausible = (window as unknown as { plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void }).plausible

  if (!plausible) {
    if (config.debug) {
      console.warn('[Analytics] Plausible not loaded')
    }
    return
  }

  // Convert our event to Plausible format
  const eventName = event.type.replace(/_/g, ' ')
  const props: Record<string, unknown> = {}

  // Extract props from event
  Object.entries(event).forEach(([key, value]) => {
    if (key !== 'type') {
      props[key] = value
    }
  })

  plausible(eventName, { props })
}

/**
 * Send event to Fathom Analytics
 */
function sendToFathom(event: AnalyticsEvent) {
  const fathom = (window as unknown as { fathom?: { trackGoal: (id: string, value: number) => void } }).fathom

  if (!fathom) {
    if (config.debug) {
      console.warn('[Analytics] Fathom not loaded')
    }
    return
  }

  // Fathom uses goal IDs - you'd need to map event types to goal IDs
  // This is a simplified example
  const goalMap: Record<string, string> = {
    intake_completed: 'INTAKE_COMPLETED_GOAL_ID',
    checkout_completed: 'CHECKOUT_COMPLETED_GOAL_ID',
  }

  const goalId = goalMap[event.type]
  if (goalId) {
    fathom.trackGoal(goalId, 0)
  }
}

/**
 * Helper to track page views (call from layout or page components)
 */
export function trackPageView(path?: string) {
  track({
    type: 'page_view',
    path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  })
}

/**
 * Helper to track CTA clicks
 */
export function trackCTA(location: string, destination: string) {
  track({
    type: 'cta_clicked',
    location,
    destination,
  })
}

/**
 * Helper for intake funnel tracking
 */
export const intakeFunnel = {
  started: (vertical?: string) => track({ type: 'intake_started', vertical }),
  step: (step: string, vertical?: string) => track({ type: 'intake_step', step, vertical }),
  completed: (vertical?: string) => track({ type: 'intake_completed', vertical }),
}

/**
 * Helper for e-commerce funnel tracking
 */
export const commerceFunnel = {
  addToCart: (serviceId: string) => track({ type: 'service_added_to_cart', service_id: serviceId }),
  checkoutStarted: (total: number) => track({ type: 'checkout_started', cart_total: total }),
  checkoutCompleted: (orderId: string) => track({ type: 'checkout_completed', order_id: orderId }),
}
