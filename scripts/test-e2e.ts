#!/usr/bin/env npx tsx
/**
 * End-to-End Reckoning Test
 *
 * Runs test personas through the full pipeline:
 * 1. Questionnaire completion (AI simulation)
 * 2. Report generation (real Claude API)
 * 3. Validation scoring (10-layer system)
 * 4. Output report + quality analysis
 *
 * Usage:
 *   npx tsx scripts/test-e2e.ts
 *   npx tsx scripts/test-e2e.ts --persona ella
 *   npx tsx scripts/test-e2e.ts --persona-type launcher --runs 1
 */

import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import {
  ALL_PERSONAS,
  type TestPersona
} from '../src/data/test-personas';
import { PERSONAS, type PersonaQuestion } from '../src/data/persona-questions';
import { buildPrompt } from '../src/lib/prompts/builder';
import { calculateConfidence, getConfidenceSummary } from '../src/lib/validation/confidence';
import { query } from '../src/lib/db';
import type { ReckoningReport, QuestionnaireSubmission } from '../src/types/report';

const anthropic = new Anthropic();
const AI_MODEL = process.env.AI_MODEL || 'claude-sonnet-4-20250514';

interface TestResult {
  persona: TestPersona;
  reckoningId: string;
  token: string;
  questionnaireAnswers: Record<string, string | string[]>;
  report: ReckoningReport | null;
  confidence: {
    score: number;
    autoApprove: boolean;
    flags: string[];
  } | null;
  timings: {
    questionnaire: number;
    generation: number;
    total: number;
  };
  error?: string;
}

// Shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get questions for a persona type (excluding meta questions)
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

// Step 1: Complete questionnaire as persona
async function completeQuestionnaire(
  persona: TestPersona
): Promise<{ answers: Record<string, string | string[]>; timeMs: number }> {
  const startTime = Date.now();
  const questions = getQuestionsForPersona(persona.reckoningPersona);
  const questionsFormatted = questions.map(formatQuestion).join('\n---\n');

  const systemPrompt = `${persona.systemPrompt}

IMPORTANT INSTRUCTIONS:
- Answer each question as this persona would, staying completely in character
- For "single" type questions, respond with ONLY the option value (e.g., "coaching" not "Coaching")
- For "multi" type questions, respond with a JSON array of values (e.g., ["time", "money"])
- For "text" type questions, respond with authentic free-text as the persona would write it
- Be practical and specific, avoid overly emotional or vague answers
- If a question is optional and the persona wouldn't answer, say "SKIP"

Respond in JSON format:
{
  "responses": [
    { "questionId": "question_id", "answer": "value" or ["value1", "value2"] }
  ]
}`;

  const userPrompt = `Complete this questionnaire as ${persona.name}. Be practical and specific.

QUESTIONS:
${questionsFormatted}

Respond with your answers in JSON format.`;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse JSON from response');

  const parsed = JSON.parse(jsonMatch[0]);
  const answers: Record<string, string | string[]> = {};

  for (const resp of parsed.responses) {
    if (resp.answer !== 'SKIP') {
      answers[resp.questionId] = resp.answer;
    }
  }

  // Add contact info
  answers.contact = JSON.stringify({
    name: persona.name,
    email: `${persona.id}@test.reckoning.dev`,
  });

  return { answers, timeMs: Date.now() - startTime };
}

// Step 2: Generate report
async function generateReport(
  reckoningId: string,
  token: string,
  persona: TestPersona,
  answers: Record<string, string | string[]>
): Promise<{ report: ReckoningReport; confidence: ReturnType<typeof calculateConfidence>; timeMs: number }> {
  const startTime = Date.now();

  const submission: QuestionnaireSubmission = {
    id: reckoningId,
    persona: persona.reckoningPersona,
    answers,
    email: `${persona.id}@test.reckoning.dev`,
    created_at: new Date().toISOString(),
  };

  const { systemPrompt, userMessage } = buildPrompt(submission);

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  let jsonText = content.text.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const report = JSON.parse(jsonText) as ReckoningReport;
  const confidence = calculateConfidence(report, submission);

  return { report, confidence, timeMs: Date.now() - startTime };
}

