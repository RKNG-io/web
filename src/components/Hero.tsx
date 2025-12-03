'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Check } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    'Clarity on what\'s actually blocking you',
    'Prioritised next steps — not a 50-point plan',
    'Systems that grow with you',
    'Automations that sound like you',
  ];

  return (
    <section className="min-h-screen bg-charcoal text-white">
      <div className="container mx-auto px-6 lg:px-8 min-h-screen flex items-center py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full">
          {/* Left Column - Copy */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Tagline */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Unblock. Unlock. Unleash.
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Your business. Your way.
              </p>
            </div>

            {/* Main Copy */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                You didn't start your business to drown in admin. You started it for the work — and the life you're building.
              </p>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                You don't need to overhaul a thing. Introduce automations that sound like you. Build systems that let you grow without burning out.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                How it works
              </Button>
            </div>
          </div>

          {/* Right Column - What You Get Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                What you get
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Check className="w-5 h-5 text-fuchsia" strokeWidth={3} />
                    </div>
                    <span className="text-white/90 leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    </section>
  );
};

export default Hero;
