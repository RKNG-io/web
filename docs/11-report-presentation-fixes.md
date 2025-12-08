# Reckoning — Report Presentation & Validation Fixes

**Issues addressed:**
1. PDF file naming (ugly tokens → human-readable)
2. Checklist feel (prose → scannable, printable checkboxes)
3. Validation tactics (stated intent → buying intent)
4. Consistency checks (calculation inputs must match questionnaire answers)

---

## 1. PDF File Naming

### Current (Bad)
```
reckoning-rk_dgscf.pdf
```

### Target
```
Sophie-Reckoning-2025-12-04.pdf
```

### Implementation

```typescript
// lib/pdf/filename.ts

export function generatePDFFilename(
  recipientName: string,
  generatedAt: Date
): string {
  // Clean the name: remove special chars, titlecase, replace spaces with hyphens
  const cleanName = recipientName
    .trim()
    .replace(/[^a-zA-Z\s]/g, '')  // Remove non-alpha chars
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
  
  // Format date as YYYY-MM-DD
  const dateStr = generatedAt.toISOString().split('T')[0];
  
  return `${cleanName}-Reckoning-${dateStr}.pdf`;
}

// Examples:
// "sophie" → "Sophie-Reckoning-2025-12-04.pdf"
// "Sophie Final" → "Sophie-Final-Reckoning-2025-12-04.pdf"
// "JOHN SMITH" → "John-Smith-Reckoning-2025-12-04.pdf"
// "test123" → "Test-Reckoning-2025-12-04.pdf"
```

### Email Subject Line (Matching)

```typescript
// lib/email/send.ts

export function getEmailSubject(recipientName: string): string {
  const firstName = recipientName.split(' ')[0];
  return `${firstName}, your Reckoning is ready`;
}

// "Sophie Final" → "Sophie, your Reckoning is ready"
```

---

## 2. PDF Template with Checklist Styling

### Design Principles

1. **Scannable** — Headings, whitespace, visual hierarchy
2. **Printable** — Checkboxes they can tick with a pen
3. **Pin-to-wall worthy** — The journey map should be something they reference daily
4. **Branded** — Uses Reckoning colours, Outfit font

### Page Structure

```
Page 1: Opening + Where You Are
Page 2: The Diagnosis  
Page 3: The Path Forward (CHECKLIST FORMAT)
Page 4: Your Next Step + DIY Path
Page 5: Recommended Services + Closing
```

### Journey Map Checklist Styling

**Current (Prose-heavy):**
```
1 Demand Validation
2-3 weeks
Prove people will pay before building anything

must Survey 20 people in your target market about pricing and preferences
must Create simple landing page describing your service  
should Test different price points with potential customers
```

**Target (Scannable Checklist):**

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Demand Validation                          Weeks 1-3  │
│  ───────────────────────────────────────────────────────────── │
│  Prove people will pay before building anything                 │
│                                                                 │
│  □ Survey 20 people in your target market          ●  MUST     │
│  □ Create simple landing page                      ●  MUST     │
│  □ Test 2-3 different price points                 ○  SHOULD   │
│  □ Get 3 people to put down a £1 deposit          ○  SHOULD   │
│                                                                 │
│  ✓ Phase complete when: 3+ people have paid a deposit          │
└─────────────────────────────────────────────────────────────────┘
```

### Priority Indicators

| Priority | Symbol | Colour | Meaning |
|----------|--------|--------|---------|
| MUST | ● | Fuchsia (#D14BA8) | Do this or phase isn't complete |
| SHOULD | ○ | Charcoal (#2d2926) | Do this if you can |
| COULD | ◦ | Stone (#888) | Nice to have |

### PDF Template (React-PDF or Similar)

```typescript
// lib/pdf/templates/checklist-phase.tsx

interface Task {
  task: string;
  priority: 'must' | 'should' | 'could';
  completed?: boolean;
}

interface Phase {
  number: number;
  title: string;
  duration: string;
  description: string;
  tasks: Task[];
  completionCriteria: string;
}

