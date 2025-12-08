# Reckoning Web  -  Agent Definitions

Use these agents for parallel component development.

## Available Agents

### component-builder
**Purpose**: Convert HTML sections to React components
**Tools**: Read, Write, Edit, Glob
**Instructions**:
1. Read the source HTML section from `reckoning 2/website/index.html`
2. Convert to React/TypeScript component
3. Use Tailwind classes (reference tailwind.config.ts for brand colours)
4. Write to `src/components/[ComponentName].tsx`
5. Report back: component name, file path, any dependencies needed

### data-migrator
**Purpose**: Copy and adapt data files from source
**Tools**: Read, Write, Edit
**Instructions**:
1. Read source file from `reckoning 2/src/`
2. Adapt import paths for new project structure
3. Write to `reckoning-web/src/`
4. Report back: files copied, any type adjustments made

### questionnaire-builder
**Purpose**: Convert questionnaire prototype to React
**Tools**: Read, Write, Edit, Bash
**Instructions**:
1. Read `reckoning 2/examples/questionnaire-prototype.html`
2. Extract state management logic
3. Create React components with useState/Zustand
4. Build at `src/app/questionnaire/`
5. Report back: components created, state structure

### api-builder
**Purpose**: Create API routes for AI integration
**Tools**: Read, Write, Edit, Bash
**Instructions**:
1. Read prompt templates from `reckoning 2/src/prompts/`
2. Create API route at `src/app/api/reckoning/route.ts`
3. Use @anthropic-ai/sdk
4. Handle persona-specific prompts
5. Report back: endpoint created, expected request/response format

### ui-primitives
**Purpose**: Build reusable UI components
**Tools**: Read, Write, Edit
**Instructions**:
1. Reference brand guidelines for styling
2. Create components in `src/components/ui/`
3. Include: Button, Card, SectionHeader, Input, Badge
4. Export with proper TypeScript props
5. Report back: components created with usage examples

## Parallel Execution Strategy

### Phase 1 (Foundation)  -  Run in parallel:
- **ui-primitives**: Build Button, Card, SectionHeader
- **data-migrator**: Copy services, questions, packages, types

### Phase 2 (Landing Page)  -  Run in parallel:
- **component-builder**: Hero section
- **component-builder**: PersonaCards section
- **component-builder**: HowItWorks section
- **component-builder**: Nav component

### Phase 3 (Landing Page cont.)  -  Run in parallel:
- **component-builder**: ReckoningCTA section
- **component-builder**: ServiceExplorer section
- **component-builder**: Testimonials section
- **component-builder**: Footer component

### Phase 4 (Features)  -  Run in parallel:
- **questionnaire-builder**: Full questionnaire flow
- **api-builder**: Reckoning generation endpoint

### Phase 5 (Integration):
- Assemble landing page from components
- Connect questionnaire to API
- Build results page

## Agent Prompts

### Example: Component Builder for Hero
```
You are building the Hero component for Reckoning.

Source: Read `/Users/liz/Projects/Reckoning/reckoning 2/website/index.html`
Find the `.hero` section and convert it to React.

Requirements:
- Full viewport height
- Charcoal background with radial gradient overlays
- Tagline: "For business owners  -  and those about to be"
- H1: "This is your reckoning."
- Two CTA buttons
- Use Tailwind classes from tailwind.config.ts

Output: Write to `/Users/liz/Projects/Reckoning/reckoning-web/src/components/Hero.tsx`

Report what you created and any dependencies needed.
```

### Example: Data Migrator for Services
```
You are migrating the service catalogue data.

Source: `/Users/liz/Projects/Reckoning/reckoning 2/src/data/service-catalogue.ts`
Destination: `/Users/liz/Projects/Reckoning/reckoning-web/src/data/services.ts`

Also copy types from:
Source: `/Users/liz/Projects/Reckoning/reckoning 2/src/types/index.ts`
Destination: `/Users/liz/Projects/Reckoning/reckoning-web/src/types/index.ts`

Adjust any import paths as needed.
Report what was copied and any changes made.
```
