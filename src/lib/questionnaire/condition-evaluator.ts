// Condition evaluation engine for dynamic questionnaire
// Evaluates showIf/skipIf conditions against current answers

import type { Condition } from '@/lib/types';

export type Answers = Record<string, string | string[]>;

/**
 * Condition group supports AND/OR logic for complex conditions
 */
export interface ConditionGroup {
  operator: 'AND' | 'OR';
  conditions: Condition[];
}

/**
 * A condition can be a single Condition or a ConditionGroup
 */
export type ConditionExpression = Condition | ConditionGroup;

/**
 * Check if expression is a ConditionGroup (has operator AND/OR)
 */
function isConditionGroup(expr: ConditionExpression): expr is ConditionGroup {
  return 'operator' in expr && (expr.operator === 'AND' || expr.operator === 'OR');
}

/**
 * Evaluate a single condition against current answers
 */
export function evaluateCondition(condition: Condition, answers: Answers): boolean {
  const answerValue = answers[condition.questionId];

  switch (condition.operator) {
    case 'answered':
      // Check if question has any non-empty answer
      if (answerValue === undefined || answerValue === null) return false;
      if (Array.isArray(answerValue)) return answerValue.length > 0;
      if (typeof answerValue === 'string') return answerValue.trim().length > 0;
      return true;

    case 'equals':
      // Exact match (for single values)
      if (Array.isArray(answerValue)) {
        // Array with single value that matches
        return answerValue.length === 1 && answerValue[0] === condition.value;
      }
      return answerValue === condition.value;

    case 'notEquals':
      // Not equal to value
      if (Array.isArray(answerValue)) {
        return !(answerValue.length === 1 && answerValue[0] === condition.value);
      }
      return answerValue !== condition.value;

    case 'includes':
      // For multi-select: array includes value(s)
      // For single-select: value matches one of provided options
      if (Array.isArray(answerValue)) {
        if (Array.isArray(condition.value)) {
          // Any of the condition values are in the answer
          return condition.value.some(v => answerValue.includes(v));
        }
        return answerValue.includes(condition.value as string);
      }
      // Single answer — check if it's one of the condition values
      if (Array.isArray(condition.value)) {
        return condition.value.includes(answerValue as string);
      }
      return answerValue === condition.value;

    default:
      // Unknown operator — default to true (show question)
      return true;
  }
}

/**
 * Evaluate a condition expression (single or group)
 */
export function evaluateConditionExpression(
  expr: ConditionExpression | undefined,
  answers: Answers
): boolean {
  // No condition = always true
  if (!expr) return true;

  // Single condition (shorthand)
  if (!isConditionGroup(expr)) {
    return evaluateCondition(expr, answers);
  }

  // Condition group with AND/OR
  const group = expr;

  if (group.operator === 'AND') {
    return group.conditions.every(c => evaluateCondition(c, answers));
  }

  if (group.operator === 'OR') {
    return group.conditions.some(c => evaluateCondition(c, answers));
  }

  return true;
}

/**
 * Determine if a question should be shown based on showIf/skipIf conditions
 */
export function shouldShowQuestion(
  question: {
    showIf?: ConditionExpression;
    skipIf?: ConditionExpression;
  },
  answers: Answers
): boolean {
  // If skipIf is defined and evaluates to true, hide the question
  if (question.skipIf && evaluateConditionExpression(question.skipIf, answers)) {
    return false;
  }

  // If showIf is defined, only show if it evaluates to true
  if (question.showIf) {
    return evaluateConditionExpression(question.showIf, answers);
  }

  // No conditions = always show
  return true;
}

/**
 * Find all question IDs that depend on a given question's answer
 * Used for determining what to reset when an answer changes
 */
export function findDependentQuestions(
  questionId: string,
  questions: Array<{ id: string; showIf?: ConditionExpression; skipIf?: ConditionExpression }>
): string[] {
  const dependents: string[] = [];

  for (const q of questions) {
    const dependsOnShowIf = conditionReferencesQuestion(q.showIf, questionId);
    const dependsOnSkipIf = conditionReferencesQuestion(q.skipIf, questionId);

    if (dependsOnShowIf || dependsOnSkipIf) {
      dependents.push(q.id);
    }
  }

  return dependents;
}

/**
 * Check if a condition expression references a specific question
 */
function conditionReferencesQuestion(
  expr: ConditionExpression | undefined,
  questionId: string
): boolean {
  if (!expr) return false;

  if (isConditionGroup(expr)) {
    return expr.conditions.some(c => c.questionId === questionId);
  }

  return expr.questionId === questionId;
}
