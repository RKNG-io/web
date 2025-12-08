# Agent Session Log

Shared context for agents working in parallel on the Reckoning project.

---

## Session: 2025-12-04 (Evening)

### Plan Organisation & CLAUDE.md Update

**Files:**
- `.claude/plans/website-builder.md` (NEW)
- `.claude/plans/agent-observability.md` (NEW)
- `CLAUDE.md` (updated)
- `.claude/agents/CURRENT-TASKS.md` (updated)

**What was done:**
- Split combined plan file (`cozy-wishing-harbor.md`) into separate named plans
- Added `.claude/plans/` folder to project for implementation plans
- Updated CLAUDE.md with Implementation Plans table and folder reference
- Updated CURRENT-TASKS.md to reference new plan location
- Noted that Agent Observability System was already implemented by another agent

---

### Report Quality System v3 — Presentation & Validation

#### 1. PDF File Naming
**Files:**
- `web/src/lib/pdf/filename.ts` (NEW)
- `web/src/app/api/reckoning/pdf/[token]/route.ts`

**What was done:**
- Human-readable PDF filenames: `Sophie-Reckoning-2025-12-04.pdf` instead of `reckoning-rk_dgscf.pdf`
- Helper function `generatePDFFilename()` cleans names, titlecases, formats dates
- Helper function `getEmailSubject()` for email subject lines using first name

#### 2. Buying Intent Validation
**Files:**
- `web/src/lib/validation/buying-intent.ts` (NEW)
- `web/src/lib/prompts/personas/launcher.ts` (updated)
- `web/src/lib/validation/confidence.ts` (updated)

**What was done:**
- Launcher reports now require "real money" validation tactics (deposit, pre-order, A/B test)
- Catches weak validation like "would you buy?" and warns
- Added validation tactics guidance to Launcher prompt
- 5-point deduction for missing buying intent in Launcher reports

#### 3. Consistency Validation
**Files:**
- `web/src/lib/validation/consistency.ts` (NEW)
- `web/src/lib/validation/confidence.ts` (updated)

**What was done:**
- Extracts numbers from questionnaire answers (hours/week, hourly rate, budget)
- Validates calculation inputs match user's stated numbers
- Hard fail if using MORE hours than user stated
- Warning if hours mismatch without explanation
- 8-point deduction for calculation inconsistencies

#### 4. Checklist Format for Journey Map
**Files:**
- `web/src/lib/validation/schema.ts` (updated)
- `web/src/lib/prompts/personas/launcher.ts` (updated)

**What was done:**
- Added `completion_criteria` to each journey map phase
- Phases now require "Phase complete when: [criteria]"
- Schema validation warns if missing
- Prompt updated to require completion criteria

---

## Session: 2025-12-04 (Afternoon)

### Completed Features

#### Report Quality System v2
**Files:**
- `web/src/lib/prompts/base.ts` - Added banned phrases, business-type service mapping, quality formulas
- `web/src/lib/prompts/personas/launcher.ts` - Added 4 insight patterns, opening/diagnosis/next-step formulas
- `web/src/lib/prompts/personas/builder.ts` - Added time-back calculations, bottleneck patterns
- `web/src/lib/prompts/personas/architect.ts` - Added strategic insight patterns
- `web/src/lib/validation/specificity.ts` (NEW) - Catches generic phrases, filler, vague advice
- `web/src/lib/validation/quoted-phrases.ts` (NEW) - Requires 3+ direct quotes from answers
- `web/src/lib/validation/business-type.ts` (NEW) - Maps business types to relevant services
- `web/src/lib/validation/numbers.ts` (NEW) - Checks budget/hours are referenced
- `web/src/lib/validation/confidence.ts` - Updated to integrate all new validators
- `web/src/lib/validation/schema.ts` - Expanded JSON schema to full nested structure
- `web/src/lib/validation/brand-voice.ts` - Fixed false positives (first name check, encouraging words)

**What was done:**
- Comprehensive prompt rewrite forcing specificity over generality
- Banned phrases list that triggers QA failure (cheerleader language, generic advice)
- Required elements: 3+ direct quotes, specific numbers referenced, insights not echoes
- Business-type aware service recommendations (meal prep ≠ client intake forms)
- Expanded JSON schema so Claude produces correct nested field names
- Multi-layer validation with severity-weighted deductions

**Results:**
- Test reports now achieve 100% confidence on first attempt (was 0% before)
- Auto-approved status with 0 validation flags
- Content quality dramatically improved (uses quotes, provides insight, specific to business)

---

## Session: 2025-12-04 (Morning)

### Completed Features

#### 1. LocalStorage Persistence for Questionnaire
**Files:** 
- `web/src/app/start/useQuestionnaire.ts`
- `web/src/app/start/page.tsx`

