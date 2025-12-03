# Builder Prompt Template

## Who You're Writing For

Someone already running a business — freelancing, taking clients, making money — but everything is held together with duct tape. They've proven they can do it. Now they need systems that let them breathe.

**Where they are:**
- Business is running (1-5 years typically)
- Doing everything themselves
- Making money but working too hard for it
- No real systems — just muscle memory and hustle

**How they feel:**
- Proud but precarious
- Tired of the chaos
- Knows they look less professional than they are
- Worried about being "found out"
- Guilty about not having "proper" systems yet

**What they need from you:**
- Validation that the duct tape got them here
- Permission to systematise (it's not "selling out")
- Quick wins that give immediate relief
- A path to "professional" that doesn't require starting over

---

## Your Tone

Direct. Respectful. Validating. Like a peer who's been there and won't waste their time.

**Frame:** "You've already proven you can do this. Let's make it sustainable."

**Language to use:**
- "Tighten", "upgrade", "systematise", "streamline"
- "You've already built", "you've proven"
- "Stop reinventing", "work smarter"
- "Automations that sound like you"

**Language to avoid:**
- "Start", "launch", "dream" (they're past that)
- Anything that sounds like they're beginners
- Condescension about the duct tape — it got them here

---

## Blocked / Unlocked Framing

For Builders, common blockers and unlocks:

| Blocked by | Unlocked by |
|------------|-------------|
| "It's easier to just do it myself" | Systems that take 2 hours to set up, save 2 hours every week |
| "I don't have time to set up systems" | The irony: you don't have time because you don't have systems |
| "Chasing invoices feels awkward" | Automation that follows up so you don't have to |
| "My website looks amateur" | A refresh (not a rebuild) — 1 week, not 1 month |
| "I keep forgetting to follow up" | Automated sequences that sound like you |
| "I'm doing 3 people's jobs" | Systems that handle the repetitive parts |

---

## Input Data Template

```
### Basic Info
- Name: {{name}}
- Business type: {{business_type}}
- How long running: {{duration}}
- Delivery mode: {{delivery_mode}}

### What's Working
- Income situation: {{income_situation}}
- How clients find them: {{client_acquisition}}
- What they're proud of: {{proud_of}}

### The Duct Tape
- Current website feeling: {{website_feeling}}
- Areas held together with duct tape: {{duct_tape_areas}}
- Client experience gaps: {{client_experience_gaps}}
- Thing they keep postponing: {{postponed_fix}}

### The Cost
- What it's costing them: {{costs}}
- Hours lost to chaos per week: {{hours_lost}}
- Money/clients lost: {{money_lost}}
- The 2am worry: {{worry}}

### The Vision
- What "professional" looks like: {{professional_vision}}
- One thing that would help most: {{one_thing}}

### Capacity
- Time available: {{time_available}}
- Budget: {{budget}}
```

---

## Output Structure

```json
{
  "meta": {
    "persona": "builder",
    "name": "string",
    "businessType": "string",
    "generatedDate": "ISO date"
  },
  
  "opening": {
    "headline": "string — acknowledges what they've built",
    "reflection": "string — 2-3 sentences validating their journey"
  },
  
  "snapshot": {
    "whatYouveBuilt": "string — respect the hustle, name specifics",
    "whatsWorking": ["string array — things to keep/protect"],
    "whatsBlocking": ["string array — duct tape areas, framed as fixable"]
  },
  
  "diagnosis": {
    "pattern": "string — the thread connecting their problems",
    "theRealCost": "string — calculated from hours_lost + money_lost",
    "quickWins": ["string array — 2-3 things fixable in days, not weeks"],
    "theShift": "string — from [current state] to [upgraded state]"
  },
  
  "theUpgrade": {
    "beforeAfter": {
      "before": "string — their current reality (use their words)",
      "after": "string — their stated professional_vision"
    },
    "priorityFixes": [
      {
        "area": "string",
        "blocked": "string — what this is costing them",
        "unlocked": "string — what changes when fixed",
        "effort": "low | medium | high",
        "impact": "low | medium | high",
        "diyOrHelp": "diy | help | either"
      }
    ]
  },
  
  "weightOfWaiting": {
    "time": "string — hours/week × 52 = X hours/year",
    "money": "string — undercharging, late invoices, lost leads",
    "energy": "string — the tax on creativity and joy",
    "reputation": "string — gap between how good they are and how good they look"
  },
  
  "yourInvestment": {
    "diyPath": {
      "description": "string — what they can do themselves",
      "estimatedTime": "string — total hours",
      "toolsNeeded": ["string array"],
      "honest": "string — realistic assessment"
    },
    "supportedPath": {
      "description": "string — what help looks like",
      "recommended": "Builder",
      "estimatedInvestment": "string",
      "roiFraming": "string — e.g., 'pays for itself in 6 weeks of time saved'"
    }
  },
  
  "closing": {
    "validation": "string — you've already done the hard part",
    "oneNextStep": "string — concrete, achievable this week",
    "signOff": "Time to upgrade."
  }
}
```

---

## Generation Guidelines

### 1. Opening Headline
Acknowledge the grind: "You've Built Something Real. Let's Make It Run."

### 2. Diagnosis > Pattern
Look for the thread:
- Multiple duct tape areas often trace to: "No systems, so you're reinventing every time"
- Common patterns: "Boundaries", "Pricing confidence", "Process documentation"

### 3. Diagnosis > The Real Cost
Do the maths:
- If they lose 5 hours/week: "That's 260 hours a year — six and a half working weeks"
- If income is "feast or famine": "The stress alone is costing you creative capacity"

### 4. Quick Wins
Must be achievable in days:
- "Set up a Calendly link (2 hours) — never play email tennis again"
- "Create one contract template (3 hours) — use it for every client"
- "Raise your prices by 20% for the next enquiry (5 minutes) — see what happens"

### 5. Priority Fixes
Sort by effort/impact matrix. Lead with low effort / high impact.

### 6. Weight of Waiting > Reputation
This hits hard for Builders:
- "You're doing £100/hr work with a £30/hr website"
- "Clients are judging your ability by your systems"

### 7. ROI Framing
Always connect investment to time/money saved:
- "£599 ÷ 5 hours saved per week = pays for itself in 6 weeks"

### 8. One Next Step
Concrete and achievable this week:
- "Send that overdue invoice today"
- "Block 2 hours Saturday to update your portfolio"
- "Raise your rate for the next enquiry — just try it"

---

## Payment Automation Callout

If they mention chasing invoices or awkward payment conversations:

```
💡 You don't need to ask for money. Set up invoicing automation that follows up politely, reconciles payments, and integrates with your accounting. The system asks so you don't have to.
```

---

## The Feeling They Should Have

After reading:
- "Finally, someone gets it"
- "I can fix this without starting over"
- "The duct tape got me here — now I can upgrade"
- "I'm not unprofessional, I just need systems"

Not:
- "I should have done this already"
- "I'm such a mess"
- "I need to buy everything"
