# Brand Voice Audit  -  4 December 2024

## Executive Summary

Strong baseline adherence to brand voice guidelines  -  the "Blocked by / Unlocked by" frame is consistent, the tone avoids jargon, and the warmth feels genuine. However, **critical voice breaks occur at high-friction moments** (error states, loading screens, CTAs) where the copy becomes either too clinical or too performative.

**Brand Voice Health Score: 7.5/10**

---

## Top 3 Voice/Tone Issues

### 1. Loading & Error States: Where the Brand Voice Disappears

**The Problem**: At the exact moments when users are anxious, the voice becomes generic tech-speak.

**Loading state** (`src/app/start/page.tsx`):
```
We're analysing your answers and creating your personalised report.
```
- "analysing" and "personalised report" = business-speak
- Missing warmth, no personality
- Sounds like every other SaaS tool

**Error state** (`src/app/start/page.tsx`):
```
We've noted what happened. You can try again, or we'll be in touch within 24 hours.
```
- Passive, bureaucratic
- Abandons the user at their moment of need

**Brand Voice Fix**:
```
Loading: "Building your Reckoning. This takes about 30 seconds. Worth the wait."
Error: "That didn't work. Let's try again  -  or we'll sort it out for you within 24 hours."
```

---

### 2. CTA Inconsistency Dilutes Brand Recognition

| Component | CTA Copy |
|-----------|----------|
| Hero | "Get Your Reckoning  -  Free" |
| HowItWorks | "Get Your Reckoning  -  Free" |
| BlockedUnlocked | "See what's blocking you" |
| FinalCTA | "Get Your Reckoning  -  Free" |
| Packages | "Get started" |

**Why this breaks voice**:
- "Get started" is generic startup-speak
- "See what's blocking you" introduces a third variant
- Solo founders notice inconsistency  -  reads as lack of polish

**Fix**: Use "Get Your Reckoning  -  Free" everywhere for primary CTA.

---

### 3. Resume Prompt: Technically Accurate But Emotionally Cold

**Current** (`src/app/start/page.tsx`):
```
You have progress saved
You were 4 of 12 questions through as a Builder.
```

**Why this breaks voice**:
- "You have progress saved" = passive, system-focused
- "You were X of Y questions through" = robotic phrasing

**Brand Voice Fix**:
```
Welcome back
You're 4 of 12 questions into your Reckoning as a Builder.
Let's finish what you started  -  takes about 5 more minutes.
```

---

## Off-Brand Copy (Specific Examples)

### "Get started"  -  Generic Startup-Speak
**Where**: Packages section
**Fix**: Replace with "Get Your Reckoning  -  Free"

### "Personalised report"  -  Jargon Alert
**Where**: Loading state
**Fix**: "Building your Reckoning. We're seeing what's in the way  -  and what unlocks it."

### "We've noted what happened"  -  Corporate HR Voice
**Where**: Error state
**Fix**: "That didn't work. Try again, or we'll sort it out and reach out within 24 hours."

---

## Missing Personality Opportunities

### 1. Progress Bar Label
Numeric progress = transactional (to-do list)
Stage-based labels = narrative (conversation)

**Implementation**:
- Stage 1: "Getting to know you"
- Stage 2: "What's in the way"
- Stage 3: "What you're building toward"

### 2. Loading Emoji
Current ⏱ emphasises time pressure  -  opposite of "Space to breathe"

**Better**: No emoji, just text. Or use ✨ (unlocking, not waiting)

### 3. Hero Secondary Button
Current subordinate styling implicitly judges users who skip the questionnaire.

**Fix**: Make both buttons equally prominent (both solid backgrounds):
- Primary: `bg-fuchsia text-white`
- Secondary: `bg-mint text-charcoal`

---

## Reframes: Where UX Fixes Might Damage Brand Voice

### "View My Reckoning →" is too passive
Keep "Continue →" throughout. Change loading screen headline to set expectations:
"You're done. We're building your Reckoning  -  30 seconds."

### Resume prompt: Don't over-explain
One line that reinforces the promise without repeating the pitch:
"Let's finish your Reckoning  -  finding what's blocking you and what unlocks it."

### BlockedUnlocked arrows
Only on "Unlocked by" side to reinforce forward motion, not transactional feel.

---

## Recommended Actions (Priority Order)

1. **Fix error/loading state copy** (Critical)
2. **Standardise CTAs** (High)
3. **Warm up resume prompt** (High)
4. **Implement stage-based progress labels** (Medium)
5. **Equalise Hero button hierarchy** (Medium)
6. **Replace "Get started" in Packages** (Low)

---

## File Locations for Copy Changes

| Issue | File | Lines |
|-------|------|-------|
| Loading state | `src/app/start/page.tsx` | 312-318 |
| Error state | `src/app/start/page.tsx` | 267-272 |
| Resume prompt | `src/app/start/page.tsx` | 113-119 |
| Packages CTA | `src/components/landing/Packages.tsx` | 99 |
| Hero buttons | `src/components/landing/Hero.tsx` | 34-46 |
| Progress bar | `src/app/start/ProgressBar.tsx` | 19 |