const priorityStyles = {
  must: { color: '#D14BA8', symbol: '●', label: 'MUST' },
  should: { color: '#2d2926', symbol: '○', label: 'SHOULD' },
  could: { color: '#888888', symbol: '◦', label: 'COULD' },
};

export function PhaseChecklist({ phase }: { phase: Phase }) {
  return (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseNumber}>PHASE {phase.number}</Text>
        <Text style={styles.phaseTitle}>{phase.title}</Text>
        <Text style={styles.phaseDuration}>{phase.duration}</Text>
      </View>
      
      {/* Description */}
      <Text style={styles.phaseDescription}>{phase.description}</Text>
      
      {/* Tasks */}
      <View style={styles.taskList}>
        {phase.tasks.map((task, i) => (
          <View key={i} style={styles.taskRow}>
            {/* Checkbox */}
            <View style={styles.checkbox} />
            
            {/* Task text */}
            <Text style={styles.taskText}>{task.task}</Text>
            
            {/* Priority badge */}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyles[task.priority].color + '20' }]}>
              <Text style={[styles.prioritySymbol, { color: priorityStyles[task.priority].color }]}>
                {priorityStyles[task.priority].symbol}
              </Text>
              <Text style={[styles.priorityLabel, { color: priorityStyles[task.priority].color }]}>
                {priorityStyles[task.priority].label}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* Completion criteria */}
      <View style={styles.completionCriteria}>
        <Text style={styles.completionIcon}>✓</Text>
        <Text style={styles.completionText}>
          Phase complete when: {phase.completionCriteria}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phaseContainer: {
    backgroundColor: '#F2F6F9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7E9',
    paddingBottom: 8,
  },
  phaseNumber: {
    fontFamily: 'Outfit',
    fontWeight: 600,
    fontSize: 10,
    color: '#D14BA8',
    letterSpacing: 1,
    marginRight: 8,
  },
  phaseTitle: {
    fontFamily: 'Outfit',
    fontWeight: 600,
    fontSize: 16,
    color: '#2d2926',
    flex: 1,
  },
  phaseDuration: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#888',
  },
  phaseDescription: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#555',
    marginBottom: 16,
  },
  taskList: {
    marginBottom: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#2d2926',
    borderRadius: 3,
    marginRight: 12,
  },
  taskText: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#2d2926',
    flex: 1,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prioritySymbol: {
    fontSize: 8,
    marginRight: 4,
  },
  priorityLabel: {
    fontFamily: 'Outfit',
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  completionCriteria: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7E9',
  },
  completionIcon: {
    color: '#2A7F78',
    fontSize: 12,
    marginRight: 8,
  },
  completionText: {
    fontFamily: 'Outfit',
    fontSize: 11,
    color: '#555',
    fontStyle: 'italic',
  },
});
```

### Full Page Layout

```typescript
// lib/pdf/templates/journey-page.tsx

export function JourneyMapPage({ phases }: { phases: Phase[] }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.sectionLabel}>THE PATH FORWARD</Text>
        <Text style={styles.pageNumber}>3 of 5</Text>
      </View>
      
      {/* Intro text */}
      <Text style={styles.introText}>
        Your path is validate first, build second. Each phase has clear tasks — 
        tick them off as you go. Print this page and pin it somewhere visible.
      </Text>
      
      {/* Phases */}
      {phases.map((phase, i) => (
        <PhaseChecklist key={i} phase={phase} />
      ))}
      
      {/* Footer */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerLogo}>Reckoning</Text>
      </View>
    </Page>
  );
}
```

---

## 3. Validation Tactics (Buying Intent vs Stated Intent)

### Add to Launcher Prompt

```markdown
## Validation Tactics

When suggesting validation steps, always push for BUYING INTENT, not just stated interest.

### The Problem

"Would you buy this?" → Everyone says yes
"Here's my credit card" → Real customers only

People are polite. They'll say "sounds great!" to avoid awkwardness. That's not validation — it's social courtesy.

### Tactics to Suggest (Pick 1-2)

**1. Micro-deposit**
> "Ask for a £1 deposit to 'reserve a spot in the first batch.' Anyone who pays £1 is a real lead. Anyone who says 'sounds great!' but won't pay £1 was never going to buy."

