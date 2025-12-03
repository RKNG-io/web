'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

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
    { label: 'Services', href: '#services' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Wordmark with rising line */}
        <a href="/" className="relative inline-block">
          <span className={`text-2xl font-semibold tracking-tight ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
            Reckoning
          </span>
          <span
            className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-sm"
            style={{ background: 'linear-gradient(90deg, transparent 0%, var(--fuchsia) 30%, var(--fuchsia) 100%)' }}
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hover:text-fuchsia transition-colors font-medium ${isScrolled ? 'text-charcoal' : 'text-white/90'}`}
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" size="md" href="/questionnaire">
            Get Your Reckoning
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block w-6 h-0.5 bg-charcoal transition-all ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-charcoal transition-all ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-charcoal transition-all ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4 pt-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-charcoal hover:text-fuchsia transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" size="md" className="w-full" href="/questionnaire">
            Get Your Reckoning
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
