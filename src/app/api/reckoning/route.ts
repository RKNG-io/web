import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { PersonaType, ReckoningReport } from '@/types';
import { BASE_SYSTEM_PROMPT, OUTPUT_SCHEMA_INSTRUCTIONS } from '@/prompts/base';
import { getPersonaPrompt } from '@/prompts/personas';

// Validation schemas
const VALID_PERSONAS: PersonaType[] = ['launcher', 'builder', 'architect'];

interface ReckoningRequestBody {
  answers: Record<string, string | string[]>;
  persona: PersonaType;
  businessType?: string;
  businessName?: string;
}

/**
 * Format questionnaire answers as context for the AI
 */
function formatAnswersContext(answers: Record<string, string | string[]>): string {
  const lines: string[] = ['# Questionnaire Responses\n'];

  for (const [key, value] of Object.entries(answers)) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (Array.isArray(value)) {
      lines.push(`**${label}:**`);
      value.forEach(item => lines.push(`- ${item}`));
      lines.push('');
    } else {
      lines.push(`**${label}:** ${value}\n`);
    }
  }

  return lines.join('\n');
}

/**
 * Validate request body
 */
function validateRequestBody(body: unknown): { valid: true; data: ReckoningRequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const data = body as Partial<ReckoningRequestBody>;

  if (!data.answers || typeof data.answers !== 'object') {
    return { valid: false, error: 'Missing or invalid "answers" field' };
  }

  if (!data.persona || !VALID_PERSONAS.includes(data.persona)) {
    return { valid: false, error: `Invalid persona. Must be one of: ${VALID_PERSONAS.join(', ')}` };
  }

  return { valid: true, data: data as ReckoningRequestBody };
}

/**
 * POST /api/reckoning
 * Generate a personalised Reckoning report using Claude
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequestBody(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { answers, persona, businessType, businessName } = validation.data;

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    });

    // Build the prompt
    const systemPrompt = BASE_SYSTEM_PROMPT;
    const personaPrompt = getPersonaPrompt(persona);
    const answersContext = formatAnswersContext(answers);

    const userPrompt = `${personaPrompt}

${answersContext}

${businessType ? `\n**Business Type:** ${businessType}` : ''}
${businessName ? `**Business Name:** ${businessName}` : ''}

${OUTPUT_SCHEMA_INSTRUCTIONS}

Generate a comprehensive Reckoning report based on the questionnaire responses above. Return ONLY valid JSON matching the ReckoningReport structure. Do not include any markdown formatting or code blocks — just raw JSON.`;

    console.log('Generating report for persona:', persona);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract response content
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    // Parse the JSON response
    let report: ReckoningReport;
    try {
      // Remove potential markdown code blocks if present
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      report = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      console.error('Raw response:', content.text);
      return NextResponse.json(
        {
          error: 'Failed to parse report data',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Add metadata if missing
    if (!report.meta) {
      report.meta = {
        persona,
        name: businessName || 'Unknown',
        businessType: businessType || 'Unknown',
        generatedDate: new Date().toISOString(),
      };
    } else {
      // Ensure metadata is complete
      report.meta.persona = persona;
      report.meta.generatedDate = report.meta.generatedDate || new Date().toISOString();
      if (businessName) report.meta.name = businessName;
      if (businessType) report.meta.businessType = businessType;
    }

    // Return the generated report
    return NextResponse.json({
      success: true,
      report,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });

  } catch (error) {
    console.error('Error generating Reckoning report:', error);

    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: 'Claude API error',
          message: error.message,
          status: error.status,
        },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/reckoning
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Allow': 'POST, OPTIONS',
      },
    }
  );
}
