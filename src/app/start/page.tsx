'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { PERSONAS } from '@/data/persona-questions';
import { useQuestionnaire } from './useQuestionnaire';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { BackConfirmModal } from './BackConfirmModal';

function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    isHydrated,
    hasSavedProgress,
    filteredQuestions,
    selectPersona,
    startQuestions,
    setAnswer,
    clearDependentAnswers,
    nextQuestion,
    goBack,
    hasAnswer,
    reset,
    getCurrentQuestion,
    getProgress,
    getAnsweredDependents,
  } = useQuestionnaire();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [backConfirm, setBackConfirm] = useState<{
    show: boolean;
    affectedCount: number;
    questionId: string | null;
  }>({ show: false, affectedCount: 0, questionId: null });

  // Show resume prompt if returning with saved progress
  useEffect(() => {
    if (isHydrated && hasSavedProgress && state.step !== 'persona') {
      setShowResumePrompt(true);
    }
  }, [isHydrated, hasSavedProgress, state.step]);

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
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          persona: state.persona,
          answers: state.answers,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit questionnaire');
      }

      const data = await response.json();

      // Redirect to the reckoning result page
      if (data.token) {
        // Clear localStorage since submission is complete
        localStorage.removeItem('reckoning_progress');
        router.push(`/reckoning/${data.token}`);
      } else {
        throw new Error('No token returned');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong on our end.');
    }
  };

  // Show loading state while hydrating to prevent flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4 flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    );
  }

  // Show resume prompt for returning users
  if (showResumePrompt) {
    const progress = getProgress();
    const personaName = state.persona ? PERSONAS[state.persona]?.name : '';

    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center py-8 mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-charcoal mb-2">
              Reckoning
            </h1>
            <p className="text-sm text-charcoal/60">Your time is now</p>
          </header>

          <div className="bg-white rounded-[10px] p-6 md:p-10 border border-stone">
            <div className="text-xs uppercase tracking-wider text-blue font-medium mb-4">
              Hey again
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-charcoal">
              You&apos;re already on your way
            </h2>
            <p className="text-charcoal/60 mb-6">
              You made it {progress.current} of {progress.total} questions into the{' '}
              <span className="font-medium text-charcoal">{personaName}</span> questionnaire. Pick up where you left off?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowResumePrompt(false)}
                className="w-full px-6 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity"
              >
                Keep going
              </button>
              <button
                onClick={() => {
                  reset();
                  setShowResumePrompt(false);
                }}
                className="w-full px-6 py-3 rounded-lg bg-transparent border-2 border-charcoal/20 text-charcoal font-medium hover:border-charcoal/40 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="bg-white rounded-[10px] p-6 md:p-10 border border-stone">
            <div className="text-xs uppercase tracking-wider text-fuchsia font-medium mb-4">
              Let's start
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-charcoal">
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
    // Use filteredQuestions length for accurate "last question" check
    const isLastQuestion = state.questionIndex === filteredQuestions.length - 1;

    const handleNext = () => {
      if (isLastQuestion) {
        handleSubmit();
      } else {
        nextQuestion();
      }
    };

    // Check if going back would invalidate dependent answers
    const handleBack = () => {
      // Get the previous question to check its dependents
      if (state.questionIndex > 0) {
        const prevQuestion = filteredQuestions[state.questionIndex - 1];
        if (prevQuestion) {
          const answeredDependents = getAnsweredDependents(prevQuestion.id);
          if (answeredDependents.length > 0) {
            // Show confirmation modal
            setBackConfirm({
              show: true,
              affectedCount: answeredDependents.length,
              questionId: prevQuestion.id,
            });
            return;
          }
        }
      }
      // No dependents affected, just go back
      goBack();
    };

    const handleBackConfirm = () => {
      if (backConfirm.questionId) {
        clearDependentAnswers(backConfirm.questionId);
      }
      setBackConfirm({ show: false, affectedCount: 0, questionId: null });
      goBack();
    };

    const handleBackCancel = () => {
      setBackConfirm({ show: false, affectedCount: 0, questionId: null });
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
            onBack={handleBack}
            canContinue={canContinue}
            isFirstQuestion={state.questionIndex === 0}
            isLastQuestion={isLastQuestion}
            questionNumber={isWelcome ? undefined : state.questionIndex}
            totalQuestions={isWelcome ? undefined : filteredQuestions.length}
            personaName={persona.name}
          />
        </div>

        <BackConfirmModal
          isOpen={backConfirm.show}
          affectedCount={backConfirm.affectedCount}
          onConfirm={handleBackConfirm}
          onCancel={handleBackCancel}
        />
      </div>
    );
  }

  // Error state
  if (submitError) {
    return (
      <div className="min-h-screen bg-ice py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center py-8 mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-charcoal mb-2">
              Reckoning
            </h1>
            <p className="text-sm text-charcoal/60">Your time is now</p>
          </header>

          <div className="bg-white rounded-[10px] p-10 border border-stone text-center">
            <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">
              That didn&apos;t work
            </h2>
            <p className="text-charcoal/60 mb-8">
              Let&apos;s try again  - or we&apos;ll sort it out and reach out within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitError(null);
                  handleSubmit();
                }}
                className="px-6 py-3 rounded-lg bg-fuchsia text-white font-medium hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
              <button
                onClick={() => setSubmitError(null)}
                className="px-6 py-3 rounded-lg bg-transparent border-2 border-charcoal text-charcoal font-medium hover:bg-charcoal/5 transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
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

          <div className="bg-white rounded-[10px] p-10 border border-stone text-center">
            <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin text-3xl">⏱</div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">
              Building your Reckoning...
            </h2>
            <p className="text-charcoal/60">
              We&apos;re seeing what&apos;s in the way  - and what unlocks it.
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
