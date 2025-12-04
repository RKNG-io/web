// Numbers validation — ensures report uses their specific numbers

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

  // Extract numbers from submission
  const answerNumbers: number[] = [];
  const budgetPatterns: string[] = [];

  for (const [key, value] of Object.entries(submission.answers)) {
    if (typeof value === 'number' && value > 10) {
      answerNumbers.push(value);
    }
    if (typeof value === 'string') {
      // Look for currency amounts
      const currencyMatches = value.match(/[£$€]?\s*(\d{1,3}(?:,?\d{3})*)/g);
      if (currencyMatches) {
        for (const match of currencyMatches) {
          const num = parseInt(match.replace(/[£$€,\s]/g, ''), 10);
          if (num > 10 && num < 10000000) {
            answerNumbers.push(num);
            budgetPatterns.push(match);
          }
        }
      }

      // Look for hour amounts
      const hourMatches = value.match(/(\d+)\s*(?:hours?|hrs?)/gi);
      if (hourMatches) {
        for (const match of hourMatches) {
          const num = parseInt(match, 10);
          if (num > 0 && num < 100) {
            answerNumbers.push(num);
          }
        }
      }

      // Look for plain numbers in budget-related fields
      if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('invest')) {
        const numMatches = value.match(/\d+/g);
        if (numMatches) {
          for (const match of numMatches) {
            const num = parseInt(match, 10);
            if (num > 100) {
              answerNumbers.push(num);
            }
          }
        }
      }
    }
  }

  // Deduplicate
  const uniqueNumbers = [...new Set(answerNumbers)];

  // Check if at least one of their numbers appears in report
  let numbersUsed = 0;
  const foundNumbers: number[] = [];

  for (const num of uniqueNumbers) {
    // Check for the number in various formats
    if (
      reportText.includes(num.toString()) ||
      reportText.includes(num.toLocaleString()) ||
      reportText.includes(`£${num}`) ||
      reportText.includes(`£${num.toLocaleString()}`)
    ) {
      numbersUsed++;
      foundNumbers.push(num);
    }
  }

  if (numbersUsed === 0 && uniqueNumbers.length > 0) {
    warnings.push(
      `Report doesn't reference their specific numbers. ` +
      `They mentioned: ${uniqueNumbers.slice(0, 3).map(n =>
        n > 100 ? `£${n.toLocaleString()}` : n
      ).join(', ')}. ` +
      `Should reference their budget, timeline, or hours.`
    );
  }

  // Check if budget is mentioned at all
  const hasBudgetAnswer = Object.keys(submission.answers).some(k =>
    k.toLowerCase().includes('budget') || k.toLowerCase().includes('invest')
  );

  if (hasBudgetAnswer) {
    const reportLower = reportText.toLowerCase();
    const mentionsBudget =
      reportLower.includes('budget') ||
      reportLower.includes('£') ||
      reportLower.includes('invest');

    if (!mentionsBudget) {
      warnings.push(
        `They provided budget information but report doesn't address it. ` +
        `Should acknowledge their budget and what it can/can't buy.`
      );
    }
  }

  return { valid: true, errors: [], warnings };
}
