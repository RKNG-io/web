# Reckoning — Report Quality Improvements

**Problem:** Generated reports are structurally complete but feel generic. They echo inputs rather than providing insight, use filler phrases, and recommendations don't always match business type.

**This document contains:**
1. Revised prompt templates (forcing specificity)
2. Additional validation rules (catching generic content)
3. Example "good" report (Sophie rewritten)

---

## Part 1: Revised Prompt Templates

### Base System Prompt

```markdown
# Reckoning Report Generator

You are generating a personalised business diagnostic report. Your job is to make the recipient feel **seen, understood, and clear on what to do next**.

## Core Principles

1. **Specificity over generality** — Every sentence should contain details only THIS person could have provided. If a sentence could apply to anyone, rewrite it or delete it.

2. **Insight over echo** — Don't just repeat what they told you. Connect dots they haven't connected. Show them something they didn't see.

3. **Their words, your structure** — Quote their exact phrases. Use their language. But organise it into actionable clarity.

4. **Warm, not cheerleader** — Be encouraging without being saccharine. "You've got this!" is banned. "Here's your first step — you're ready for it" is fine.

5. **Business-type awareness** — Recommendations must make sense for their specific business. A meal prep service needs ordering systems, not "client intake forms."

## What Makes a Bad Report

❌ "You've identified a clear target audience" — This is just echoing their input
❌ "Pricing can feel overwhelming at the start" — Generic, applies to everyone
❌ "Every successful business started as just an idea" — Motivational fluff
❌ "Research competitor pricing" — Obvious advice anyone could give
❌ Recommending services that don't match their business type

## What Makes a Good Report

✅ "You said you're targeting busy professionals who 'don't have time to cook but are sick of takeaway' — that's a sharp insight. It tells us exactly how to position your pricing."
✅ "Your £2,000 budget is tight but workable. Here's exactly how I'd allocate it..."
✅ "The blocker isn't really pricing — it's that you haven't tested whether anyone will pay. One conversation with a potential customer will tell you more than a week of research."
✅ Recommending: Menu/ordering system, payment processing, delivery zone planning

## Banned Phrases

Never use these — they trigger QA failure:

- "every successful business"
- "you've got this"
- "believe in yourself"  
- "take the first step"
- "can feel overwhelming"
- "at the start of your journey"
- "the key is to"
- "it's important to"
- "you've identified a clear..."
- "you have a good understanding of..."
- "you know what you want"
- "consider exploring"
- "think about"

## Required Elements

Every report MUST include:

1. **At least 3 direct quotes** from their answers (in quotation marks)
2. **At least 1 specific number** they provided (budget, hours, timeline)
3. **At least 1 insight** they didn't explicitly state (you connected the dots)
4. **Business-type-appropriate recommendations** (see taxonomy below)

## Business Type → Relevant Services

Match recommendations to their actual business:

| Business Type | Relevant Services | NOT Relevant |
|---------------|-------------------|--------------|
| Food/meal prep | Ordering system, payment, delivery logistics, food photography | Client intake form, booking system |
| Coaching/consulting | Booking system, client intake, payment, email sequences | E-commerce, inventory |
| Freelance creative | Portfolio website, project inquiry form, invoicing | Booking calendar, delivery logistics |
| E-commerce/products | Online store, payment, inventory, shipping | Booking system, client intake |
| Service business | Booking, invoicing, client management, reviews | E-commerce, inventory |

If their business type doesn't fit these categories, reason from first principles about what they actually need to operate.
```

---

### Launcher Persona Prompt (Revised)

