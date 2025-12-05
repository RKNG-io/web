import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOutcome, getAllOutcomes } from '@/lib/data/outcomes';
import { getBundleById } from '@/lib/data/bundles';
import { SERVICE_CATALOGUE } from '@/lib/data/service-catalogue';
import {
  Globe,
  Calendar,
  Smartphone,
  Settings,
  Rocket,
  TrendingUp,
} from 'lucide-react';

// Map icon names to Lucide components
const iconComponents: Record<string, React.ReactNode> = {
  globe: <Globe className="w-8 h-8 text-fuchsia" />,
  calendar: <Calendar className="w-8 h-8 text-fuchsia" />,
  smartphone: <Smartphone className="w-8 h-8 text-fuchsia" />,
  settings: <Settings className="w-8 h-8 text-fuchsia" />,
  rocket: <Rocket className="w-8 h-8 text-fuchsia" />,
  'trending-up': <TrendingUp className="w-8 h-8 text-fuchsia" />,
};

interface PageProps {
  params: Promise<{ outcome: string }>;
}

// Generate static paths for all outcomes
export async function generateStaticParams() {
  const outcomes = getAllOutcomes();
  return outcomes.map((outcome) => ({
    outcome: outcome.slug,
  }));
}

export default async function OutcomePage({ params }: PageProps) {
  const { outcome: slug } = await params;
  const outcome = getOutcome(slug);

  if (!outcome) {
    notFound();
  }

  // Get matching services and bundles
  const services = SERVICE_CATALOGUE.filter((s) =>
    outcome.serviceIds.includes(s.id)
  );
  const bundles = outcome.bundleIds
    .map((id) => getBundleById(id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="bg-white border-b border-stone">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            Reckoning
          </Link>
          <Link
            href="/services"
            className="text-sm text-charcoal/60 hover:text-charcoal transition-colors"
          >
            All services
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-charcoal text-white py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wider text-fuchsia mb-4">
            {outcome.title}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            {outcome.headline}
          </h1>
          <p className="text-xl text-white/70">{outcome.subhead}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 px-6 bg-white border-b border-stone">
        <div className="container mx-auto max-w-2xl">
          <p className="text-lg text-charcoal/70 text-center">
            {outcome.description}
          </p>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold text-charcoal mb-2 text-center">
              Bundles that deliver this
            </h2>
            <p className="text-charcoal/60 text-center mb-10">
              Services that work better together, priced to match
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {bundles.map((bundle) => bundle && (
                <div
                  key={bundle.id}
                  className="bg-white rounded-[10px] p-6 border-2 border-fuchsia/20 hover:border-fuchsia/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    {iconComponents[bundle.icon] || <Settings className="w-8 h-8 text-fuchsia" />}
                    <span className="px-2 py-1 bg-mint text-charcoal text-xs font-medium rounded">
                      Save £{bundle.savings}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-charcoal mb-1">
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-charcoal/60 mb-4">
                    {bundle.tagline}
                  </p>

                  <p className="text-sm text-charcoal/70 mb-4">
                    {bundle.customerBenefit}
                  </p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-semibold text-charcoal">
                      £{bundle.bundlePrice}
                    </span>
                    <span className="text-sm text-charcoal/40 line-through">
                      £{bundle.alaCarteTotal}
                    </span>
                  </div>

                  <Link
                    href="/services#bundles"
                    className="block w-full py-3 bg-fuchsia text-white rounded-lg font-medium text-center hover:bg-fuchsia/90 transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Individual Services */}
      {services.length > 0 && (
        <section className="py-16 px-6 bg-stone/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold text-charcoal mb-2 text-center">
              Individual services
            </h2>
            <p className="text-charcoal/60 text-center mb-10">
              Pick what you need — add 2+ for 5% off, 4+ for 10% off
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-[10px] p-5 border border-stone hover:border-charcoal/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-charcoal">
                      {service.name}
                    </h3>
                    <span className="text-lg font-semibold text-charcoal">
                      £{service.basePrice}
                    </span>
                  </div>

                  <p className="text-sm text-charcoal/60 mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-charcoal/40">
                      {service.timeEstimate}
                    </span>
                    <Link
                      href="/services"
                      className="px-4 py-1.5 text-sm border border-charcoal text-charcoal rounded hover:bg-charcoal hover:text-white transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-charcoal">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-lg text-white/70 mb-4">{outcome.ctaText}</p>
          <Link
            href={outcome.ctaLink}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-fuchsia text-white font-medium text-lg hover:bg-fuchsia/90 transition-colors"
          >
            {outcome.ctaLink === '/start'
              ? 'Get your free Reckoning'
              : outcome.ctaLink === '/start/automations'
              ? 'Tell us what to automate'
              : 'Browse all services'}
          </Link>
        </div>
      </section>

      {/* Footer nav */}
      <footer className="py-8 px-6 bg-white border-t border-stone">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/get/time" className="text-charcoal/60 hover:text-charcoal">
              Time
            </Link>
            <Link href="/get/space" className="text-charcoal/60 hover:text-charcoal">
              Space
            </Link>
            <Link href="/get/presence" className="text-charcoal/60 hover:text-charcoal">
              Presence
            </Link>
            <Link href="/get/systems" className="text-charcoal/60 hover:text-charcoal">
              Systems
            </Link>
            <Link href="/get/clients" className="text-charcoal/60 hover:text-charcoal">
              Clients
            </Link>
            <Link href="/get/paid" className="text-charcoal/60 hover:text-charcoal">
              Paid
            </Link>
            <Link href="/get/clarity" className="text-charcoal/60 hover:text-charcoal">
              Clarity
            </Link>
            <Link href="/get/calm" className="text-charcoal/60 hover:text-charcoal">
              Calm
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
