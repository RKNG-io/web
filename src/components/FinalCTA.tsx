import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

const FinalCTA: React.FC = () => {
  return (
    <section className="bg-charcoal py-32 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-5xl font-semibold text-white md:text-6xl lg:text-7xl">
          Your time is now.
        </h2>

        <p className="mb-10 text-xl text-white/60 md:text-2xl">
          Find out what&rsquo;s blocking you — and what unlocks it. 15 minutes. Free. No commitment.
        </p>

        <Link href="/questionnaire">
          <Button variant="primary" size="lg" className="bg-fuchsia px-10 py-4 text-xl">
            Get Your Reckoning — Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
