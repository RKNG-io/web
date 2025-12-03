'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  websiteType: string;
  hasCopy: string;
  hasBranding: string;
  priorities: string[];
  additionalInfo: string;
  name: string;
  email: string;
  contactPreference: string;
}

const initialFormData: FormData = {
  websiteType: '',
  hasCopy: '',
  hasBranding: '',
  priorities: [],
  additionalInfo: '',
  name: '',
  email: '',
  contactPreference: '',
};

export default function WebsiteIntake() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePriority = (priority: string) => {
    setFormData((prev) => {
      const current = prev.priorities;
      if (current.includes(priority)) {
        return { ...prev, priorities: current.filter((p) => p !== priority) };
      }
      if (current.length < 2) {
        return { ...prev, priorities: [...current, priority] };
      }
      return prev;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.websiteType !== '';
      case 1: return formData.hasCopy !== '';
      case 2: return formData.hasBranding !== '';
      case 3: return formData.priorities.length > 0;
      case 4: return true; // Optional
      case 5: return formData.name !== '' && formData.email !== '' && formData.contactPreference !== '';
      default: return false;
    }
  };

  const handleSubmit = async () => {
    // TODO: Send to API
    console.log('Submitting:', formData);
    setIsSubmitted(true);
  };

  const questions = [
    // Step 0: Website Type
    {
      title: 'What kind of website?',
      options: [
        { value: 'one-page', label: 'One-page', desc: 'Landing page, simple presence' },
        { value: 'multi-page', label: 'Multi-page', desc: 'Services, about, contact, etc.' },
        { value: 'ecommerce', label: 'E-commerce', desc: 'Selling products' },
        { value: 'not-sure', label: 'Not sure', desc: 'Help me decide' },
      ],
    },
    // Step 1: Copy
    {
      title: 'Do you have copy?',
      options: [
        { value: 'yes', label: "Yes, I'll provide the text", desc: '' },
        { value: 'rough', label: 'I have rough notes', desc: 'Need help refining' },
        { value: 'no', label: 'No, I need copywriting', desc: '' },
        { value: 'not-sure', label: 'Not sure what I need', desc: '' },
      ],
    },
    // Step 2: Branding
    {
      title: 'Do you have branding?',
      options: [
        { value: 'yes', label: 'Yes, logo and colours sorted', desc: '' },
        { value: 'some', label: 'I have some things', desc: 'Need refinement' },
        { value: 'no', label: 'No, starting from scratch', desc: '' },
        { value: 'your-call', label: 'Just use your judgement', desc: '' },
      ],
    },
    // Step 3: Priorities (multi-select, max 2)
    {
      title: 'What matters most?',
      subtitle: 'Pick up to 2',
      multiSelect: true,
      options: [
        { value: 'speed', label: 'Speed', desc: 'I need this live fast' },
        { value: 'seo', label: 'SEO', desc: 'I want to be found on Google' },
        { value: 'conversions', label: 'Conversions', desc: 'I want visitors to take action' },
        { value: 'beauty', label: 'Beauty', desc: 'I want it to look exceptional' },
        { value: 'simplicity', label: 'Simplicity', desc: 'I want to update it myself' },
      ],
    },
    // Step 4: Additional Info
    {
      title: 'Anything else we should know?',
      subtitle: 'Optional',
      textField: true,
    },
    // Step 5: Contact
    {
      title: 'How should we reach you?',
      contactForm: true,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold text-white mb-4">Got it.</h1>
          <p className="text-white/70 mb-8">
            We&apos;ll be in touch within 24 hours with a quote and timeline.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-fuchsia text-white font-medium transition-transform hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-white">
            Reckoning
          </Link>
          <span className="text-sm text-white/50">Website intake</span>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? 'bg-fuchsia' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          {step === 0 && (
            <p className="text-white/60 text-center mb-8">
              Let&apos;s get the details so we can give you an accurate quote.
            </p>
          )}

          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-white/50 text-center mb-8">{currentQuestion.subtitle}</p>
          )}

          {/* Options */}
          {currentQuestion.options && !currentQuestion.multiSelect && (
            <div className="space-y-3 mt-8">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const field = step === 0 ? 'websiteType' : step === 1 ? 'hasCopy' : 'hasBranding';
                    updateField(field as keyof FormData, opt.value);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    (step === 0 && formData.websiteType === opt.value) ||
                    (step === 1 && formData.hasCopy === opt.value) ||
                    (step === 2 && formData.hasBranding === opt.value)
                      ? 'border-fuchsia bg-fuchsia/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-white font-medium">{opt.label}</span>
                  {opt.desc && (
                    <span className="text-white/50 ml-2">{opt.desc}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Multi-select */}
          {currentQuestion.multiSelect && currentQuestion.options && (
            <div className="space-y-3 mt-8">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => togglePriority(opt.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.priorities.includes(opt.value)
                      ? 'border-fuchsia bg-fuchsia/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-white font-medium">{opt.label}</span>
                  {opt.desc && (
                    <span className="text-white/50 ml-2">— {opt.desc}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Text field */}
          {currentQuestion.textField && (
            <div className="mt-8">
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => updateField('additionalInfo', e.target.value)}
                placeholder="Anything specific you'd like us to know..."
                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-fuchsia focus:outline-none resize-none h-32"
              />
            </div>
          )}

          {/* Contact form */}
          {currentQuestion.contactForm && (
            <div className="mt-8 space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Name"
                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-fuchsia focus:outline-none"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Email"
                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-fuchsia focus:outline-none"
              />
              <div className="space-y-3 mt-6">
                <button
                  onClick={() => updateField('contactPreference', 'quote')}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.contactPreference === 'quote'
                      ? 'border-fuchsia bg-fuchsia/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-white font-medium">Send me a quote</span>
                </button>
                <button
                  onClick={() => updateField('contactPreference', 'call')}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.contactPreference === 'call'
                      ? 'border-fuchsia bg-fuchsia/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-white font-medium">Book a quick call to discuss</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-white/60 hover:text-white transition-colors ${
              step === 0 ? 'invisible' : ''
            }`}
          >
            ← Back
          </button>
          {step < questions.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                canProceed()
                  ? 'bg-fuchsia text-white hover:-translate-y-0.5'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                canProceed()
                  ? 'bg-fuchsia text-white hover:-translate-y-0.5'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
