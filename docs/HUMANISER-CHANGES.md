# Humaniser Audit - Changes Summary

This document outlines all copy changes made to remove AI-generated patterns from the Reckoning website.

---

## Audit Score: 4/10 (Before) → Improved

---

## 1. Hero Section (`src/components/landing/Hero.tsx`)

### Headline
| Before | After |
|--------|-------|
| "Unblock. Unlock. Unleash." | "Stop spinning. Start building." |

**Why**: Triple-U alliteration is peak AI copywriting. "Unlock" was on our own banned words list.

### Benefits List
| Before | After |
|--------|-------|
| "Systems that grow with you" | "Systems that don't break when you do" |

**Why**: "Built/grow with you" is generic AI filler.

---

## 2. Footer (`src/components/layout/Footer.tsx`)

### Tagline
| Before | After |
|--------|-------|
| "Unblock. Unlock. Unleash.<br/>Your business. Your way." | "The work you love.<br/>Without the chaos." |

**Why**: Same AI triple-U pattern repeated. New tagline is concrete and emotional.

---

## 3. ReckoningCTA (`src/components/landing/ReckoningCTA.tsx`)

### Description
| Before | After |
|--------|-------|
| "Get a free diagnostic that cuts through the noise and shows you exactly where you stand. No fluff, no sales pitch - just honest clarity about your business and what comes next." | "A free diagnostic that shows you exactly where you stand. No fluff, no 50-point plan - just what's actually blocking you and what to do about it." |

**Why**: "Cuts through the noise" is a tired cliche. New copy is more specific.

---

## 4. Service Descriptions (`src/data/services.ts`)

### Strategy Session
| Before | After |
|--------|-------|
| "Two 45-minute sessions with structured guidance between. Get clarity on priorities, systems, and next steps - tailored to where you are." | "Two 45-minute sessions with structured guidance between. Clarity on what matters now - not a 50-point plan." |

**Why**: "Tailored to where you are" is generic AI speak.

### Multi-Page Website
| Before | After |
|--------|-------|
| "Full site: Home, About, Services, Contact, Blog-ready. Built to grow with you." | "Full site: Home, About, Services, Contact, Blog-ready. Add pages when you need them." |

**Why**: "Built to grow with you" is AI filler. New copy is concrete action.

### Welcome Email Sequence
| Before | After |
|--------|-------|
| "3-5 emails that nurture new subscribers or clients automatically" | "3-5 emails that turn new subscribers into clients - automatically" |

**Why**: "Nurture" is marketing automation jargon.

### Email List Setup
| Before | After |
|--------|-------|
| "Lead magnet delivery, signup forms, list management - ready to grow your audience" | "Lead magnet delivery, signup forms, list management. Build your list properly." |

**Why**: "Ready to grow your audience" is AI SaaS speak.

### Custom Workflow Automation
| Before | After |
|--------|-------|
| "Connect your tools: when X happens, do Y. Tailored to your business." | "Connect your tools: when X happens, do Y. Built for how you actually work." |

**Why**: Second use of "tailored" - replaced with concrete language.

### Social Media System Setup
| Before | After |
|--------|-------|
| revenuePotential: "Consistent visibility without the daily scramble" | revenuePotential: "Show up consistently without scrambling daily" |

**Why**: "Consistent visibility" is buzzword soup.

### Content Bank & Calendar
| Before | After |
|--------|-------|
| "30 days of post ideas tailored to your business, organised in a calendar you can reuse and adapt" | "30 days of post ideas for your business, organised in a calendar you can reuse" |

**Why**: Third use of "tailored" - removed.

---

## 5. Packages (`src/components/landing/Packages.tsx`)

### Launcher Package
| Before | After |
|--------|-------|
| "Everything you need to go from idea to taking money." | "Website, payments, booking, contracts. Launch properly." |

**Why**: "Everything you need" is AI opening formula. New copy is specific.

---

## 6. Persona Prompts (`src/prompts/personas.ts`)

### Architect Language Suggestions
| Before | After |
|--------|-------|
| "Machine", "operations", "leverage" | "Machine", "operations", "systems" |

**Why**: "Leverage" is on our banned list - we were telling AI to use banned words.

### Builder Language Suggestions
| Before | After |
|--------|-------|
| "Tighten", "upgrade", "systematise", "streamline" | "Tighten", "upgrade", "systematise", "simplify" |

**Why**: "Streamline" is AI buzzword.

### Launcher Section Naming
| Before | After |
|--------|-------|
| "Journey Map" | "Roadmap" |

**Why**: "Journey" is overused AI/coaching speak.

---

## 7. Brand Voice Filter (`src/lib/validation/brand-voice.ts`)

### New AI Pattern Detection
Added regex patterns to catch:
- Triple constructions (`Unblock. Unlock. Unleash.`)
- "From X to Y" openings
- "Not just X, but Y" constructions
- "Whether you're X or Y" hedging
- Generic benefit formulas

### Expanded Banned Phrases (80+)
Organised by category:
- **AI Buzzwords**: leverage, unlock, unleash, empower, elevate, streamline, seamless, robust, cutting-edge, game-changer, next level, transform, revolutionise
- **AI Filler**: "in today's fast-paced world", "cuts through the noise", "at the end of the day"
- **Vague Benefits**: "tailored to", "customised solution", "bespoke", "holistic approach", "comprehensive solution", "end-to-end", "turnkey"
- **Marketing Fluff**: nurture, curate, synergy, deep dive, move the needle, low-hanging fruit, best-in-class
- **Prescriptive**: "you should", "you need to", "you must"
- **Fear-based**: "leaving money on the table", "don't miss out", "act now"
- **Patronising**: "the real problem is", "what you don't realise", "the truth is"
- **Hustle Culture**: pain points, disrupt, hustle, grind, crushing it, 10x, level up
- **Journey Cliches**: your journey, embark, thrive, flourish, next chapter

### Style Rules Added
- **No em-dashes** - use en-dash with spaces ( - ) or rephrase
- No double-hyphens as em-dashes (--)
- No excessive exclamation marks
- No ALL CAPS for emphasis

### New Exports
```typescript
import {
  HUMANISER_PROMPT,      // Ready-to-use prompt for copy review
  checkForAIPatterns,    // Check any text string
  validateBrandVoice,    // Validate full reports
  BANNED_PHRASES,        // Raw list of banned phrases
  AI_PATTERNS            // Regex patterns for AI detection
} from '@/lib/validation/brand-voice';
```

---

## Voice Benchmark

The **BlockedUnlocked component** was identified as the best example of human voice in the codebase:

> "The constant context-switching. The background hum of things you haven't got to yet. More time on admin than on the work you actually love.
>
> That's not a character flaw. That's a systems problem. And systems problems have systems solutions."

**Why it works**: Direct. Observational. True. No fluff.

---

## Self-Test Questions

Before publishing any copy, ask:

1. Would I actually say this to a friend?
2. Can I picture a specific person, not "businesses"?
3. Is there a concrete detail, or just vibes?
4. Does it sound like a LinkedIn post? (If yes, rewrite)
5. Could this describe any business? (If yes, make it specific)

---

## Commits

1. `c8d0c2d` - fix: humanise copy by removing AI-generated patterns
2. `292b981` - fix: correct headline path in test-e2e script
3. `311b7a8` - feat: add comprehensive humaniser filter and brand voice guidelines