```markdown
## Persona: Launcher

This person has an idea but hasn't started yet. They're often still employed, testing the waters, uncertain if this is real.

### What They Need to Hear

- Permission to start small
- Validation that their idea has potential (if it does)
- A brutally clear first step (not a 10-step plan)
- Honest assessment of what their budget can actually buy

### What They DON'T Need

- Generic "follow your dreams" encouragement
- A comprehensive business plan
- All the things that could go wrong
- Advice to "do more research" (they've been researching — they need to act)

### Tone

Direct but warm. Like a trusted friend who's been there saying: "Stop overthinking. Here's what you actually need to do this week."

### Launcher-Specific Insight Patterns

Look for these in their answers and call them out:

1. **Hidden clarity** — They often know more than they think. "You said your target is 'busy professionals who hate cooking' — that's not vague, that's specific. You know exactly who this is for."

2. **Budget reality** — Be honest about what their budget can/can't do. "£2,000 is enough to validate this idea and get your first 5 customers. It's not enough for a custom app or professional kitchen. That's fine — you don't need those yet."

3. **The real blocker** — Usually it's not what they say. "You said 'pricing' is your blocker, but you've got a budget and a target market. The real blocker is you haven't talked to a single potential customer yet."

4. **Permission to be scrappy** — "Your first version can be a Google Form and bank transfer. Ugly but functional beats beautiful but unlaunched."

### Opening Line Formula

[Name], [specific thing they said about their business/goal] — [reframe or insight].

❌ "Sophie, you're closer than you think." (generic)
✅ "Sophie, you've got a meal prep idea, £2,000, and a target market that 'hates cooking but is sick of takeaway.' That's more clarity than most people have after a year." (specific)

### Diagnosis Formula

The real blocker isn't [what they said]. It's [the underlying issue you've identified].

❌ "Pricing uncertainty can feel overwhelming."
✅ "You said pricing is your blocker — but you can't price something you haven't tested. The real blocker is you're trying to perfect the plan instead of running a tiny experiment."

### Next Step Formula

Must be completable in <1 week, with no budget required.

❌ "Research competitor pricing and service models."
✅ "Message 5 people who fit your target market. Ask: 'If I made fresh meal prep for £8/meal, delivered to your office, would you try it?' That's your pricing research."
```

---

### Builder Persona Prompt (Revised)

```markdown
## Persona: Builder

This person is running a business but doing everything themselves. They're busy but stuck — trading time for money with no leverage.

### What They Need to Hear

- Acknowledgment that they've built something real
- Identification of the ONE thing that's eating their time
- A system that gives time back (not more tasks)
- Permission to invest in efficiency

### What They DON'T Need

- Advice to "work smarter not harder" (they've heard it)
- A long list of improvements
- Guilt about not having systems already
- Suggestions that require hiring

### Tone

Peer-to-peer. Like a fellow business owner who's been through it saying: "I see what's happening. Here's the lever that'll actually move things."

### Builder-Specific Insight Patterns

1. **The hidden time sink** — Calculate it for them. "You mentioned chasing invoices takes 'a few hours a week.' At your rate, that's £X/year you're spending on admin you hate."

2. **The bottleneck they can't see** — "You said you're 'too busy to market.' But you're not too busy — you're spending 10 hours/week on things that could be automated. Free those hours first."

3. **The delegation blocker** — "You said 'it's easier to do it myself.' That's true today. But every hour you spend on £20/hour tasks is an hour you can't spend on £200/hour work."

4. **Quick wins** — Identify one automation that saves 3+ hours/week immediately.

### Recommendations Must Include

- At least one automation (not just "get organised")
- Time-back calculation (hours saved × hourly rate)
- Something they can implement without hiring
```

---

### Architect Persona Prompt (Revised)

