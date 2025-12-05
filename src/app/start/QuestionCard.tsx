'use client';

import { PersonaQuestion } from '@/data/persona-questions';

interface QuestionCardProps {
  question: PersonaQuestion;
  answer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  canContinue: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  personaName?: string;
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  onBack,
  canContinue,
  isFirstQuestion,
  isLastQuestion,
  questionNumber,
  totalQuestions,
  personaName
}: QuestionCardProps) {
  // Welcome screen
  if (question.type === 'welcome') {
    return (
      <div className="bg-white rounded-[10px] p-10 border border-stone flex flex-col min-h-[500px]">
        <div className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
          {personaName}
        </div>
        <h2 className="text-3xl font-semibold mb-6 leading-tight text-charcoal">
          {question.title}
        </h2>
        <div
          className="prose prose-lg mb-8 flex-1"
          dangerouslySetInnerHTML={{ __html: question.content || '' }}
        />
        <div className="flex gap-4 mt-auto pt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg border-2 border-stone text-charcoal/60 font-medium hover:border-charcoal hover:text-charcoal transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-colors"
          >
            Let's begin →
          </button>
        </div>
      </div>
    );
  }

  // Single select
  const handleSingleSelect = (value: string) => {
    onAnswer(value);
  };

  // Multi select
  const handleMultiToggle = (value: string) => {
    const currentAnswer = Array.isArray(answer) ? answer : [];
    const newAnswer = currentAnswer.includes(value)
      ? currentAnswer.filter(v => v !== value)
      : [...currentAnswer, value];
    onAnswer(newAnswer);
  };

  // Text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswer(e.target.value);
  };

  return (
    <div className="bg-white rounded-[10px] p-10 border border-stone flex flex-col min-h-[500px]">
      {/* Progress shown in bar, not question numbers */}

      <h2 className="text-2xl font-semibold mb-3 leading-tight text-charcoal">
        {question.question}
      </h2>

      {question.subtext && (
        <p className="text-charcoal/60 mb-6">{question.subtext}</p>
      )}

      {/* Single select */}
      {question.type === 'single' && question.options && (
        <div className="flex flex-col gap-3 mb-6 flex-1">
          {question.options.map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                answer === option.value
                  ? 'border-fuchsia bg-white'
                  : 'border-transparent bg-ice hover:border-blue'
              }`}
              onClick={() => handleSingleSelect(option.value)}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  answer === option.value
                    ? 'border-fuchsia bg-fuchsia'
                    : 'border-stone'
                }`}
              >
                {answer === option.value && (
                  <span className="text-white text-xs font-semibold">✓</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-charcoal">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-charcoal/50 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Multi select */}
      {question.type === 'multi' && question.options && (
        <div className="flex flex-col gap-3 mb-6 flex-1">
          {question.options.map(option => {
            const isSelected = Array.isArray(answer) && answer.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-fuchsia bg-white'
                    : 'border-transparent bg-ice hover:border-blue'
                }`}
                onClick={() => handleMultiToggle(option.value)}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-fuchsia bg-fuchsia'
                      : 'border-stone'
                  }`}
                >
                  {isSelected && (
                    <span className="text-white text-xs font-semibold">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-charcoal">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-charcoal/50 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Text input */}
      {question.type === 'text' && (
        <div className="mb-6 flex-1">
          <textarea
            className="w-full p-4 border-2 border-stone rounded-lg resize-vertical min-h-[150px] focus:outline-none focus:border-fuchsia transition-colors"
            placeholder={question.placeholder}
            value={typeof answer === 'string' ? answer : ''}
            onChange={handleTextChange}
          />
        </div>
      )}

      {/* Presence input */}
      {question.type === 'presence' && (
        <div className="mb-6 flex-1 space-y-4">
          <div>
            <label className="block text-sm text-charcoal/60 mb-1">Website</label>
            <input
              type="url"
              className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
              placeholder="https://yoursite.com"
              value={(() => {
                if (typeof answer === 'string') {
                  try { return JSON.parse(answer).website || ''; } catch { return ''; }
                }
                return '';
              })()}
              onChange={(e) => {
                const current = typeof answer === 'string' ? (() => {
                  try { return JSON.parse(answer); } catch { return {}; }
                })() : {};
                onAnswer(JSON.stringify({ ...current, website: e.target.value }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1">Instagram</label>
            <input
              type="text"
              className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
              placeholder="@yourhandle"
              value={(() => {
                if (typeof answer === 'string') {
                  try { return JSON.parse(answer).instagram || ''; } catch { return ''; }
                }
                return '';
              })()}
              onChange={(e) => {
                const current = typeof answer === 'string' ? (() => {
                  try { return JSON.parse(answer); } catch { return {}; }
                })() : {};
                onAnswer(JSON.stringify({ ...current, instagram: e.target.value }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1">LinkedIn</label>
            <input
              type="url"
              className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
              placeholder="https://linkedin.com/in/you"
              value={(() => {
                if (typeof answer === 'string') {
                  try { return JSON.parse(answer).linkedin || ''; } catch { return ''; }
                }
                return '';
              })()}
              onChange={(e) => {
                const current = typeof answer === 'string' ? (() => {
                  try { return JSON.parse(answer); } catch { return {}; }
                })() : {};
                onAnswer(JSON.stringify({ ...current, linkedin: e.target.value }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1">Other (TikTok, Facebook, etc.)</label>
            <input
              type="text"
              className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
              placeholder="Any other links"
              value={(() => {
                if (typeof answer === 'string') {
                  try { return JSON.parse(answer).other || ''; } catch { return ''; }
                }
                return '';
              })()}
              onChange={(e) => {
                const current = typeof answer === 'string' ? (() => {
                  try { return JSON.parse(answer); } catch { return {}; }
                })() : {};
                onAnswer(JSON.stringify({ ...current, other: e.target.value }));
              }}
            />
          </div>
          <p className="text-sm text-charcoal/50 mt-2">
            Share any of these and we&apos;ll review your current presence as part of your Reckoning.
          </p>
        </div>
      )}

      {/* Contact input */}
      {question.type === 'contact' && (
        <div className="mb-6 flex-1 space-y-4">
          <input
            type="text"
            className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
            placeholder="Your name"
            value={(() => {
              if (typeof answer === 'string') {
                try {
                  const parsed = JSON.parse(answer);
                  return parsed.name || '';
                } catch {
                  return '';
                }
              }
              return '';
            })()}
            onChange={(e) => {
              const current = typeof answer === 'string' ? (() => {
                try { return JSON.parse(answer); } catch { return {}; }
              })() : {};
              onAnswer(JSON.stringify({ ...current, name: e.target.value }));
            }}
          />
          <input
            type="email"
            className="w-full p-4 border-2 border-stone rounded-lg focus:outline-none focus:border-fuchsia transition-colors"
            placeholder="Your email"
            value={(() => {
              if (typeof answer === 'string') {
                try {
                  const parsed = JSON.parse(answer);
                  return parsed.email || '';
                } catch {
                  return '';
                }
              }
              return '';
            })()}
            onChange={(e) => {
              const current = typeof answer === 'string' ? (() => {
                try { return JSON.parse(answer); } catch { return {}; }
              })() : {};
              onAnswer(JSON.stringify({ ...current, email: e.target.value }));
            }}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-auto pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border-2 border-stone text-charcoal/60 font-medium hover:border-charcoal hover:text-charcoal transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 px-6 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-colors disabled:bg-stone disabled:text-charcoal/40 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? 'See My Reckoning →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
