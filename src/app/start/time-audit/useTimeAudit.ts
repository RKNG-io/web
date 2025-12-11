'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { BusinessStage, IntakeAnswers, Vertical } from '@/types/automation'

/**
 * V2 Time Audit Intake Hook
 *
 * Manages state for the simplified 8-screen intake flow:
 * 1. Name
 * 2. Business (what they do)
 * 3. Stage (launching/building/established)
 * 4. Hours per week (on admin/repetitive tasks)
 * 5. Time sinks (multi-select, max 3)
 * 6. Biggest frustration (text)
 * 7. Tools (multi-select)
 * 8. Email
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 */

export type TimeAuditStep =
  | 'name'
  | 'business'
  | 'stage'
  | 'hours'
  | 'time_sinks'
  | 'frustration'
  | 'tools'
  | 'email'
  | 'submitting'
  | 'complete'

export interface TimeAuditState {
  step: TimeAuditStep
  name: string
  business: string
  stage: BusinessStage | null
  hours_per_week: number | null
  time_sinks: string[]
  biggest_frustration: string
  tools: string[]
  email: string
  // Optional: which vertical landing page they came from
  source_vertical?: Vertical
}

interface SavedProgress {
  state: TimeAuditState
  savedAt: number
  version: number
}

const STORAGE_KEY = 'reckoning_time_audit'
const STORAGE_VERSION = 1
const EXPIRY_HOURS = 72

const STEP_ORDER: TimeAuditStep[] = [
  'name',
  'business',
  'stage',
  'hours',
  'time_sinks',
  'frustration',
  'tools',
  'email',
]

const initialState: TimeAuditState = {
  step: 'name',
  name: '',
  business: '',
  stage: null,
  hours_per_week: null,
  time_sinks: [],
  biggest_frustration: '',
  tools: [],
  email: '',
}

function isValidSavedProgress(data: unknown): data is SavedProgress {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.savedAt === 'number' &&
    typeof obj.version === 'number' &&
    obj.version === STORAGE_VERSION &&
    obj.state !== undefined &&
    typeof (obj.state as Record<string, unknown>).step === 'string'
  )
}

function isExpired(savedAt: number): boolean {
  const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000
  return Date.now() - savedAt > expiryMs
}

// Helper to load state from localStorage (for lazy init)
function loadSavedState(sourceVertical?: Vertical): {
  state: TimeAuditState
  hasSavedProgress: boolean
} {
  if (typeof window === 'undefined') {
    return {
      state: { ...initialState, source_vertical: sourceVertical },
      hasSavedProgress: false,
    }
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (isValidSavedProgress(parsed)) {
        if (isExpired(parsed.savedAt)) {
          localStorage.removeItem(STORAGE_KEY)
        } else {
          return {
            state: {
              ...parsed.state,
              source_vertical: sourceVertical || parsed.state.source_vertical,
            },
            hasSavedProgress: parsed.state.step !== 'name',
          }
        }
      }
    }
  } catch (e) {
    console.error('Could not parse saved state:', e)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    state: { ...initialState, source_vertical: sourceVertical },
    hasSavedProgress: false,
  }
}

export function useTimeAudit(sourceVertical?: Vertical) {
  // Use lazy initialization to load from localStorage
  const [state, setState] = useState<TimeAuditState>(() => {
    return loadSavedState(sourceVertical).state
  })
  // Start hydrated as true on client, false on server
  // This avoids needing to call setState in an effect
  const [isHydrated] = useState(() => typeof window !== 'undefined')
  const [hasSavedProgress, setHasSavedProgress] = useState(() => {
    return loadSavedState(sourceVertical).hasSavedProgress
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return

    const progress: SavedProgress = {
      state,
      savedAt: Date.now(),
      version: STORAGE_VERSION,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [state, isHydrated])

  // Current step index
  const stepIndex = useMemo(
    () => STEP_ORDER.indexOf(state.step as TimeAuditStep),
    [state.step]
  )

  // Progress percentage
  const progress = useMemo(() => {
    const idx = stepIndex >= 0 ? stepIndex : 0
    return Math.round(((idx + 1) / STEP_ORDER.length) * 100)
  }, [stepIndex])

  // Can proceed to next step?
  const canProceed = useMemo(() => {
    switch (state.step) {
      case 'name':
        return state.name.trim().length > 0
      case 'business':
        return state.business.trim().length > 0
      case 'stage':
        return state.stage !== null
      case 'hours':
        return state.hours_per_week !== null && state.hours_per_week > 0
      case 'time_sinks':
        return state.time_sinks.length > 0 && state.time_sinks.length <= 3
      case 'frustration':
        return state.biggest_frustration.trim().length > 0
      case 'tools':
        return state.tools.length > 0
      case 'email':
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
      default:
        return false
    }
  }, [state])

  // Is this the last question step?
  const isLastStep = state.step === 'email'

  // Update a single field
  const setField = useCallback(
    <K extends keyof TimeAuditState>(field: K, value: TimeAuditState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  // Toggle an item in an array field
  const toggleArrayItem = useCallback(
    (field: 'time_sinks' | 'tools', value: string, maxItems?: number) => {
      setState((prev) => {
        const current = prev[field]
        if (current.includes(value)) {
          return { ...prev, [field]: current.filter((v) => v !== value) }
        }
        // Enforce max items if specified
        if (maxItems && current.length >= maxItems) {
          return prev
        }
        return { ...prev, [field]: [...current, value] }
      })
    },
    []
  )

  // Move to next step
  const nextStep = useCallback(() => {
    const currentIndex = stepIndex
    if (currentIndex >= 0 && currentIndex < STEP_ORDER.length - 1) {
      setState((prev) => ({ ...prev, step: STEP_ORDER[currentIndex + 1] }))
    }
  }, [stepIndex])

  // Move to previous step
  const prevStep = useCallback(() => {
    const currentIndex = stepIndex
    if (currentIndex > 0) {
      setState((prev) => ({ ...prev, step: STEP_ORDER[currentIndex - 1] }))
    }
  }, [stepIndex])

  // Reset to beginning
  const reset = useCallback(() => {
    setState({ ...initialState, source_vertical: sourceVertical })
    localStorage.removeItem(STORAGE_KEY)
    setHasSavedProgress(false)
  }, [sourceVertical])

  // Resume from saved progress
  const resumeProgress = useCallback(() => {
    setHasSavedProgress(false)
  }, [])

  // Start over (from resume prompt)
  const startOver = useCallback(() => {
    reset()
  }, [reset])

  // Mark as submitting
  const setSubmitting = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'submitting' }))
  }, [])

  // Mark as complete
  const setComplete = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'complete' }))
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Get answers in the format expected by the matcher
  const getIntakeAnswers = useCallback((): IntakeAnswers | null => {
    if (
      !state.name ||
      !state.business ||
      !state.stage ||
      !state.hours_per_week ||
      !state.time_sinks.length ||
      !state.tools.length ||
      !state.email
    ) {
      return null
    }

    return {
      name: state.name,
      business: state.business,
      stage: state.stage,
      hours_per_week: state.hours_per_week,
      time_sinks: state.time_sinks,
      biggest_frustration: state.biggest_frustration,
      tools: state.tools,
      email: state.email,
      source_vertical: state.source_vertical,
    }
  }, [state])

  return {
    state,
    isHydrated,
    hasSavedProgress,
    stepIndex,
    progress,
    canProceed,
    isLastStep,
    setField,
    toggleArrayItem,
    nextStep,
    prevStep,
    reset,
    resumeProgress,
    startOver,
    setSubmitting,
    setComplete,
    getIntakeAnswers,
  }
}
