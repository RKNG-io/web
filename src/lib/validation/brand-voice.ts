// Brand voice validation - check for banned phrases, AI patterns, and tone

import type { ReckoningReport, ValidationResult } from '@/types/report';

// ===========================================================================
// HUMANISER FILTER - AI Pattern Detection
// ===========================================================================
// Use this list to catch AI-generated copy before it ships.
// Run all marketing copy, service descriptions, and generated reports through this.

const AI_PATTERNS = {
  // Triple constructions (peak AI)
  tripleConstructions: [
    /\b\w+\.\s+\w+\.\s+\w+\./i,  // "Unblock. Unlock. Unleash."
  ],

  // "From X to Y" openings
  fromXtoY: [
    /^from \w+ to \w+/i,
    /from idea to/i,
    /from chaos to/i,
    /from overwhelm to/i,
  ],

  // "Not just X, but Y" constructions
  notJustButAlso: [
    /not just .+, but/i,
    /not only .+, but/i,
  ],

  // "Whether you're X or Y" hedging
  whetherYoure: [
    /whether you're .+ or/i,
    /whether you .+ or/i,
  ],

  // Generic benefit formulas
  genericBenefits: [
    /everything you need/i,
    /all you need/i,
    /built to grow with you/i,
    /ready to grow/i,
    /designed to help you/i,
    /helps you achieve/i,
    /takes you from/i,
    /on your journey/i,
  ],
};

const BANNED_PHRASES = [
  // === AI BUZZWORDS (high priority) ===
  "leverage",
  "unlock",
  "unlock your potential",
  "unleash",
  "empower",
  "elevate",
  "streamline",
  "seamless",
  "robust",
  "cutting-edge",
  "game-changer",
  "game changer",
  "next level",
  "take your business to the next level",
  "transform your",
  "revolutionise",
  "revolutionize",

  // === AI FILLER PHRASES ===
  "in today's fast-paced world",
  "in today's digital age",
  "in this day and age",
  "at the end of the day",
  "it goes without saying",
  "needless to say",
  "cutting through the noise",
  "cuts through the noise",

  // === VAGUE BENEFIT LANGUAGE ===
  "tailored to your needs",
  "tailored to your business",
  "tailored to where you are",
  "customised solution",
  "bespoke solution",
  "holistic approach",
  "comprehensive solution",
  "end-to-end",
  "turnkey solution",
  "one-stop shop",

  // === MARKETING FLUFF ===
  "nurture",
  "curate",
  "curated",
  "optimise your workflow",
  "streamline your processes",
  "maximise your potential",
  "synergy",
  "synergise",
  "deep dive",
  "move the needle",
  "low-hanging fruit",
  "best-in-class",
  "world-class",
  "industry-leading",

  // === PRESCRIPTIVE LANGUAGE ===
  "you should",
  "you need to",
  "you must",
  "you have to",
  "what you need to understand",

  // === FEAR-BASED ===
  "most businesses fail",
  "you're leaving money on the table",
  "don't miss out",
  "act now",
  "limited time",
  "before it's too late",

  // === PATRONISING ===
  "the real problem is",
  "what you don't realise",
  "you might not know",
  "the truth is",
  "let me be clear",
  "to be honest",
  "honestly",

  // === SALES PRESSURE ===
  "buy now",
  "don't wait",
  "you can't afford not to",
  "this is a no-brainer",
  "invest in yourself",
  "bet on yourself",

  // === HUSTLE CULTURE ===
  "pain points",
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
  "10x",
  "level up",

  // === JOURNEY/TRANSFORMATION CLICHES ===
  "your journey",
  "transformation journey",
  "embark on",
  "begin your journey",
  "next chapter",
  "new chapter",
  "thrive",
  "flourish",
];

// Characters and patterns to flag
const STYLE_ISSUES = {
  // Em-dashes should be en-dashes with spaces or simple hyphens
  emDash: /\u2014/g,  // — character
  doubleHyphenEmDash: /--/g,  // -- used as em-dash

  // Excessive exclamation marks
  multipleExclamations: /!{2,}/g,

  // ALL CAPS for emphasis (use bold or italics instead)
  allCapsWords: /\b[A-Z]{4,}\b/g,

  // Ellipsis overuse
  multipleEllipsis: /\.{4,}/g,
};

const REQUIRED_TONE_MARKERS = [
  // Permission-giving language
  /you (could|can|might)/i,
  /when you're ready/i,
  /both paths work/i,
  /run with it yourself/i,
  /if you want/i,
  /it's up to you/i,
  /your call/i,
  /take your time/i,
];

// ===========================================================================
// HUMANISER PROMPT
// ===========================================================================
// Use this prompt when reviewing or generating copy

