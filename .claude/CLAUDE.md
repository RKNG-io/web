# Reckoning Web — Project Instructions

## Before Starting Any Task

1. **Read `.claude/agents/CURRENT-TASKS.md`** — Check what's in progress, avoid conflicts
2. **Read `.claude/agents/SESSION-LOG.md`** — Recent context and patterns
3. **Read `.claude/agents/DECISIONS.md`** — Architectural constraints
4. **Skim `.claude/agents/FILE-MAP.md`** — Find files quickly

For brand/tone context (if needed):
- `docs/00-brand-voice.md` — Tone guidelines
- `docs/00-PSYCHOLOGY-BRIEF.md` — Emotional vision
- `docs/DESIGN-RULES.md` — Visual design rules

## After Completing Work

1. Update `SESSION-LOG.md` with what you did
2. Move tasks in `CURRENT-TASKS.md`
3. Update `FILE-MAP.md` if you added key files
4. Update `DECISIONS.md` if you made architectural choices

---

## Overview

Next.js 14+ website for Reckoning — a business diagnostic platform for solopreneurs.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Fonts**: Outfit (primary), Source Serif 4 (editorial)
- **AI**: Claude API via @anthropic-ai/sdk
- **Database**: PostgreSQL (`postgresql://liz:localdev@localhost:5432/reckoning`)
- **Deployment**: Vercel

## Strict Rules

- **Outfit font ONLY**
- **Brand colours ONLY** (see `tailwind.config.ts`)
- **NO gradient backgrounds**
- **NO generic shadows**
- **Tokens in URLs** (not IDs) for public routes
- **Lazy client initialization** — dev-friendly fallbacks when env vars missing

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
│   ├── start/              # Questionnaire & bypass intakes
│   ├── services/           # Services catalogue
│   ├── reckoning/[token]/  # Generated report view
│   ├── admin/              # Admin dashboard
│   └── api/
│       ├── reckoning/      # AI generation endpoint
│       ├── checkout/       # Stripe checkout
│       └── webhooks/       # Stripe webhooks
├── components/             # React components
│   ├── ui/                 # Reusable primitives
│   └── services/           # Service-related components
├── data/                   # TypeScript data files
├── lib/                    # Utilities
│   ├── db.ts               # Database queries
│   ├── stripe.ts           # Stripe client
│   ├── validation/         # Validation layers
│   └── prompts/            # AI prompt templates
└── types/                  # TypeScript types
```

## Key Systems

| System | Entry Point | Docs |
|--------|-------------|------|
| Report generation | `api/reckoning/generate/route.ts` | `docs/09-report-generation-system.md` |
| Validation (10 layers) | `lib/validation/confidence.ts` | `.claude/agents/DECISIONS.md` |
| Prompts | `lib/prompts/builder.ts` | See persona files in `lib/prompts/personas/` |
| Services/Cart | `components/services/CartContext.tsx` | — |
| Stripe checkout | `api/checkout/route.ts` | — |
| Brand voice filter | `lib/validation/brand-voice.ts` | `docs/HUMANISER-CHANGES.md` |

## Environment Variables

```env
# Required for AI generation
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=postgresql://liz:localdev@localhost:5432/reckoning

# Email (optional locally)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=

# Stripe (optional locally)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Documentation

| Folder | Purpose |
|--------|---------|
| `.claude/agents/` | **Shared agent context** — read before working |
| `.claude/plans/` | Implementation plans for major features |
| `docs/` | Specs, brand, copy, business strategy |
| `docs/business/` | Automation OS catalogue, research |
| `docs/personas/` | Persona definitions |
| `docs/questionnaires/` | Question flow specs |

## Implementation Plans

| Plan | File | Status |
|------|------|--------|
| Website Builder | `.claude/plans/website-builder.md` | Planned |
| Agent Observability | `.claude/plans/agent-observability.md` | Planned |
| Appointment Bot | `.claude/plans/appointment-bot.md` | Draft |

## Styling Rules

- Use Tailwind exclusively — no CSS modules
- Use semantic colour names: `bg-charcoal`, `text-fuchsia`, `bg-mint`
- Button variants: primary (fuchsia), secondary (charcoal), outline, tertiary (blue)
- Border radius: `rounded-lg` (10px) for cards, `rounded-md` (6px) for buttons
- See `docs/DESIGN-RULES.md` for complete visual reference

## Voice & Copy

- Clear over clever
- Warm, not soft
- Grounded optimism
- No buzzwords or jargon
- Run all copy through `lib/validation/brand-voice.ts` humaniser filter

## Testing

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — ESLint check
- `pnpm test` — Run tests
