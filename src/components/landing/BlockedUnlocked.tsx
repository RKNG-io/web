import React from 'react';
import Link from 'next/link';

interface BlockedRow {
  blocked: string;
  unlocked: string;
}

const rows: BlockedRow[] = [
  {
    blocked: "I don't know where to start",
    unlocked: 'A prioritised list of what actually matters',
  },
  {
    blocked: 'Social media feels fake',
    unlocked: 'Permission to do it your way',
  },
  {
    blocked: "It's easier to do it myself",
    unlocked: 'Automation that sounds like you',
  },
  {
    blocked: 'Chasing invoices feels awkward',
    unlocked: 'Automation that follows up, reconciles, and gets you paid',
  },
  {
    blocked: 'I need to hire to scale',
    unlocked: 'Systems that run without headcount',
  },
];

const BlockedUnlocked: React.FC = () => {
  return (
    <section className="bg-ice py-24" id="blocked">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          {/* Intro */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.15em] text-fuchsia font-medium mb-2 text-center">
              The weight we lift
            </p>
            <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal mb-4 text-center">
              You know the feeling
            </h2>
            <p className="text-lg text-charcoal/70 text-center max-w-[600px] mx-auto">
              The constant context-switching. The background hum of things you haven&apos;t got to yet.
              More time on admin than on the work you actually love.
            </p>
            <p className="text-lg text-charcoal/70 text-center max-w-[600px] mx-auto mt-4">
              <strong className="text-charcoal">That&apos;s not a character flaw. That&apos;s a systems problem.</strong><br />
              And systems problems have systems solutions.
            </p>
          </div>

          {/* Blocked/Unlocked table */}
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-6 p-6 bg-white rounded-lg border border-stone hover:border-fuchsia transition-colors md:grid-cols-2"
              >
                {/* Blocked column */}
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] font-medium text-charcoal/50 mb-2">
                    Blocked by
                  </p>
                  <p className="text-sm text-charcoal/60 italic">{row.blocked}</p>
                </div>

                {/* Unlocked column */}
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] font-medium text-fuchsia mb-2">
                    Unlocked by
                  </p>
                  <p className="text-sm text-charcoal font-medium">{row.unlocked}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/start"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(209,75,168,0.3)]"
            >
              See what&apos;s blocking you
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockedUnlocked;
