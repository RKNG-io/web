// Quoted phrases validation  - ensures report uses their actual words

import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateQuotedPhrases(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const reportText = JSON.stringify(report.sections);

  // Count actual quotation marks (phrases in quotes)
  // Match phrases in double quotes that are 5+ characters
  const doubleQuotedPhrases = reportText.match(/"[^"]{5,}"/g) || [];
  // Match phrases in single quotes that are 5+ characters (but not apostrophes)
  const singleQuotedPhrases = reportText.match(/'[^']{10,}'/g) || [];
  const allQuoted = [...doubleQuotedPhrases, ...singleQuotedPhrases];

  // Must have at least 3 quoted phrases
  if (allQuoted.length < 3) {
    errors.push(
      `Only ${allQuoted.length} quoted phrases found. ` +
      `Must include at least 3 direct quotes from their answers.`
    );
  }

  // Verify quoted phrases exist in original answers
  const allAnswerText = Object.values(submission.answers)
    .filter(v => typeof v === 'string')
    .join(' ')
    .toLowerCase();

  let verifiedQuotes = 0;
  const foundQuotes: string[] = [];

  for (const quoted of allQuoted) {
    const cleanQuote = quoted.replace(/['"]/g, '').toLowerCase().trim();
    // Check if at least part of the quote (3+ word substring) appears in answers
    const words = cleanQuote.split(/\s+/);
    if (words.length >= 3) {
      const threeWordChunk = words.slice(0, 3).join(' ');
      if (allAnswerText.includes(threeWordChunk) || allAnswerText.includes(cleanQuote)) {
        verifiedQuotes++;
        foundQuotes.push(cleanQuote.slice(0, 40));
      }
    } else if (cleanQuote.length > 5 && allAnswerText.includes(cleanQuote)) {
      verifiedQuotes++;
      foundQuotes.push(cleanQuote.slice(0, 40));
    }
  }

  if (verifiedQuotes < 2 && allQuoted.length >= 3) {
    warnings.push(
      `Only ${verifiedQuotes} quoted phrases verified in original answers. ` +
      `Quotes may be paraphrased or fabricated.`
    );
  }

  // Check input_echo has quoted phrases
  const inputEchoQuotes = report.input_echo?.quoted_phrases || [];
  if (inputEchoQuotes.length < 2) {
    warnings.push(
      `input_echo.quoted_phrases has only ${inputEchoQuotes.length} items. Should have 2-3.`
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}
