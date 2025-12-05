'use client';

import { useState, useEffect, useCallback } from 'react';
import { PERSONAS, type Persona } from '@/data/persona-questions';

export type QuestionnaireStep = 'persona' | 'questions' | 'submitting' | 'complete';

export interface QuestionnaireState {
  step: QuestionnaireStep;
  persona: string | null;
  questionIndex: number;
  answers: Record<string, string | string[]>;
}

interface SavedProgress {
  state: QuestionnaireState;
  savedAt: number;
  version: number;
}

const STORAGE_KEY = 'reckoning_progress';
const STORAGE_VERSION = 1;
const EXPIRY_HOURS = 72; // Progress expires after 72 hours

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
    answers: {}
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

        // Handle legacy format (direct state object)
        if (parsed && !parsed.version && parsed.step) {
          // Migrate old format
          const migrated: SavedProgress = {
            state: parsed,
            savedAt: Date.now(),
            version: STORAGE_VERSION
          };
          setState(migrated.state);
          setHasSavedProgress(Object.keys(migrated.state.answers).length > 0);
        } else if (isValidSavedProgress(parsed)) {
          // Check if expired
          if (isExpired(parsed.savedAt)) {
            localStorage.removeItem(STORAGE_KEY);
          } else if (parsed.version === STORAGE_VERSION) {
            setState(parsed.state);
            setHasSavedProgress(Object.keys(parsed.state.answers).length > 0);
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
      version: STORAGE_VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [state, isHydrated]);

  const selectPersona = (persona: string) => {
    setState(prev => ({ ...prev, persona }));
  };

  const startQuestions = () => {
    if (state.persona) {
      setState(prev => ({ ...prev, step: 'questions', questionIndex: 0 }));
    }
  };

  const setAnswer = (questionId: string, value: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const nextQuestion = () => {
    if (!state.persona) return;

    const persona = PERSONAS[state.persona];
    if (state.questionIndex < persona.questions.length - 1) {
      setState(prev => ({ ...prev, questionIndex: prev.questionIndex + 1 }));
    } else {
      // All questions answered, move to submitting
      setState(prev => ({ ...prev, step: 'submitting' }));
    }
  };

  const goBack = () => {
    if (state.step === 'questions' && state.questionIndex > 0) {
      setState(prev => ({ ...prev, questionIndex: prev.questionIndex - 1 }));
    } else if (state.step === 'questions' && state.questionIndex === 0) {
      setState(prev => ({ ...prev, step: 'persona' }));
    }
  };

  const hasAnswer = (questionId: string): boolean => {
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
  };

  const reset = () => {
    setState({
      step: 'persona',
      persona: null,
      questionIndex: 0,
      answers: {}
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const getCurrentQuestion = () => {
    if (!state.persona || state.step !== 'questions') return null;
    const persona = PERSONAS[state.persona];
    return persona.questions[state.questionIndex];
  };

  const getProgress = () => {
    if (!state.persona) return { current: 0, total: 0, percentage: 0 };

    const persona = PERSONAS[state.persona];
    const current = state.questionIndex + 1;
    const total = persona.questions.length;
    const percentage = (current / total) * 100;

    return { current, total, percentage };
  };

  const completeSubmission = () => {
    setState(prev => ({ ...prev, step: 'complete' }));
  };

  return {
    state,
    isHydrated,
    hasSavedProgress,
    selectPersona,
    startQuestions,
    setAnswer,
    nextQuestion,
    goBack,
    hasAnswer,
    reset,
    getCurrentQuestion,
    getProgress,
    completeSubmission
  };
}
