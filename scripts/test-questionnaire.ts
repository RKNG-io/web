#!/usr/bin/env npx tsx
/**
 * Questionnaire Test Script
 *
 * Runs test personas through the questionnaire using Claude to simulate responses.
 * Each persona is run 3 times to test response variability.
 *
 * Usage:
 *   npx tsx scripts/test-questionnaire.ts
 *   npx tsx scripts/test-questionnaire.ts --persona ella --runs 1
 *   npx tsx scripts/test-questionnaire.ts --persona-type launcher --runs 2
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  ALL_PERSONAS,
  LAUNCHER_PERSONAS,
  BUILDER_PERSONAS,
  ARCHITECT_PERSONAS,
  type TestPersona
} from '../src/data/test-personas';
import { PERSONAS, type PersonaQuestion } from '../src/data/persona-questions';

const anthropic = new Anthropic();

interface QuestionnaireResponse {
  questionId: string;
  questionText: string;
  answer: string | string[];
  reasoning?: string;
}

interface TestResult {
  persona: TestPersona;
  runNumber: number;
  responses: QuestionnaireResponse[];
  completionTime: number;
  errors: string[];
}

// Shuffle array for randomisation
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get questions for a persona type
function getQuestionsForPersona(personaType: 'launcher' | 'builder' | 'architect'): PersonaQuestion[] {
  return PERSONAS[personaType].questions.filter(q =>
    q.type !== 'welcome' && q.type !== 'contact' && q.type !== 'presence'
  );
}

// Format question for the AI
function formatQuestion(q: PersonaQuestion): string {
  let formatted = `Question ID: ${q.id}\n`;
  formatted += `Question: ${q.question}\n`;
  if (q.subtext) formatted += `Context: ${q.subtext}\n`;
  formatted += `Type: ${q.type}\n`;

  if (q.options) {
    formatted += `Options:\n`;
    q.options.forEach(opt => {
      formatted += `  - "${opt.value}": ${opt.label}`;
      if (opt.description) formatted += ` (${opt.description})`;
      formatted += '\n';
    });
  }

  if (q.optional) formatted += `(This question is optional)\n`;

  return formatted;
}

// Run a single persona through the questionnaire
async function runPersonaQuestionnaire(
  persona: TestPersona,
  runNumber: number
): Promise<TestResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const responses: QuestionnaireResponse[] = [];

  const questions = getQuestionsForPersona(persona.reckoningPersona);

  // Build the full prompt with all questions
  const questionsFormatted = questions.map(formatQuestion).join('\n---\n');

  const systemPrompt = `${persona.systemPrompt}

IMPORTANT INSTRUCTIONS:
- Answer each question as this persona would, staying completely in character
- For "single" type questions, respond with ONLY the option value (e.g., "coaching" not "Coaching")
- For "multi" type questions, respond with a JSON array of values (e.g., ["time", "money"])
- For "text" type questions, respond with authentic free-text as the persona would write it
- Add natural variation - don't give identical answers every time
- Include occasional typos or informal language where appropriate for the persona
- If a question is optional and the persona wouldn't answer, say "SKIP"

Respond in JSON format with this structure:
{
  "responses": [
    {
      "questionId": "question_id",
      "answer": "value" or ["value1", "value2"],
      "reasoning": "Brief note on why this persona would answer this way"
    }
  ]
}`;

  const userPrompt = `Complete this questionnaire as ${persona.name}. Remember to stay in character and answer authentically.

QUESTIONS:
${questionsFormatted}

Respond with your answers in JSON format.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: userPrompt }
      ],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      errors.push('Unexpected response type');
      return { persona, runNumber, responses, completionTime: Date.now() - startTime, errors };
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      errors.push('Could not parse JSON from response');
      console.error('Raw response:', content.text);
      return { persona, runNumber, responses, completionTime: Date.now() - startTime, errors };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    for (const resp of parsed.responses) {
      const question = questions.find(q => q.id === resp.questionId);
      responses.push({
        questionId: resp.questionId,
        questionText: question?.question || 'Unknown question',
        answer: resp.answer,
        reasoning: resp.reasoning
      });
    }

  } catch (error) {
    errors.push(`API Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    persona,
    runNumber,
    responses,
    completionTime: Date.now() - startTime,
    errors
  };
}

// Format results for console output
function formatResult(result: TestResult): string {
  const lines: string[] = [];

  lines.push(`\n${'='.repeat(60)}`);
  lines.push(`PERSONA: ${result.persona.name} (${result.persona.reckoningPersona})`);
  lines.push(`Run #${result.runNumber} | Time: ${result.completionTime}ms`);
  lines.push(`${'='.repeat(60)}`);

  if (result.errors.length > 0) {
    lines.push(`\n⚠️  ERRORS:`);
    result.errors.forEach(e => lines.push(`   - ${e}`));
  }

  lines.push(`\nRESPONSES (${result.responses.length} questions answered):`);

  for (const resp of result.responses) {
    const answerStr = Array.isArray(resp.answer)
      ? resp.answer.join(', ')
      : resp.answer;

    lines.push(`\n  📝 ${resp.questionId}`);
    lines.push(`     Q: ${resp.questionText?.slice(0, 60)}${(resp.questionText?.length || 0) > 60 ? '...' : ''}`);
    lines.push(`     A: ${answerStr.slice(0, 100)}${answerStr.length > 100 ? '...' : ''}`);
    if (resp.reasoning) {
      lines.push(`     💭 ${resp.reasoning.slice(0, 80)}${resp.reasoning.length > 80 ? '...' : ''}`);
    }
  }

  return lines.join('\n');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let personaFilter: string | null = null;
  let personaTypeFilter: 'launcher' | 'builder' | 'architect' | null = null;
  let runsPerPersona = 3;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--persona' && args[i + 1]) {
      personaFilter = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--persona-type' && args[i + 1]) {
      personaTypeFilter = args[i + 1].toLowerCase() as 'launcher' | 'builder' | 'architect';
      i++;
    } else if (args[i] === '--runs' && args[i + 1]) {
      runsPerPersona = parseInt(args[i + 1], 10);
      i++;
    }
  }

  // Select personas to test
  let personasToTest: TestPersona[];

  if (personaFilter) {
    const found = ALL_PERSONAS.find(p => p.id === personaFilter || p.name.toLowerCase() === personaFilter);
    if (!found) {
      console.error(`Persona "${personaFilter}" not found. Available: ${ALL_PERSONAS.map(p => p.id).join(', ')}`);
      process.exit(1);
    }
    personasToTest = [found];
  } else if (personaTypeFilter) {
    personasToTest = ALL_PERSONAS.filter(p => p.reckoningPersona === personaTypeFilter);
  } else {
    personasToTest = ALL_PERSONAS;
  }

  // Randomise order
  personasToTest = shuffle(personasToTest);

  console.log(`\n🧪 QUESTIONNAIRE TEST`);
  console.log(`${'─'.repeat(40)}`);
  console.log(`Personas: ${personasToTest.length}`);
  console.log(`Runs per persona: ${runsPerPersona}`);
  console.log(`Total iterations: ${personasToTest.length * runsPerPersona}`);
  console.log(`${'─'.repeat(40)}\n`);

  const allResults: TestResult[] = [];
  let completed = 0;
  const total = personasToTest.length * runsPerPersona;

  for (const persona of personasToTest) {
    for (let run = 1; run <= runsPerPersona; run++) {
      completed++;
      console.log(`\n[${completed}/${total}] Running ${persona.name} (${persona.reckoningPersona}) - Run ${run}...`);

      const result = await runPersonaQuestionnaire(persona, run);
      allResults.push(result);

      console.log(formatResult(result));

      // Small delay to avoid rate limiting
      if (completed < total) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Summary
  console.log(`\n\n${'═'.repeat(60)}`);
  console.log(`SUMMARY`);
  console.log(`${'═'.repeat(60)}`);

  const successful = allResults.filter(r => r.errors.length === 0);
  const failed = allResults.filter(r => r.errors.length > 0);

  console.log(`\n✅ Successful: ${successful.length}/${allResults.length}`);
  console.log(`❌ Failed: ${failed.length}/${allResults.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed runs:`);
    failed.forEach(r => {
      console.log(`  - ${r.persona.name} Run ${r.runNumber}: ${r.errors.join(', ')}`);
    });
  }

  // Average completion time by persona type
  const byType: Record<string, number[]> = {};
  successful.forEach(r => {
    const type = r.persona.reckoningPersona;
    if (!byType[type]) byType[type] = [];
    byType[type].push(r.completionTime);
  });

  console.log(`\nAverage completion time by persona type:`);
  Object.entries(byType).forEach(([type, times]) => {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`  ${type}: ${Math.round(avg)}ms`);
  });

  // Save results to file
  const outputPath = `./test-results/questionnaire-test-${Date.now()}.json`;
  const fs = await import('fs');
  const path = await import('path');

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    config: {
      personaFilter,
      personaTypeFilter,
      runsPerPersona,
      totalPersonas: personasToTest.length,
      totalRuns: allResults.length
    },
    summary: {
      successful: successful.length,
      failed: failed.length,
      avgCompletionTimeMs: successful.reduce((a, r) => a + r.completionTime, 0) / successful.length
    },
    results: allResults.map(r => ({
      personaId: r.persona.id,
      personaName: r.persona.name,
      personaType: r.persona.reckoningPersona,
      runNumber: r.runNumber,
      completionTimeMs: r.completionTime,
      responseCount: r.responses.length,
      errors: r.errors,
      responses: r.responses
    }))
  }, null, 2));

  console.log(`\n📁 Results saved to: ${outputPath}`);
}

main().catch(console.error);
