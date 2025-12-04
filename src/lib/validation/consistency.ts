// Consistency validation — ensure calculations use numbers from questionnaire answers

import type { ReckoningReport, QuestionnaireSubmission, ValidationResult } from '@/types/report';

interface ExtractedNumbers {
  hoursPerWeek: number | null;
  hourlyRate: number | null;
  budget: number | null;
}

/**
 * Extract numeric values from questionnaire answers
 */
export function extractNumbersFromAnswers(
  answers: Record<string, unknown>
): ExtractedNumbers {
  const result: ExtractedNumbers = {
    hoursPerWeek: null,
    hourlyRate: null,
    budget: null,
  };

  // Common field names for hours
  const hoursFields = ['hours_per_week', 'weekly_hours', 'time_available', 'hours_available', 'hours'];
  for (const field of hoursFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.hoursPerWeek = parseInt(match[1]);
    }
  }

  // Common field names for rate
  const rateFields = ['hourly_rate', 'rate', 'charge_rate', 'value_per_hour'];
  for (const field of rateFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.hourlyRate = parseInt(match[1]);
    }
  }

  // Common field names for budget
  const budgetFields = ['budget', 'investment', 'starting_budget', 'available_budget'];
  for (const field of budgetFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.budget = parseInt(match[1]);
    }
  }

  // Fallback: scan all string answers for patterns
  const allText = Object.values(answers)
    .filter(v => typeof v === 'string')
    .join(' ');

  // "20 hours per week" or "20 hours/week"
  const hoursMatch = allText.match(/(\d+)\s*hours?\s*(per|\/|a)\s*week/i);
  if (hoursMatch && !result.hoursPerWeek) {
    result.hoursPerWeek = parseInt(hoursMatch[1]);
  }

  // "£50/hour" or "£50 per hour"
  const rateMatch = allText.match(/£(\d+)\s*(per|\/|an)\s*hour/i);
  if (rateMatch && !result.hourlyRate) {
    result.hourlyRate = parseInt(rateMatch[1]);
  }

  // "£2,000 budget" or "budget of £2000" or "around 2000 pounds"
  const budgetMatch = allText.match(/£([\d,]+)\s*budget|budget\s*(?:of\s*)?£([\d,]+)|around\s*([\d,]+)\s*pounds?/i);
  if (budgetMatch && !result.budget) {
    const value = (budgetMatch[1] || budgetMatch[2] || budgetMatch[3]).replace(/,/g, '');
    result.budget = parseInt(value);
  }

  return result;
}

/**
 * Validate that report calculations are consistent with questionnaire answers
 */
export function validateConsistency(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const answersNumbers = extractNumbersFromAnswers(submission.answers);
  const calc = report.sections.diagnosis?.cost_of_inaction?.calculation;

  // Check hours consistency
  if (answersNumbers.hoursPerWeek && calc?.hours_per_week) {
    const answerHours = answersNumbers.hoursPerWeek;
    const calcHours = calc.hours_per_week;

    if (answerHours !== calcHours) {
      // Allow if calc uses a subset (e.g., "admin hours" vs "total hours")
      if (calcHours < answerHours) {
        // Acceptable: using a portion of their time
        // But should be explained in the narrative
        const narrative = report.sections.diagnosis.cost_of_inaction.narrative.toLowerCase();
        const hasExplanation = narrative.includes('admin') ||
          narrative.includes('portion') ||
          narrative.includes('some of') ||
          narrative.includes('part of');

        if (!hasExplanation) {
          warnings.push(
            `Hours mismatch: They said ${answerHours} hrs/week, ` +
            `calculation uses ${calcHours} hrs/week. ` +
            `If intentional, explain in the narrative.`
          );
        }
      } else {
        // Using MORE hours than they stated — likely error
        errors.push(
          `Hours inconsistency: They said ${answerHours} hrs/week available, ` +
          `but calculation uses ${calcHours} hrs/week.`
        );
      }
    }
  }

  // Check hourly rate plausibility
  if (answersNumbers.hourlyRate && calc?.hourly_value) {
    const answerRate = answersNumbers.hourlyRate;
    const calcRate = calc.hourly_value;

    if (Math.abs(answerRate - calcRate) > answerRate * 0.2) {
      warnings.push(
        `Hourly rate mismatch: They indicated £${answerRate}/hr, ` +
        `calculation uses £${calcRate}/hr.`
      );
    }
  }

  // Check budget is referenced if provided
  if (answersNumbers.budget) {
    const reportText = JSON.stringify(report.sections).toLowerCase();
    const budgetStr = answersNumbers.budget.toString();
    const budgetFormatted = answersNumbers.budget.toLocaleString();

    const budgetMentioned = reportText.includes(budgetStr) ||
      reportText.includes(budgetFormatted) ||
      reportText.includes(`£${budgetStr}`) ||
      reportText.includes(`£${budgetFormatted}`);

    if (!budgetMentioned) {
      warnings.push(
        `Budget not referenced: They mentioned £${budgetFormatted} budget, ` +
        `but report doesn't use this number.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
