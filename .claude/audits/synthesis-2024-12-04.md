# Expert Synthesis: Psychology + Brand Voice — 4 December 2024

## Where They Agree

| Issue | Both say | Impact |
|-------|----------|--------|
| **Dual CTAs create friction** | Decision fatigue forces meta-decision before understanding | Critical |
| **Loading/error states generic** | Undermines trust and personality | Critical |
| **Final button misleading** | "Complete" doesn't match what user actually gets | High |
| **Resume prompt system-focused** | Should acknowledge user's effort, not just show data | High |

---

## Where They Disagree — And Who Wins

### BlockedUnlocked Arrows
- **Psychologist**: Make tapping unnecessary, show both states
- **Brand Voice**: Only on "unlocked" side for forward motion
- **Winner**: Brand voice. Less clutter, visual relief when something unlocks.

### Loading Screen Strategy
- **Psychologist**: Remove defensive language ("— Free")
- **Brand Voice**: Keep "Continue" throughout, change loading headline
- **Winner**: Both right but incomplete. Change loading headline AND remove defensive modifiers.

### Resume Prompt Length
- **Psychologist**: Give option to restart, not just continue
- **Brand Voice**: One line reminder, don't lecture
- **Winner**: Compromise. Keep two buttons but shorten context. Make "Continue" the obvious default.

---

## Combined Action List

### Phase 1 (Immediate)
1. Rename final button: "Complete" → "Show Me What I Got"
2. Shorten resume prompt to one-liner + time context below
3. Fix loading headlines: outcome-focused messages

### Phase 2 (Week 1)
4. Standardise CTAs to "Continue" (except restart)
5. Rewrite error messages: ownership language
6. Add "We save as you go" reassurance

### Phase 3 (Week 2)
7. Evaluate `/start/choose` flow — before or after questionnaire?
8. Pick ONE services page version

---

## The Insight Neither Fully Articulated

**The questionnaire is treated as a utility, not a ritual.**

Both spotted symptoms (dual CTAs, generic copy, cold resume prompt) but missed the structural truth: The questionnaire is the *first experience* of "fiercely in your corner" — but it's designed like a form.

**What should happen:**
- Make questionnaire conversational, not transactional
- Loading screen = confidence-building moment, not waiting state
- Resume choice = trust inflection. Make continuation the obvious default.

**The core problem:**
Users don't come because they love questionnaires. They come because they're stuck. Every interaction should reinforce: *We get it. We're solving this together.*

Right now the UX says: *Please fill out this form so our system can process you.*

---

## Files to Update

| File | What |
|------|------|
| `src/app/start/page.tsx` | Resume prompt, final button, loading message |
| `src/app/reckoning/[token]/GeneratingState.tsx` | Loading headline, progress messages |
| `src/app/start/QuestionCard.tsx` | Final button label |
| `src/app/start/choose/page.tsx` | Evaluate if this should exist |
| `src/components/landing/Hero.tsx` | Button hierarchy |
| `src/components/landing/Packages.tsx` | "Get started" → brand CTA |
