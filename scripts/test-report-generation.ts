#!/usr/bin/env npx ts-node

/**
 * Test report generation locally
 * Run with: npx ts-node scripts/test-report-generation.ts
 */

import Anthropic from '@anthropic-ai/sdk';
import { launcherPrompt, LAUNCHER_USER_PROMPT_TEMPLATE } from '../src/lib/prompts/personas/launcher';
import { REPORT_OUTPUT_SCHEMA } from '../src/lib/prompts/schema';
import { validateBrandVoice } from '../src/lib/validation/brand-voice';

const testAnswers = {
  business_idea: 'I want to start a copywriting business for tech startups',
  current_stage: 'idea',
  biggest_block: "I don't know what to charge or how to find clients",
  time_available: '10-20 hours',
  budget_range: 'under-500',
  name: 'Sarah',
  email: 'sarah@test.com',
};

async function testGeneration() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY environment variable');
    process.exit(1);
  }

  const client = new Anthropic();

  console.log('Testing report generation for Launcher persona...\n');

  const userPrompt = LAUNCHER_USER_PROMPT_TEMPLATE
    .replace('{{name}}', testAnswers.name)
    .replace('{{answers}}', JSON.stringify(testAnswers, null, 2));

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: launcherPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    console.log('Raw response:');
    console.log('='.repeat(60));
    console.log(content.text);
    console.log('='.repeat(60));

    // Try to parse as JSON
    try {
      const report = JSON.parse(content.text);
      console.log('\nParsed report sections:');
      console.log(`- Greeting: ${report.greeting?.substring(0, 50)}...`);
      console.log(`- Summary: ${report.summary?.substring(0, 50)}...`);
      console.log(`- Sections: ${report.sections?.length || 0}`);
      console.log(`- Blocked by: ${report.blocked_by?.length || 0} items`);
      console.log(`- Unlocked by: ${report.unlocked_by?.length || 0} items`);
      console.log(`- Services: ${report.recommended_services?.length || 0}`);
      console.log(`- Next steps: ${report.next_steps?.length || 0}`);

      // Validate brand voice
      const voiceValidation = validateBrandVoice(report);
      console.log('\nBrand voice validation:');
      console.log(`- Valid: ${voiceValidation.valid}`);
      if (voiceValidation.errors.length > 0) {
        console.log(`- Errors:`);
        voiceValidation.errors.forEach((err) => console.log(`    - ${err}`));
      }
      if (voiceValidation.warnings.length > 0) {
        console.log(`- Warnings:`);
        voiceValidation.warnings.forEach((warn) => console.log(`    - ${warn}`));
      }
    } catch (parseError) {
      console.log('\nFailed to parse as JSON - response may need structured output');
    }

    console.log('\nTokens used:');
    console.log(`- Input: ${response.usage.input_tokens}`);
    console.log(`- Output: ${response.usage.output_tokens}`);

  } catch (error) {
    console.error('Generation failed:', error);
    process.exit(1);
  }
}

testGeneration();
