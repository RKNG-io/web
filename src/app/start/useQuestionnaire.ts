'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PERSONAS, type Persona, type PersonaQuestion } from '@/data/persona-questions';
import { mergeWithIndustryQuestions } from '@/data/industry-questions';
import { shouldShowQuestion, findDependentQuestions } from '@/lib/questionnaire/condition-evaluator';

export type QuestionnaireStep = 'persona' | 'questions' | 'submitting' | 'complete';

export interface QuestionnaireState {
  step: QuestionnaireStep;
  persona: string | null;
  questionIndex: number;
  answers: Record<string, string | string[]>;
  // Track current question ID for navigation (more stable than index)
  currentQuestionId: string | null;
}

// Journey phases for emotional arc (UX recommendation)
export type JourneyPhase = {
  name: string;
  description: string;
};

export const JOURNEY_PHASES: JourneyPhase[] = [
  { name: 'Getting started', description: 'A few quick questions' },
  { name: 'Your situation', description: 'Where you are now' },
  { name: "What's in the way", description: 'The honest bit' },
  { name: 'Where you want to be', description: 'Almost there' },
  { name: 'Final details', description: 'Last step' },
];

interface SavedProgress {
  state: QuestionnaireState;
  savedAt: number;
  version: number;
}

const STORAGE_KEY = 'reckoning_progress';
const STORAGE_VERSION = 2; // Bumped for new state shape
const EXPIRY_HOURS = 72;

function isValidSavedProgress(data: unknown): data is SavedProgress {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.savedAt === 'number' &&
    typeof obj.version === 'number' &&
    obj.state !== undefined &&
    typeof (obj.state as Record<string, unknown>).step === 'string'
  );
}

function isExpired(savedAt: number): boolean {
  const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000;
  return Date.now() - savedAt > expiryMs;
}

