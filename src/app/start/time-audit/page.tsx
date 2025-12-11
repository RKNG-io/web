'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTimeAudit } from './useTimeAudit'
import {
  TIME_SINK_OPTIONS,
  TOOL_OPTIONS,
  STAGE_OPTIONS,
} from '@/lib/matcher'
import type { BusinessStage, Vertical } from '@/types/automation'

/**
 * V2 Time Audit Intake Flow
 *
 * 8 screens:
 * 1. Name
 * 2. Business (what they do)
 * 3. Stage (launching/building/established)
 * 4. Hours per week on admin/repetitive tasks
 * 5. Time sinks (multi-select, max 3)
 * 6. Biggest frustration (text)
 * 7. Tools (multi-select)
 * 8. Email
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 */

// Hours options for step 4
const HOURS_OPTIONS = [
  { value: 2, label: '1-2 hours' },
  { value: 5, label: '3-5 hours' },
  { value: 8, label: '6-10 hours' },
  { value: 15, label: '10+ hours' },
]

function TimeAuditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sourceVertical = searchParams.get('from') as Vertical | null

  const {
    state,
    isHydrated,
    hasSavedProgress,
    stepIndex,
    canProceed,
    isLastStep,
    setField,
    toggleArrayItem,
    nextStep,
    prevStep,
    resumeProgress,
    startOver,
    setSubmitting,
    setComplete,
    getIntakeAnswers,
  } = useTimeAudit(sourceVertical || undefined)

  const [isSubmitting, setIsSubmittingLocal] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Handle form submission
  const handleSubmit = async () => {
    const answers = getIntakeAnswers()
    if (!answers) return

    setIsSubmittingLocal(true)
    setSubmitError(null)
    setSubmitting()

    try {
      const response = await fetch('/api/intake/time-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setComplete()

      // Redirect to diagnostic results
      if (data.token) {
        router.push(`/diagnostic/${data.token}`)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmittingLocal(false)
    }
  }

  // Handle next/submit button
  const handleNext = () => {
    if (isLastStep) {
      handleSubmit()
    } else {
      nextStep()
    }
  }

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-ice flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    )
  }

  // Show resume prompt for returning users
  if (hasSavedProgress) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Header />

          <div className="bg-white rounded-lg p-6 md:p-10 border border-stone">
            <div className="text-xs uppercase tracking-wider text-blue font-medium mb-4">
              Welcome back
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-charcoal">
              Pick up where you left off?
            </h2>
            <p className="text-charcoal/60 mb-6">
              You&apos;ve already started the time audit. Continue from where you were?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={resumeProgress}
                className="w-full px-6 py-3 rounded-md bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
              <button
                onClick={startOver}
                className="w-full px-6 py-3 rounded-md bg-transparent border-2 border-charcoal/20 text-charcoal font-medium hover:border-charcoal/40 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show submitting state
  if (state.step === 'submitting' || isSubmitting) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Header />

          <div className="bg-white rounded-lg p-10 border border-stone text-center">
            <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-charcoal animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">
              Finding your automations...
            </h2>
            <p className="text-charcoal/60">
              We&apos;re matching your answers to our automation catalogue.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (submitError) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Header />

          <div className="bg-white rounded-lg p-10 border border-stone text-center">
            <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">
              Something went wrong
            </h2>
            <p className="text-charcoal/60 mb-8">{submitError}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitError(null)
                  handleSubmit()
                }}
                className="px-6 py-3 rounded-md bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
              <button
                onClick={() => setSubmitError(null)}
                className="px-6 py-3 rounded-md bg-transparent border-2 border-charcoal text-charcoal font-medium hover:bg-charcoal/5 transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ice flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Header />

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= stepIndex + 1 ? 'bg-fuchsia' : 'bg-stone'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-charcoal/40 mt-2 text-center">
              Step {stepIndex + 1} of 8
            </p>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-lg p-6 md:p-10 border border-stone">
            {/* Step 1: Name */}
            {state.step === 'name' && (
              <StepContent
                label="Let's start"
                heading="What's your name?"
                description="First name is fine."
              >
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  className="w-full p-4 rounded-lg bg-ice border border-stone text-charcoal placeholder:text-charcoal/40 focus:border-fuchsia focus:outline-none"
                />
              </StepContent>
            )}

            {/* Step 2: Business */}
            {state.step === 'business' && (
              <StepContent
                label={`Hey ${state.name}`}
                heading="What's your business?"
                description="A few words about what you do."
              >
                <input
                  type="text"
                  value={state.business}
                  onChange={(e) => setField('business', e.target.value)}
                  placeholder="e.g. Personal trainer, Wedding photographer"
                  autoFocus
                  className="w-full p-4 rounded-lg bg-ice border border-stone text-charcoal placeholder:text-charcoal/40 focus:border-fuchsia focus:outline-none"
                />
              </StepContent>
            )}

            {/* Step 3: Stage */}
            {state.step === 'stage' && (
              <StepContent
                label="Where you are"
                heading="Which best describes your business?"
              >
                <div className="space-y-3">
                  {STAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setField('stage', opt.value as BusinessStage)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        state.stage === opt.value
                          ? 'border-fuchsia bg-fuchsia/5'
                          : 'border-stone hover:border-blue'
                      }`}
                    >
                      <span className="font-medium text-charcoal block">
                        {opt.label}
                      </span>
                      <span className="text-sm text-charcoal/60">
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>
              </StepContent>
            )}

            {/* Step 4: Hours */}
            {state.step === 'hours' && (
              <StepContent
                label="The time audit"
                heading="How many hours a week do you spend on repetitive admin tasks?"
                description="Things like chasing invoices, sending reminders, data entry."
              >
                <div className="space-y-3">
                  {HOURS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setField('hours_per_week', opt.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        state.hours_per_week === opt.value
                          ? 'border-fuchsia bg-fuchsia/5'
                          : 'border-stone hover:border-blue'
                      }`}
                    >
                      <span className="font-medium text-charcoal">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </StepContent>
            )}

            {/* Step 5: Time sinks */}
            {state.step === 'time_sinks' && (
              <StepContent
                label="The culprits"
                heading="What eats up most of your time?"
                description="Pick up to 3."
              >
                <div className="space-y-3">
                  {TIME_SINK_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleArrayItem('time_sinks', opt.value, 3)}
                      disabled={
                        state.time_sinks.length >= 3 &&
                        !state.time_sinks.includes(opt.value)
                      }
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        state.time_sinks.includes(opt.value)
                          ? 'border-fuchsia bg-fuchsia/5'
                          : state.time_sinks.length >= 3
                            ? 'border-stone/50 text-charcoal/40 cursor-not-allowed'
                            : 'border-stone hover:border-blue'
                      }`}
                    >
                      <span className="font-medium text-charcoal">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
                {state.time_sinks.length > 0 && (
                  <p className="text-sm text-charcoal/60 mt-3">
                    {state.time_sinks.length} of 3 selected
                  </p>
                )}
              </StepContent>
            )}

            {/* Step 6: Biggest frustration */}
            {state.step === 'frustration' && (
              <StepContent
                label="The real problem"
                heading="What's the most frustrating repetitive task?"
                description="The one that makes you think 'there has to be a better way'."
              >
                <textarea
                  value={state.biggest_frustration}
                  onChange={(e) => setField('biggest_frustration', e.target.value)}
                  placeholder="Tell us about it..."
                  autoFocus
                  rows={4}
                  className="w-full p-4 rounded-lg bg-ice border border-stone text-charcoal placeholder:text-charcoal/40 focus:border-fuchsia focus:outline-none resize-none"
                />
              </StepContent>
            )}

            {/* Step 7: Tools */}
            {state.step === 'tools' && (
              <StepContent
                label="Your stack"
                heading="What tools do you already use?"
                description="Select all that apply."
              >
                <div className="grid grid-cols-2 gap-3">
                  {TOOL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleArrayItem('tools', opt.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        state.tools.includes(opt.value)
                          ? 'border-fuchsia bg-fuchsia/5'
                          : 'border-stone hover:border-blue'
                      }`}
                    >
                      <span className="text-sm font-medium text-charcoal">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </StepContent>
            )}

            {/* Step 8: Email */}
            {state.step === 'email' && (
              <StepContent
                label="Last step"
                heading="Where should we send your results?"
                description="We'll email you a link to your personal diagnostic."
              >
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="your@email.com"
                  autoFocus
                  className="w-full p-4 rounded-lg bg-ice border border-stone text-charcoal placeholder:text-charcoal/40 focus:border-fuchsia focus:outline-none"
                />
              </StepContent>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                className={`text-charcoal/60 hover:text-charcoal transition-colors ${
                  stepIndex === 0 ? 'invisible' : ''
                }`}
              >
                &larr; Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  canProceed
                    ? 'bg-fuchsia text-white hover:opacity-90'
                    : 'bg-stone text-charcoal/40 cursor-not-allowed'
                }`}
              >
                {isLastStep ? 'See my results' : 'Continue'} &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Header component
function Header() {
  return (
    <header className="text-center py-6 mb-4">
      <Link href="/" className="inline-block">
        <h1 className="text-2xl font-semibold tracking-tight text-charcoal">
          Reckoning
        </h1>
      </Link>
      <p className="text-sm text-charcoal/60 mt-1">Time Audit</p>
    </header>
  )
}

// Step content wrapper
function StepContent({
  label,
  heading,
  description,
  children,
}: {
  label: string
  heading: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <>
      <div className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
        {label}
      </div>
      <h2 className="text-xl md:text-2xl font-semibold mb-2 text-charcoal">
        {heading}
      </h2>
      {description && (
        <p className="text-charcoal/60 mb-6">{description}</p>
      )}
      {!description && <div className="mb-6" />}
      {children}
    </>
  )
}

export default function TimeAuditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ice flex items-center justify-center">
          <div className="text-charcoal/60">Loading...</div>
        </div>
      }
    >
      <TimeAuditContent />
    </Suspense>
  )
}
