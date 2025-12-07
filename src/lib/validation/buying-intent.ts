// Buying intent validation  - Launchers should suggest real money tests, not just "would you buy?"

import type { ReckoningReport, ValidationResult } from '@/types/report';

const BUYING_INTENT_SIGNALS = [
  'deposit',
  'pre-order',
  'pre order',
  'pay now',
  'credit card',
  'payment',
  'commit',
  'reserve',
  'waitlist',
  'a/b test',
  'landing page',
  'refundable',
  '£1',
  '£5',
  'put down',
];

const WEAK_VALIDATION_SIGNALS = [
  'would you buy',
  'would you be interested',
  'what do you think',
  'does this sound good',
  'let me know if',
  'would you consider',
  'are you interested',
];

export function validateBuyingIntent(report: ReckoningReport): ValidationResult {
  const warnings: string[] = [];

  // Only applies to Launchers
  if (report.meta.persona !== 'launcher') {
    return { valid: true, errors: [], warnings: [] };
  }

  const nextStepText = JSON.stringify(report.sections.next_step).toLowerCase();
  const journeyText = JSON.stringify(report.sections.journey_map).toLowerCase();
  const allValidationText = nextStepText + journeyText;

  // Check for buying intent signals
  const hasBuyingIntent = BUYING_INTENT_SIGNALS.some(signal =>
    allValidationText.includes(signal)
  );

  // Check for weak validation only
  const hasWeakValidation = WEAK_VALIDATION_SIGNALS.some(signal =>
    allValidationText.includes(signal)
  );

  if (!hasBuyingIntent) {
    warnings.push(
      'No buying intent validation suggested. ' +
      'Launcher reports should include at least one "real money" test ' +
      '(deposit, pre-order, A/B landing page, etc.)'
    );
  }

  if (hasWeakValidation && !hasBuyingIntent) {
    warnings.push(
      'Only weak validation suggested ("would you buy", etc.). ' +
      'Add a buying intent test  - stated interest ≠ real demand.'
    );
  }

  return { valid: true, errors: [], warnings };
}
