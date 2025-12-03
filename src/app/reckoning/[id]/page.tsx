'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { ReportSection } from '@/components/reckoning/ReportSection';
import { DiagnosisCard } from '@/components/reckoning/DiagnosisCard';
import { JourneyPhase } from '@/components/reckoning/JourneyPhase';
import { CostCard } from '@/components/reckoning/CostCard';
import type { ReckoningReport } from '@/types/reckoning';

export default function ReckoningResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReckoningReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch report from localStorage
    const fetchReport = () => {
      try {
        const storedReport = localStorage.getItem(`reckoning-${params.id}`);
        if (storedReport) {
          const parsedReport = JSON.parse(storedReport) as ReckoningReport;
          setReport(parsedReport);
        }
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

  const handleDownloadPDF = () => {
    // Placeholder for PDF download functionality
    alert('PDF download coming soon!');
  };

  const handleGetStarted = () => {
    // Navigate to booking or contact page
    router.push('/contact');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ice">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone border-t-fuchsia mx-auto" />
          <p className="text-lg text-charcoal/70">Loading your Reckoning...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ice">
        <Card variant="white" className="max-w-md space-y-4 text-center">
          <div className="text-6xl">🔍</div>
          <h1 className="text-3xl font-semibold text-charcoal">
            Report Not Found
          </h1>
          <p className="text-base text-charcoal/70">
            We couldn&apos;t find the Reckoning report you&apos;re looking for.
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const urgencyConfig = {
    high: { variant: 'fuchsia' as const, label: 'Urgent Action Required' },
    medium: { variant: 'blue' as const, label: 'Timely Action Needed' },
    low: { variant: 'mint' as const, label: 'Consider Acting Soon' },
  };

  const urgency = urgencyConfig[report.nextStep.urgency];

  return (
    <main className="min-h-screen bg-ice">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-charcoal to-ink py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge variant="fuchsia" className="mb-4">
              Generated Report
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Your Reckoning
            </h1>
            <p className="text-lg text-white/80 md:text-xl">
              Generated on{' '}
              {new Date(report.generatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Opening Message */}
      <ReportSection variant="highlight" className="border-b border-stone">
        <div className="max-w-3xl">
          <p className="text-xl leading-relaxed text-charcoal md:text-2xl">
            {report.openingMessage}
          </p>
        </div>
      </ReportSection>

      {/* Snapshot Section */}
      <ReportSection
        subtitle="Your Snapshot"
        title="Where You Are, Where You're Going"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card variant="white" className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-fuchsia">
              Current State
            </div>
            <p className="text-base leading-relaxed text-charcoal">
              {report.snapshot.currentState}
            </p>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-fuchsia">
              Your Goal
            </div>
            <p className="text-base leading-relaxed text-charcoal">
              {report.snapshot.goal}
            </p>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-fuchsia">
              The Gap
            </div>
            <p className="text-base leading-relaxed text-charcoal">
              {report.snapshot.gap}
            </p>
          </Card>
        </div>
      </ReportSection>

      {/* Diagnosis Section */}
      {report.diagnosis && report.diagnosis.length > 0 && (
        <ReportSection
          variant="highlight"
          subtitle="Diagnosis"
          title="What's Holding You Back"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {report.diagnosis.map((issue) => (
              <DiagnosisCard key={issue.id} diagnosis={issue} />
            ))}
          </div>
        </ReportSection>
      )}

      {/* Journey Map */}
      {report.journey && report.journey.length > 0 && (
        <ReportSection subtitle="Your Journey" title="The Path Forward">
          <div className="max-w-3xl space-y-8">
            {report.journey.map((phase, index) => (
              <JourneyPhase
                key={phase.id}
                phase={phase}
                index={index}
                className={index === report.journey.length - 1 ? '[&>div:last-child]:hidden' : ''}
              />
            ))}
          </div>
        </ReportSection>
      )}

      {/* Cost of Waiting */}
      {report.costOfWaiting && report.costOfWaiting.length > 0 && (
        <ReportSection
          variant="dark"
          subtitle="Cost of Waiting"
          title="What Delay Really Costs You"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {report.costOfWaiting.map((cost) => (
              <CostCard key={cost.id} cost={cost} />
            ))}
          </div>
        </ReportSection>
      )}

      {/* Next Step CTA */}
      <ReportSection variant="highlight">
        <Card variant="fuchsia" className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge variant="mint" className="mb-3">
                {urgency.label}
              </Badge>
              <h2 className="mb-3 text-3xl font-semibold md:text-4xl">
                {report.nextStep.title}
              </h2>
              <p className="text-lg leading-relaxed text-white/90">
                {report.nextStep.description}
              </p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Recommended Action
            </div>
            <p className="mb-6 text-xl font-medium">{report.nextStep.action}</p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-fuchsia hover:bg-ice"
              >
                Get Started Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadPDF}
                className="border-white text-white hover:bg-white/10"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </Card>
      </ReportSection>

      {/* Recommended Services */}
      {report.recommendedServices && report.recommendedServices.length > 0 && (
        <ReportSection
          subtitle="Recommended for You"
          title={report.packageName || 'Services & Packages'}
        >
          {report.packageDescription && (
            <p className="mb-8 max-w-3xl text-lg text-charcoal/80">
              {report.packageDescription}
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {report.recommendedServices.map((service) => (
              <Card key={service.id} variant="white" className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-charcoal">
                    {service.name}
                  </h3>
                  {service.price && (
                    <div className="text-2xl font-bold text-fuchsia">
                      {service.price}
                    </div>
                  )}
                </div>

                <p className="text-base text-charcoal/80">{service.description}</p>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 border-t border-stone pt-4">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-charcoal/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fuchsia" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="primary" size="lg" onClick={handleGetStarted}>
              Book a Consultation
            </Button>
          </div>
        </ReportSection>
      )}

      {/* Final CTA */}
      <ReportSection variant="dark">
        <div className="max-w-3xl text-center mx-auto">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            Ready to Move Forward?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Your Reckoning is complete. The next step is yours to take.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
            >
              Get Started Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadPDF}
              className="border-white text-white hover:bg-white/10"
            >
              Download Your Report
            </Button>
          </div>
        </div>
      </ReportSection>
    </main>
  );
}
