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
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Wordmark */}
        <div className="relative">
          <h1 className="text-2xl font-bold text-charcoal">
            Reckoning
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia to-fuchsia-dark"></span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-charcoal hover:text-fuchsia transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" size="md">
            Get Started
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
          <Button variant="primary" size="md" className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
