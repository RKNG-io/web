# Agent E Review  -  Behavioural Psychology Audit

**Date:** 3 December 2024
**Reviewer:** Claude (as Agent E  -  Brand Guardian)
**Status:** ✅ Largely Approved | ⚠️ Minor Fixes Required

---

## Executive Summary

The codebase is **emotionally coherent** and **on-brand**. The copy correctly uses blocked/unlocked framing, permission-giving language, and respects the two-path model. The questionnaires feel like conversations, not forms.

**Minor issues found:** 6
**Critical issues found:** 0

---

## Review by Component

### 🟢 Landing Page Components  -  APPROVED

**Files reviewed:**
- `Hero.tsx`
- `PersonaCards.tsx`
- `HowItWorks.tsx`
- `Benefits.tsx`
- `BlockedUnlocked.tsx`
- `Packages.tsx`
- `FAQ.tsx`
- `FinalCTA.tsx`
- `Nav.tsx`
- `Footer.tsx`

**What's Working:**

✅ Hero uses exact brand tagline: "Unblock. Unlock. Unleash."
✅ Both CTA paths ("Get Your Reckoning" + "I know what I need") equally prominent
✅ Blocked/Unlocked table uses correct framing
✅ Benefits section uses approved outcomes (Time, Space, Presence, Systems, Clarity, Calm)
✅ FAQ answers are direct and permission-giving
✅ Packages section explicitly says "Both paths work"
✅ FinalCTA uses "Your time is now" correctly
✅ No banned phrases detected

**Issues Found:**

| Location | Issue | Severity | Fix |
|----------|-------|----------|-----|
| `Hero.tsx:27` | "drown in admin" is slightly dramatic | ⚠️ Minor | Keep  -  acceptable |
| `FAQ.tsx:29` | "We're here if you get stuck"  -  good | ✅ None |  -  |

**Verdict:** ✅ **APPROVED**  -  No changes required

---

### 🟢 Questionnaire Flow  -  APPROVED WITH NOTES

**Files reviewed:**
- `start/page.tsx`
- `data/persona-questions.ts`
- `start/QuestionCard.tsx`
- `start/ProgressBar.tsx`

**What's Working:**

✅ Opening screens are permission-giving ("This isn't a test. No wrong answers.")
✅ Question flow follows psychology spec: dream → reality → blockers
✅ Questions use human language ("What would your life look like...") not clinical ("Describe your goals")
✅ Options are phrased in their voice ("I've been thinking about this for years")
✅ Progress indicator is journey-based, not percentage-based
✅ One question per screen
✅ Back button always available

**Issues Found:**

| Location | Issue | Severity | Fix Required |
|----------|-------|----------|--------------|
| `persona-questions.ts:37` | Welcome screen says "This is your moment"  -  good | ✅ None |  -  |
| `persona-questions.ts:169` | "What's the fear underneath the fear?"  -  may feel intense for some | ⚠️ Minor | Consider softer subtext |
| `start/page.tsx:69` | Error alert is generic (`alert(error.message)`) | ⚠️ Minor | Replace with branded error state |

**Missing (per spec):**

⚠️ **Micro-acknowledgments not implemented**  -  The spec requires brief validation after certain answers:
- "Got it. We'll flag anything to check with your employer."
- "That's a lot to carry. Let's figure out what to tackle first."

**Verdict:** ✅ **APPROVED**  -  Micro-acknowledgments should be added but not blocking

---

### 🟢 Bypass Intakes  -  APPROVED

**Files reviewed:**
- `start/choose/page.tsx`
- `start/website/page.tsx`
- `start/automations/page.tsx`
- `start/social/page.tsx`

**What's Working:**

✅ Opening line matches spec: "Let's get the details so we can give you an accurate quote."
✅ Completion message matches spec: "Got it. We'll be in touch within 24 hours."
✅ Questions are scope-focused, not diagnostic
✅ Each flow is under 5 minutes
✅ Assumes competence (no "why do you think you need this?")
✅ "Not sure what you need?" links back to full Reckoning

**Issues Found:**

| Location | Issue | Severity | Fix |
|----------|-------|----------|-----|
| All intake pages | No email validation or error states | ⚠️ Minor | Add friendly error messages |

**Verdict:** ✅ **APPROVED**

---

### 🟢 Report Display  -  APPROVED

