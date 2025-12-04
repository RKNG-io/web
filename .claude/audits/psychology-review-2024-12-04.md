# Psychological Analysis of UX Audit — 4 December 2024

## Top 3 Issues That Matter Most Psychologically

### 1. The "Dual CTA" Problem — Decision Fatigue at the Threshold

**UX Audit Says**: Hero CTAs have visual hierarchy issues (one button feels subordinate).

**Psychology Says**: This is deeper than visual weight. You're asking an already-overwhelmed person to make a meta-decision *about how they want to make a decision*. "Do I want the diagnostic or do I already know?" is cognitive load they don't need at the moment of arrival.

**Cognitive Impact**:
- Forces premature commitment before they understand what either path offers
- Creates anxiety: "What if I pick wrong and waste time?"
- The secondary styling on "I know what I need" inadvertently signals "you should probably do the other thing" — undermining the "both paths are valid" principle

**Emotional Safety Risk**:
People who "know what they need" may actually be defending against looking too closely at their situation. Making that button feel subordinate reinforces shame ("I should do the proper diagnostic but I'm taking the shortcut").

**Reframe**: Don't ask them to choose paths at the hero. Let them discover which path feels right *after* you've connected with them. The hero should simply invite them in: "Find out what's actually blocking you" (single CTA). Then let the first interaction reveal which path they need.

---

### 2. Services Page Indecision — Trust Erosion Through Visible Uncertainty

**UX Audit Says**: Two versions exist with ?v=b toggle. Pick one and remove the other.

**Psychology Says**: This isn't just technical debt. The *existence* of the A/B toggle suggests you don't know what works. And if you don't know, how can they trust you to know what *they* need?

**Trust Signal Impact**:
- Query parameters visible in URL = "they're still figuring this out"
- Inconsistent discount structures between versions = unreliable pricing
- For someone already skeptical of "business guru solutions," this confirms their suspicion

**Hidden Risk**: Even if users never see ?v=b, the internal indecision bleeds through. Maintenance of two versions means neither gets full attention. The compromise position is the worst position psychologically — it signals lack of conviction.

**Reframe**: This isn't a UX decision. It's a *commitment* decision. Pick the version that best serves the "Permission Before Prescription" principle from the psychology brief. VersionB's structured service explorer likely wins because it *shows* rather than *tells*.

---

### 3. Progress Indicator — Numeric vs Journey-Based

**UX Audit Says**: Use stage labels ("Getting to know you") instead of percentage.

**Psychology Says**: This is the single highest-impact psychological fix in the entire audit.

**Why It Matters**:
- Percentage frames the questionnaire as a *task to complete* (external motivation)
- Journey labels frame it as a *conversation unfolding* (intrinsic motivation)
- "67% complete" triggers urgency and completion anxiety
- "What's in the way" creates curiosity and permission to slow down

**Cognitive Load Reduction**:
Percentages force constant recalculation: "I'm at 40%, that means 6 more minutes if each question is 1 minute..." Journey stages let them be *present* with the question.

---

## Hidden Psychological Risks the UX Audit Missed

### Risk 1: The "Complete" Button Betrayal

This isn't just misleading — it's a micro-betrayal. They've given you 15 minutes of vulnerable answers. The word "Complete" creates a *relief response*: "I did it." Then you take that away by showing *another* screen. The emotional whiplash creates doubt: "Did it actually work?"

**Why This Matters More Than It Seems**:
For someone who's already stuck and doubting themselves, clicking "Complete →" and then seeing "Preparing..." instead of results triggers the familiar pattern: "I did the thing but it didn't work."

### Risk 2: "Welcome Back" Screen Context Gap

The real risk isn't recognition — it's *re-commitment*. They left mid-questionnaire. That means something interrupted them OR they had second thoughts. The welcome back screen needs to give them a reason to continue that's stronger than the reason they stopped.

**Missing Element**:
Instead of "Welcome back, [name]" → Try: "Welcome back, [name]. You were telling us about [last meaningful answer]. Want to finish your Reckoning?"

### Risk 3: Services Page After Report

The transition from report to services is the highest-anxiety moment in the entire journey. They've just read truths about what's blocking them. Now you're asking them to spend money. The cognitive dissonance is: "They gave me this valuable thing for free... now they want money... was the report just a sales pitch?"

**Missing Safeguard**:
"Your Reckoning is yours to keep. These are services that could help — but only if you want them. Run with it yourself, or let us help."

### Risk 4: Broken Navigation Anchors

Broken anchors are *trust violations*, not just UX friction. If clicking "Services" doesn't take them to services, it confirms the subconscious fear: "Marketing sites lie."

---

## Reframes: Where Psychology Suggests a Different Approach

### BlockedUnlocked Interaction
**UX Audit Says**: Add arrow icon to make rows obviously tappable.
**Psychology Says**: Don't just make them *more* tappable — make them less *necessary* to tap. Show blocked/unlocked comparison at a glance. No content hiding.

### FAQ Estimated Read Time
**UX Audit Says**: Add estimated read time to FAQ items.
**Psychology Says**: No. Time-poor users see "3 min read" and think "I don't have 3 minutes." Then they feel guilty.

### Questionnaire Resume Flow
**UX Audit Says**: Add context to welcome back screen.
**Psychology Says**: Context yes, but *choice* more important. Give them the option to restart or continue.

---

## Quick Wins: Small Changes With Outsized Psychological Impact

### 1. Replace "Get Your Reckoning — Free" with "Get Your Reckoning"
**Why**: "Free" signals "we expect you to be suspicious of cost" which primes suspicion.

### 2. Change Questionnaire Final Button Copy
"Continue →" maintains consistency. Or go bold: "Show Me What I Got →"

### 3. Add Single Reassurance Line Before Questionnaire
"This takes about 12 minutes. We save as you go — you can pause anytime."

### 4. Remove Footer Links to Non-Existent Pages
An incomplete footer is *better* than broken links.

### 5. Make Services Page Discount Structure Visible Earlier
Showing it upfront feels generous. Surprising at checkout feels manipulative.

---

## Priority Psychological Fixes

1. **Replace numeric progress with journey stages**
2. **Pick ONE services page version and commit**
3. **Change final questionnaire button copy**
4. **Add "Both paths valid" language to services-from-report**
5. **Fix broken nav anchors**

These five fixes address the deepest psychological risks: lack of presence, visible indecision, false completion, conversion anxiety, and credibility gaps.
