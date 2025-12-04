// Prompt builder v2 — OpenAI-optimised with strict schema enforcement

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

export function buildPromptOpenAI(submission: QuestionnaireSubmission): BuiltPrompt {
  const persona = submission.persona;
  const personaPrompt = personaPrompts[persona];

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

  const systemPrompt = `${baseSystemPrompt}

${personaPrompt}

## Available Services Catalogue

You may ONLY recommend services from this list. Use exact service_id values and price_from values.

${JSON.stringify(relevantServices, null, 2)}

## CRITICAL: Output Schema Requirements

You MUST respond with valid JSON that EXACTLY matches the structure below.
This is not optional — the response will fail validation if the structure differs.

IMPORTANT STRUCTURAL REQUIREMENTS:
- Every section must be an OBJECT with the specified nested properties
- Do NOT return sections as simple strings
- opening MUST have "headline" and "body" as separate properties
- snapshot MUST have "stage", "strengths" array, and "blockers" array
- diagnosis MUST have "primary_blocker" object AND "cost_of_inaction" object
- journey_map MUST have "phases" array where each phase has "name", "timeframe", and "tasks" array
- next_step MUST have "the_one_thing" object, "diy_path" object, AND "supported_path" object
- closing MUST have "message" and "sign_off" properties
- recommendations MUST have "services" array with service_id, service_name, price_from, and why_recommended

EXACT SCHEMA:
${JSON.stringify(REPORT_JSON_SCHEMA, null, 2)}

EXAMPLE of correct structure (abbreviated):
{
  "version": "1.0",
  "meta": { "prompt_version": "2025-12", "model": "advisor-model-v1", "persona": "launcher", "submission_id": "..." },
  "recipient": { "name": "...", "business_type": "...", "industry": null, "business_name": null },
  "input_echo": { "name": "...", "persona": "launcher", "primary_goal": "...", "biggest_blocker": "...", "quoted_phrases": ["...", "..."] },
  "sections": {
    "opening": { "headline": "...", "body": "..." },
    "snapshot": { "stage": "...", "strengths": ["...", "..."], "blockers": [{ "blocker": "...", "why_blocked": "...", "unlock": "..." }] },
    "diagnosis": {
      "primary_blocker": { "title": "...", "explanation": "...", "reframe": "..." },
      "cost_of_inaction": { "narrative": "...", "calculation": { "hours_per_week": 5, "hourly_value": 50, "weeks_per_year": 48, "annual_cost": 12000 } }
    },
    "journey_map": { "phases": [{ "name": "...", "timeframe": "...", "tasks": [{ "task": "...", "why": "...", "diy_or_supported": "diy" }] }] },
    "next_step": {
      "the_one_thing": { "action": "...", "why_this": "...", "first_micro_step": "..." },
      "diy_path": { "description": "...", "time_investment": "...", "resources": ["...", "..."] },
      "supported_path": { "service_id": "...", "service_name": "...", "price_from": 199, "what_you_get": "...", "booking_cta": "..." }
    },
    "closing": { "message": "...", "sign_off": "..." }
  },
  "recommendations": { "services": [{ "service_id": "...", "service_name": "...", "price_from": 199, "why_recommended": "..." }], "package": null },
  "generated_at": "2025-12-04T00:00:00.000Z"
}

Return ONLY the JSON object. No markdown, no explanation, just the JSON.`;

  const userMessage = `## Questionnaire Submission

**Submission ID:** ${submission.id}
**Persona:** ${persona}
**Submitted:** ${submission.created_at}

## Their Answers

${formatAnswers(submission.answers)}

---

Generate their Reckoning report based on these answers.

CHECKLIST — your response MUST include:
[ ] sections.opening.headline (string with their name)
[ ] sections.opening.body (string paragraph)
[ ] sections.snapshot.stage (string)
[ ] sections.snapshot.strengths (array of strings)
[ ] sections.snapshot.blockers (array of objects with blocker/why_blocked/unlock)
[ ] sections.diagnosis.primary_blocker (object with title/explanation/reframe)
[ ] sections.diagnosis.cost_of_inaction (object with narrative and calculation)
[ ] sections.journey_map.phases (array of 3 phase objects)
[ ] sections.next_step.the_one_thing (object with action/why_this/first_micro_step)
[ ] sections.next_step.diy_path (object)
[ ] sections.next_step.supported_path (object with valid service_id from catalogue)
[ ] sections.closing.message (string)
[ ] sections.closing.sign_off (string)
[ ] recommendations.services (array of 2-4 services from catalogue)
[ ] input_echo.quoted_phrases (2-3 exact quotes from their answers)

Use their name "${submission.answers.name || 'the user'}" in the opening headline.
Quote their exact words in quoted_phrases.
Use ONLY services from the catalogue provided.

TONE REQUIREMENT: Use permission-giving language throughout. Include at least 2-3 phrases like:
- "you could...", "you can...", "you might..."
- "when you're ready"
- "both paths work"
- "if you want"
Avoid prescriptive language like "you should", "you must", "you need to".

Return ONLY valid JSON matching the schema exactly.`;

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
