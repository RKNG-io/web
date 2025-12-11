import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDiagnosticByToken, markDiagnosticViewed } from '@/lib/db'
import { getAutomationById } from '@/data/automation-catalogue'
import {
  formatTimeSaved,
  formatServicePrice,
  getPrimaryTimeSink,
  calculateAnnualSavings,
} from '@/lib/matcher'
import type { Automation } from '@/types/automation'

/**
 * Diagnostic Results Page
 *
 * Displays the time audit results with matched automations.
 * This is the v2 output page that replaces the AI-generated Reckoning report.
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 */

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function DiagnosticPage({ params }: PageProps) {
  const { token } = await params

  // Fetch the diagnostic
  const diagnostic = await getDiagnosticByToken(token)

  if (!diagnostic) {
    notFound()
  }

  // Mark as viewed (fire and forget)
  markDiagnosticViewed(token).catch(() => {})

  // Parse JSON fields that come back as strings from the database
  const timeSinks =
    typeof diagnostic.time_sinks === 'string'
      ? JSON.parse(diagnostic.time_sinks)
      : diagnostic.time_sinks

  const tools =
    typeof diagnostic.tools === 'string'
      ? JSON.parse(diagnostic.tools)
      : diagnostic.tools

  const matches =
    typeof diagnostic.matches === 'string'
      ? JSON.parse(diagnostic.matches)
      : diagnostic.matches

  // Get full automation objects for matched automations
  const matchedAutomations = matches
    .map((match: { automation_id: string; score: number; match_reasons: string[] }) => {
      const automation = getAutomationById(match.automation_id)
      if (!automation) return null
      return {
        automation,
        score: match.score,
        match_reasons: match.match_reasons,
      }
    })
    .filter(Boolean) as Array<{
    automation: Automation
    score: number
    match_reasons: string[]
  }>

  // Calculate totals
  const totalTimeSaved = matchedAutomations.reduce(
    (sum, m) => sum + m.automation.time_saved_weekly,
    0
  )
  const annualSavings = calculateAnnualSavings(totalTimeSaved)
  const primaryTimeSink = getPrimaryTimeSink(timeSinks)

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <span className="text-sm text-charcoal/60">Your Time Audit</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Hey {diagnostic.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-charcoal mb-4">
            We found {totalTimeSaved}+ hours hiding in your week
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Based on your answers, {primaryTimeSink} is your biggest time sink.
            Here&apos;s what we can automate.
          </p>
        </section>

        {/* Summary card */}
        <section className="bg-white rounded-lg border border-stone p-6 md:p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-semibold text-charcoal">
                {diagnostic.hours_per_week}
              </p>
              <p className="text-sm text-charcoal/60">hrs/week on admin</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-fuchsia">{totalTimeSaved}</p>
              <p className="text-sm text-charcoal/60">hrs we can save</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-charcoal">
                {annualSavings.hours}
              </p>
              <p className="text-sm text-charcoal/60">hrs/year back</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-charcoal">
                {matchedAutomations.length}
              </p>
              <p className="text-sm text-charcoal/60">automations matched</p>
            </div>
          </div>
        </section>

        {/* Matched automations */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-charcoal mb-6">
            Your matched automations
          </h2>

          <div className="space-y-4">
            {matchedAutomations.map(({ automation, match_reasons }, index) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                matchReasons={match_reasons}
                rank={index + 1}
              />
            ))}
          </div>

          {matchedAutomations.length === 0 && (
            <div className="bg-white rounded-lg border border-stone p-8 text-center">
              <p className="text-charcoal/60">
                We couldn&apos;t find a perfect match for your current setup, but
                we&apos;d love to chat about custom solutions.
              </p>
              <a
                href="mailto:hello@reckoning.co"
                className="inline-block mt-4 px-6 py-3 bg-fuchsia text-white font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Get in touch
              </a>
            </div>
          )}
        </section>

        {/* What you told us */}
        <section className="bg-charcoal rounded-lg p-6 md:p-8 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">
            What you told us
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-white/60 text-sm mb-1">Business</p>
              <p className="text-white">{diagnostic.business}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Stage</p>
              <p className="text-white capitalize">{diagnostic.stage}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Time sinks</p>
              <p className="text-white">
                {timeSinks.map((s: string) => s.replace(/_/g, ' ')).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Tools</p>
              <p className="text-white">
                {tools.map((t: string) => t.replace(/_/g, ' ')).join(', ')}
              </p>
            </div>
          </div>

          {diagnostic.biggest_frustration && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/60 text-sm mb-1">Your biggest frustration</p>
              <p className="text-white italic">
                &ldquo;{diagnostic.biggest_frustration}&rdquo;
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">
            Ready to get started?
          </h2>
          <p className="text-charcoal/70 mb-6 max-w-xl mx-auto">
            Pick any automation above, or book a call to discuss which one makes
            the most sense for where you are now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 py-3 bg-fuchsia text-white font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              View all services
            </Link>
            <a
              href="https://calendly.com/reckoning/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-charcoal text-charcoal font-medium rounded-md hover:bg-charcoal/5 transition-colors"
            >
              Book a call
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-white/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>
            This diagnostic link is unique to you. Bookmark it to come back later.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Automation card component
function AutomationCard({
  automation,
  matchReasons,
  rank,
}: {
  automation: Automation
  matchReasons: string[]
  rank: number
}) {
  return (
    <div className="bg-white rounded-lg border border-stone overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-fuchsia/10 text-fuchsia text-sm font-medium">
                {rank}
              </span>
              <h3 className="text-lg font-semibold text-charcoal">
                {automation.name}
              </h3>
            </div>
            <p className="text-charcoal/70 mb-4">{automation.description}</p>

            {/* Match reasons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {matchReasons.slice(0, 3).map((reason, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-1 bg-mint/30 text-charcoal text-xs rounded"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="text-right shrink-0">
            <p className="text-2xl font-semibold text-fuchsia">
              {formatTimeSaved(automation.time_saved_weekly)}
            </p>
            {automation.cost_saved_percentage && (
              <p className="text-sm text-charcoal/60">
                +{automation.cost_saved_percentage}% fee savings
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone mt-4">
          <div>
            <span className="text-sm text-charcoal/60">One-time setup:</span>
            <span className="ml-2 font-semibold text-charcoal">
              {formatServicePrice(automation.service_price)}
            </span>
          </div>
          <Link
            href={`/services?add=${automation.service_id}`}
            className="inline-flex items-center px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Add to cart
          </Link>
        </div>
      </div>
    </div>
  )
}
