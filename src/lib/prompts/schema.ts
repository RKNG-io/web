// JSON schema for Claude API structured output

export const REPORT_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    greeting: {
      type: 'string',
      description: 'Personalised greeting using their name',
    },
    summary: {
      type: 'string',
      description: '2-3 sentence summary of their situation',
    },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          type: {
            type: 'string',
            enum: ['blocked', 'unlocked', 'neutral'],
          },
        },
        required: ['title', 'content', 'type'],
      },
      description: 'Main report sections (aim for 4-6)',
    },
    blocked_by: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of things currently blocking them',
    },
    unlocked_by: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of things that would unlock progress',
    },
    recommended_services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          reason: { type: 'string' },
          priority: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
          },
        },
        required: ['id', 'name', 'reason', 'priority'],
      },
      description: 'Services to recommend (max 5)',
    },
    next_steps: {
      type: 'array',
      items: { type: 'string' },
      description: '3-5 concrete next steps they can take',
    },
    closing: {
      type: 'string',
      description: 'Encouraging closing paragraph',
    },
  },
  required: [
    'greeting',
    'summary',
    'sections',
    'blocked_by',
    'unlocked_by',
    'recommended_services',
    'next_steps',
    'closing',
  ],
};

export const SYSTEM_PROMPT_BASE = `You are generating a Reckoning report for someone who has just completed a diagnostic questionnaire.

CRITICAL RULES:
1. Use "blocked by" and "unlocked by" framing - NEVER say "problems" or "solutions"
2. Present DIY and supported paths as equally valid
3. Be direct, warm, and practical - not salesy or patronising
4. Echo back their specific words and situations
5. Only recommend services that genuinely fit their needs
6. All calculations must be accurate and grounded

BANNED PHRASES (never use):
- "pain points"
- "game-changer"
- "synergy"
- "leverage"
- "hustle"
- "crushing it"
- "six figures"

VOICE:
- Speak like a smart friend who's been there
- No corporate jargon
- British English (UK spelling)
- Contractions are fine
- Be specific, not generic`;