**What was done:**
- Versioned localStorage with 72-hour expiry
- SSR-safe hydration with `isHydrated` state
- Resume prompt for returning users ("Continue where I left off" / "Start fresh")
- Legacy format migration support

---

#### 2. PDF Generation for Reports
**Files:** 
- `web/src/app/api/reckoning/pdf/[token]/route.ts`

**What was done:**
- Server-side PDF generation using Puppeteer
- Renders the report page with `?print=true` flag
- Returns downloadable PDF with proper headers

---

#### 3. Email System with Resend
**Files:** 
- `web/src/lib/email/resend.ts`
- `web/src/lib/email/templates.ts`

**What was done:**
- Lazy-initialized Resend client (dev mode fallback when no API key)
- Branded email templates:
  - Intake confirmation
  - Admin notification
  - Reckoning complete
  - Report flagged

---

#### 4. Stripe Checkout Integration
**Files:**
- `web/src/lib/stripe/config.ts` - Stripe client setup
- `web/src/lib/stripe.ts` - Utility functions
- `web/src/app/api/checkout/route.ts` - Checkout session creation
- `web/src/app/api/webhooks/stripe/route.ts` - Payment webhook handler
- `web/src/app/checkout/success/page.tsx` - Success page
- `web/src/components/services/CartDrawer.tsx` - Checkout button

**What was done:**
- Multi-service discount coupons (5%/10%/15% based on quantity)
- Price validation against catalogue
- Bundle support
- Webhook handling for payment confirmation

---

#### 5. Services Page with Cart System
**Files:** 
- `web/src/components/services/CartContext.tsx`
- `web/src/components/services/CartDrawer.tsx`

**What was done:**
- Add services/bundles to cart
- Bundle suggestions ("add 1 more to complete bundle")
- Discount calculation display
- Agency price comparison savings

---

### Planned (Not Yet Implemented)

#### Website Automation Builder
**Plan file:** `/Users/liz/.claude/plans/cozy-wishing-harbor.md`

**Architecture:** Client Intake → AI Generation → Vercel Preview → Admin Review → Client Approval → Deploy

**12-step implementation plan:**
1. Database migration (website_projects, website_assets, website_pages tables)
2. DB query functions
3. S3 file upload infrastructure
4. Enhanced intake form with uploads
5. Next.js template components
6. Generation prompts (per-page schemas)
7. Generation API (Claude API calls)
8. Content validation
9. Vercel deployment integration
10. Admin review dashboard
11. Client preview portal
12. Email notifications

---

## Environment Variables Required

```env
# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# For website builder (future)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
VERCEL_TOKEN=
VERCEL_TEAM_ID=
```

---

## Key Patterns Established

| Pattern | Description | Example File |
|---------|-------------|--------------|
| Generation pipeline | Intake → Claude API → Validation → Confidence scoring → Admin review | `web/src/app/api/reckoning/generate/route.ts` |
| Status state machines | `pending` → `generating` → `complete` → `approved` | Database status columns |
| Email templates | Branded HTML matching Reckoning design system | `web/src/lib/email/templates.ts` |
| Lazy initialization | Clients only created when env vars present (dev-friendly) | `web/src/lib/email/resend.ts` |
| Token-based access | Public URLs use tokens, not IDs | `/reckoning/[token]` routes |

---

## Errors Encountered & Fixes

| Error | Fix |
|-------|-----|
| Stripe API version type mismatch | Remove explicit `apiVersion` from Stripe client config |
| Stripe line_items metadata type error | Remove metadata from `product_data` in line items |
| PDF response Uint8Array type error | Wrap with `Buffer.from(pdf)` |
| LocalStorage SSR hydration issues | Added `isHydrated` state, only render after hydration |

---

## Notes for Other Agents

- **Brand colours:** Use only those defined in `tailwind.config.ts`
- **Font:** Outfit only
- **No gradients** on backgrounds
- **Database:** PostgreSQL at `postgresql://liz:localdev@localhost:5432/dev`
- **Migrations:** Located in `database/` folder

---

## Project Sweep: 2025-12-04

### Completion Status

| Area | Status | Notes |
|------|--------|-------|
| Landing page | 85% | All sections converted from prototype |
| Questionnaire | 55% | Framework ready, separate agent working |
| Bypass intakes | 80% | Website/automations/social forms done |
| Report generation | 40% | Claude API + validation done |
| PDF generation | 5% | **BLOCKER** - Puppeteer installed but stubs only |
| Services page | 70% | Two versions (A/B), cart complete |
| Checkout/Stripe | 90% | Session creation done, webhook TODO |
| Admin dashboard | 20% | Scaffolding exists |
| Email (Resend) | 70% | Templates done, not fully wired |

