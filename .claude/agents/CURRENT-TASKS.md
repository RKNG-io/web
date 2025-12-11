# Current Tasks

Active work being done by agents. Update this when starting/completing tasks to avoid conflicts.

---

## In Progress

| Task | Agent/Session | Started | Notes |
|------|---------------|---------|-------|
| - | - | - | - |

---

## Queued - Launch Blockers (HIGH)

| Task | Priority | Dependencies | Notes |
|------|----------|--------------|-------|
| PDF generation implementation | **CRITICAL** | None | `src/lib/pdf/generator.ts` is stubs only |
| Stripe webhook handler | **HIGH** | Stripe account | `src/app/api/webhooks/stripe/route.ts` |

---

## Queued - Website Builder (12 steps)

Plan: `.claude/plans/website-builder.md`

| Step | Task | Dependencies | Files |
|------|------|--------------|-------|
| 1 | Database migration | None | `database/005_website_projects.sql` |
| 2 | DB query functions | Step 1 | `src/lib/db.ts` |
| 3 | S3 upload infrastructure | AWS creds | `src/lib/storage/s3.ts`, `src/app/api/upload/` |
| 4 | Enhanced intake form | Steps 1-3 | `src/app/start/website-builder/page.tsx` |
| 5 | Template components | None | `src/templates/website/` |
| 6 | Generation prompts | None | `src/lib/prompts/website/` |
| 7 | Generation API | Steps 5-6 | `src/app/api/website-builder/generate/route.ts` |
| 8 | Content validation | Step 7 | `src/lib/validation/website/` |
| 9 | Vercel deployment | VERCEL_TOKEN | `src/lib/vercel/deploy.ts` |
| 10 | Admin review dashboard | Steps 7-9 | `src/app/admin/websites/` |
| 11 | Client preview portal | Step 9 | `src/app/preview/[token]/page.tsx` |
| 12 | Email notifications | Steps 10-11 | `src/lib/email/templates.ts` |

---

## Queued - Polish

| Task | Priority | Dependencies | Notes |
|------|----------|--------------|-------|
| Create /about page | Low | None | Footer link hidden until built |
| Create /contact page | Low | None | Footer link hidden until built |
| Create /privacy page | Low | None | Footer link hidden until built |
| Create /terms page | Low | None | Footer link hidden until built |
| Wire up email notifications | Medium | None | Templates exist, sends not called |
| Mobile responsive testing | Medium | None | 900px, 600px breakpoints |
| Acknowledgment component | Low | Questionnaire | Placeholder only |

---

## Blocked

| Task | Blocker | Owner |
|------|---------|-------|
| Vercel deployment (Website Builder step 9) | Need VERCEL_TOKEN | Liz |
| S3 uploads (Website Builder step 3) | Need AWS credentials | Liz |
| Stripe webhooks (prod) | Need STRIPE_WEBHOOK_SECRET | Liz |

---

## Recently Completed

| Task | Completed | Agent |
|------|-----------|-------|
| v2 Vertical Landing Pages (/for/fitness, etc.) | 2025-12-11 | Claude |
| Landing page CTAs updated to /start/time-audit | 2025-12-11 | Claude |
| v2 Time Audit Intake Flow (8 screens) | 2025-12-11 | Claude |
| v2 Diagnostic Results Page | 2025-12-11 | Claude |
| v2 Schema & Automation Catalogue | 2025-12-11 | Claude |
| Questionnaire rewrite - practical time/task audit | 2025-12-10 | Claude |
| Action-oriented prompts + QA validation | 2025-12-10 | Claude |
| Services page problem-first layout | 2025-12-10 | Claude |
| Admin authentication middleware | 2025-12-08 | Claude |
| Services page version choice (VersionA only) | 2025-12-08 | Claude |
| UX consistency sweep (buttons, shadows, tap targets) | 2025-12-08 | Claude |
| À la carte business model update | 2025-12-08 | Claude |
| Report Quality System v3 (presentation/validation) | 2025-12-04 | Claude |
| CLAUDE.md rewrite | 2025-12-04 | Claude |
| Report Quality System v2 | 2025-12-04 | Claude |
| Stripe checkout integration | 2025-12-04 | Claude |
| Email system with Resend | 2025-12-04 | Claude |
| PDF generation (Puppeteer route) | 2025-12-04 | Claude |
| LocalStorage persistence | 2025-12-04 | Claude |
| Services page cart system | 2025-12-04 | Claude |

---

## Ideas Bucket (Future)

| Idea | Description | Notes |
|------|-------------|-------|
| **Ikigai Finder → Reckoning Pipeline** | Pre-Reckoning flow for people who don't have a business idea yet. Smart/dynamic intake helps them discover what they could do, based on skills, interests, market demand. Validate the idea, then funnel into Reckoning Launch. | Target: Job market shifters moving to freelance/gig economy. Could be separate product or front-door to Reckoning. |

---

## How to Use This File

**Starting work:**
1. Check "In Progress" - avoid duplicating work
2. Move your task from "Queued" to "In Progress"
3. Add your session identifier

**Completing work:**
1. Move task to "Recently Completed"
2. Update `SESSION-LOG.md` with details
3. Add any new tasks discovered to "Queued"

**If blocked:**
1. Move to "Blocked" with clear blocker description
2. Note who can unblock it
