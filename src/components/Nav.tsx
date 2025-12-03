'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Where are you?', href: '#where-are-you' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'What you get', href: '#what-you-get' },
    { label: 'Services', href: '#support' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-stone' : ''
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 gap-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-tight">
            <span className={isScrolled ? 'text-charcoal' : 'text-white'}>
              Reckoning
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-charcoal ${
                  isScrolled ? 'text-charcoal/60' : 'text-white/70'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/questionnaire"
              className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-fuchsia text-white font-medium text-sm transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(209,75,168,0.3)]"
            >
              Get Your Reckoning
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all ${
                isScrolled ? 'bg-charcoal' : 'bg-white'
              } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all ${
                isScrolled ? 'bg-charcoal' : 'bg-white'
              } ${isMobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all ${
                isScrolled ? 'bg-charcoal' : 'bg-white'
              } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium py-2 transition-colors ${
                  isScrolled ? 'text-charcoal' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/questionnaire"
              className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-fuchsia text-white font-medium text-sm mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Your Reckoning
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
