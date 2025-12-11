import React from 'react';
import Link from 'next/link';

const FinalCTA: React.FC = () => {
  return (
    <section className="bg-charcoal py-24 text-center">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-[2rem] font-semibold tracking-tight text-white mb-4">
          Your time is now.
        </h2>
        <p className="text-white/60 max-w-[480px] mx-auto mb-10">
          Take our 2-minute time audit and see exactly where your hours are going  -
          and which automations will get them back.
        </p>
        <Link
          href="/start/time-audit"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(209,75,168,0.3)]"
        >
          Start my time audit
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
