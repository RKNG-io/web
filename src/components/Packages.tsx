import Link from 'next/link';

const packages = [
  {
    name: 'Launcher',
    description: 'Everything you need to go from idea to taking money.',
    features: [
      'One-page website',
      'Booking system',
      'Payment setup',
      'Basic online presence',
    ],
    price: 'From £399',
  },
  {
    name: 'Builder',
    description: 'Systems that give you time back.',
    features: [
      'Workflow automation',
      'Follow-up sequences',
      'Invoicing setup',
      'Content that sounds like you',
    ],
    price: 'From £599',
  },
  {
    name: 'Architect',
    description: 'Operations that don\'t depend on you.',
    features: [
      'AI-powered workflows',
      'Client communications',
      'Reporting dashboards',
      'Scale without headcount',
    ],
    price: 'From £999',
  },
];

export default function Packages() {
  return (
    <section className="bg-white py-16 px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-stone-500">
            When you're ready
          </p>
          <h2 className="mb-4 text-3xl font-bold text-stone-900 lg:text-4xl">
            Support if you want it
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-600">
            Some people take their Reckoning and run with it. Others want help
            building what comes next. Both paths work.
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="flex flex-col rounded-[10px] border border-stone-300 bg-white p-8"
            >
              {/* Package Name */}
              <h3 className="mb-2 text-2xl font-bold text-stone-900">
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="mb-6 text-stone-600">{pkg.description}</p>

              {/* Features List */}
              <ul className="mb-8 flex-grow space-y-3">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className="border-b border-stone-200 pb-3 text-stone-700 last:border-0"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <p className="mb-4 text-lg font-medium text-stone-500">
                {pkg.price}
              </p>

              {/* CTA Button */}
              <button className="rounded border border-stone-900 bg-transparent px-6 py-2.5 font-medium text-stone-900 transition-colors hover:bg-stone-900 hover:text-white">
                Learn more
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-block rounded border border-stone-400 bg-transparent px-8 py-3 font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            Browse all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