**2. A/B Landing Pages**
> "Create two landing pages with different prices (e.g., £10/meal vs £14/meal). Run £20 of Facebook ads to your target area. See which gets more clicks. That's pricing data — not opinions."

**3. Pre-order**
> "Offer 20% off for anyone who pre-orders before you launch. Real customers will commit. Wishful supporters won't."

**4. Waitlist with Friction**
> "Create a waitlist that asks for a credit card (not charged yet). Anyone willing to enter their card details is serious."

**5. The 'Pay Now, Deliver Later' Test**
> "Offer: 'Pay today, first delivery in 2 weeks.' If they won't wait 2 weeks, they weren't urgent enough to be your first customer."

### How to Work Into the Report

In the "Next Step" section, after the basic ask (talk to 10 people), add:

> "Even better: ask for a small commitment. 'If you're interested, I'm taking £5 deposits to reserve spots in my first batch — fully refundable if you change your mind.' Anyone who pays is your real first customer. Anyone who hesitates was never going to buy anyway."

### Prompt Instruction

Always include at least one "real money" validation step in the Launcher journey map. Conversations are step 1. Money changing hands is the real validation.
```

### Updated Next Step Schema

```typescript
interface NextStepSection {
  headline: string;
  the_one_thing: {
    action: string;
    why_this: string;
    how_to_start: string;
  };
  buying_intent_test: {          // NEW
    tactic: string;              // e.g., "micro-deposit", "ab-test", "pre-order"
    script: string;              // Exact words to use
    success_metric: string;      // e.g., "3+ people pay the deposit"
  };
  diy_path: {
    description: string;
    first_step: string;
    resources: string[];
  };
  supported_path: {
    description: string;
    recommended_service: string;
    service_id: string;
    price_from: number;
  };
}
```

### Validation Rule

```typescript
// lib/validation/buying-intent.ts

const BUYING_INTENT_SIGNALS = [
  'deposit',
  'pre-order',
  'pay now',
  'credit card',
  'payment',
  'commit',
  'reserve',
  'waitlist',
  'a/b test',
  'landing page',
];

const WEAK_VALIDATION_SIGNALS = [
  'would you buy',
  'would you be interested',
  'what do you think',
  'does this sound good',
  'let me know if',
];

export function validateBuyingIntent(report: ReckoningReport): ValidationResult {
  const warnings: string[] = [];
  
  // Only applies to Launchers
  if (report.meta.persona !== 'launcher') {
    return { valid: true, errors: [], warnings: [] };
  }
  
  const nextStepText = JSON.stringify(report.sections.next_step).toLowerCase();
  const journeyText = JSON.stringify(report.sections.journey_map).toLowerCase();
  const allValidationText = nextStepText + journeyText;
  
  // Check for buying intent signals
  const hasBuyingIntent = BUYING_INTENT_SIGNALS.some(signal => 
    allValidationText.includes(signal)
  );
  
  // Check for weak validation only
  const hasWeakValidation = WEAK_VALIDATION_SIGNALS.some(signal =>
    allValidationText.includes(signal)
  );
  
  if (!hasBuyingIntent) {
    warnings.push(
      'No buying intent validation suggested. ' +
      'Launcher reports should include at least one "real money" test ' +
      '(deposit, pre-order, A/B landing page, etc.)'
    );
  }
  
  if (hasWeakValidation && !hasBuyingIntent) {
    warnings.push(
      'Only weak validation suggested ("would you buy", etc.). ' +
      'Add a buying intent test — stated interest ≠ real demand.'
    );
  }
  
  return { valid: true, errors: [], warnings };
}
```

---

## 4. Consistency Validation (Calculation Inputs Match Answers)

### The Problem

Report says: `5 hours/week × £50/hour × 52 weeks = £13,000`
Questionnaire says: `20 hours/week available`

These should match — or the discrepancy should be explained.

### Validation Rule

```typescript
// lib/validation/consistency.ts

interface ExtractedNumbers {
  hoursPerWeek: number | null;
  hourlyRate: number | null;
  budget: number | null;
  weeksPerYear: number | null;
  teamSize: number | null;
}

