'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  needs: string[];
  platforms: string[];
  hasContent: string;
  vibe: string;
  name: string;
  email: string;
  contactPreference: string;
}

const initialFormData: FormData = {
  needs: [],
  platforms: [],
  hasContent: '',
  vibe: '',
  name: '',
  email: '',
  contactPreference: '',
};

export default function SocialIntake() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'needs' | 'platforms', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.needs.length > 0;
      case 1: return formData.platforms.length > 0;
      case 2: return formData.hasContent !== '';
      case 3: return formData.vibe !== '';
      case 4: return formData.name !== '' && formData.email !== '' && formData.contactPreference !== '';
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'social',
          answers: {
            needs: formData.needs,
            platforms: formData.platforms,
            hasContent: formData.hasContent,
            vibe: formData.vibe,
          },
          name: formData.name,
          email: formData.email,
          contactPreference: formData.contactPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsOptions = [
    { value: 'setup', label: 'Profile setup', desc: 'From scratch' },
    { value: 'strategy', label: 'Content strategy', desc: '' },
    { value: 'posting', label: 'Ongoing posting', desc: '' },
    { value: 'engagement', label: 'Engagement management', desc: '' },
    { value: 'ads', label: 'Ads setup', desc: '' },
    { value: 'help', label: 'Not sure', desc: 'Help me figure it out' },
  ];

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const contentOptions = [
    { value: 'yes', label: 'Yes, I have photos/videos ready' },
    { value: 'some', label: 'I have some, need more' },
    { value: 'no', label: 'No, starting fresh' },
  ];

  const vibeOptions = [
    { value: 'professional', label: 'Professional & polished' },
    { value: 'warm', label: 'Warm & personal' },
    { value: 'bold', label: 'Bold & edgy' },
    { value: 'minimal', label: 'Minimal & clean' },
    { value: 'not-sure', label: 'Not sure yet' },
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

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-white">
            Reckoning
          </Link>
          <span className="text-sm text-white/50">Social media intake</span>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
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
            <>
              <p className="text-white/60 text-center mb-8">
                Let&apos;s get the details so we can give you an accurate quote.
              </p>
              <h2 className="text-2xl font-semibold text-white text-center mb-2">
                What do you need?
              </h2>
              <p className="text-white/50 text-center mb-8">Select all that apply</p>
              <div className="space-y-3">
                {needsOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleArrayField('needs', opt.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      formData.needs.includes(opt.value)
                        ? 'border-fuchsia bg-fuchsia/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white font-medium">{opt.label}</span>
                    {opt.desc && (
                      <span className="text-white/50 ml-2"> - {opt.desc}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-white text-center mb-2">
                Which platforms?
              </h2>
              <p className="text-white/50 text-center mb-8">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {platformOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleArrayField('platforms', opt.value)}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      formData.platforms.includes(opt.value)
                        ? 'border-fuchsia bg-fuchsia/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-white text-center mb-8">
                Do you have content already?
              </h2>
              <div className="space-y-3">
                {contentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('hasContent', opt.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      formData.hasContent === opt.value
                        ? 'border-fuchsia bg-fuchsia/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-white text-center mb-8">
                What&apos;s your vibe?
              </h2>
              <div className="space-y-3">
                {vibeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('vibe', opt.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      formData.vibe === opt.value
                        ? 'border-fuchsia bg-fuchsia/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold text-white text-center mb-8">
                How should we reach you?
              </h2>
              <div className="space-y-4">
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
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto p-4 bg-fuchsia/20 border border-fuchsia/40 rounded-lg text-center">
            <p className="text-white">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-white/60 hover:text-white mt-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-white/60 hover:text-white transition-colors ${
              step === 0 || isSubmitting ? 'invisible' : ''
            }`}
          >
            ← Back
          </button>
          {step < 4 ? (
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
              disabled={!canProceed() || isSubmitting}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-fuchsia text-white hover:-translate-y-0.5'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
