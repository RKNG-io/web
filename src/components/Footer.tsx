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
              Unblock. Unlock. Unleash.<br />
              Your business. Your way.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-16">
            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services?package=launcher" className="text-sm text-white/50 hover:text-white transition-colors">
                    Launcher
                  </Link>
                </li>
                <li>
                  <Link href="/services?package=builder" className="text-sm text-white/50 hover:text-white transition-colors">
                    Builder
                  </Link>
                </li>
                <li>
                  <Link href="/services?package=architect" className="text-sm text-white/50 hover:text-white transition-colors">
                    Architect
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-white/50 hover:text-white transition-colors">
                    All services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">
                    Contact
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
          <span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            {' · '}
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