export function extractNumbersFromAnswers(
  answers: Record<string, unknown>
): ExtractedNumbers {
  const result: ExtractedNumbers = {
    hoursPerWeek: null,
    hourlyRate: null,
    budget: null,
    weeksPerYear: null,
    teamSize: null,
  };
  
  // Common field names for hours
  const hoursFields = ['hours_per_week', 'weekly_hours', 'time_available', 'hours_available'];
  for (const field of hoursFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.hoursPerWeek = parseInt(match[1]);
    }
  }
  
  // Common field names for rate
  const rateFields = ['hourly_rate', 'rate', 'charge_rate', 'value_per_hour'];
  for (const field of rateFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.hourlyRate = parseInt(match[1]);
    }
  }
  
  // Common field names for budget
  const budgetFields = ['budget', 'investment', 'starting_budget', 'available_budget'];
  for (const field of budgetFields) {
    if (answers[field]) {
      const match = String(answers[field]).match(/(\d+)/);
      if (match) result.budget = parseInt(match[1]);
    }
  }
  
  // Fallback: scan all string answers for patterns
  const allText = Object.values(answers)
    .filter(v => typeof v === 'string')
    .join(' ');
  
  // "20 hours per week" or "20 hours/week"
  const hoursMatch = allText.match(/(\d+)\s*hours?\s*(per|\/|a)\s*week/i);
  if (hoursMatch && !result.hoursPerWeek) {
    result.hoursPerWeek = parseInt(hoursMatch[1]);
  }
  
  // "£50/hour" or "£50 per hour"
  const rateMatch = allText.match(/£(\d+)\s*(per|\/|an)\s*hour/i);
  if (rateMatch && !result.hourlyRate) {
    result.hourlyRate = parseInt(rateMatch[1]);
  }
  
  // "£2,000 budget" or "budget of £2000"
  const budgetMatch = allText.match(/£([\d,]+)\s*budget|budget\s*(?:of\s*)?£([\d,]+)/i);
  if (budgetMatch && !result.budget) {
    const value = (budgetMatch[1] || budgetMatch[2]).replace(/,/g, '');
    result.budget = parseInt(value);
  }
  
  return result;
}