// Step 3: Save to database
async function saveToDatabase(
  reckoningId: string,
  token: string,
  persona: TestPersona,
  answers: Record<string, string | string[]>,
  report: ReckoningReport,
  confidence: ReturnType<typeof calculateConfidence>
): Promise<void> {
  const status = confidence.autoApprove ? 'ready' : 'pending_review';

  await query(`
    INSERT INTO reckonings (
      id, token, persona, email, name, answers, report,
      status, confidence_score, validation_flags,
      generation_attempts, created_at, completed_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      report = $7,
      status = $8,
      confidence_score = $9,
      validation_flags = $10,
      generation_attempts = $11,
      completed_at = NOW()
  `, [
    reckoningId,
    token,
    persona.reckoningPersona,
    `${persona.id}@test.reckoning.dev`,
    persona.name,
    JSON.stringify(answers),
    JSON.stringify(report),
    status,
    confidence.score,
    JSON.stringify(confidence.flags),
    1,
  ]);
}

// Run a single persona through the full pipeline
async function runPersonaE2E(persona: TestPersona): Promise<TestResult> {
  const reckoningId = randomUUID();
  const token = randomUUID().replace(/-/g, '').slice(0, 16);
  const totalStart = Date.now();

  console.log(`\n  📝 Completing questionnaire...`);

  try {
    // Step 1: Complete questionnaire
    const { answers, timeMs: qTime } = await completeQuestionnaire(persona);
    console.log(`     Done (${Math.round(qTime / 1000)}s) — ${Object.keys(answers).length} answers`);

    // Step 2: Generate report
    console.log(`  🧠 Generating report...`);
    const { report, confidence, timeMs: gTime } = await generateReport(
      reckoningId, token, persona, answers
    );
    console.log(`     Done (${Math.round(gTime / 1000)}s) — Confidence: ${confidence.score}%`);

    // Step 3: Save to database
    console.log(`  💾 Saving to database...`);
    await saveToDatabase(reckoningId, token, persona, answers, report, confidence);
    console.log(`     Saved — Token: ${token}`);

    return {
      persona,
      reckoningId,
      token,
      questionnaireAnswers: answers,
      report,
      confidence: {
        score: confidence.score,
        autoApprove: confidence.autoApprove,
        flags: confidence.flags,
      },
      timings: {
        questionnaire: qTime,
        generation: gTime,
        total: Date.now() - totalStart,
      },
    };

  } catch (error) {
    return {
      persona,
      reckoningId,
      token,
      questionnaireAnswers: {},
      report: null,
      confidence: null,
      timings: {
        questionnaire: 0,
        generation: 0,
        total: Date.now() - totalStart,
      },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Format a single result for display
function formatResult(result: TestResult): string {
  const lines: string[] = [];

  lines.push(`\n${'═'.repeat(70)}`);
  lines.push(`${result.persona.name} (${result.persona.reckoningPersona}) — ${result.persona.businessType}`);
  lines.push(`${'═'.repeat(70)}`);

  if (result.error) {
    lines.push(`\n❌ ERROR: ${result.error}`);
    return lines.join('\n');
  }

  // Confidence
  const conf = result.confidence!;
  const emoji = conf.autoApprove ? '✅' : conf.score >= 70 ? '⚠️' : '❌';
  lines.push(`\n${emoji} Confidence: ${conf.score}% ${conf.autoApprove ? '(Auto-approved)' : '(Needs review)'}`);

  if (conf.flags.length > 0) {
    lines.push(`\nFlags (${conf.flags.length}):`);
    conf.flags.slice(0, 5).forEach(f => lines.push(`  • ${f}`));
    if (conf.flags.length > 5) lines.push(`  ... and ${conf.flags.length - 5} more`);
  }

  // Report summary
  const report = result.report!;
  lines.push(`\n📊 Report Summary:`);
  lines.push(`  Headline: "${report.sections?.headline?.text?.slice(0, 60)}..."`);
  lines.push(`  Sections: ${Object.keys(report.sections || {}).length}`);

  if (report.recommendations?.bundles) {
    lines.push(`  Bundles: ${report.recommendations.bundles.length}`);
    report.recommendations.bundles.forEach(b => {
      lines.push(`    • ${b.name}: £${b.total_price}`);
    });
  }

  if (report.action_items?.diy_actions) {
    lines.push(`  DIY Actions: ${report.action_items.diy_actions.length}`);
  }

  // Timings
  lines.push(`\n⏱️  Timings:`);
  lines.push(`  Questionnaire: ${Math.round(result.timings.questionnaire / 1000)}s`);
  lines.push(`  Generation: ${Math.round(result.timings.generation / 1000)}s`);
  lines.push(`  Total: ${Math.round(result.timings.total / 1000)}s`);

  // Link
  lines.push(`\n🔗 View: http://localhost:3000/reckoning/${result.token}`);

  return lines.join('\n');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let personaFilter: string | null = null;
  let personaTypeFilter: 'launcher' | 'builder' | 'architect' | null = null;
  let runsPerPersona = 1;

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

  // Select personas
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
    // Default: one of each type
    personasToTest = [
      ALL_PERSONAS.find(p => p.reckoningPersona === 'launcher')!,
      ALL_PERSONAS.find(p => p.reckoningPersona === 'builder')!,
      ALL_PERSONAS.find(p => p.reckoningPersona === 'architect')!,
    ];
  }

  personasToTest = shuffle(personasToTest);

  console.log(`\n🧪 END-TO-END RECKONING TEST`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`Personas: ${personasToTest.length}`);
  console.log(`Runs per persona: ${runsPerPersona}`);
  console.log(`Total iterations: ${personasToTest.length * runsPerPersona}`);
  console.log(`Model: ${AI_MODEL}`);
  console.log(`${'─'.repeat(50)}`);

  const allResults: TestResult[] = [];
  let completed = 0;
  const total = personasToTest.length * runsPerPersona;

  for (const persona of personasToTest) {
    for (let run = 1; run <= runsPerPersona; run++) {
      completed++;
      console.log(`\n[${completed}/${total}] ${persona.name} (${persona.reckoningPersona})${runsPerPersona > 1 ? ` — Run ${run}` : ''}`);

      const result = await runPersonaE2E(persona);
      allResults.push(result);
      console.log(formatResult(result));
    }
  }

  // Summary
  console.log(`\n\n${'═'.repeat(70)}`);
  console.log(`SUMMARY`);
  console.log(`${'═'.repeat(70)}`);

  const successful = allResults.filter(r => !r.error);
  const failed = allResults.filter(r => r.error);
  const autoApproved = successful.filter(r => r.confidence?.autoApprove);
  const needsReview = successful.filter(r => !r.confidence?.autoApprove);

  console.log(`\n✅ Successful: ${successful.length}/${allResults.length}`);
  console.log(`❌ Failed: ${failed.length}/${allResults.length}`);
  console.log(`\n🎯 Auto-approved: ${autoApproved.length}`);
  console.log(`👀 Needs review: ${needsReview.length}`);

  if (successful.length > 0) {
    const avgConfidence = successful.reduce((a, r) => a + (r.confidence?.score || 0), 0) / successful.length;
    console.log(`\n📊 Average confidence: ${Math.round(avgConfidence)}%`);

    // Confidence by persona type
    const byType: Record<string, number[]> = {};
    successful.forEach(r => {
      const type = r.persona.reckoningPersona;
      if (!byType[type]) byType[type] = [];
      byType[type].push(r.confidence?.score || 0);
    });

    console.log(`\nBy persona type:`);
    Object.entries(byType).forEach(([type, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      console.log(`  ${type}: ${Math.round(avg)}% avg`);
    });
  }

  // Common flags
  const allFlags = successful.flatMap(r => r.confidence?.flags || []);
  const flagCounts: Record<string, number> = {};
  allFlags.forEach(f => {
    const key = f.slice(0, 50);
    flagCounts[key] = (flagCounts[key] || 0) + 1;
  });

  const topFlags = Object.entries(flagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topFlags.length > 0) {
    console.log(`\n🚩 Most common flags:`);
    topFlags.forEach(([flag, count]) => {
      console.log(`  ${count}x ${flag}`);
    });
  }

  // Links
  console.log(`\n🔗 View reports:`);
  successful.slice(0, 5).forEach(r => {
    console.log(`  ${r.persona.name}: http://localhost:3000/reckoning/${r.token}`);
  });

  // Save results
  const outputPath = `./test-results/e2e-test-${Date.now()}.json`;
  const fs = await import('fs');
  const path = await import('path');

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    model: AI_MODEL,
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
      autoApproved: autoApproved.length,
      needsReview: needsReview.length,
      avgConfidence: successful.length > 0
        ? Math.round(successful.reduce((a, r) => a + (r.confidence?.score || 0), 0) / successful.length)
        : 0,
    },
    results: allResults.map(r => ({
      personaId: r.persona.id,
      personaName: r.persona.name,
      personaType: r.persona.reckoningPersona,
      businessType: r.persona.businessType,
      reckoningId: r.reckoningId,
      token: r.token,
      confidence: r.confidence,
      timings: r.timings,
      error: r.error,
      questionnaireAnswers: r.questionnaireAnswers,
      reportSections: r.report ? Object.keys(r.report.sections || {}) : null,
      bundles: r.report?.recommendations?.bundles?.map(b => ({
        name: b.name,
        price: b.total_price,
        services: b.services?.length || 0,
      })),
      diyActionsCount: r.report?.action_items?.diy_actions?.length || 0,
    })),
  }, null, 2));

  console.log(`\n📁 Results saved to: ${outputPath}`);
}

main().catch(console.error);
