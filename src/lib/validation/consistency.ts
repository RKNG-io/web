// Consistency validation  - ensure calculations use numbers from questionnaire answers

import type { ReckoningReport, QuestionnaireSubmission, ValidationResult } from '@/types/report';

interface ExtractedNumbers {
  hoursPerWeek: number | null;
  hourlyRate: number | null;
  hoursRange: { min: number; max: number } | null;
}

// Map option values to numeric ranges
const TIME_AVAILABLE_MAP: Record<string, { min: number; max: number }> = {
  'minimal': { min: 0, max: 2 },
  'some': { min: 2, max: 5 },
  'decent': { min: 5, max: 10 },
  'serious': { min: 10, max: 20 },
  'full_time': { min: 30, max: 50 },
};

const HOURS_LOST_MAP: Record<string, { min: number; max: number }> = {
  '1_2': { min: 1, max: 2 },
  '3_5': { min: 3, max: 5 },
  '5_10': { min: 5, max: 10 },
  'over_10': { min: 10, max: 20 },
  'constant': { min: 15, max: 40 },
};

/**
 * Extract numeric values from questionnaire answers
 * Handles both legacy raw numbers and new option-value format
 */
export function extractNumbersFromAnswers(
  answers: Record<string, unknown>
): ExtractedNumbers {
  const result: ExtractedNumbers = {
    hoursPerWeek: null,
    hourlyRate: null,
    hoursRange: null,
  };

  // Handle time_available option values
  const timeAvailable = answers.time_available;
  if (typeof timeAvailable === 'string' && TIME_AVAILABLE_MAP[timeAvailable]) {
    result.hoursRange = TIME_AVAILABLE_MAP[timeAvailable];
    result.hoursPerWeek = Math.round((result.hoursRange.min + result.hoursRange.max) / 2);
  }

  // Handle hours_lost option values (Builder persona)
  const hoursLost = answers.hours_lost;
  if (typeof hoursLost === 'string' && HOURS_LOST_MAP[hoursLost]) {
    const range = HOURS_LOST_MAP[hoursLost];
    // This is hours lost to admin, not total available
    result.hoursRange = result.hoursRange || range;
  }

  // Legacy: try extracting raw numbers from text fields
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

  // Check hours consistency  - use ranges when available
  if (calc?.hours_per_week) {
    const calcHours = calc.hours_per_week;

    if (answersNumbers.hoursRange) {
      const { min, max } = answersNumbers.hoursRange;
      // Allow calc hours within range (with 20% tolerance)
      const toleranceMin = Math.max(0, min * 0.8);
      const toleranceMax = max * 1.2;

      if (calcHours > toleranceMax) {
        errors.push(
          `Hours inconsistency: They indicated ${min}-${max} hrs/week available, ` +
          `but calculation uses ${calcHours} hrs/week.`
        );
      } else if (calcHours < toleranceMin && calcHours > 0) {
        // Using less than stated  - only warn, might be intentional
        warnings.push(
          `Hours note: They indicated ${min}-${max} hrs/week, ` +
          `calculation uses ${calcHours}. This is fine if intentional.`
        );
      }
    } else if (answersNumbers.hoursPerWeek) {
      // Legacy exact match check
      const answerHours = answersNumbers.hoursPerWeek;
      if (calcHours > answerHours * 1.2) {
        errors.push(
          `Hours inconsistency: They said ${answerHours} hrs/week available, ` +
          `but calculation uses ${calcHours} hrs/week.`
        );
      }
    }
  }

  // Check hourly rate plausibility (only from free text  - we don't ask for this directly)
  if (answersNumbers.hourlyRate && calc?.hourly_value) {
    const answerRate = answersNumbers.hourlyRate;
    const calcRate = calc.hourly_value;

    if (Math.abs(answerRate - calcRate) > answerRate * 0.3) {
      warnings.push(
        `Hourly rate mismatch: They indicated £${answerRate}/hr, ` +
        `calculation uses £${calcRate}/hr.`
      );
    }
  }

  // Note: Budget validation removed  - asking about budget feels extractive
  // and doesn't improve report quality

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
