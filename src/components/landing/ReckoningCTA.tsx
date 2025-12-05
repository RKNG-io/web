import React from 'react';
import { Button } from '@/components/ui';

const ReckoningCTA: React.FC = () => {
  return (
    <section className="bg-mint py-24 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: Text content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-semibold text-charcoal md:text-5xl lg:text-6xl">
              Your Reckoning awaits
            </h2>
            <p className="text-lg text-charcoal/80 md:text-xl">
              Get a free diagnostic that cuts through the noise and shows you exactly where you stand.
              No fluff, no sales pitch — just honest clarity about your business and what comes next.
            </p>

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                'Clear diagnosis of where you are',
                'Prioritised action items',
                'The cost of waiting',
                'Recommended next steps',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base font-medium text-charcoal md:text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Button variant="secondary" size="lg">
                Get Your Reckoning — Free
              </Button>
            </div>
          </div>

          {/* Right column: Preview card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-[10px] bg-white p-8 border border-stone">
              {/* Card header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia text-lg font-semibold text-white">
                  AS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Your Reckoning</h3>
                  <p className="text-sm text-charcoal/60">Diagnostic Report</p>
                </div>
              </div>

              {/* Sample checklist */}
              <div className="space-y-4">
                <div className="border-b border-stone pb-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal/50">
                    Status
                  </p>
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-charcoal">Value proposition clarity</span>
                  </div>
                </div>

                <div className="border-b border-stone pb-3">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-charcoal">Target audience defined</span>
                  </div>
                </div>

                <div className="border-b border-stone pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-stone bg-white" />
                    <span className="text-sm text-charcoal/50">Operational systems in place</span>
                  </div>
                </div>

                <div className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-stone bg-white" />
                    <span className="text-sm text-charcoal/50">Sales process documented</span>
                  </div>
                </div>
              </div>

              {/* Bottom note */}
              <div className="mt-6 rounded-lg bg-mint/50 p-4">
                <p className="text-xs font-medium text-charcoal/70">
                  <strong className="text-charcoal">Next step:</strong> Focus on operational systems
                  to reduce overwhelm and free up 8-10 hours per week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReckoningCTA;