```markdown
## Persona: Architect

This person has a successful business but has become the bottleneck. Revenue is good but they can't step away. Growth means more of their time, not less.

### What They Need to Hear

- Recognition of what they've built
- Honest assessment of where they're the constraint
- A path to owner-independence (not just efficiency)
- Permission to invest significantly in systems

### What They DON'T Need  

- Basic advice (they're past that)
- Suggestions to "hire help" without specifics
- Incremental improvements
- Anything that adds to their plate short-term

### Tone

Strategic advisor. Like a fractional COO saying: "Here's what I see in your operation, and here's the sequence to fix it."

### Architect-Specific Insight Patterns

1. **The owner-dependency audit** — "Three things currently require you: [X], [Y], [Z]. Only one of those actually needs your judgment. The other two are documentation and delegation problems."

2. **The revenue ceiling** — "You're at £X/year. To hit £Y, you need to remove yourself from [specific function]. That's not about working harder."

3. **The team leverage gap** — "You have people, but they're waiting on you for decisions that don't need you. That's a systems problem, not a people problem."

4. **The real asset** — "Your business's value isn't your revenue — it's whether it runs without you. Right now, you have a well-paying job, not a sellable asset."

### Recommendations Must Include

- Process documentation for at least one key function
- Decision-rights framework (what needs you vs. what doesn't)
- Delegation sequence with specific handoff points
```

---

## Part 2: Additional Validation Rules

Add these to `lib/validation/`:

### Specificity Validation

```typescript
// lib/validation/specificity.ts

const GENERIC_PHRASES = [
  // Motivational fluff
  "every successful business",
  "you've got this",
  "believe in yourself",
  "follow your dreams",
  "take the leap",
  "the journey begins",
  "your journey",
  "first step on your journey",
  
  // Filler advice
  "can feel overwhelming",
  "at the start",
  "it's important to",
  "the key is to",
  "consider exploring",
  "think about",
  "you might want to",
  "it would be beneficial",
  
  // Echo patterns (not insights)
  "you've identified a clear",
  "you have a good understanding",
  "you know what you want",
  "you mentioned that you",
  "as you said",
  "you told us that",
];

const FILLER_STRENGTHS = [
  "you've identified",
  "you have a clear",
  "you know your",
  "you understand",
  "you're aware",
  "you recognise",
];

const VAGUE_ADVICE = [
  "research competitor",
  "explore your options",
  "consider your target",
  "think about pricing",
  "develop a strategy",
  "create a plan",
  "build a presence",
  "establish yourself",
];

export function validateSpecificity(report: ReckoningReport): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const reportText = JSON.stringify(report.sections).toLowerCase();
  
  // Check for generic phrases
  let genericCount = 0;
  for (const phrase of GENERIC_PHRASES) {
    if (reportText.includes(phrase.toLowerCase())) {
      warnings.push(`Generic phrase: "${phrase}"`);
      genericCount++;
    }
  }
  
  // More than 3 generic phrases = hard fail
  if (genericCount > 3) {
    errors.push(`Too many generic phrases (${genericCount}). Report feels templated.`);
  }
  
  // Check strengths aren't just echoing
  const strengthsText = JSON.stringify(report.sections.snapshot.strengths).toLowerCase();
  for (const filler of FILLER_STRENGTHS) {
    if (strengthsText.includes(filler.toLowerCase())) {
      warnings.push(`Filler strength (echo, not insight): "${filler}"`);
    }
  }
  
  // Check advice isn't vague
  const adviceText = JSON.stringify(report.sections.journey_map).toLowerCase() +
                     JSON.stringify(report.sections.next_step).toLowerCase();
  for (const vague of VAGUE_ADVICE) {
    if (adviceText.includes(vague.toLowerCase())) {
      warnings.push(`Vague advice: "${vague}" — should be specific action`);
    }
  }
  
  return { 
    valid: errors.length === 0, 
    errors, 
    warnings 
  };
}
```

---

### Quoted Phrases Validation (Strengthened)

