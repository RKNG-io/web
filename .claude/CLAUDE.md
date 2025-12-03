# Reckoning Web — Project Instructions

## Overview

Next.js 14+ website for **Reckoning** — a business diagnostic platform for solopreneurs. The platform takes users through a persona-based questionnaire and generates personalised AI-powered business reports using Claude.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Fonts**: Outfit (primary sans-serif), Source Serif 4 (editorial/serif)
- **Icons**: Lucide React
- **AI**: Claude API via `@anthropic-ai/sdk`
- **Deployment**: Vercel

## Core Concepts

### Personas

The platform serves three distinct user personas:

| Persona | ID | Description | Target User |
|---------|-----|-------------|-------------|
| **Launcher** | `launcher` | Starting but haven't launched | Pre-launch solopreneurs, side-hustlers ready to go full-time |
| **Builder** | `builder` | Making it work with duct tape | Freelancers with clients but chaotic operations |
| **Architect** | `architect` | Built something real but it's running them | Business owners with staff/revenue who've become the bottleneck |

### User Journey

1. **Landing Page** (`/`) — Hero, persona cards, how it works, packages, testimonials
2. **Questionnaire** (`/questionnaire`) — Persona-specific questions (8-15 questions)
3. **Report Generation** — Claude API generates personalised Reckoning report
4. **Results Page** (`/reckoning/[id]`) — Interactive report with diagnosis, journey map, recommendations

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (composes all sections)
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Tailwind config + CSS variables
│   ├── questionnaire/
│   │   ├── page.tsx                # Questionnaire flow (client component)
│   │   ├── useQuestionnaire.ts     # State management hook
│   │   ├── QuestionCard.tsx        # Question renderer
│   │   └── ProgressBar.tsx         # Progress indicator
│   ├── reckoning/[id]/
│   │   └── page.tsx                # Report results page
│   └── api/reckoning/
│       └── route.ts                # POST endpoint for report generation
│
├── components/
│   ├── index.ts                    # Barrel export
│   │
│   │  # Landing page sections
│   ├── Nav.tsx                     # Navigation bar
│   ├── Hero.tsx                    # Hero section with CTA
│   ├── PersonaCards.tsx            # Three persona selection cards
│   ├── HowItWorks.tsx              # 3-step process explanation
│   ├── Benefits.tsx                # Value propositions
│   ├── BlockedUnlocked.tsx         # Before/after comparison
│   ├── Packages.tsx                # Service packages display
│   ├── ServiceExplorer.tsx         # Service catalogue browser
│   ├── Testimonials.tsx            # Social proof
│   ├── FAQ.tsx                     # Frequently asked questions
│   ├── ReckoningCTA.tsx            # Mid-page CTA
│   ├── FinalCTA.tsx                # Bottom CTA
│   └── Footer.tsx                  # Site footer
│   │
│   ├── ui/                         # Reusable primitives
│   │   ├── index.ts
│   │   ├── Button.tsx              # Primary, secondary, outline, tertiary variants
│   │   ├── Card.tsx                # Card container
│   │   ├── Badge.tsx               # Status badges
│   │   ├── Input.tsx               # Form inputs
│   │   └── SectionHeader.tsx       # Section title component
│   │
│   └── reckoning/                  # Report-specific components
│       ├── index.ts
│       ├── ReportSection.tsx       # Section wrapper
│       ├── DiagnosisCard.tsx       # Issue diagnosis display
│       ├── JourneyPhase.tsx        # Journey map phase
│       └── CostCard.tsx            # Cost of waiting card
│
├── data/
│   ├── services.ts                 # 35+ services with pricing, personas, categories
│   ├── packages.ts                 # Package definitions
│   ├── questions.ts                # Legacy question bank
│   └── persona-questions.ts        # Persona-specific question flows
│
├── lib/
│   ├── pricing.ts                  # Pricing utilities
│   ├── mockReportData.ts           # Test data for reports
│   ├── data/                       # Alternative data location
│   │   ├── packages.ts
│   │   ├── service-catalogue.ts
│   │   └── question-bank.ts
│   ├── pricing/
│   │   └── calculator.ts           # Bundle discount logic
│   ├── prompts/                    # Markdown prompt templates
│   │   ├── base-system-prompt.md
│   │   ├── launcher-template.md
│   │   ├── builder-template.md
│   │   └── architect-template.md
│   └── types/
│       └── index.ts
│
├── prompts/
│   ├── base.ts                     # Base system prompt + output schema
│   └── personas.ts                 # Persona-specific prompt templates
│
└── types/
    ├── index.ts                    # Core type definitions
    └── reckoning.ts                # Report-specific types
```

## Brand System

### Colours (CSS Variables & Tailwind)

```css
/* Primary */
--charcoal: #2d2926    /* Primary dark, text, headers */
--ice: #F2F6F9         /* Page backgrounds, cards */
--fuchsia: #D14BA8     /* CTAs, accents, links */
--mint: #B6E2D3        /* Fresh sections, success */
--blue: #A8C3D1        /* Secondary, borders, calm */

/* Supporting */
--ink: #1a1a1a         /* Deepest black */
--stone: #E5E7E9       /* Borders, dividers */
--fuchsia-dark: #a33a85
--mint-light: #d4efe6
--blue-light: #c5d8e3

