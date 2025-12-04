// Brand voice validation — check for banned phrases and tone

import type { ReckoningReport, ValidationResult } from '@/types/report';

const BANNED_PHRASES = [
  // Prescriptive language
  "you should",
  "you need to",
  "you must",
  "you have to",
  "what you need to understand",
  
  // Fear-based
  "most businesses fail",
  "you're leaving money on the table",
  "don't miss out",
  "act now",
  "limited time",
  
  // Patronising
  "the real problem is",
  "what you don't realise",
  "you might not know",
  "the truth is",
  
  // Generic/corporate
  "leverage",
  "synergy",
  "optimise your workflow",
  "streamline your processes",
  "unlock your potential",
  "take your business to the next level",
  
  // Sales pressure
  "buy now",
  "don't wait",
  "you can't afford not to",
  "this is a no-brainer",
  
  // Added from original spec
  "pain points",
  "game-changer",
  "game changer",
  "disrupt",
  "hustle",
  "grind",
  "boss babe",
  "girlboss",
  "crushing it",
  "killing it",
  "scale to the moon",
  "passive income",
  "six figures",
  "seven figures",
];

const REQUIRED_TONE_MARKERS = [
  // Permission-giving
  /you (could|can|might)/i,
  /when you're ready/i,
  /both paths work/i,
  /run with it yourself/i,
  /if you want/i,
  /when you're ready/i,
];

export function validateBrandVoice(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const reportText = JSON.stringify(report.sections || {}).toLowerCase();
  
  // Check for banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (reportText.includes(phrase.toLowerCase())) {
      warnings.push(`Banned phrase found: "${phrase}"`);
    }
  }
  
  // Check for required tone markers (at least 2)
  let toneMarkerCount = 0;
  for (const pattern of REQUIRED_TONE_MARKERS) {
    if (pattern.test(reportText)) {
      toneMarkerCount++;
    }
  }
  
  if (toneMarkerCount < 2) {
    warnings.push("Missing permission-giving language (expected at least 2 markers)");
  }
  
  // Check opening uses their name (first name is sufficient)
  const headline = report.sections?.opening?.headline || '';
  const recipientName = report.recipient?.name || '';
  const firstName = recipientName.split(' ')[0]; // Use first name only
  if (headline && firstName && !headline.toLowerCase().includes(firstName.toLowerCase())) {
    warnings.push("Opening headline doesn't use recipient's name");
  }

  // Check closing is encouraging
  const closingText = (report.sections?.closing?.message || '').toLowerCase();
  const encouragingWords = [
    "ready", "can", "will", "possible", "beginning", "start", "yours", "future",
    "perfect", "right", "good", "great", "enough", "well", "clear", "specific",
    "achievable", "realistic", "solid", "strong"
  ];
  const hasEncouragement = encouragingWords.some(word => closingText.includes(word));
  
  if (!hasEncouragement) {
    warnings.push("Closing message may not be encouraging enough");
  }
  
  // Check for blocked/unlocked framing
  const hasBlockedFraming = /blocked by/i.test(reportText) || /blocking/i.test(reportText);
  const hasUnlockedFraming = /unlocked by/i.test(reportText) || /unlock/i.test(reportText);
  
  if (!hasBlockedFraming && !hasUnlockedFraming) {
    warnings.push("Missing blocked/unlocked framing language");
  }
  
  // Brand voice issues are warnings, not hard failures
  return {
    valid: true,
    errors,
    warnings
  };
}
