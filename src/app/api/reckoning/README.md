# Reckoning Report Generation API

## Endpoint

`POST /api/reckoning`

Generates a personalised Reckoning report using Claude AI based on questionnaire responses.

## Request

### Headers
```
Content-Type: application/json
```

### Body
```typescript
{
  answers: Record<string, string | string[]>;
  persona: 'leaper' | 'scrappy' | 'overwhelmed';
  businessType?: string;
  businessName?: string;
}
```

### Example Request
```json
{
  "persona": "leaper",
  "businessType": "coaching",
  "businessName": "Mindful Growth Coaching",
  "answers": {
    "name": "Sarah",
    "business_description": "Life coaching for career transitions",
    "vision_life": "Work from home, set my own schedule",
    "who_they_help": "Mid-career professionals feeling stuck",
    "why_now": "Been thinking about this for 2 years, ready to make the leap",
    "business_stage": "Pre-launch, have 2 test clients",
    "whats_in_place": ["Website draft", "Basic branding", "Social media accounts"],
    "client_acquisition": "Word of mouth from friends",
    "website_feeling": "Looks amateur, doesn't reflect my expertise",
    "whats_missing": ["Proper booking system", "Payment processing", "Email marketing"],
    "blockers": ["Fear of not being good enough", "Overwhelmed by tech"],
    "timeline": "3 months",
    "time_available": "10-15 hours per week",
    "budget": "£300-500",
    "one_year_vision": "Working full-time in my business, serving 10-15 clients per month"
  }
}
```

## Response

### Success (200)
```typescript
{
  success: true;
  report: ReckoningReport;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid persona. Must be one of: leaper, scrappy, overwhelmed"
}
```

#### 500 Internal Server Error
```json
{
  "error": "API configuration error"
}
```

Or for Claude API errors:
```json
{
  "error": "Claude API error",
  "message": "Rate limit exceeded",
  "status": 429
}
```

## Report Structure

The generated report follows the `ReckoningReport` type structure defined in `/src/types/index.ts`:

```typescript
{
  meta: {
    persona: PersonaType;
    name: string;
    businessType: string;
    generatedDate: string; // ISO date
  };
  opening: {
    headline: string;
    reflection: string;
  };
  snapshot: {
    // Varies by persona
    whereYouAre?: string;
    whatYouveBuilt?: string;
    whatsWorking: string[];
    whatsMissing?: string[];
    whatsCostingYou?: string[];
  };
  diagnosis: {
    // Varies by persona
    coreInsight?: string;
    pattern?: string;
    blockersReframed?: string;
    hiddenAdvantage?: string;
    hiddenCost?: string;
    quickWins?: string[];
  };
  // ... additional sections based on persona
}
```

## Persona-Specific Output

### Leaper (Priya)
For people starting a business. Includes:
- `journeyMap` with 3 phases of actionable steps
- `costOfWaiting` section
- Encouraging, permission-giving tone

### Scrappy (Jordan)
For people already running a business that needs upgrading. Includes:
- `theUpgrade` with priority fixes
- `costOfStatusQuo` section
- Direct, validating tone

### Overwhelmed (Marcus)
For established business owners who are the bottleneck. Includes:
- `theFix` with 3-phase plan
- `toolsAudit` section
- `freedomVision` section
- Honest, respectful tone

## Configuration

### Environment Variables

Required:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from: https://console.anthropic.com/

### Model Configuration

Current settings (in route.ts):
- Model: `claude-sonnet-4-20250514`
- Max tokens: 4096
- Temperature: 1

## Implementation Details

### Prompt Engineering

The API combines three prompt components:

1. **Base System Prompt** (`/src/prompts/base.ts`)
   - Shared guidelines for all personas
   - Output format instructions
   - Quality validation criteria

2. **Persona-Specific Prompt** (`/src/prompts/personas.ts`)
   - Tone and language guidelines
   - Persona context and emotional state
   - Output requirements specific to each persona

3. **User Context**
   - Formatted questionnaire answers
   - Business type and name
   - JSON schema instructions

### Error Handling

The endpoint handles:
- Request validation (missing/invalid fields)
- API configuration errors (missing key)
- Claude API errors (rate limits, network issues)
- JSON parsing errors (malformed responses)

### Response Processing

1. Calls Claude API with constructed prompt
2. Extracts text response
3. Strips markdown code blocks if present
4. Parses JSON
5. Validates and enriches metadata
6. Returns formatted response with usage stats

## Testing

Example using curl:

```bash
curl -X POST http://localhost:3000/api/reckoning \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "leaper",
    "businessType": "coaching",
    "businessName": "Test Business",
    "answers": {
      "name": "Test User",
      "one_thing": "Get my website launched"
    }
  }'
```

## Notes

- Reports are generated in real-time (not cached)
- Token usage is returned for monitoring costs
- The model is instructed to return raw JSON (no markdown)
- Fallback handling strips markdown if present anyway
- Metadata is validated/enriched before returning