/* Semantic */
--success: #2A7F78
--warning: #C3B273
--error: #c45d5d
```

**Usage:** `bg-charcoal`, `text-fuchsia`, `border-stone`, etc.

### Typography

- **Headings**: Outfit, font-weight 600, letter-spacing -0.02em
- **Body**: Outfit, font-weight 400, line-height 1.6
- **Editorial/Accents**: Source Serif 4 (use sparingly)
- **Overline**: Uppercase, 0.75rem, tracking 0.1em, fuchsia colour

### Button Variants

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| `primary` | fuchsia | white | Main CTAs |
| `secondary` | charcoal | white | Secondary actions |
| `outline` | transparent | charcoal | Tertiary actions |
| `tertiary` | blue | charcoal | Alternative actions |

### Spacing & Radius

- **Cards**: `rounded-lg` (10px)
- **Buttons**: `rounded-md` (6px)
- **Section padding**: `py-16 md:py-24` (vertical), `px-4 md:px-6 lg:px-8` (horizontal)

## API Routes

### POST `/api/reckoning`

Generates a personalised Reckoning report using Claude.

**Request Body:**
```typescript
{
  answers: Record<string, string | string[]>;
  persona: 'launcher' | 'builder' | 'architect';
  businessType?: string;
  businessName?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  report: ReckoningReport;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}
```

**Model:** `claude-sonnet-4-20250514`

## Key Types

### PersonaType
```typescript
type PersonaType = 'launcher' | 'builder' | 'architect';
```

### ServiceItem
```typescript
interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;              // £ GBP
  timeEstimate: string;
  personas: PersonaType[];
  businessTypes: BusinessCategory[];
  deliveryType: 'diy_resource' | 'done_with_you' | 'done_for_you';
  category: 'presence' | 'operations' | 'automation' | 'legal' | 'visibility' | 'support';
  suggestedWith: string[];
  requiredWith: string[];
  popular: boolean;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  agencyComparison: number;
  timeSavedPerMonth?: number;
  revenuePotential?: string;
}
```

### ReckoningReport (from types/index.ts)
See `src/types/index.ts` for the full report structure with persona-specific sections.

## Development

### Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

### Environment Variables

```env
ANTHROPIC_API_KEY=     # Required for report generation
NEXT_PUBLIC_SITE_URL=  # Production URL (optional)
```

## Coding Conventions

### Component Guidelines

1. **Use Tailwind exclusively** — no CSS modules or inline styles
2. **Use semantic colour names** — `bg-charcoal` not `bg-[#2d2926]`
3. **Export components as default** — use barrel exports in index.ts
4. **Include TypeScript types** for all props
5. **Use `'use client'`** directive only when necessary (hooks, interactivity)

### File Naming

- Components: PascalCase (`PersonaCards.tsx`)
- Hooks: camelCase with `use` prefix (`useQuestionnaire.ts`)
- Utils/data: camelCase (`pricing.ts`, `services.ts`)
- Types: camelCase (`index.ts`, `reckoning.ts`)

### Voice & Copy Guidelines

- Clear over clever
- Warm, not soft
- Grounded optimism
- No buzzwords or jargon
- Use contractions ("you're" not "you are")
- Direct address ("you" not "the user")

## AI Report Generation

### Prompt Architecture

1. **Base System Prompt** (`src/prompts/base.ts`)
   - Role definition and behavioural rules
   - Output format instructions
   - Token budget guidelines
   - Validation requirements

2. **Persona Prompts** (`src/prompts/personas.ts`)
   - Persona-specific context and emotional state
   - Tone and language guidelines
   - Required output sections
   - Examples and patterns

3. **User Answers** — Formatted from questionnaire responses

### Report Sections by Persona

| Section | Launcher | Builder | Architect |
|---------|----------|---------|-----------|
| Opening | Headline + Reflection | Headline + Reflection | Headline + Reflection |
| Snapshot | whereYouAre, whatsWorking, whatsMissing | whatYouveBuilt, whatsWorking, whatsCostingYou | whatYouveBuilt, whatsWorking, whatsCostingYou |
| Diagnosis | coreInsight, blockersReframed, hiddenAdvantage | pattern, hiddenCost, quickWins | pattern, hiddenCost |
| Journey | journeyMap (3 phases) | theFix (3 phases) | theUpgrade (before/after + priorityFixes) |
| Cost | costOfWaiting | costOfStatusQuo | costOfStatusQuo + toolsAudit |
| Investment | diyPath + supportedPath | diyPath + supportedPath | diyPath + supportedPath |
| Closing | affirmation + oneNextStep | validation + oneNextStep | truth + permission + oneNextStep |

## State Management

### Questionnaire State

The questionnaire uses a custom hook (`useQuestionnaire`) with localStorage persistence:

```typescript
interface QuestionnaireState {
  step: 'persona' | 'questions' | 'submitting' | 'complete';
  persona: string | null;
  questionIndex: number;
  answers: Record<string, string | string[]>;
}
```

**Storage key:** `reckoning_progress`

### Report Storage

Generated reports are stored in localStorage with key `reckoning-{id}`.

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Use Tailwind responsive prefixes: `md:` (768px), `lg:` (1024px)

## Common Patterns

### Section Wrapper
```tsx
<section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Card with Hover
```tsx
<div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

### CTA Button
```tsx
<Button variant="primary" size="lg" href="/questionnaire">
  Start Your Reckoning
</Button>
```

## Troubleshooting

### Common Issues

1. **Font not loading**: Check that `next/font/google` imports are correct in `layout.tsx`
2. **Tailwind classes not applying**: Verify the class exists in `globals.css` or is a valid Tailwind v4 utility
3. **API 500 errors**: Check `ANTHROPIC_API_KEY` is set in environment
4. **localStorage errors**: Wrap in `useEffect` or check for `typeof window !== 'undefined'`

### Debug Report Generation

Set `console.log` in `/api/reckoning/route.ts` to see:
- Incoming request body
- Constructed prompts
- Claude API response
- Parse errors
