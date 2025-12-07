// Confidence scoring  - combine all validation results (v3 - buying intent + consistency)

import type { ReckoningReport, QuestionnaireSubmission, ConfidenceResult } from '@/types/report';
import { validateSchema } from './schema';
import { validateInputEcho } from './input-echo';
import { validateBrandVoice } from './brand-voice';
import { validateCalculations, validateRoiClaims } from './maths';
import { validateServices } from './services';
import { validateSpecificity } from './specificity';
import { validateQuotedPhrases } from './quoted-phrases';
import { validateBusinessTypeMatch } from './business-type';
import { validateNumbersUsed } from './numbers';
import { validateBuyingIntent } from './buying-intent';
import { validateConsistency } from './consistency';

export function calculateConfidence(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ConfidenceResult {

  // Run all validations
  const results = {
    schema: validateSchema(report),
    inputEcho: validateInputEcho(report, submission),
    brandVoice: validateBrandVoice(report),
    maths: validateCalculations(report),
    services: validateServices(report),
    specificity: validateSpecificity(report),
    quotedPhrases: validateQuotedPhrases(report, submission),
    businessTypeMatch: validateBusinessTypeMatch(report, submission),
    numbersUsed: validateNumbersUsed(report, submission),
    buyingIntent: validateBuyingIntent(report),
    consistency: validateConsistency(report, submission),
  };

  // Also check ROI claims in the full report text
  const reportText = JSON.stringify(report.sections);
  const roiValidation = validateRoiClaims(reportText);

  // Collect hard failures
  const hardFailures = [
    ...results.schema.errors,
    ...results.inputEcho.errors,
    ...results.maths.errors,
    ...results.services.errors,
    ...results.specificity.errors,
    ...results.quotedPhrases.errors,
    ...results.businessTypeMatch.errors,
    ...results.consistency.errors,
  ];

  // If any hard failures, confidence is 0
  if (hardFailures.length > 0) {
    return {
      score: 0,
      autoApprove: false,
      flags: hardFailures,
      validationResults: results,
    };
  }

  // Start at 100, deduct for warnings
  let score = 100;
  const flags: string[] = [];

  // Collect all warnings
  const allWarnings = [
    ...results.schema.warnings,
    ...results.inputEcho.warnings,
    ...results.brandVoice.warnings,
    ...results.maths.warnings,
    ...results.services.warnings,
    ...results.specificity.warnings,
    ...results.quotedPhrases.warnings,
    ...results.businessTypeMatch.warnings,
    ...results.numbersUsed.warnings,
    ...results.buyingIntent.warnings,
    ...results.consistency.warnings,
    ...roiValidation.warnings,
  ];

  // Deduct points per warning type (different severity)
  for (const warning of allWarnings) {
    if (warning.includes('Generic phrase')) {
      score -= 3;
    } else if (warning.includes('Filler strength')) {
      score -= 5;
    } else if (warning.includes('Vague advice')) {
      score -= 5;
    } else if (warning.includes('Cheerleader phrase')) {
      score -= 5;
    } else if (warning.includes('not relevant for')) {
      score -= 8; // Business type mismatch
    } else if (warning.includes('quoted phrases')) {
      score -= 8; // Missing direct quotes
    } else if (warning.includes("doesn't reference their")) {
      score -= 5; // Not using their numbers
    } else if (warning.includes('buying intent')) {
      score -= 5; // Missing validation tactics (Launcher only)
    } else if (warning.includes('Hours mismatch') || warning.includes('rate mismatch')) {
      score -= 8; // Calculation inconsistency
    } else if (warning.includes('Budget not referenced')) {
      score -= 3; // Minor  - budget should be mentioned
    } else if (warning.includes('completion_criteria')) {
      score -= 2; // Minor  - phases should have criteria
    } else {
      score -= 3; // Default deduction
    }
    flags.push(warning);
  }

  // Floor at 0
  score = Math.max(score, 0);

  // Bonus points for good signals
  if ((report.input_echo?.quoted_phrases?.length || 0) >= 4) {
    score += 5; // Extra personalisation
  }

  // Bonus for using blocked/unlocked framing throughout
  const blockedCount = (reportText.match(/blocked/gi) || []).length;
  const unlockedCount = (reportText.match(/unlocked/gi) || []).length;
  if (blockedCount >= 2 && unlockedCount >= 2) {
    score += 3;
  }

  // Bonus for including specific quotes (more than minimum)
  const quoteCount = (reportText.match(/"[^"]{5,}"/g) || []).length;
  if (quoteCount >= 5) {
    score += 5;
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Auto-approve threshold: 90% confidence + ≤2 warnings
  const autoApprove = score >= 90 && allWarnings.length <= 2;

  return {
    score,
    autoApprove,
    flags,
    validationResults: results,
  };
}

// Helper to get a human-readable summary
export function getConfidenceSummary(result: ConfidenceResult): string {
  if (result.score === 0) {
    return `Failed validation: ${result.flags[0]}`;
  }

  if (result.autoApprove) {
    return `High confidence (${result.score}%)  - auto-approved`;
  }

  if (result.score >= 70) {
    return `Medium confidence (${result.score}%)  - needs review. ${result.flags.length} issue(s)`;
  }

  return `Low confidence (${result.score}%)  - needs review. ${result.flags.length} issue(s)`;
}