```typescript
// lib/validation/quoted-phrases.ts

export function validateQuotedPhrases(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const reportText = JSON.stringify(report.sections);
  
  // Count actual quotation marks (phrases in quotes)
  const quotedPhrases = reportText.match(/"[^"]{5,}"/g) || [];
  const singleQuotedPhrases = reportText.match(/'[^']{5,}'/g) || [];
  const allQuoted = [...quotedPhrases, ...singleQuotedPhrases];
  
  // Must have at least 3 quoted phrases
  if (allQuoted.length < 3) {
    errors.push(
      `Only ${allQuoted.length} quoted phrases found. ` +
      `Must include at least 3 direct quotes from their answers.`
    );
  }
  
  // Verify quoted phrases exist in original answers
  const allAnswerText = Object.values(submission.answers)
    .filter(v => typeof v === 'string')
    .join(' ')
    .toLowerCase();
  
  let verifiedQuotes = 0;
  for (const quoted of allQuoted) {
    const cleanQuote = quoted.replace(/['"]/g, '').toLowerCase().trim();
    if (cleanQuote.length > 5 && allAnswerText.includes(cleanQuote)) {
      verifiedQuotes++;
    }
  }
  
  if (verifiedQuotes < 2) {
    warnings.push(
      `Only ${verifiedQuotes} quoted phrases verified in original answers. ` +
      `Quotes may be paraphrased or fabricated.`
    );
  }
  
  return { valid: errors.length === 0, errors, warnings };
}
```

---

### Business Type Matching Validation

```typescript
// lib/validation/business-type.ts

interface BusinessTypeServices {
  relevant: string[];
  irrelevant: string[];
}

const BUSINESS_TYPE_MAP: Record<string, BusinessTypeServices> = {
  'food': {
    relevant: ['ordering-system', 'payment-setup', 'delivery-logistics', 'menu-design', 'food-photography', 'website'],
    irrelevant: ['client-intake-form', 'booking-system', 'course-platform', 'membership-site']
  },
  'meal prep': {
    relevant: ['ordering-system', 'payment-setup', 'delivery-logistics', 'menu-design', 'food-photography', 'website'],
    irrelevant: ['client-intake-form', 'booking-system', 'course-platform', 'membership-site']
  },
  'coaching': {
    relevant: ['booking-system', 'client-intake-form', 'payment-setup', 'email-sequences', 'website', 'calendar-integration'],
    irrelevant: ['ordering-system', 'delivery-logistics', 'inventory-management', 'e-commerce']
  },
  'consulting': {
    relevant: ['booking-system', 'client-intake-form', 'payment-setup', 'proposal-templates', 'invoicing', 'website'],
    irrelevant: ['ordering-system', 'delivery-logistics', 'inventory-management', 'e-commerce']
  },
  'freelance': {
    relevant: ['portfolio-website', 'project-inquiry-form', 'invoicing', 'contract-templates', 'payment-setup'],
    irrelevant: ['booking-calendar', 'delivery-logistics', 'membership-site', 'course-platform']
  },
  'e-commerce': {
    relevant: ['online-store', 'payment-setup', 'inventory-management', 'shipping-integration', 'product-photography'],
    irrelevant: ['booking-system', 'client-intake-form', 'calendar-integration']
  },
  'service': {
    relevant: ['booking-system', 'invoicing', 'client-management', 'review-collection', 'website'],
    irrelevant: ['e-commerce', 'inventory-management', 'shipping-integration']
  },
  'therapy': {
    relevant: ['booking-system', 'client-intake-form', 'secure-payment', 'calendar-integration', 'website'],
    irrelevant: ['e-commerce', 'delivery-logistics', 'inventory-management']
  },
};

export function validateBusinessTypeMatch(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Determine business type from answers
  const businessType = submission.answers.business_type?.toLowerCase() || 
                       submission.answers.what_are_you_building?.toLowerCase() ||
                       report.recipient.business_type?.toLowerCase() || '';
  
  // Find matching category
  let matchedCategory: BusinessTypeServices | null = null;
  for (const [key, value] of Object.entries(BUSINESS_TYPE_MAP)) {
    if (businessType.includes(key)) {
      matchedCategory = value;
      break;
    }
  }
  
  if (!matchedCategory) {
    // Can't validate — business type not recognised
    warnings.push(`Business type "${businessType}" not in taxonomy. Manual review recommended.`);
    return { valid: true, errors, warnings };
  }
  
  // Check recommended services
  for (const rec of report.recommendations.services) {
    const serviceId = rec.service_id.toLowerCase();
    
    // Check if service is irrelevant for this business type
    const isIrrelevant = matchedCategory.irrelevant.some(s => 
      serviceId.includes(s) || s.includes(serviceId)
    );
    
    if (isIrrelevant) {
      errors.push(
        `Service "${rec.service_name}" (${rec.service_id}) is not relevant for ` +
        `business type "${businessType}". This looks like a mismatch.`
      );
    }
  }
  
  // Check if any highly relevant services are missing
  const recommendedIds = report.recommendations.services.map(s => s.service_id.toLowerCase());
  const missingEssentials = matchedCategory.relevant.slice(0, 3).filter(essential =>
    !recommendedIds.some(rec => rec.includes(essential) || essential.includes(rec))
  );
  
  if (missingEssentials.length > 0) {
    warnings.push(
      `Potentially missing essential services for "${businessType}": ${missingEssentials.join(', ')}`
    );
  }
  
  return { valid: errors.length === 0, errors, warnings };
}
```

