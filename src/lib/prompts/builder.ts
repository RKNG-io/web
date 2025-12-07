// Prompt builder  - construct prompts from persona + answers

import { baseSystemPrompt } from './base';
import { REPORT_JSON_SCHEMA } from '../validation/schema';
import { launcherPrompt } from './personas/launcher';
import { builderPersonaPrompt } from './personas/builder';
import { architectPrompt } from './personas/architect';
import { services } from '@/data/services-adapter';
import type { QuestionnaireSubmission } from '@/types/report';

const personaPrompts = {
  launcher: launcherPrompt,
  builder: builderPersonaPrompt,
  architect: architectPrompt,
};

export interface BuiltPrompt {
  systemPrompt: string;
  userMessage: string;
}

export function buildPrompt(submission: QuestionnaireSubmission): BuiltPrompt {
  const persona = submission.persona;
  const personaPrompt = personaPrompts[persona];

  // Extract name from contact field or direct name field
  const userName = extractUserName(submission.answers);

  // Get active services for this persona
  const relevantServices = services
    .filter(s => s.status === 'active')
    .filter(s => !s.personas || s.personas.includes(persona))
    .map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price_from: s.price,
      category: s.category,
    }));
  
  const systemPrompt = `
${baseSystemPrompt}

${personaPrompt}

## Available Services Catalogue

You may ONLY recommend services from this list. Use exact service_id and price_from values.

${JSON.stringify(relevantServices, null, 2)}

## Output Schema

You MUST respond with valid JSON matching this schema exactly:

${JSON.stringify(REPORT_JSON_SCHEMA, null, 2)}

Do not include any text outside the JSON object.
Do not wrap the JSON in markdown code blocks.
Return ONLY the JSON object.
`;

  const userMessage = `
## Questionnaire Submission

**Submission ID:** ${submission.id}
**Persona:** ${persona}
**Submitted:** ${submission.created_at}

## Their Answers

${formatAnswers(submission.answers)}

---

Generate their Reckoning report based on these answers. Remember to:

1. Use their name (${userName || 'the user'}) in the opening headline
2. Quote their exact words at least 2-3 times in quoted_phrases
3. Match recommendations to their specific blockers
4. Keep all calculations accurate
5. Maintain warm, permission-giving tone throughout
6. Never use banned phrases
7. Present both DIY and supported paths as equally valid
8. Use only services from the catalogue provided

Return ONLY valid JSON matching the schema.
`;

  return { systemPrompt, userMessage };
}

function formatAnswers(answers: Record<string, unknown>): string {
  return Object.entries(answers)
    .map(([key, value]) => {
      const formattedKey = formatKey(key);
      if (Array.isArray(value)) {
        return `**${formattedKey}:**\n${value.map(v => `- ${v}`).join('\n')}`;
      }
      if (typeof value === 'object' && value !== null) {
        return `**${formattedKey}:**\n${JSON.stringify(value, null, 2)}`;
      }
      return `**${formattedKey}:** ${value}`;
    })
    .join('\n\n');
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extract user name from answers  - handles both direct name field
 * and the new contact JSON field format
 */
export function extractUserName(answers: Record<string, unknown>): string {
  // Try direct name field first
  if (typeof answers.name === 'string' && answers.name.trim()) {
    return answers.name.trim();
  }

  // Try contact field (JSON string with name and email)
  const contactField = answers.contact;
  if (typeof contactField === 'string') {
    try {
      const parsed = JSON.parse(contactField);
      if (parsed.name && typeof parsed.name === 'string') {
        return parsed.name.trim();
      }
    } catch {
      // Not valid JSON, ignore
    }
  }

  return '';
}
