# Architectural Decisions

Decisions made during development that all agents should follow.

---

## Database

| Decision | Rationale |
|----------|-----------|
| Use tokens (not IDs) in public URLs | Security - don't expose sequential IDs |
| JSONB for flexible content | Report sections, site configs vary in structure |
| Status columns as VARCHAR | Readable, easy to query, no enum migrations |
| Soft deletes where needed | Audit trail, recovery |

---

## API Design

| Decision | Rationale |
|----------|-----------|
| Token-based public routes | `/reckoning/[token]` not `/reckoning/[id]` |
| Lazy client initialization | Dev-friendly - works without all env vars |
| Return `{ success, error?, data? }` | Consistent error handling |
| Validate prices server-side | Never trust client-provided prices |

---

## UI/UX

| Decision | Rationale |
|----------|-----------|
| Outfit font only | Brand consistency |
| Brand colours only (see tailwind.config.ts) | No off-brand colours |
| No gradient backgrounds | Brand guidelines |
| No generic shadows | Brand guidelines |
| Mobile-first responsive | Most users on mobile |

---

## Generation Pipeline

| Decision | Rationale |
|----------|-----------|
| Confidence scoring (0-100) | Flag low-confidence for human review |
| Validation flags as JSONB array | Flexible, queryable |
| Admin review before client sees | Quality control |
| Store both original and edited content | Audit trail |

---

## Report Quality (v2)

| Decision | Rationale |
|----------|-----------|
| Specificity over generality | Every sentence must be specific to THIS person |
| Insight over echo | Don't repeat what they said, connect dots they haven't |
| Minimum 3 direct quotes | Forces personalisation, proves we read their answers |
| Business-type service matching | Meal prep ≠ client intake forms |
| Banned phrases list | Catches cheerleader language, generic advice |
| Severity-weighted deductions | Some issues worse than others |
| Auto-approve at 90%+ with ≤2 warnings | High-quality reports don't need review |
| Buying intent validation (Launcher) | Real money tests, not just "would you buy?" |
| Consistency validation | Calculation inputs must match questionnaire answers |
| Completion criteria per phase | Clear "Phase complete when:" for journey map |

**Validation layers:**
1. Schema validation (structure correct)
2. Input echo validation (quotes match original)
3. Brand voice validation (no banned phrases, permission-giving tone)
4. Specificity validation (catches generic content)
5. Business-type validation (services match business)
6. Numbers validation (budget/hours referenced)
7. Quoted phrases validation (3+ direct quotes verified)
8. Maths validation (calculations correct)
9. Buying intent validation (Launcher — requires deposit/pre-order tactics)
10. Consistency validation (hours/rate/budget match original answers)

---

## Email

| Decision | Rationale |
|----------|-----------|
| Resend for transactional | Simple API, good deliverability |
| Branded HTML templates | Consistent with site design |
| Dev mode logs instead of sending | No Resend account needed locally |

---

## Payments

| Decision | Rationale |
|----------|-----------|
| Stripe Checkout (not Elements) | Simpler, handles compliance |
| Server-side price validation | Prevent price manipulation |
| Dynamic coupon creation | Auto-create discount coupons as needed |
| Webhook for confirmation | Reliable payment confirmation |

---

## File Uploads (Planned)

| Decision | Rationale |
|----------|-----------|
| S3 with presigned URLs | Direct upload, no server bottleneck |
| Client uploads directly to S3 | Scalable, fast |
| Store URLs in DB, not files | DB stays small |

---

## Deployment (Planned)

| Decision | Rationale |
|----------|-----------|
| Vercel API for website previews | Automated deploys, preview URLs |
| Content via env vars at build | Simple, no runtime DB needed for client sites |
| Template repo separate from main app | Clean separation |
