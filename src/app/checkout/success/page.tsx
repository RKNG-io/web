'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Clear cart on success
  useEffect(() => {
    if (sessionId) {
      localStorage.removeItem('reckoning_cart');
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-ice flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[10px] p-8 md:p-10 text-center border border-stone">
          <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Payment received
          </h1>

          <p className="text-charcoal/70 mb-6">
            Thanks for your order. We&apos;ll be in touch within 24 hours to kick things off.
          </p>

          <div className="bg-ice rounded-lg p-4 mb-8">
            <p className="text-sm text-charcoal/60">
              A confirmation email is on its way to your inbox.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 px-6 bg-fuchsia text-white rounded-lg font-medium hover:bg-fuchsia/90 transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/start"
              className="w-full py-3 px-6 border-2 border-charcoal/20 text-charcoal rounded-lg font-medium hover:border-charcoal/40 transition-colors"
            >
              Get your Reckoning
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-charcoal/50 mt-6">
          Questions? <a href="mailto:hello@rkng.io" className="text-fuchsia hover:underline">hello@rkng.io</a>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ice flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
