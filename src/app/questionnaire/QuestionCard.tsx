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
      <div className="bg-white rounded-2xl p-10 shadow-lg flex flex-col min-h-[500px]">
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
            className="px-6 py-3 rounded-xl border-2 border-stone text-gray-600 font-medium hover:border-charcoal hover:text-charcoal transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 rounded-xl bg-fuchsia text-white font-medium hover:bg-fuchsia-dark transition-colors"
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
    <div className="bg-white rounded-2xl p-10 shadow-lg flex flex-col min-h-[500px]">
      {questionNumber && totalQuestions && (
        <div className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
          Question {questionNumber} of {totalQuestions - 1}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3 leading-tight text-charcoal">
        {question.question}
      </h2>

      {question.subtext && (
        <p className="text-gray-600 mb-6">{question.subtext}</p>
      )}

      {/* Single select */}
      {question.type === 'single' && question.options && (
        <div className="flex flex-col gap-3 mb-6 flex-1">
          {question.options.map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                  <div className="text-sm text-gray-500 mt-1">
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
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                    <div className="text-sm text-gray-500 mt-1">
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
            className="w-full p-4 border-2 border-stone rounded-xl resize-vertical min-h-[150px] focus:outline-none focus:border-fuchsia transition-colors"
            placeholder={question.placeholder}
            value={typeof answer === 'string' ? answer : ''}
            onChange={handleTextChange}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-auto pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-stone text-gray-600 font-medium hover:border-charcoal hover:text-charcoal transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 px-6 py-3 rounded-xl bg-fuchsia text-white font-medium hover:bg-fuchsia-dark transition-colors disabled:bg-stone disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? 'Complete →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