---

### Numbers Check Validation

```typescript
// lib/validation/numbers.ts

export function validateNumbersUsed(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const warnings: string[] = [];
  
  const reportText = JSON.stringify(report.sections);
  
  // Extract numbers from submission
  const answerNumbers: number[] = [];
  for (const value of Object.values(submission.answers)) {
    if (typeof value === 'number') {
      answerNumbers.push(value);
    }
    if (typeof value === 'string') {
      const matches = value.match(/\d+/g);
      if (matches) {
        answerNumbers.push(...matches.map(Number));
      }
    }
  }
  
  // Check if at least one of their numbers appears in report
  const significantNumbers = answerNumbers.filter(n => n > 10); // Ignore trivial numbers
  let numbersUsed = 0;
  
  for (const num of significantNumbers) {
    if (reportText.includes(num.toString())) {
      numbersUsed++;
    }
  }
  
  if (numbersUsed === 0 && significantNumbers.length > 0) {
    warnings.push(
      `Report doesn't use any of their specific numbers (${significantNumbers.join(', ')}). ` +
      `Should reference their budget, timeline, or hours.`
    );
  }
  
  return { valid: true, errors: [], warnings };
}
```

---

### Updated Confidence Scorer

```typescript
// lib/validation/confidence.ts (updated)

import { validateSchema } from './schema';
import { validateInputEcho } from './input-echo';
import { validateBrandVoice } from './brand-voice';
import { validateCalculations } from './maths';
import { validateServices } from './services';
import { validateSpecificity } from './specificity';
import { validateQuotedPhrases } from './quoted-phrases';
import { validateBusinessTypeMatch } from './business-type';
import { validateNumbersUsed } from './numbers';

