'use client';

import { useState, useEffect } from 'react';
import { PERSONAS, type Persona } from '@/data/persona-questions';

export type QuestionnaireStep = 'persona' | 'questions' | 'submitting' | 'complete';

export interface QuestionnaireState {
  step: QuestionnaireStep;
  persona: string | null;
  questionIndex: number;
  answers: Record<string, string | string[]>;
}

const STORAGE_KEY = 'reckoning_progress';

export function useQuestionnaire() {
  const [state, setState] = useState<QuestionnaireState>({
    step: 'persona',
    persona: null,
    questionIndex: 0,
    answers: {}
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error('Could not parse saved state:', e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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
    if (typeof answer === 'string') return answer.trim().length > 0;
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
