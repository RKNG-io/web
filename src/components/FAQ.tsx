export default function FAQ() {
  return (
    <section className="bg-ice py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Questions?</h2>

        <div className="space-y-4">
          <details className="group border-b border-gray-200 pb-4">
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <span className="font-semibold pr-4">I'm still employed — can I even start a business?</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl group-open:hidden">+</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl hidden group-open:block">−</span>
            </summary>
            <p className="mt-3 text-gray-600">
              Probably. Most contracts don't ban side work, but some require disclosure. Your Reckoning will flag this if it applies to you.
            </p>
          </details>

          <details className="group border-b border-gray-200 pb-4">
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <span className="font-semibold pr-4">I don't have time for a big overhaul</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl group-open:hidden">+</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl hidden group-open:block">−</span>
            </summary>
            <p className="mt-3 text-gray-600">
              We don't do overhauls. We do one thing at a time. Small shifts that compound — that's how businesses actually change.
            </p>
          </details>

          <details className="group border-b border-gray-200 pb-4">
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <span className="font-semibold pr-4">Will automation sound robotic?</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl group-open:hidden">+</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl hidden group-open:block">−</span>
            </summary>
            <p className="mt-3 text-gray-600">
              Not ours. We build systems trained on your voice — your tone, your words. What goes out sounds like you wrote it.
            </p>
          </details>

          <details className="group border-b border-gray-200 pb-4">
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <span className="font-semibold pr-4">What if I just want to DIY everything?</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl group-open:hidden">+</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl hidden group-open:block">−</span>
            </summary>
            <p className="mt-3 text-gray-600">
              Great. Your Reckoning gives you a clear starting point. Run with it. We're here if you get stuck.
            </p>
          </details>

          <details className="group border-b border-gray-200 pb-4">
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <span className="font-semibold pr-4">What does this actually cost?</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl group-open:hidden">+</span>
              <span className="text-fuchsia-600 flex-shrink-0 text-xl hidden group-open:block">−</span>
            </summary>
            <p className="mt-3 text-gray-600">
              The Reckoning is free. Services start from £399. No surprises, no upsells, no pressure.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