export const HUMANISER_PROMPT = `
# Humaniser Filter - Reckoning Brand Voice

## Core Principle
Write like a knowledgeable friend who's been there, not a marketing department.

## Voice Characteristics
- **Clear over clever** - Say what you mean directly
- **Warm, not soft** - Be supportive but don't coddle
- **Grounded optimism** - Hopeful but realistic
- **Specific over generic** - Use concrete details, not vague benefits

## Hard Rules

### NEVER use:
- Em-dashes (use "- " or rephrase)
- "Unlock", "unleash", "empower", "elevate", "leverage"
- "Streamline", "seamless", "robust", "cutting-edge"
- "Transform your", "revolutionise", "game-changer"
- "Journey", "embark", "thrive", "flourish"
- "Tailored to", "customised solution", "bespoke"
- "In today's fast-paced world" or any "in today's X" opener
- "Cuts through the noise"
- "Everything you need"
- "Built to grow with you"
- Triple-word constructions ("Unblock. Unlock. Unleash.")
- "Whether you're X or Y" hedging
- "Not just X, but Y" constructions

### ALWAYS:
- Use specific, concrete language
- Write like you're talking to one person
- Include real details (numbers, timeframes, outcomes)
- Use active voice
- Keep sentences short and punchy
- Use en-dashes with spaces ( - ) if you need a break, or rephrase

## Before/After Examples

| AI Copy | Human Copy |
|---------|------------|
| "Everything you need to launch" | "Website, payments, booking. Launch properly." |
| "Built to grow with you" | "Add pages when you need them" |
| "Tailored to your business" | "Built for how you actually work" |
| "Nurture new subscribers" | "Turn subscribers into clients" |
| "Cuts through the noise" | "Shows you what's actually broken" |
| "Consistent visibility without the daily scramble" | "Show up without scrambling" |
| "Unlock your potential" | "Get unstuck" |
| "Transform your business" | "Fix what's broken" |
| "Embark on your journey" | "Get started" |
| "Comprehensive solution" | "Everything handled" |

## Test Your Copy
Ask yourself:
1. Would I actually say this to a friend?
2. Can I picture a specific person, not "businesses"?
3. Is there a concrete detail, or just vibes?
4. Does it sound like a LinkedIn post? (If yes, rewrite)
5. Could this describe any business? (If yes, make it specific)
`;

// ===========================================================================
// VALIDATION FUNCTIONS
// ===========================================================================

export function validateBrandVoice(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const reportText = JSON.stringify(report.sections || {}).toLowerCase();
  const reportTextRaw = JSON.stringify(report.sections || {});

  // Check for banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (reportText.includes(phrase.toLowerCase())) {
      warnings.push(`Banned phrase: "${phrase}"`);
    }
  }

  // Check for AI patterns
  for (const [patternName, patterns] of Object.entries(AI_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(reportText)) {
        warnings.push(`AI pattern detected (${patternName})`);
        break;
      }
    }
  }

  // Check for style issues
  if (STYLE_ISSUES.emDash.test(reportTextRaw)) {
    warnings.push("Em-dash found - use en-dash with spaces or rephrase");
  }
  if (STYLE_ISSUES.doubleHyphenEmDash.test(reportTextRaw)) {
    warnings.push("Double-hyphen found - use en-dash with spaces or rephrase");
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

  // Check opening uses their name
  const headline = report.sections?.opening?.headline || '';
  const recipientName = report.recipient?.name || '';
  const firstName = recipientName.split(' ')[0];
  if (headline && firstName && !headline.toLowerCase().includes(firstName.toLowerCase())) {
    warnings.push("Opening headline doesn't use recipient's name");
  }

  // Check closing is encouraging
  const closingText = (report.sections?.closing?.message || '').toLowerCase();
  const encouragingWords = [
    "ready", "can", "will", "possible", "beginning", "start", "yours", "future",
    "enough", "clear", "specific", "achievable", "realistic", "solid", "strong"
  ];
  const hasEncouragement = encouragingWords.some(word => closingText.includes(word));

  if (!hasEncouragement) {
    warnings.push("Closing message may not be encouraging enough");
  }

  return {
    valid: true,
    errors,
    warnings
  };
}

// Standalone function to check any text for AI patterns
export function checkForAIPatterns(text: string): string[] {
  const issues: string[] = [];
  const lowerText = text.toLowerCase();

  // Check banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      issues.push(`Banned phrase: "${phrase}"`);
    }
  }

  // Check AI patterns
  for (const [patternName, patterns] of Object.entries(AI_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        issues.push(`AI pattern: ${patternName}`);
        break;
      }
    }
  }

  // Check for em-dashes
  if (/\u2014/.test(text) || /--/.test(text)) {
    issues.push("Em-dash or double-hyphen found");
  }

  return issues;
}

// Export lists for use elsewhere
export { BANNED_PHRASES, AI_PATTERNS, STYLE_ISSUES };