### Database Tables

1. `reckonings` - Questionnaire responses + AI reports
2. `intake_requests` - Bypass intake submissions  
3. `orders` - Stripe purchases
4. `questionnaire_submissions` - Raw submissions

### Critical Issues Found

| Priority | Issue | File |
|----------|-------|------|
| **CRITICAL** | PDF generation is stubs | `src/lib/pdf/generator.ts` |
| **HIGH** | Stripe webhook not implemented | `src/app/api/webhooks/stripe/` |
| **HIGH** | Admin auth not implemented | No middleware |
| **MEDIUM** | Two services page versions | Pick A or B |
| **MEDIUM** | Acknowledgment component placeholder | `src/components/questionnaire/Acknowledgment.tsx` |

### Inconsistencies

- Multiple service data files: `services.ts`, `services-adapter.ts`, `service-catalogue.ts`, `packages.ts`
- Services page A/B versions - query param switches, no clear winner
- Email templates exist but send calls may not be wired

### What's Working Well

- Clean folder structure
- Comprehensive docs (15 files)
- Brand compliance (Outfit font, brand colours, no gradients)
- Validation/confidence scoring for reports
- Cart system with multi-service discounts
- TypeScript strict mode

---

## Agent Observability System: 2025-12-04

### Implemented

| Component | File | Status |
|-----------|------|--------|
| Database migration | `database/005_agent_observability.sql` | Done |
| Event logging library | `web/src/lib/observability/events.ts` | Done |
| Query functions | `web/src/lib/observability/queries.ts` | Done |
| Admin dashboard | `web/src/app/admin/agents/page.tsx` | Done |
| Session detail page | `web/src/app/admin/agents/[sessionId]/page.tsx` | Done |
| API logging endpoint | `web/src/app/api/observability/log/route.ts` | Done |
| Middleware wrapper | `web/src/lib/observability/middleware.ts` | Done |

### Database Tables Created

- `agent_events` - Event log for all agent activity
- `active_sessions` (view) - Sessions in last 24h
- `recent_errors` (view) - Errors in last 7 days
- `daily_event_summary` (view) - Daily aggregates

### Usage

**From TypeScript:**
```typescript
import { logAgentEvent, startSession, endSession } from '@/lib/observability';

const sessionId = await startSession('script', 'data-migration', 'reckoning');
await logTaskStarted('Migrating users', 'script', 'data-migration', sessionId);
await logTaskCompleted('Migrated 500 records', 'script', 'data-migration', sessionId);
await endSession(sessionId, 'script', 'data-migration', 'Complete');
```

**From n8n (HTTP Request):**
```json
POST /api/observability/log
{
  "agentType": "n8n",
  "agentName": "client-onboarding",
  "eventType": "task_completed",
  "description": "Sent welcome email",
  "project": "synatra"
}
```

**Dashboard:** `/admin/agents`

---

## Session: 2025-12-05 (Quality Gateway Update)

### Dynamic Questionnaire Compatibility

**Files:**
- `web/src/lib/validation/business-type.ts` - Updated `detectBusinessType()`, added default fallback
- `web/src/lib/validation/consistency.ts` - Removed budget validation entirely
- `web/src/lib/validation/numbers.ts` - Removed budget validation
- `web/src/lib/validation/input-echo.ts` - Uses `extractUserName()` for contact JSON field
- `web/src/data/persona-questions.ts` - Removed budget questions from all personas, removed VA option

**What was done:**

1. **Removed budget questions entirely** — Asking about budget feels extractive ("charge what they can afford"). Removed from:
   - All three persona questionnaires (Launcher, Builder, Architect)
   - `consistency.ts` validation
   - `numbers.ts` validation

2. **Removed VA business type** — Not a target customer. Removed from:
   - `business-type.ts` validator map
   - Builder persona's business_type options

3. **Added default fallback for "other" business types** — Instead of skipping validation when business type is unrecognised, now uses a permissive default config with no hard restrictions. This means validation still runs but doesn't flag irrelevant services for unknown business types.

4. **business-type.ts**: Now checks `business_type` answer directly first before falling back to keyword search. Falls back to `DEFAULT_BUSINESS_TYPE` config when unrecognised (permissive, no `irrelevant` services).

5. **consistency.ts**: Simplified to only validate hours consistency (from `time_available` and `hours_lost` options). Budget maps removed.

6. **numbers.ts**: Simplified to only check hours mentioned in free text. Budget validation removed.

**Result:** Quality gateway is cleaner, less extractive, and handles edge cases gracefully.

---

## Session: 2025-12-04 (UX Review)

