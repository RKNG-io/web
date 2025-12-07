// Numbers validation — ensures report uses their specific numbers from free text

import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateNumbersUsed(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const warnings: string[] = [];

  const reportText = JSON.stringify(report.sections);

  // Extract raw numbers from free-text answers only
  const freeTextNumbers: number[] = [];

  for (const [key, value] of Object.entries(submission.answers)) {
    // Skip option-based fields
    if (key === 'time_available' || key === 'hours_lost') {
      continue;
    }

    if (typeof value === 'number' && value > 10) {
      freeTextNumbers.push(value);
    }
    if (typeof value === 'string') {
      // Look for hour amounts in free text
      const hourMatches = value.match(/(\d+)\s*(?:hours?|hrs?)/gi);
      if (hourMatches) {
        for (const match of hourMatches) {
          const num = parseInt(match, 10);
          if (num > 0 && num < 100) {
            freeTextNumbers.push(num);
          }
        }
      }
    }
  }

  // Deduplicate free-text numbers
  const uniqueNumbers = [...new Set(freeTextNumbers)];

  // Check if at least one of their explicit numbers appears in report
  let numbersUsed = 0;

  for (const num of uniqueNumbers) {
    if (
      reportText.includes(num.toString()) ||
      reportText.includes(num.toLocaleString())
    ) {
      numbersUsed++;
    }
  }

  // Only warn about missing numbers if they provided explicit amounts in free text
  if (numbersUsed === 0 && uniqueNumbers.length > 0) {
    warnings.push(
      `Report doesn't reference their specific numbers. ` +
      `They mentioned: ${uniqueNumbers.slice(0, 3).join(', ')}. ` +
      `Consider referencing these in the report.`
    );
  }

  return { valid: true, errors: [], warnings };
}
