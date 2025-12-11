'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { track, trackPageView, intakeFunnel, commerceFunnel, type AnalyticsEvent } from './index'

/**
 * React hook for analytics tracking
 *
 * Automatically tracks page views on route changes
 * and provides typed helpers for event tracking.
 *
 * Usage:
 * ```tsx
 * const { trackEvent, trackCTA, intake, commerce } = useAnalytics()
 *
 * // Track a CTA click
 * trackCTA('hero', '/start/time-audit')
 *
 * // Track intake funnel
 * intake.started('fitness')
 * intake.step('name', 'fitness')
 * intake.completed('fitness')
 *
 * // Track commerce funnel
 * commerce.addToCart('service-123')
 * commerce.checkoutStarted(199)
 * ```
 */
export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on route change
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname, searchParams])

  // Generic event tracker
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    track(event)
  }, [])

  // CTA click tracker with location context
  const trackCTA = useCallback((location: string, destination: string) => {
    track({
      type: 'cta_clicked',
      location,
      destination,
    })
  }, [])

  return {
    trackEvent,
    trackCTA,
    intake: intakeFunnel,
    commerce: commerceFunnel,
  }
}

/**
 * Hook specifically for intake flow tracking
 */
export function useIntakeAnalytics(vertical?: string) {
  const { intake } = useAnalytics()

  // Track intake start on mount
  useEffect(() => {
    intake.started(vertical)
  }, [vertical, intake])

  const trackStep = useCallback(
    (step: string) => {
      intake.step(step, vertical)
    },
    [vertical, intake]
  )

  const trackComplete = useCallback(() => {
    intake.completed(vertical)
  }, [vertical, intake])

  return {
    trackStep,
    trackComplete,
  }
}
