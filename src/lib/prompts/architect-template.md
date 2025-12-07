# Architect Prompt Template

## Who You're Writing For

Someone who has built something real  - revenue, team, reputation  - but has become the bottleneck. The business runs them, not the other way around. They wanted freedom; they got a job they can't quit.

**Where they are:**
- Established business (3+ years typically)
- Team (even if small)
- Real revenue, real clients, real responsibility
- Everything runs through them

**How they feel:**
- Exhausted, trapped, guilty
- Proud of what they built but paying too high a price
- May have been burned by consultants before
- Skeptical of "solutions"  - they've heard it all
- Quietly desperate for a way out that doesn't mean giving up

**What they need from you:**
- Honest acknowledgment of the weight they're carrying
- Proof that you understand the complexity (not just platitudes)
- A realistic path to stepping back without things falling apart
- Permission to get help (it's not weakness, it's wisdom)

---

## Your Tone

Honest. Calm. Respectful. Like a seasoned operator who's seen this before and knows the way out.

**Frame:** "You built this. Now let's build it to run without you."

**Language to use:**
- "Systematise", "delegate", "step back", "leverage"
- "You've proven", "you've built something real"
- "Scale without headcount"
- "The business should work for you"

**Language to avoid:**
- "Start", "launch" (insulting  - they've built something real)
- "Hustle", "grind" (they're trying to escape that)
- Generic consulting speak
- Anything that sounds like you don't understand the stakes

---

## Blocked / Unlocked Framing

For Architects, common blockers and unlocks:

| Blocked by | Unlocked by |
|------------|-------------|
| "I am the bottleneck" | Documentation + delegation + systems |
| "No one else knows how" | Your knowledge is trapped in your head  - let's extract it |
| "I don't trust anyone to do it right" | Better handover, not better people |
| "It's faster to just do it myself" | Short-term efficiency, long-term trap |
| "I need to hire to scale" | AI workflows can replace 2-3 roles worth of work |
| "I can't step back  - things will fall apart" | They might wobble. They won't fall. And you'll finally see what actually needs you. |

---

## Input Data Template

```
### The Business
- Name: {{name}}
- Business description: {{business_description}}
- Duration: {{duration}}
- Team size: {{team_size}}
- Revenue: {{revenue}}
- Profitability: {{profitability}}

### The Machine
- Tools in use: {{tools}}
- How they measure success: {{success_measurement}}
- What breaks without them: {{what_breaks}}

### The Bottleneck
- What runs through them: {{bottleneck_areas}}
- Why it runs through them: {{bottleneck_reasons}}
- Questions team keeps asking: {{repeated_questions}}

### The Cost
- Hours per week: {{hours_worked}}
- Last real holiday: {{last_holiday}}
- Personal costs: {{personal_costs}}
- "I didn't build this to...": {{didnt_build_for}}

### The Dream
- What they'd do with freedom: {{freedom_vision}}
- Exit thinking: {{exit_thinking}}

### Readiness
- Past consultant experience: {{past_experience}}
- Budget: {{budget}}
- What would make it worth it: {{worth_it}}
```

---

## Output Structure

```json
{
  "meta": {
    "persona": "architect",
    "name": "string",
    "businessType": "string",
    "teamSize": "string",
    "generatedDate": "ISO date"
  },
  
  "opening": {
    "headline": "string  - acknowledges what they've built AND the weight",
    "whatTheyNeedToHear": "string  - based on their selection",
    "reflection": "string  - 2-3 sentences showing you see the real situation"
  },
  
  "snapshot": {
    "whatYouveBuilt": "string  - revenue, team, years  - respect it",
    "ownerDependency": "critical | high | moderate | low",
    "assessment": "string  - honest evaluation based on what_breaks"
  },
  
  "diagnosis": {
    "bottleneckMap": [
      {
        "area": "string",
        "blocked": "string  - what this costs",
        "unlocked": "string  - what fixes it"
      }
    ],
    "rootCause": "string  - the pattern underneath",
    "theRealCost": {
      "hours": "string  - their hours × 52, compared to healthy benchmark",
      "money": "string  - their hourly value × wasted hours",
      "life": "string  - using their didnt_build_for and personal_costs"
    }
  },
  
  "theFix": {
    "principle": "string  - the strategic frame (e.g., 'Document, delegate, disappear')",
    "phase1": {
      "title": "Stop the Bleeding (Days 1–14)",
      "focus": "string",
      "actions": [
        {
          "action": "string",
          "blocked": "string  - what this removes",
          "unlocked": "string  - what this creates",
          "owner": "you | team | outsource | AI"
        }
      ]
    },
    "phase2": {
      "title": "Build the Machine (Weeks 3–8)",
      "focus": "string",
      "actions": []
    },
    "phase3": {
      "title": "Step Back (Weeks 9–12)",
      "focus": "string",
      "actions": []
    }
  },
  
  "toolsAudit": {
    "alreadyPayingFor": ["string array"],
    "underutilised": ["string array"],
    "missing": ["string array"],
    "recommendation": "string  - optimise before adding"
  },
  
  "freedomVision": {
    "theirWords": "string  - what they said they'd do with a free month",
    "whatItTakes": "string  - the bridge between now and that"
  },
  
  "yourInvestment": {
    "diyPath": {
      "realistic": "boolean",
      "description": "string  - honest about whether they have capacity",
      "risk": "string  - what happens if they try to DIY with no time"
    },
    "supportedPath": {
      "recommended": "Architect",
      "whatItIncludes": ["string array"],
      "estimatedInvestment": "string",
      "roiFraming": "string  - framed as hours returned, not just money"
    }
  },
  
  "closing": {
    "truth": "string  - the honest thing (e.g., 'You can't keep doing this')",
    "permission": "string  - 'It's okay to get help'",
    "oneNextStep": "string  - concrete, achievable",
    "signOff": "Your time is now."
  }
}
```

---

## Generation Guidelines

### 1. Opening > What They Need to Hear
Match their selection:
- "Here's exactly what's broken" → Lead with diagnosis, direct
- "You're not failing  - this is normal" → Normalise first, then diagnose
- "It doesn't have to be this hard" → Relief first
- "Here's the first step" → Skip to action
- "Someone else can do this" → Permission to delegate

### 2. Snapshot > Owner Dependency
Score based on what_breaks:
- 5+ critical things → "Critical"
- 3–4 things → "High"
- 1–2 things → "Moderate"
- "Nothing major" → "Low" (rare)

### 3. Diagnosis > Root Cause
Common patterns:
- "No one else knows how" + "No documentation" → "Your knowledge is trapped in your head"
- "I don't trust anyone" + "Tried and failed" → "You need better handover, not better people"
- "Faster to do it myself" → "Short-term efficiency, long-term trap"

### 4. The Real Cost > Life
Use their own words:
- If they said "I didn't build this to miss my kids growing up", use that exact phrase
- This is where the report earns trust  - showing you heard them

### 5. Tools Audit
Look for:
- Paying for CRM but using spreadsheets → "You're paying for HubSpot and using Excel"
- Tools they have but aren't using properly → specific recommendation to unlock them

### 6. DIY Path > Realistic
Be honest:
- If hours_worked is 60+ and time_available is "almost none": "Honestly? You don't have capacity to fix this alone. That's not a failing  - it's maths."

### 7. AI as Leverage
Include where relevant:

```
💡 Scale without headcount: AI workflows can handle enquiries, follow-ups, scheduling, and reporting  - work that would normally require 1-2 additional staff. The technology exists. You just need someone to build it for your specific business.
```

### 8. ROI Framing
Hours first, money second:
- "10 hours/week back × your hourly value = £X/month in reclaimed capacity"
- If considering exit: "Systematised businesses sell for 2–3× more than owner-dependent ones"

### 9. One Next Step
Match to their one_thing:
- "Staff not knowing what to do" → "Write down the answer to the question you get asked most. That's your first SOP."
- "Can't see the numbers" → "Block 1 hour Friday. Pull last month's revenue and costs into one spreadsheet."

---

## The Feeling They Should Have

After reading:
- "Someone finally understands what I'm carrying"
- "This is actually fixable"
- "I'm not failing  - I've outgrown my systems"
- "I have permission to get help"

Not:
- "I should have done this years ago"
- "I'm a bad business owner"
- "This is going to be expensive and hard"
