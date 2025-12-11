# File Map

Key files and their purposes. Update when adding significant new files.

---

## App Routes

| Path | Purpose |
|------|---------|
| `web/src/app/page.tsx` | Landing page |
| `web/src/app/start/page.tsx` | Questionnaire intake (v1 persona-based) |
| `web/src/app/start/time-audit/page.tsx` | **v2 Time Audit intake** (8 screens) |
| `web/src/app/diagnostic/[token]/page.tsx` | **v2 Diagnostic results** (matched automations) |
| `web/src/app/for/[vertical]/page.tsx` | **v2 Vertical landing pages** (fitness, wellness, trades, events) |
| `web/src/app/services/page.tsx` | Services catalogue with cart |
| `web/src/app/reckoning/[token]/page.tsx` | Public report view (v1 AI-generated) |
| `web/src/app/checkout/success/page.tsx` | Payment success |
| `web/src/app/admin/` | Admin dashboard routes |

---

## API Routes

| Path | Purpose |
|------|---------|
| `web/src/app/api/intake/route.ts` | Submit questionnaire (v1) |
| `web/src/app/api/intake/time-audit/route.ts` | **v2 Time Audit submission** - runs matcher, saves diagnostic |
| `web/src/app/api/intake/bypass/route.ts` | Quick intake (skip questions) |
| `web/src/app/api/reckoning/generate/route.ts` | AI report generation (v1) |
| `web/src/app/api/reckoning/pdf/[token]/route.ts` | PDF download |
| `web/src/app/api/checkout/route.ts` | Stripe checkout session |
| `web/src/app/api/webhooks/stripe/route.ts` | Stripe payment webhooks |

---

## Core Libraries

| Path | Purpose |
|------|---------|
| `web/src/lib/db.ts` | Database queries |
| `web/src/lib/stripe/config.ts` | Stripe client |
| `web/src/lib/email/resend.ts` | Email client |
| `web/src/lib/email/templates.ts` | Email HTML templates |

---

## Validation (Report Quality)

| Path | Purpose |
|------|---------|
| `web/src/lib/validation/confidence.ts` | Main confidence scorer (integrates all validators) |
| `web/src/lib/validation/schema.ts` | JSON schema + structure validation |
| `web/src/lib/validation/brand-voice.ts` | Banned phrases, tone markers |
| `web/src/lib/validation/specificity.ts` | Catches generic phrases, filler, vague advice |
| `web/src/lib/validation/quoted-phrases.ts` | Verifies 3+ direct quotes from answers |
| `web/src/lib/validation/business-type.ts` | Maps business types to relevant services |
| `web/src/lib/validation/numbers.ts` | Checks budget/hours are referenced |
| `web/src/lib/validation/input-echo.ts` | Validates quotes match original answers |
| `web/src/lib/validation/maths.ts` | Verifies calculations are correct |
| `web/src/lib/validation/services.ts` | Validates service recommendations |
| `web/src/lib/validation/buying-intent.ts` | Requires real money validation (Launcher) |
| `web/src/lib/validation/consistency.ts` | Checks calculations match questionnaire numbers |

---

## PDF Generation

| Path | Purpose |
|------|---------|
| `web/src/lib/pdf/filename.ts` | Human-readable PDF naming |

---

## AI Prompts

| Path | Purpose |
|------|---------|
| `web/src/lib/prompts/base.ts` | Shared quality rules, banned phrases, formulas |
| `web/src/lib/prompts/builder.ts` | Assembles system + user prompts |
| `web/src/lib/prompts/personas/launcher.ts` | Launcher-specific insight patterns |
| `web/src/lib/prompts/personas/builder.ts` | Builder-specific time-back patterns |
| `web/src/lib/prompts/personas/architect.ts` | Architect-specific strategic patterns |

---

## Automation Schema (v2)

| Path | Purpose |
|------|---------|
| `docs/schema/README.md` | Schema overview, principles, versioning |
| `docs/schema/entities.md` | Contact, Appointment, Invoice, Quote, Message, Event, Provider |
| `docs/schema/automations.md` | Triggers, Steps, Actions, Conditions |
| `docs/schema/variables.md` | Variable interpolation syntax and filters |
| `docs/schema/integrations.md` | Supported tools by category |
| `docs/schema/extension-guide.md` | How to extend the schema |
| `docs/schema/catalogue.md` | All automations documented |
| `src/types/automation.ts` | Canonical TypeScript types |
| `src/data/automation-catalogue.ts` | 10 automations defined in code |
| `src/lib/matcher.ts` | Automation selection algorithm |

---

## Data & Config

| Path | Purpose |
|------|---------|
| `web/src/lib/data/service-catalogue.ts` | Services definitions |
| `web/src/lib/data/bundles.ts` | Bundle definitions |
| `web/src/data/automation-catalogue.ts` | v2 automations catalogue |

---

## Components

| Path | Purpose |
|------|---------|
| `web/src/components/services/CartContext.tsx` | Cart state provider |
| `web/src/components/services/CartDrawer.tsx` | Cart slide-out UI |
| `web/src/app/start/useQuestionnaire.ts` | Questionnaire state hook (v1) |
| `web/src/app/start/time-audit/useTimeAudit.ts` | **v2 Time Audit state hook** |

---

## Database

| Path | Purpose |
|------|---------|
| `database/001_initial_schema.sql` | Core tables |
| `database/002_*.sql` | Subsequent migrations |
| `database/007_diagnostics.sql` | **v2 Diagnostics table** |

---

## Config

| Path | Purpose |
|------|---------|
| `web/tailwind.config.ts` | Brand colours, fonts |
| `web/next.config.js` | Next.js config |

---

## Documentation

| Path | Purpose |
|------|---------|
| `docs/00-ORCHESTRATION.md` | Agent personas |
| `docs/00-PSYCHOLOGY-BRIEF.md` | Emotional vision |
| `docs/00-brand-voice.md` | Tone guidelines |
| `docs/00-BUILD-TODO.md` | Build status |

---

## Known Issues

| Path | Issue |
|------|-------|
| `web/src/lib/pdf/generator.ts` | **STUBS ONLY** - needs implementation |
| `web/src/app/api/webhooks/stripe/route.ts` | Webhook handler incomplete |
| `web/src/components/questionnaire/Acknowledgment.tsx` | Placeholder only |
| `web/src/app/admin/` | No auth middleware protecting routes |

---

## Duplicate/Unclear Files

| Files | Issue |
|-------|-------|
| `services.ts`, `services-adapter.ts`, `service-catalogue.ts`, `packages.ts` | Multiple service data files - relationship unclear |
| `VersionA.tsx`, `VersionB.tsx` | Two services page versions - pick one |
