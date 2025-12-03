# Reckoning Web — Project Instructions

## Overview
Next.js 14+ website for Reckoning — a business diagnostic platform for solopreneurs.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Fonts**: Outfit (primary), Source Serif 4 (editorial)
- **AI**: Claude API via @anthropic-ai/sdk
- **Deployment**: Vercel

## Brand Colours (Tailwind)
```
charcoal: #2d2926    — Primary dark, text, headers
ice: #F2F6F9         — Page backgrounds, cards
fuchsia: #D14BA8     — CTAs, accents, links
mint: #B6E2D3        — Fresh sections, success
blue: #A8C3D1        — Secondary, borders, calm
ink: #1a1a1a         — Deepest black
stone: #E5E7E9       — Borders, dividers
fuchsia-dark: #a33a85
mint-light: #d4efe6
blue-light: #c5d8e3
success: #2A7F78
warning: #C3B273
error: #c45d5d
```

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── questionnaire/      # Questionnaire flow
│   ├── services/           # Services catalogue
│   ├── reckoning/[id]/     # Generated report view
│   └── api/reckoning/      # AI generation endpoint
├── components/             # React components
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── PersonaCards.tsx
│   ├── HowItWorks.tsx
│   ├── ReckoningCTA.tsx
│   ├── ServiceExplorer.tsx
│   ├── Testimonials.tsx
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   └── ui/                 # Reusable primitives
├── data/                   # TypeScript data files
│   ├── services.ts         # 48 services
│   ├── questions.ts        # Question bank
│   └── packages.ts         # Package definitions
├── lib/                    # Utilities
│   ├── utils.ts
│   └── pricing.ts
├── prompts/                # AI prompt templates
│   ├── base.ts
│   └── personas.ts
└── types/                  # TypeScript types
    └── index.ts
```

## Source Files (Convert From)
Existing HTML/TS files in `/Users/liz/Projects/Reckoning/reckoning 2/`:
- `website/index.html` — Complete landing page
- `examples/questionnaire-prototype.html` — Working questionnaire
- `src/data/service-catalogue.ts` — 48 services
- `src/data/question-bank.ts` — Question flows
- `src/data/packages.ts` — Package definitions
- `src/types/index.ts` — TypeScript types
- `src/prompts/*.md` — AI prompt templates
- `src/pricing/calculator.ts` — Bundle discount logic

## Component Guidelines

### Converting HTML to React
1. Extract each section from index.html into its own component
2. Convert inline styles to Tailwind classes
3. Use the brand colour variables defined in tailwind.config.ts
4. Preserve all hover/focus states
5. Ensure responsive behaviour (check 1024px, 768px breakpoints)

### Styling Rules
- Use Tailwind exclusively — no CSS modules
- Use semantic colour names: `bg-charcoal`, `text-fuchsia`, `bg-mint`
- Button variants: primary (fuchsia), secondary (charcoal), outline, tertiary (blue)
- Border radius: `rounded-lg` (10px) for cards, `rounded-md` (6px) for buttons

### Voice & Copy
- Clear over clever
- Warm, not soft
- Grounded optimism
- No buzzwords or jargon

## Agent Instructions

### For Component Building Agents
When building a component:
1. Read the corresponding section from `reckoning 2/website/index.html`
2. Convert to React with TypeScript
3. Use Tailwind classes matching the brand guidelines
4. Export as default from the component file
5. Include proper TypeScript types for all props

### For Data Migration Agents
When copying data files:
1. Copy from `reckoning 2/src/data/` to `reckoning-web/src/data/`
2. Adjust import paths as needed
3. Ensure TypeScript types are properly exported

### For API Route Agents
When building the Reckoning API:
1. Use @anthropic-ai/sdk
2. Load prompts from src/prompts/
3. Accept POST with { answers, persona }
4. Return structured JSON report
5. Handle errors gracefully

## Testing
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check

## Environment Variables
```
ANTHROPIC_API_KEY=     # Required for Reckoning generation
NEXT_PUBLIC_SITE_URL=  # Production URL
```
