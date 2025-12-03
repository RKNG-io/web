import React from 'react';
import { Button } from '@/components/ui';

const FinalCTA: React.FC = () => {
  return (
    <section className="relative bg-charcoal py-32 px-6 md:px-12 lg:px-24">
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(209, 75, 168, 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-5xl font-semibold text-white md:text-6xl lg:text-7xl">
          Your time is now.
        </h2>

        <p className="mb-10 text-xl text-white/80 md:text-2xl">
          Stop planning. Start running. Get the clarity you need to move forward.
        </p>

        <div className="mb-6">
          <Button variant="primary" size="lg" className="px-10 py-4 text-xl">
            Get Your Reckoning — Free
          </Button>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-white/60">
          FREE · NO OBLIGATION · TAKES 10 MINUTES
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
