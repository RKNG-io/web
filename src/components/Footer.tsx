import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Launcher', href: '#launcher' },
      { label: 'Builder', href: '#builder' },
      { label: 'Architect', href: '#architect' },
      { label: 'All services', href: '#services' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
    contact: [
      { label: 'hello@rkng.io', href: 'mailto:hello@rkng.io' },
    ],
  };

  return (
    <footer className="bg-ink px-6 py-16 text-white md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="relative mb-3 inline-block">
              <span className="text-2xl font-semibold">Reckoning</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-sm"
                style={{ background: 'linear-gradient(90deg, transparent 0%, var(--fuchsia) 30%, var(--fuchsia) 100%)' }}
              />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Unblock. Unlock. Unleash. Your business. Your way.
            </p>
          </div>

          {/* Services column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
              Contact
            </h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; Reckoning
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
