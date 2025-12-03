'use client';

import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "I'm still employed — can I even start a business?",
    answer:
      "Probably. Most contracts don't ban side work, but some require disclosure. Your Reckoning will flag this if it applies to you.",
  },
  {
    question: "I don't have time for a big overhaul",
    answer:
      "We don't do overhauls. We do one thing at a time. Small shifts that compound — that's how businesses actually change.",
  },
  {
    question: 'Will automation sound robotic?',
    answer:
      "Not ours. We build systems trained on your voice — your tone, your words. What goes out sounds like you wrote it.",
  },
  {
    question: 'What if I just want to DIY everything?',
    answer:
      "Great. Your Reckoning gives you a clear starting point. Run with it. We're here if you get stuck.",
  },
  {
    question: 'What does this actually cost?',
    answer:
      'The Reckoning is free. Services start from £399. No surprises, no upsells, no pressure.',
  },
];

const FAQ: React.FC = () => {
  return (
    <section className="bg-ice py-24" id="faq">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <h2 className="text-[2rem] font-semibold tracking-tight text-charcoal">
            Questions?
          </h2>
        </div>

        {/* FAQ list */}
        <div className="max-w-[700px] mx-auto">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="border-b border-stone group"
            >
              <summary className="py-6 cursor-pointer font-medium text-charcoal flex justify-between items-center list-none">
                <span>{item.question}</span>
                <span className="text-xl text-fuchsia font-light ml-4">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="pb-6 text-sm text-charcoal/60">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