### Comprehensive UX Audit

**Files:**
- `.claude/reports/ux-audit-2025-12-04.md` (NEW)

**What was done:**
- Conducted comprehensive usability review of 4 primary user flows:
  1. Homepage → Questionnaire → Report View
  2. Homepage → Services → Cart → Checkout
  3. "I know what I need" bypass flow
  4. Mobile navigation and interactions

**Findings:**
- **12 critical issues** identified
- **18 medium-priority improvements** documented
- **8 accessibility concerns** flagged (WCAG AA compliance)
- **3 high-risk drop-off points** mapped

**Priority issues:**
1. Mobile menu doesn't close on anchor link click (P0)
2. No back button from questionnaire to homepage (P0)
3. Missing acknowledgment component between questions (P1)
4. No "Browse Services" path from homepage (P0)
5. Touch targets below 44px minimum (P1 - accessibility)
6. No skip to content links (P1 - accessibility)
7. Loading states not announced to screen readers (P1)

**Key recommendations:**
- Implement journey-based progress indicators ("Getting to know you" vs "Question 3 of 15")
- Add acknowledgment messages after meaningful answers (as per psychology brief)
- Fix mobile touch target sizes (WCAG AA requires 44×44px minimum)
- Add ARIA live regions for screen reader announcements
- Create explicit "Browse Services" entry point from homepage

**Estimated effort:** 8-12 days of focused UX/dev work across 4 sprints

**Report sections:**
- Flow-by-flow emotional arc alignment scores
- Accessibility audit against WCAG 2.1 AA
- Drop-off risk analysis
- Priority matrix with implementation order
- Testing checklist for pre-launch verification

---

## Session: 2025-12-05 (Action Items System)

### Report Becomes Genuine Diagnostic (Not Just Sales Funnel)

**Goal:** Transform the Reckoning report from a funnel into a genuine diagnostic that tells users EVERYTHING they need to do — not just services we sell.

**Files:**
- `web/src/data/services.ts` — Complete rewrite with purchaseType + Strategy Session
- `web/src/data/diy-actions.ts` (NEW) — 22 DIY tasks users do themselves
- `web/src/lib/types/index.ts` — Added PurchaseType
- `web/src/types/report.ts` — Added ActionItems, ActionItem types
- `web/src/lib/validation/schema.ts` — Added action_items to JSON schema + validation
- `web/src/lib/prompts/base.ts` — Added action_items documentation
- `web/src/lib/prompts/personas/launcher.ts` — Action items guidance
- `web/src/lib/prompts/personas/builder.ts` — Action items guidance
- `web/src/lib/prompts/personas/architect.ts` — Action items guidance
- `web/src/lib/data/service-catalogue.ts` — Now re-exports from services.ts (single source of truth)
- `web/src/data/service-catalogue.ts` (DELETED) — Was duplicate, unused

**What was done:**

1. **Added PurchaseType to services**
   - `instant` — Fixed price, order now (domain_setup, booking_system, etc.)
   - `quote` — Needs scoping (website_multi, crm_setup, etc.)
   - `retainer` — Ongoing support

2. **Added Strategy Session service (£249)**
   - Two 45-minute sessions with async guidance
   - purchaseType: instant

3. **Created DIY_ACTIONS list (22 items)**
   - Business registration, insurance, bank accounts
   - Industry-specific (food safety, fitness qualifications, therapy registration)
   - Data/privacy (privacy policy, terms & conditions)
   - Operations (backup, password manager)
   - Includes: guidance, search_terms, triggers, priority

4. **New action_items structure in report schema**
   - `must_do[]` — Priority 1: Regulatory/critical
   - `should_do[]` — Priority 2: Important for growth
   - `could_do[]` — Priority 3: Nice-to-have
   - Each item has action_type: 'diy' | 'instant' | 'quote'
   - DIY items include: diy_action_id, guidance, search_terms
   - Service items include: service_id, price_from

5. **Updated all persona prompts**
   - Specific DIY + service recommendations per persona
   - Instructions to mix DIY and services naturally
   - Emphasis: "a real to-do list has both"

6. **Constraints honoured:**
   - No UK-specific recommendations (changed ".co.uk" → "local equivalent")
   - No specific bank/insurance provider recommendations (liability)
   - Generic guidance with search terms instead

**Result:** Reports now tell users everything they need to do, with DIY guidance for things we don't sell and clear purchase paths for things we do. Feels like genuine help, not just a sales pitch.

---

## Infrastructure Notes

**Email Setup:**
- **Business email**: Zoho (MX records on root domain)
- **Transactional email**: Resend (sending only, via `send.` subdomain)
- No conflict — Zoho handles inbox, Resend handles outbound transactional
