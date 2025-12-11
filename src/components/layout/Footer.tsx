import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-white/60 py-16">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16">
          {/* Brand */}
          <div className="max-w-[280px]">
            <Link href="/" className="text-xl font-semibold text-white mb-4 block">
              Reckoning
            </Link>
            <p className="text-sm text-white/50">
              The work you love.<br />
              Without the chaos.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-16">
            {/* Industries */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Industries</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/for/fitness" className="text-sm text-white/50 hover:text-white transition-colors">
                    Fitness
                  </Link>
                </li>
                <li>
                  <Link href="/for/wellness" className="text-sm text-white/50 hover:text-white transition-colors">
                    Wellness
                  </Link>
                </li>
                <li>
                  <Link href="/for/trades" className="text-sm text-white/50 hover:text-white transition-colors">
                    Trades
                  </Link>
                </li>
                <li>
                  <Link href="/for/events" className="text-sm text-white/50 hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services" className="text-sm text-white/50 hover:text-white transition-colors">
                    Browse services
                  </Link>
                </li>
                <li>
                  <Link href="/start/time-audit" className="text-sm text-white/50 hover:text-white transition-colors">
                    Find my automations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@rkng.io" className="text-sm text-white/50 hover:text-white transition-colors">
                    hello@rkng.io
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
          <span>© Reckoning</span>
          {/* Privacy/Terms - hidden until pages exist
          <span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            {' · '}
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </span>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