export function calculateConfidence(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ConfidenceResult {
  
  const results = {
    schema: validateSchema(report),
    inputEcho: validateInputEcho(report, submission),
    brandVoice: validateBrandVoice(report),
    maths: validateCalculations(report),
    services: validateServices(report),
    specificity: validateSpecificity(report),
    quotedPhrases: validateQuotedPhrases(report, submission),
    businessTypeMatch: validateBusinessTypeMatch(report, submission),
    numbersUsed: validateNumbersUsed(report, submission),
  };
  
  // Hard failures = 0 confidence
  const hardFailures = [
    ...results.schema.errors,
    ...results.inputEcho.errors,
    ...results.maths.errors,
    ...results.services.errors,
    ...results.specificity.errors,
    ...results.quotedPhrases.errors,
    ...results.businessTypeMatch.errors,
  ];
  
  if (hardFailures.length > 0) {
    return {
      score: 0,
      autoApprove: false,
      flags: hardFailures,
      validationResults: results,
    };
  }
  
  // Start at 100, deduct for warnings
  let score = 100;
  const flags: string[] = [];
  
  // Collect all warnings
  const allWarnings = [
    ...results.inputEcho.warnings,
    ...results.brandVoice.warnings,
    ...results.services.warnings,
    ...results.specificity.warnings,
    ...results.quotedPhrases.warnings,
    ...results.businessTypeMatch.warnings,
    ...results.numbersUsed.warnings,
  ];
  
  // Deduct points per warning type
  for (const warning of allWarnings) {
    if (warning.includes('Generic phrase')) {
      score -= 3;
    } else if (warning.includes('Filler strength')) {
      score -= 5;
    } else if (warning.includes('Vague advice')) {
      score -= 5;
    } else if (warning.includes('not relevant for business type')) {
      score -= 10;
    } else if (warning.includes('quoted phrases')) {
      score -= 8;
    } else {
      score -= 3;
    }
    flags.push(warning);
  }
  
  // Floor at 0
  score = Math.max(score, 0);
  
  // Bonus points for good signals
  if (results.quotedPhrases.errors.length === 0 && 
      !allWarnings.some(w => w.includes('quoted'))) {
    score += 5;  // Good use of their words
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  return {
    score,
    autoApprove: score >= 90 && allWarnings.length <= 2,
    flags,
    validationResults: results,
  };
}
```

---

## Part 3: Example "Good" Report (Sophie Rewritten)

### Original (Generated — Grade C+)

> Sophie, you're closer than you think.
> 
> You came here with an idea — a meal prep delivery service for busy professionals — and a question: is this real? Can I actually do this? The answer is yes.

### Rewritten (What Good Looks Like — Grade A)

---

# Sophie's Reckoning

## Sophie, you've got more clarity than you realise.

You're building a meal prep delivery service for busy professionals — people who, in your words, "don't have time to cook but are sick of takeaway." That's not a vague idea. That's a specific problem you understand personally.

You've got £2,000 to start. That's not a lot — but it's enough to test whether this works before you invest more.

---

## WHERE YOU ARE

**Stage:** Pre-launch — idea validated in your head, not yet in the market

### What's actually strong

- **You know your customer.** "Busy professionals sick of takeaway" isn't everyone — it's a specific person with a specific frustration. That clarity is worth more than you think.
- **You've set a budget.** £2,000 is a real constraint, and constraints force good decisions. You won't over-engineer this.
- **You're asking the right question.** "Is this real?" is smarter than "How do I build an empire?" You're thinking like someone who wants to validate, not fantasise.

### What's actually blocking you

- **You haven't talked to a single potential customer yet.** You mentioned "pricing and logistics" as your blockers — but you can't price something people haven't said they'd buy.
- **You're trying to figure it all out before starting.** The perfect menu, the perfect pricing, the perfect delivery radius. None of that matters until someone pays you.

---

## THE DIAGNOSIS

### The real blocker isn't pricing. It's that you haven't tested demand.

You said your blockers are "pricing and logistics." But here's what I notice: you have a target market, a budget, and a clear idea. What you don't have is a single data point from an actual customer.

Pricing research won't tell you if people will pay. A conversation will.

**If nothing changes:**

You'll spend the next 3 months refining a plan for a business you haven't validated. You'll burn through your £2,000 on a website and branding before you know if anyone wants this.

**The cost of waiting:**

You estimated spending 5 hours/week thinking about this business. At £30/hour (your current rate), that's:

**5 hours × £30 × 48 weeks = £7,200/year in opportunity cost**

That's time you could spend actually testing — or time you could have back if you decide this isn't for you.

---

## THE PATH FORWARD

### Phase 1: Validate (This week, £0)

**Goal:** Find out if real people will pay for this.

| Task | How | DIY or Support |
|------|-----|----------------|
| Message 10 people who fit your target | LinkedIn, WhatsApp, email — anyone who's "busy and sick of takeaway" | DIY |
| Ask one question | "If I made fresh meal prep for around £8/meal delivered to your office, would you try it for a week?" | DIY |
| Get 3 people to say "yes, I'd pay for that" | Verbal commitment, not just "sounds cool" | DIY |

**Why this first:** You can't price what you haven't sold. One conversation teaches more than a week of research.

---

### Phase 2: First Sale (Week 2-3, £100-200)

**Goal:** Take money from a real customer.

| Task | How | DIY or Support |
|------|-----|----------------|
| Create a simple menu | 3-5 options, PDF or Google Doc | DIY |
| Set up payment | Stripe link, bank transfer, or even cash | Payment Setup (£99) |
| Deliver to your first 3 customers | Cook, package, deliver yourself | DIY |

**Why this matters:** You don't need a website. You don't need a logo. You need proof that someone will pay. Everything else comes after.

---

### Phase 3: Systemise (Week 4-6, £500-800)

**Goal:** Make repeat orders easy.

| Task | How | DIY or Support |
|------|-----|----------------|
| Simple ordering page | Google Form, Typeform, or basic website | Website Setup (£199) |
| Delivery zone map | Define where you'll deliver, at what cost | DIY |
| Repeatable meal schedule | Set menu, set days, predictable prep | DIY |

---

## YOUR NEXT STEP

### If you do one thing this week:

**Message 5 people who fit "busy professional, sick of takeaway" and ask if they'd pay £8/meal for fresh meal prep delivered.**

**Why this?** You said pricing is your blocker — but you don't need a spreadsheet, you need a conversation. If 3 out of 5 say yes, you have a business. If 0 say yes, you've saved £2,000 and 6 months.

**How to start:** Open your phone. Find 5 people — colleagues, friends, LinkedIn connections — who work long hours and complain about food. Send them a message today.

---

### Two paths from here

**Run with it yourself:**

You can do Phase 1 and 2 with zero spend. Validate first, then invest.

- First step: Send those 5 messages today
- Resources: Your existing network, a Google Doc menu, a bank transfer

**Get support:**

If you validate demand and want help systemising, these are the services that actually matter for a meal prep business:

| Service | Why | Price |
|---------|-----|-------|
| **Payment Setup** | Take orders without chasing cash | From £99 |
| **Simple Website** | Ordering page with your menu | From £199 |
| **Delivery Logistics Planning** | Zone mapping, pricing by distance | From £149 |

*Not recommended for you right now: Client intake forms, booking calendars, complex automations — those are for different business types.*

---

## CLOSING

Sophie, you don't need more research. You need one conversation with someone who might pay you.

Your £2,000 is safe in your pocket until you know this works. Spend an hour this week talking to potential customers. That's the only thing that matters right now.

---

*This report was generated on 4 December 2025*  
*Questions? hello@rkng.com*

---

## Comparison: What Changed

| Element | Original | Rewritten |
|---------|----------|-----------|
| **Opening** | "You're closer than you think" (generic) | Uses her exact words: "sick of takeaway" |
| **Strengths** | "You've identified a clear target audience" (echo) | "You know your customer... that clarity is worth more than you think" (insight) |
| **Diagnosis** | "Pricing uncertainty can feel overwhelming" (generic) | "The real blocker isn't pricing. It's that you haven't tested demand." (insight) |
| **First step** | "Research competitor pricing" (vague) | "Message 5 people and ask if they'd pay" (specific, actionable) |
| **Recommendations** | Payment, Domain, Client Intake Form (wrong for business type) | Payment, Website, Delivery Logistics (matches meal prep) |
| **Closing** | "You've got this!" (cheerleader) | "You don't need more research. You need one conversation." (direct) |
| **Quoted phrases** | 0 | 3+ ("sick of takeaway", "pricing and logistics", "busy professionals") |
| **Specific numbers** | Just the calculation | £2,000 budget, £8/meal, 5 people, 3 yeses |

---

## Summary

| Document | Purpose |
|----------|---------|
| **Revised prompts** | Force specificity, ban generic phrases, require quotes and numbers |
| **New validation rules** | Catch generic content, verify quotes, check business type match |
| **Example report** | Shows what "good" looks like — specific, insightful, actionable |

Add these to `docs/` and the `lib/validation/` folder. Update Claude CLI to regenerate Sophie's report as a test.

---

*This is the quality bar. Every report should feel like the rewritten version.*