**Files reviewed:**
- `reckoning/[token]/page.tsx`
- `reckoning/[token]/ReportDisplay.tsx`
- `reckoning/[token]/GeneratingState.tsx`

**What's Working:**

✅ DIY and Supported paths presented side-by-side as equal options
✅ Section "Both paths work" language present
✅ Cost of inaction shows working (transparent, not fear-mongering)
✅ Closing message is encouraging
✅ Service recommendations framed as optional
✅ "Or take this report and run with it yourself"  -  perfect
✅ GeneratingState messages are human ("Analysing your answers", "Almost there")

**Issues Found:**

| Location | Issue | Severity | Fix |
|----------|-------|----------|-----|
| `ReportDisplay.tsx:89` | Section header says "The diagnosis" | ⚠️ Minor | Consider "What we see" to avoid clinical framing |
| `ReportDisplay.tsx:281` | CTA says "Get started with support" | ⚠️ Minor | Could also offer "Browse services" as lower-commitment option |

**Verdict:** ✅ **APPROVED**  -  Minor phrasing tweaks optional

---

### 🟢 Report Generation Prompts  -  APPROVED

**Files reviewed:**
- `lib/prompts/base.ts`
- `lib/validation/brand-voice.ts`

**What's Working:**

✅ Banned phrases list comprehensive
✅ Required tone markers enforced (permission-giving language)
✅ Blocked/unlocked framing explicitly required
✅ "Both paths work" framing required
✅ No fear-based selling allowed
✅ Maths validation prevents inflated claims
✅ Service recommendations validated against catalogue

**Issues Found:**

None. The prompt engineering is excellent.

**Verdict:** ✅ **APPROVED**

---

### 🟡 Error States  -  NEEDS IMPROVEMENT

**Files reviewed:**
- `reckoning/[token]/page.tsx` (failed state)
- `start/page.tsx` (submission error)

**What's Working:**

✅ Failed generation message is human: "We had trouble generating your report"
✅ Promise of manual follow-up: "within 24 hours"

**Issues Found:**

| Location | Issue | Severity | Fix Required |
|----------|-------|----------|--------------|
| `start/page.tsx:69` | Uses browser `alert()` for errors | ⚠️ Medium | Replace with branded error component |
| N/A | No offline/network error handling | ⚠️ Minor | Add friendly network error message |

**Recommended error copy:**

```
Something went wrong on our end.

We've noted what happened. You can try again,
or we'll be in touch within 24 hours.

[Try again] [Go back to home]
```

**Verdict:** ⚠️ **CHANGES REQUESTED**  -  Error states need branded styling

---

## Summary of Required Changes

### Must Fix (before launch):

1. **Replace browser `alert()` with branded error component** (`start/page.tsx:69`)

### Should Fix (recommended):

2. Add micro-acknowledgments after key questionnaire answers (per spec)
3. Add email validation with friendly error messages to bypass intakes
4. Consider changing "The diagnosis" to "What we see" in report

### Nice to Have (optional):

5. Soften subtext on "What's the fear underneath the fear?" question
6. Add lower-commitment CTA option on report ("Browse services" alongside "Get started")

---

## Emotional Arc Check

The overall emotional arc matches the spec:

| Stage | Expected | Actual | Status |
|-------|----------|--------|--------|
| **Before** | Stuck, overwhelmed, alone | Addressed in BlockedUnlocked, PersonaCards | ✅ |
| **During** | Seen, understood, possibilities | Questionnaire feels conversational | ✅ |
| **After** | Clear, capable, supported | Report gives options, not orders | ✅ |

---

## Red Flag Audit

Checked all copy for banned patterns:

| Pattern | Found? |
|---------|--------|
| "You should..." | ❌ Not found |
| "Most businesses fail..." | ❌ Not found |
| "Don't miss out..." | ❌ Not found |
| "Pain points" | ❌ Not found |
| "Leverage" / "Synergy" | ❌ Not found |
| Fear-based urgency | ❌ Not found |

✅ **PASSED**  -  No red flags detected

---

## Conclusion

The Reckoning codebase is **emotionally coherent** and ready for launch with one required fix (error states). The copy correctly implements:

- Permission-giving language
- Blocked/unlocked framing
- Equal treatment of DIY and supported paths
- Conversational, non-clinical tone
- Human voice in all user-facing copy

**Overall Status:** ✅ **APPROVED FOR LAUNCH** (with error state fix)

---

*Review completed by Agent E (Brand Guardian)*
*3 December 2024*
