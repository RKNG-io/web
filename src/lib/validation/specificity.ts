// Specificity validation  - catches generic content that should be specific

import type { ReckoningReport } from '@/types/report';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const GENERIC_PHRASES = [
  // Motivational fluff
  'every successful business',
  "you've got this",
  'believe in yourself',
  'follow your dreams',
  'take the leap',
  'the journey begins',
  'your journey',
  'first step on your journey',
  'closer than you think',

  // Filler advice
  'can feel overwhelming',
  'at the start',
  "it's important to",
  'the key is to',
  'consider exploring',
  'think about',
  'you might want to',
  'it would be beneficial',

  // Echo patterns (not insights)
  "you've identified a clear",
  'you have a good understanding',
  'you know what you want',
  'you mentioned that you',
  'as you said',
  'you told us that',
];

const FILLER_STRENGTHS = [
  "you've identified",
  'you have a clear',
  'you know your',
  'you understand',
  "you're aware",
  'you recognise',
];

const VAGUE_ADVICE = [
  'research competitor',
  'explore your options',
  'consider your target',
  'think about pricing',
  'develop a strategy',
  'create a plan',
  'build a presence',
  'establish yourself',
  'work on your',
  'focus on building',
];

const CHEERLEADER_PHRASES = [
  "you've got this",
  'believe in yourself',
  'you can do it',
  'go for it',
  'take the leap',
  'make it happen',
  'crushing it',
  'killing it',
  'smashing it',
];

export function validateSpecificity(report: ReckoningReport): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const reportText = JSON.stringify(report.sections).toLowerCase();

  // Check for generic phrases
  let genericCount = 0;
  for (const phrase of GENERIC_PHRASES) {
    if (reportText.includes(phrase.toLowerCase())) {
      warnings.push(`Generic phrase: "${phrase}"`);
      genericCount++;
    }
  }

  // More than 3 generic phrases = hard fail
  if (genericCount > 3) {
    errors.push(`Too many generic phrases (${genericCount}). Report feels templated.`);
  }

  // Check strengths aren't just echoing
  const strengthsText = JSON.stringify(report.sections?.snapshot?.strengths || []).toLowerCase();
  for (const filler of FILLER_STRENGTHS) {
    if (strengthsText.includes(filler.toLowerCase())) {
      warnings.push(`Filler strength (echo, not insight): "${filler}"`);
    }
  }

  // Check advice isn't vague
  const adviceText = (
    JSON.stringify(report.sections?.journey_map || {}).toLowerCase() +
    JSON.stringify(report.sections?.next_step || {}).toLowerCase()
  );
  for (const vague of VAGUE_ADVICE) {
    if (adviceText.includes(vague.toLowerCase())) {
      warnings.push(`Vague advice: "${vague}"  - should be specific action`);
    }
  }

  // Check for cheerleader phrases
  for (const cheerleader of CHEERLEADER_PHRASES) {
    if (reportText.includes(cheerleader.toLowerCase())) {
      warnings.push(`Cheerleader phrase: "${cheerleader}"  - should be direct, not saccharine`);
    }
  }

  // Check opening isn't template
  const openingHeadline = report.sections?.opening?.headline?.toLowerCase() || '';
  const openingBody = report.sections?.opening?.body?.toLowerCase() || '';

  if (openingHeadline.includes('closer than you think') && !openingBody.includes('"')) {
    errors.push('Opening uses generic template without specific quotes. Must reference their actual words.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