export function useQuestionnaire() {
  const [state, setState] = useState<QuestionnaireState>({
    step: 'persona',
    persona: null,
    questionIndex: 0,
    answers: {},
    currentQuestionId: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Handle legacy format (direct state object or v1)
        if (parsed && !parsed.version && parsed.step) {
          const migrated: SavedProgress = {
            state: { ...parsed, currentQuestionId: null },
            savedAt: Date.now(),
            version: STORAGE_VERSION,
          };
          setState(migrated.state);
          setHasSavedProgress(Object.keys(migrated.state.answers).length > 0);
        } else if (isValidSavedProgress(parsed)) {
          if (isExpired(parsed.savedAt)) {
            localStorage.removeItem(STORAGE_KEY);
          } else {
            // Migrate v1 to v2 if needed
            const migratedState = {
              ...parsed.state,
              currentQuestionId: parsed.state.currentQuestionId || null,
            };
            setState(migratedState);
            setHasSavedProgress(Object.keys(migratedState.answers).length > 0);
          }
        }
      }
    } catch (e) {
      console.error('Could not parse saved state:', e);
      localStorage.removeItem(STORAGE_KEY);
    }

    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    const progress: SavedProgress = {
      state,
      savedAt: Date.now(),
      version: STORAGE_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [state, isHydrated]);

  /**
   * Get the filtered list of questions based on current answers
   * This includes industry-specific questions and condition evaluation
   */
  const filteredQuestions = useMemo((): PersonaQuestion[] => {
    if (!state.persona) return [];

    const persona = PERSONAS[state.persona];
    if (!persona) return [];

    // Get business type from answers
    const businessType = state.answers.business_type as string | undefined;

    // Merge with industry questions
    const allQuestions = mergeWithIndustryQuestions(persona.questions, businessType);

    // Filter based on showIf/skipIf conditions
    return allQuestions.filter((q) => shouldShowQuestion(q, state.answers));
  }, [state.persona, state.answers]);

  /**
   * Get questions that depend on a given question's answer
   * Used to determine what needs to be reset when an answer changes
   */
  const getDependentQuestionIds = useCallback(
    (questionId: string): string[] => {
      if (!state.persona) return [];

      const persona = PERSONAS[state.persona];
      const businessType = state.answers.business_type as string | undefined;
      const allQuestions = mergeWithIndustryQuestions(persona.questions, businessType);

      return findDependentQuestions(questionId, allQuestions);
    },
    [state.persona, state.answers.business_type]
  );

  const selectPersona = useCallback((persona: string) => {
    setState((prev) => ({ ...prev, persona }));
  }, []);

  const startQuestions = useCallback(() => {
    if (state.persona) {
      setState((prev) => ({
        ...prev,
        step: 'questions',
        questionIndex: 0,
        currentQuestionId: null,
      }));
    }
  }, [state.persona]);

  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setState((prev) => {
        const newAnswers = { ...prev.answers, [questionId]: value };

        // Check if this change affects dependent questions
        // For now, we keep dependent answers (they'll just be hidden if conditions no longer match)
        // A more aggressive approach would clear dependent answers

        return {
          ...prev,
          answers: newAnswers,
        };
      });
    },
    []
  );

  /**
   * Clear answers for questions that depend on a changed question
   * Call this explicitly when you want to reset dependent answers
   */
  const clearDependentAnswers = useCallback(
    (questionId: string) => {
      const dependentIds = getDependentQuestionIds(questionId);
      if (dependentIds.length === 0) return;

      setState((prev) => {
        const newAnswers = { ...prev.answers };
        for (const id of dependentIds) {
          delete newAnswers[id];
        }
        return { ...prev, answers: newAnswers };
      });
    },
    [getDependentQuestionIds]
  );

  const nextQuestion = useCallback(() => {
    if (state.questionIndex < filteredQuestions.length - 1) {
      const nextIndex = state.questionIndex + 1;
      setState((prev) => ({
        ...prev,
        questionIndex: nextIndex,
        currentQuestionId: filteredQuestions[nextIndex]?.id || null,
      }));
    } else {
      // All questions answered
      setState((prev) => ({ ...prev, step: 'submitting' }));
    }
  }, [filteredQuestions, state.questionIndex]);

  const goBack = useCallback(() => {
    if (state.step === 'questions' && state.questionIndex > 0) {
      const prevIndex = state.questionIndex - 1;
      setState((prev) => ({
        ...prev,
        questionIndex: prevIndex,
        currentQuestionId: filteredQuestions[prevIndex]?.id || null,
      }));
    } else if (state.step === 'questions' && state.questionIndex === 0) {
      setState((prev) => ({ ...prev, step: 'persona' }));
    }
  }, [filteredQuestions, state.questionIndex, state.step]);

  const hasAnswer = useCallback(
    (questionId: string): boolean => {
      const answer = state.answers[questionId];
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === 'string') {
        // Special handling for contact field (JSON with name and email)
        if (questionId === 'contact') {
          try {
            const parsed = JSON.parse(answer);
            return !!(parsed.name?.trim() && parsed.email?.trim());
          } catch {
            return false;
          }
        }
        return answer.trim().length > 0;
      }
      return !!answer;
    },
    [state.answers]
  );

  const reset = useCallback(() => {
    setState({
      step: 'persona',
      persona: null,
      questionIndex: 0,
      answers: {},
      currentQuestionId: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCurrentQuestion = useCallback((): PersonaQuestion | null => {
    if (!state.persona || state.step !== 'questions') return null;
    return filteredQuestions[state.questionIndex] ?? null;
  }, [state.persona, state.step, state.questionIndex, filteredQuestions]);

  /**
   * Get progress as journey phase (not raw numbers)
   * Per UX recommendation: don't show "X of Y" that changes
   */
  const getProgress = useCallback(() => {
    if (!state.persona) {
      return {
        current: 0,
        total: 0,
        percentage: 0,
        phaseIndex: 0,
        phase: JOURNEY_PHASES[0],
      };
    }

    const total = filteredQuestions.length;
    const current = Math.min(state.questionIndex + 1, total);
    const percentage = total > 0 ? (current / total) * 100 : 0;

    // Map percentage to journey phase
    let phaseIndex = 0;
    if (percentage >= 80) phaseIndex = 4;
    else if (percentage >= 60) phaseIndex = 3;
    else if (percentage >= 40) phaseIndex = 2;
    else if (percentage >= 20) phaseIndex = 1;

    return {
      current,
      total,
      percentage,
      phaseIndex,
      phase: JOURNEY_PHASES[phaseIndex],
    };
  }, [state.persona, state.questionIndex, filteredQuestions.length]);

  const completeSubmission = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'complete' }));
  }, []);

  /**
   * Check if changing an answer would affect other questions
   * Returns list of dependent question IDs (useful for confirmation dialogs)
   */
  const getAnsweredDependents = useCallback(
    (questionId: string): string[] => {
      const dependentIds = getDependentQuestionIds(questionId);
      return dependentIds.filter((id) => hasAnswer(id));
    },
    [getDependentQuestionIds, hasAnswer]
  );

  return {
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
    completeSubmission,
    getDependentQuestionIds,
    getAnsweredDependents,
  };
}
