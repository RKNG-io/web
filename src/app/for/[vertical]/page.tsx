import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import { getAutomationsByVertical } from '@/data/automation-catalogue'
import { formatTimeSaved, formatServicePrice } from '@/lib/matcher'
import type { Vertical } from '@/types/automation'

/**
 * Vertical Landing Pages
 *
 * /for/fitness, /for/wellness, /for/trades, /for/events
 *
 * Each page shows:
 * - Vertical-specific headline and copy
 * - Relevant automations from the catalogue
 * - CTA to start time audit with source tracking
 *
 * @see docs/UPDATES/reckoning-v2-spec.html
 */

type VerticalConfig = {
  name: string
  headline: string
  subheadline: string
  painPoints: string[]
  description: string
}

const VERTICAL_CONFIG: Record<Vertical, VerticalConfig> = {
  fitness: {
    name: 'Fitness Professionals',
    headline: 'Stop chasing clients. Start training them.',
    subheadline: 'For PTs, coaches, gym owners, and anyone helping people move.',
    painPoints: [
      'Clients forgetting sessions',
      'Chasing payment after every class',
      'No-shows eating into your income',
      'Sending the same reminders every week',
    ],
    description:
      'You got into fitness to help people get stronger - not to spend your evenings chasing payments. We handle the admin so you can stay in the gym.',
  },
  wellness: {
    name: 'Wellness Practitioners',
    headline: 'Your clients need presence. Give them yours.',
    subheadline: 'For therapists, bodyworkers, healers, and holistic practitioners.',
    painPoints: [
      'Admin squeezed between appointments',
      'Reminder calls eating into your day',
      'Last-minute cancellations',
      'Invoicing when you should be resting',
    ],
    description:
      'Your work requires presence. Hard to give that when you are thinking about unpaid invoices. We handle the admin so you can focus on your clients.',
  },
  trades: {
    name: 'Trades & Services',
    headline: 'Quote faster. Get paid sooner.',
    subheadline: 'For plumbers, sparks, builders, and anyone who works with their hands.',
    painPoints: [
      'Quotes going cold without follow-up',
      'Chasing deposits before you can start',
      'Invoices sitting unpaid for weeks',
      'Paperwork after a long day on site',
    ],
    description:
      'You are great at your trade. The paperwork? Not so much. We handle the quote chasing and payment reminders so you can focus on the work.',
  },
  events: {
    name: 'Event Professionals',
    headline: 'Run events. Not spreadsheets.',
    subheadline: 'For DJs, photographers, planners, caterers, and anyone making moments.',
    painPoints: [
      'Platform fees eating your margins',
      'Chasing deposits before the big day',
      'Quote follow-ups falling through cracks',
      'Creating payment links one by one',
    ],
    description:
      'Events are stressful enough. We handle the payment links, deposit reminders, and follow-ups so you can focus on the event itself.',
  },
}

export function generateStaticParams() {
  return [
    { vertical: 'fitness' },
    { vertical: 'wellness' },
    { vertical: 'trades' },
    { vertical: 'events' },
  ]
}

interface PageProps {
  params: Promise<{ vertical: string }>
}

export default async function VerticalPage({ params }: PageProps) {
  const { vertical } = await params

  // Validate vertical
  if (!['fitness', 'wellness', 'trades', 'events'].includes(vertical)) {
    notFound()
  }

  const config = VERTICAL_CONFIG[vertical as Vertical]
  const automations = getAutomationsByVertical(vertical)

  // Calculate total potential time saved
  const totalTimeSaved = automations.reduce((sum, a) => sum + a.time_saved_weekly, 0)

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="min-h-[70vh] bg-charcoal text-white pt-[calc(6rem+80px)] pb-16 flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
                For {config.name}
              </p>
              <h1 className="text-[2.5rem] md:text-[3.5rem] font-semibold tracking-tight mb-4 leading-[1.1]">
                {config.headline}
              </h1>
              <p className="text-xl text-white/70 mb-8">{config.subheadline}</p>
              <p className="text-lg text-white/60 mb-10 max-w-2xl">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/start/time-audit?from=${vertical}`}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-all hover:-translate-y-0.5 hover:bg-fuchsia/90"
                >
                  Find my automations
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-transparent border-2 border-white text-white font-medium transition-transform hover:-translate-y-0.5"
                >
                  View all services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-ice">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-8 text-center">
              Sound familiar?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {config.painPoints.map((point, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 border border-stone text-center"
                >
                  <p className="text-charcoal/70">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Automations for this vertical */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">
                Automations for {config.name.toLowerCase()}
              </h2>
              <p className="text-charcoal/60">
                Up to {totalTimeSaved} hours/week back in your pocket
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="bg-ice rounded-lg p-6 border border-stone"
                >
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    {automation.name}
                  </h3>
                  <p className="text-sm text-charcoal/60 mb-4">
                    {automation.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone">
                    <div>
                      <span className="text-fuchsia font-semibold">
                        {formatTimeSaved(automation.time_saved_weekly)}
                      </span>
                    </div>
                    <div className="text-sm text-charcoal/60">
                      {formatServicePrice(automation.service_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-charcoal text-white">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to get your time back?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Take our 2-minute time audit and we&apos;ll show you exactly which
              automations will save you the most time.
            </p>
            <Link
              href={`/start/time-audit?from=${vertical}`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-fuchsia text-white font-medium text-lg transition-all hover:-translate-y-0.5 hover:bg-fuchsia/90"
            >
              Start my time audit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
