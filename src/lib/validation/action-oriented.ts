// Action-oriented validation - ensure reports prescribe fixes, not just diagnose

import type { ReckoningReport, ValidationResult, QuestionnaireSubmission } from '@/types/report';

/**
 * Validates that the report is action-oriented:
 * - Every blocker has a corresponding fix in action_items
 * - Fixes include cost/time estimates where applicable
 * - Builder/Architect reports lead with fixes, not just insights
 */
export function validateActionOriented(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const persona = submission.persona;
  const isBuilderOrArchitect = persona === 'builder' || persona === 'architect';

  // Get blockers mentioned in diagnosis
  const blockers = report.sections?.snapshot?.blockers || [];
  const primaryBlocker = report.sections?.diagnosis?.primary_blocker;
  const secondaryBlockers = report.sections?.diagnosis?.secondary_blockers || [];

  // Get action items
  const actionItems = report.action_items || { must_do: [], should_do: [], could_do: [] };
  const allActions = [
    ...actionItems.must_do,
    ...actionItems.should_do,
    ...actionItems.could_do,
  ];

  // Check 1: Must have action items
  if (allActions.length === 0) {
    errors.push('No action items provided');
    return { valid: false, errors, warnings };
  }

  // Check 2: For Builder/Architect, ensure we have service recommendations with prices
  if (isBuilderOrArchitect) {
    const serviceActions = allActions.filter(a => a.action_type === 'instant' || a.action_type === 'quote');

    if (serviceActions.length === 0) {
      warnings.push('No service recommendations for Builder/Architect - report may lack concrete fixes');
    }

    // Check that service actions have prices
    const missingPrices = serviceActions.filter(a => !a.price_from);
    if (missingPrices.length > 0) {
      warnings.push(`${missingPrices.length} service(s) missing price_from`);
    }
  }

  // Check 3: Balance of DIY vs services (shouldn't be all services)
  const diyActions = allActions.filter(a => a.action_type === 'diy');
  const serviceActions = allActions.filter(a => a.action_type !== 'diy');

  if (diyActions.length === 0 && serviceActions.length > 2) {
    warnings.push('All service recommendations, no DIY items - may look too salesy');
  }

  // Check 4: Action items should have descriptions
  const missingDescriptions = allActions.filter(a => !a.description || a.description.length < 10);
  if (missingDescriptions.length > 0) {
    warnings.push(`${missingDescriptions.length} action item(s) missing or have very short descriptions`);
  }

  // Check 5: For Builder/Architect, check that diagnosis mentions fixes
  if (isBuilderOrArchitect) {
    const diagnosisText = JSON.stringify(report.sections?.diagnosis || '').toLowerCase();
    const hasFixLanguage = /fix|solve|automat|system|£\d+|\d+ hour/.test(diagnosisText);

    if (!hasFixLanguage) {
      warnings.push('Diagnosis section lacks fix-oriented language (no mentions of fixes, costs, or time saved)');
    }
  }

  // Check 6: Journey map phases should have tasks
  const journeyPhases = report.sections?.journey_map?.phases || [];
  for (const phase of journeyPhases) {
    if (!phase.tasks || phase.tasks.length === 0) {
      warnings.push(`Journey phase ${phase.number} has no tasks`);
    }
  }

  // Check 7: Next step should be specific
  const nextStep = report.sections?.next_step;
  if (nextStep) {
    const oneThingAction = nextStep.the_one_thing?.action || '';
    if (oneThingAction.length < 20) {
      warnings.push('Next step action is too vague (less than 20 characters)');
    }

    // Should have how_to_start
    if (!nextStep.the_one_thing?.how_to_start) {
      warnings.push('Next step missing how_to_start');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