export function validateConsistency(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const answersNumbers = extractNumbersFromAnswers(submission.answers);
  const calc = report.sections.diagnosis.cost_of_inaction.calculation;
  
  if (!calc) {
    // No calculation to validate
    return { valid: true, errors: [], warnings: [] };
  }
  
  // Check hours consistency
  if (answersNumbers.hoursPerWeek && calc.hours_per_week) {
    const answerHours = answersNumbers.hoursPerWeek;
    const calcHours = calc.hours_per_week;
    
    if (answerHours !== calcHours) {
      // Allow if calc uses a subset (e.g., "admin hours" vs "total hours")
      if (calcHours < answerHours) {
        // Acceptable: using a portion of their time
        // But should be explained in the narrative
        const narrative = report.sections.diagnosis.cost_of_inaction.narrative.toLowerCase();
        const hasExplanation = narrative.includes('admin') || 
                               narrative.includes('portion') ||
                               narrative.includes('some of') ||
                               narrative.includes('part of');
        
        if (!hasExplanation) {
          warnings.push(
            `Hours mismatch: They said ${answerHours} hrs/week, ` +
            `calculation uses ${calcHours} hrs/week. ` +
            `If intentional, explain in the narrative.`
          );
        }
      } else {
        // Using MORE hours than they stated — likely error
        errors.push(
          `Hours inconsistency: They said ${answerHours} hrs/week available, ` +
          `but calculation uses ${calcHours} hrs/week.`
        );
      }
    }
  }
  
  // Check hourly rate plausibility
  if (answersNumbers.hourlyRate && calc.hourly_value) {
    const answerRate = answersNumbers.hourlyRate;
    const calcRate = calc.hourly_value;
    
    if (Math.abs(answerRate - calcRate) > answerRate * 0.2) {
      warnings.push(
        `Hourly rate mismatch: They indicated £${answerRate}/hr, ` +
        `calculation uses £${calcRate}/hr.`
      );
    }
  }
  
  // Check budget is referenced if provided
  if (answersNumbers.budget) {
    const reportText = JSON.stringify(report.sections).toLowerCase();
    const budgetStr = answersNumbers.budget.toString();
    const budgetFormatted = answersNumbers.budget.toLocaleString();
    
    const budgetMentioned = reportText.includes(budgetStr) || 
                            reportText.includes(budgetFormatted) ||
                            reportText.includes(`£${budgetStr}`) ||
                            reportText.includes(`£${budgetFormatted}`);
    
    if (!budgetMentioned) {
      warnings.push(
        `Budget not referenced: They mentioned £${budgetFormatted} budget, ` +
        `but report doesn't use this number.`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

### Add to Confidence Scorer

```typescript
// In calculateConfidence()

const results = {
  // ... existing validators
  consistency: validateConsistency(report, submission),
  buyingIntent: validateBuyingIntent(report),
};

// Add to hard failures
const hardFailures = [
  // ... existing
  ...results.consistency.errors,
];

// Add to warnings with appropriate weighting
for (const warning of results.consistency.warnings) {
  if (warning.includes('Hours mismatch') || warning.includes('rate mismatch')) {
    score -= 8;  // Significant issue
  } else {
    score -= 3;
  }
  flags.push(warning);
}

for (const warning of results.buyingIntent.warnings) {
  score -= 5;  // Missing validation tactic
  flags.push(warning);
}
```

---

## Summary

| Fix | Files |
|-----|-------|
| **PDF file naming** | `lib/pdf/filename.ts` |
| **Checklist styling** | `lib/pdf/templates/checklist-phase.tsx`, `lib/pdf/templates/journey-page.tsx` |
| **Validation tactics** | Add to Launcher prompt, update `NextStepSection` schema |
| **Buying intent validation** | `lib/validation/buying-intent.ts` |
| **Consistency validation** | `lib/validation/consistency.ts` |
| **Updated confidence scorer** | `lib/validation/confidence.ts` |

---

## Updated Report Schema (for Journey Map)

```typescript
interface Phase {
  number: 1 | 2 | 3;
  title: string;
  duration: string;
  focus: string;
  tasks: Array<{
    task: string;
    priority: 'must' | 'should' | 'could';
    diy_option: string | null;
    service_id: string | null;
  }>;
  completion_criteria: string;  // NEW — what does "done" look like?
}
```

---

## Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Demand Validation                          Weeks 1-3  │
├─────────────────────────────────────────────────────────────────┤
│  Prove people will pay before building anything                 │
│                                                                 │
│  □ Survey 20 people in your target market          ● MUST      │
│  □ Create simple landing page                      ● MUST      │
│  □ Test 2-3 different price points                 ○ SHOULD    │
│  □ Get 3 people to put down a £1 deposit          ○ SHOULD    │
│                                                                 │
│  ✓ Phase complete when: 3+ people have paid a deposit          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Minimum Viable Service                     Weeks 4-6  │
├─────────────────────────────────────────────────────────────────┤
│  Serve first 10 customers manually to learn the business        │
│                                                                 │
│  □ Set up basic ordering system                    ● MUST      │
│  □ Set up payment processing                       ● MUST      │
│  □ Source local suppliers                          ● MUST      │
│  □ Create simple meal planning process             ○ SHOULD    │
│  □ Deliver to first 10 customers yourself          ○ SHOULD    │
│                                                                 │
│  ✓ Phase complete when: 10 customers served, feedback collected │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Scale Foundations                        Weeks 7-12   │
├─────────────────────────────────────────────────────────────────┤
│  Systemise what works, improve what doesn't                     │
│                                                                 │
│  □ Automate ordering and customer comms            ● MUST      │
│  □ Establish reliable delivery logistics           ● MUST      │
│  □ Build customer referral system                  ○ SHOULD    │
│  □ Create subscription/recurring order option      ◦ COULD     │
│                                                                 │
│  ✓ Phase complete when: Can handle 50 orders/week without you  │
└─────────────────────────────────────────────────────────────────┘
```

---

*Add these to the docs folder and update the validation pipeline.*
