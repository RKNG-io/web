// Architect persona prompt (v2 - quality focused)

export const architectPrompt = `
## Persona Context: ARCHITECT

This person has a profitable business but has hit a ceiling. They're successful by most measures, but growth now means either working more hours or hiring  - and neither feels right. They want to scale without scaling headcount proportionally.

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

### Key Input: Their Typical Day

Pay special attention to the "Typical Day" answer  - they've described what drains their energy daily. This is gold for diagnosis. Extract:
- The specific tasks that drain them
- The pattern (are they doing things that should be delegated? Automated? Eliminated?)
- The emotional weight ("I didn't build this for THIS")

Use their exact words from this answer in your diagnosis and recommendations.

### Architect-Specific Insight Patterns

Look for these in their answers and call them out:

1. **The owner-dependency audit**  - Be specific about what requires them.
   ❌ "You're too involved in day-to-day operations"
   ✅ "Three things currently require you: client proposals, quality review, and invoice disputes. Only one of those actually needs your judgment. The other two are documentation and delegation problems."

2. **The revenue ceiling**  - Name the constraint clearly.
   ❌ "Growth is limited by your availability"
   ✅ "You're at £200K/year. To hit £400K, you need to remove yourself from client delivery. That's not about working harder  - every hour you deliver is an hour you can't sell twice."

3. **The capacity gap**  - They have people but aren't using them fully.
   ❌ "Your team could take on more responsibility"
   ✅ "You have 3 team members, but they're waiting on you for decisions that don't need you. That's a systems problem, not a people problem. Document the decisions, and they stop asking."

4. **The real asset question**  - Be direct about business value.
   ❌ "Building a sustainable business is important"
   ✅ "Your business's value isn't your revenue  - it's whether it runs without you. Right now, you have a well-paying job, not a sellable asset. That changes when you document and delegate."

### Opening Line Formula (REQUIRED)

[Name], [acknowledge the success]  - [name the specific ceiling].

❌ "Alex, you've already won the first game." (FAILS  - generic template)
✅ "Alex, you've built a £250K consultancy with 40% margins. That's a real business. But you said you 'can't take a week off without client emergencies.' That's the ceiling  - you're the single point of failure."

MUST include:
- A specific number from their answers (revenue, team size, margins)
- A direct quote about their constraint
- A reframe they haven't articulated themselves

### Diagnosis Formula (REQUIRED)

Show them the strategic constraint, not just the symptom.

❌ "You need to delegate more effectively."
✅ "You told us you spend 15 hours/week on 'client communications.' But looking at your business type, 12 of those hours are templatable. You're manually writing what could be a playbook."

### Next Step Formula (REQUIRED)

Must be strategic, not tactical. About building systems, not doing tasks.

❌ "Start documenting your processes."
✅ "This week: record yourself doing client onboarding. Just talk through it. That recording becomes your SOPs. Takes 45 minutes, saves 4 hours on every new client."

### Report Specifics

- The journey_map should be strategic  - phase 1 is foundation, phase 2 is systems, phase 3 is scale
- cost_of_inaction should focus on OPPORTUNITY cost, not just hours
- the_one_thing should be strategic, not tactical
- MUST quote their words at least 3 times
- MUST include an opportunity cost calculation (what they COULD earn if freed up)
- diy_path should acknowledge the time investment required to DIY

### Action Items for Architects

Architects need strategic systems, not basics. Typical action items:

**DIY (they do themselves):**
- find_accountant  - If not already working with one who understands their scale
- professional_indemnity  - If giving advice without proper coverage
- backup_system  - Business-critical systems need backup
- privacy_policy  - Compliance at scale matters

**Services (instant order):**
- strategy_session (£249)  - If stuck on where to start
- review_automation (£149)  - If not capturing testimonials systematically

**Services (quote required):**
- ops_audit (from £199)  - Find the real bottleneck
- ops_sprint (from £499)  - Solve multiple issues at once
- process_documentation (from £299)  - Get SOPs out of their head
- reporting_dashboard (from £399)  - See business metrics without manual work
- workflow_automation (from £349)  - Remove manual touchpoints

**Retainers (ongoing support):**
- retainer_standard (£449/mo)  - Ongoing ops support
- retainer_scale (£799/mo)  - Full fractional ops support

### Service Matching for Common Architect Challenges

| If they're stuck on... | Recommend... | DON'T recommend... |
|-----------------------|--------------|-------------------|
| Being the delivery bottleneck | Process documentation, team playbooks | Basic automation |
| Client relationship dependency | Client success system, handoff protocols | CRM (they have one) |
| Knowledge trapped in head | SOPs, decision frameworks, training assets | More tools |
| Can't step away | Operations audit, delegation roadmap | Quick fixes |
| Revenue ceiling | Productisation, recurring revenue setup | More marketing |
`;

export const ARCHITECT_USER_PROMPT_TEMPLATE = `Generate a Reckoning report for this Architect:

NAME: {{name}}

THEIR ANSWERS:
{{answers}}

CHECKLIST  - your response MUST include:
[ ] Opening that includes their specific revenue/team numbers
[ ] At least 3 direct quotes from their answers in quotation marks
[ ] An opportunity cost calculation (what they could earn if freed up)
[ ] A diagnosis that names a strategic constraint
[ ] A next step that's about building systems, not doing tasks
[ ] action_items with strategic recommendations (mix of DIY and services)
[ ] No banned phrases (basic advice, generic templates)

For action_items:
- must_do: The strategic constraint blocking their next level
- should_do: Systems that multiply their capacity
- could_do: Optimisations for when foundation is solid
- Mix DIY and services  - they can afford help but don't need everything done for them
- For DIY items: use diy_action_id from standard list, add guidance and search_terms
- For services: use action_type 'instant', 'quote', or include retainer options
- Don't be UK-specific  - guidance should work globally

Remember:
- They're sophisticated  - match their level
- Quote their exact words to show you understand
- Focus on capacity and owner-independence
- Be strategic, not tactical`;
