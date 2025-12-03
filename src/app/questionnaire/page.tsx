'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { PERSONAS } from '@/data/persona-questions';
import { useQuestionnaire } from './useQuestionnaire';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';

function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    selectPersona,
    startQuestions,
    setAnswer,
    nextQuestion,
    goBack,
    hasAnswer,
    getCurrentQuestion,
    getProgress
  } = useQuestionnaire();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for persona in URL params on mount
  useEffect(() => {
    const personaParam = searchParams.get('persona');
    if (personaParam && PERSONAS[personaParam] && !state.persona) {
      selectPersona(personaParam);
    }
  }, [searchParams, selectPersona, state.persona]);

  // Handle question submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reckoning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          persona: state.persona,
          answers: state.answers,
          completedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }

      const data = await response.json();

      // Redirect to the reckoning result page
      if (data.id) {
        router.push(`/reckoning/${data.id}`);
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your questionnaire. Please try again.');
    }
  };

  // Render persona selector
  if (state.step === 'persona') {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center py-8 mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-charcoal mb-2">
              Reckoning
            </h1>
            <p className="text-sm text-charcoal/60">Your time is now</p>
          </header>

          <ProgressBar {...getProgress()} />

          <div className="bg-white rounded-lg p-10 shadow-lg">
            <div className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
              Let's start
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-charcoal">
              Which best describes where you are?
            </h2>
            <p className="text-charcoal/60 mb-8">
              This helps us ask the right questions.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {Object.entries(PERSONAS).map(([key, persona]) => (
                <div
                  key={key}
                  onClick={() => selectPersona(key)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    state.persona === key
                      ? 'border-fuchsia bg-white'
                      : 'border-transparent bg-ice hover:border-blue'
                  }`}
                >
                  <h3 className="text-lg font-medium text-charcoal mb-2">
                    {persona.name}
                  </h3>
                  <p className="text-sm text-charcoal/60">{persona.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={startQuestions}
              disabled={!state.persona}
              className="w-full px-6 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity disabled:bg-stone disabled:text-charcoal/40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render questions
  if (state.step === 'questions') {
    const question = getCurrentQuestion();
    const progress = getProgress();
    const persona = state.persona ? PERSONAS[state.persona] : null;

    if (!question || !persona) return null;

    const isWelcome = question.type === 'welcome';
    const canContinue = question.optional || hasAnswer(question.id);
    const isLastQuestion = state.questionIndex === persona.questions.length - 1;

    const handleNext = () => {
      if (isLastQuestion) {
        handleSubmit();
      } else {
        nextQuestion();
      }
    };

    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center py-8 mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-charcoal mb-2">
              Reckoning
            </h1>
            <p className="text-sm text-charcoal/60">Your time is now</p>
          </header>

          <ProgressBar {...progress} />

          <QuestionCard
            question={question}
            answer={state.answers[question.id]}
            onAnswer={(value) => setAnswer(question.id, value)}
            onNext={handleNext}
            onBack={goBack}
            canContinue={canContinue}
            isFirstQuestion={state.questionIndex === 0}
            isLastQuestion={isLastQuestion}
            questionNumber={isWelcome ? undefined : state.questionIndex}
            totalQuestions={isWelcome ? undefined : persona.questions.length}
            personaName={persona.name}
          />
        </div>
      </div>
    );
  }

  // Submitting state
  if (state.step === 'submitting' || isSubmitting) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center py-8 mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-charcoal mb-2">
              Reckoning
            </h1>
            <p className="text-sm text-charcoal/60">Your time is now</p>
          </header>

          <div className="bg-white rounded-lg p-10 shadow-lg text-center">
            <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin text-3xl">⏱</div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">
              Preparing your Reckoning...
            </h2>
            <p className="text-charcoal/60">
              We're analysing your answers and creating your personalised report.
              This takes about 30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ice py-8 px-4 flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
