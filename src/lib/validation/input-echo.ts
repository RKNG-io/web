// Input echo validation — ensure report uses actual user answers

import type { ReckoningReport, QuestionnaireSubmission, ValidationResult } from '@/types/report';
import { extractUserName } from '@/lib/prompts/builder';

export function validateInputEcho(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract name from answers (handles contact JSON field)
  const submittedName = extractUserName(submission.answers).toLowerCase().trim();
  const reportName = (report.recipient?.name || '').toLowerCase().trim();

  if (submittedName && submittedName !== reportName) {
    errors.push(`Name mismatch: submitted "${submittedName}", report uses "${reportName}"`);
  }

  // Persona must match
  const submittedPersona = submission.persona;
  const reportPersona = report.meta?.persona;

  if (submittedPersona !== reportPersona) {
    errors.push(`Persona mismatch: submitted "${submittedPersona}", report uses "${reportPersona}"`);
  }

  // Input echo name must match (if input_echo exists)
  if (report.input_echo) {
    const inputEchoName = (report.input_echo.name || '').toLowerCase().trim();
    if (submittedName && inputEchoName !== submittedName) {
      errors.push(`Input echo name mismatch: expected "${submittedName}", got "${inputEchoName}"`);
    }

    // Input echo persona must match
    if (report.input_echo.persona !== submittedPersona) {
      errors.push(`Input echo persona mismatch`);
    }
  } else {
    errors.push('Missing input_echo section');
  }
  
  // Quoted phrases must exist in original answers
  const allAnswerText = Object.values(submission.answers)
    .filter((v): v is string => typeof v === 'string')
    .join(' ')
    .toLowerCase();

  const quotedPhrases = report.input_echo?.quoted_phrases || [];
  for (const phrase of quotedPhrases) {
    if (!phrase) continue;
    const phraseClean = phrase.toLowerCase().replace(/['"]/g, '');
    // Only check phrases longer than 10 chars to avoid false positives
    if (phraseClean.length > 10 && !allAnswerText.includes(phraseClean)) {
      warnings.push(`Quoted phrase not found in answers: "${phrase.substring(0, 50)}..."`);
    }
  }
  
  // Check for hallucination red flags
  const hallucinationPatterns = [
    /you (mentioned|said|told us) you have \d+ employees/i,
    /your team of \d+/i,
    /your \$[\d,]+ revenue/i,
    /your £[\d,]+ revenue/i,
    /your [\d,]+ (clients|customers)/i,
  ];
  
  const reportText = JSON.stringify(report.sections);
  for (const pattern of hallucinationPatterns) {
    const match = reportText.match(pattern);
    if (match) {
      // Check if this info was actually provided
      const matchedText = match[0].toLowerCase();
      if (!allAnswerText.includes(matchedText)) {
        warnings.push(`Possible hallucination: "${match[0]}"`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
