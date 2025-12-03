'use client';

import React from 'react';
import { Button } from '@/components/ui';

const Hero: React.FC = () => {
  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-charcoal text-white overflow-hidden">
      {/* Gradient overlays */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(182, 226, 211, 0.2) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 70%, rgba(209, 75, 168, 0.2) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center min-h-screen pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto animate-fadeInUp">
          {/* Tagline */}
          <p className="text-xs md:text-sm uppercase tracking-widest mb-6 text-white/80">
            For business owners — and those about to be
          </p>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            This is your{' '}
            <span className="text-fuchsia">reckoning.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
            Get clarity on where you are, a roadmap to where you want to be,
            and the support to get there — without the agency price tag.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              href="/questionnaire"
              className="w-full sm:w-auto"
            >
              Get Your Reckoning — Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="#how-it-works"
              onClick={handleScrollToHowItWorks}
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-charcoal"
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
