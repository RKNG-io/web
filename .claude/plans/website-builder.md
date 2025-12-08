# Website Automation Builder - Implementation Plan

## Overview

Automated system where clients complete an enhanced intake form with content/assets, AI generates copy for a multi-page Next.js site, it deploys to Vercel preview, admin reviews/approves, then client approves before going live.

## Architecture

```
Client Intake → AI Generation → Vercel Preview → Admin Review → Client Approval → Deploy
```

---

## Phase 1: Foundation

### 1.1 Database Schema

**New migration:** `database/005_website_projects.sql`

```sql
-- Main project table
CREATE TABLE website_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(32) UNIQUE NOT NULL,
  intake_request_id UUID REFERENCES intake_requests(id),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  site_config JSONB NOT NULL,
  generated_content JSONB,
  vercel_project_id VARCHAR(255),
  preview_url VARCHAR(512),
  status VARCHAR(30) DEFAULT 'intake_complete',
  confidence_score DECIMAL(5,2),
  validation_flags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  generated_at TIMESTAMP,
  admin_reviewed_at TIMESTAMP,
  client_approved_at TIMESTAMP
);

-- Asset uploads
CREATE TABLE website_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES website_projects(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL,  -- logo, hero_image, gallery
  storage_url VARCHAR(512) NOT NULL,
  alt_text VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated page content
CREATE TABLE website_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES website_projects(id) ON DELETE CASCADE,
  page_slug VARCHAR(100) NOT NULL,  -- home, about, services, contact
  content JSONB NOT NULL,
  edited_content JSONB,
  UNIQUE(project_id, page_slug)
);
```

**Status flow:** `intake_complete` → `generating` → `preview_ready` → `admin_approved` → `client_approved` → `deployed`

### 1.2 File Upload Infrastructure

**Files to create:**
- `src/lib/storage/s3.ts` - S3 client, presigned URLs
- `src/app/api/upload/presigned/route.ts` - Get upload URL
- `src/app/api/upload/complete/route.ts` - Confirm upload, store in DB

**Dependencies:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

### 1.3 Enhanced Intake Form

**New route:** `src/app/start/website-builder/page.tsx`

**Steps:**
1. Business basics (name, type, description, audience)
2. Website goals (type, primary/secondary goals)
3. Page content - per page: headline preference, key points, tone
4. Assets (logo upload, hero image, brand colours)
5. Preferences (style, priorities, reference sites)
6. Contact (name, email)

---

## Phase 2: Generation

### 2.1 Template Components

**Directory:** `src/templates/website/`

```
components/
  Header.tsx, Footer.tsx, Hero.tsx, Section.tsx, CTA.tsx, ContactForm.tsx
pages/
  HomePage.tsx, AboutPage.tsx, ServicesPage.tsx, ContactPage.tsx
themes/
  modern-minimal.ts, warm-friendly.ts, bold-creative.ts, classic-professional.ts
```

### 2.2 Generation Prompts

**Directory:** `src/lib/prompts/website/`

- `base.ts` - Business context, tone, SEO requirements, brand voice rules
- `pages/home.ts`, `about.ts`, `services.ts`, `contact.ts` - Per-page schemas

**Output schema per page:**
```typescript
{
  hero: { headline, subheadline, ctaText },
  sections: [{ heading, body, image? }],
  cta: { heading, buttonText },
  meta: { title, description }
}
```

### 2.3 Generation API

**Route:** `src/app/api/website-builder/generate/route.ts`

Flow (mirrors `/api/reckoning/generate`):
1. Load project config
2. Build prompts per page
3. Call Claude API (parallel for 4 pages)
4. Validate content (schema, length, brand voice)
5. Calculate confidence score
6. Store in `website_pages` table
7. Update status

### 2.4 Validation

**Directory:** `src/lib/validation/website/`

- Schema validation (required fields)
- Length validation (headlines ≤8 words, meta 150-160 chars)
- Brand voice (no banned phrases)
- Confidence scoring (same pattern as reckonings)

---

## Phase 3: Deployment

### 3.1 Template Repository

**Separate deployable Next.js project** that:
- Contains all page templates
- Reads content from environment variable at build time
- Applies theme based on config

### 3.2 Vercel Integration

**File:** `src/lib/vercel/deploy.ts`

```typescript
async function deployWebsite(projectToken: string, content: WebsiteConfig): Promise<{
  deploymentId: string;
  previewUrl: string;
}>
```

Uses Vercel API:
- Create project (if needed)
- Set environment variables with content JSON
- Trigger deployment
- Return preview URL

**Env vars needed:** `VERCEL_TOKEN`, `VERCEL_TEAM_ID`

---

## Phase 4: Workflows

### 4.1 Admin Dashboard

**Routes:**
- `src/app/admin/websites/page.tsx` - List view with status filters
- `src/app/admin/websites/[id]/page.tsx` - Review page (intake left, preview right)
- `src/app/admin/websites/[id]/actions.ts` - Server actions

**Actions:** approve, regenerate, regeneratePage, updateContent, sendToClient

### 4.2 Client Portal

**Route:** `src/app/preview/[token]/page.tsx`

- Iframe with Vercel preview
- Device switcher (desktop/tablet/mobile)
- Approve button
- Request Changes form

**API:** `src/app/api/website-preview/approve/route.ts`

---

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Database migration | `database/005_website_projects.sql` |
| 2 | DB functions | `src/lib/db.ts` (add website project queries) |
| 3 | S3 upload | `src/lib/storage/s3.ts`, `src/app/api/upload/` |
| 4 | Enhanced intake form | `src/app/start/website-builder/page.tsx` |
| 5 | Template components | `src/templates/website/` |
| 6 | Generation prompts | `src/lib/prompts/website/` |
| 7 | Generation API | `src/app/api/website-builder/generate/route.ts` |
| 8 | Validation | `src/lib/validation/website/` |
| 9 | Vercel deployment | `src/lib/vercel/deploy.ts` |
| 10 | Admin dashboard | `src/app/admin/websites/` |
| 11 | Client portal | `src/app/preview/[token]/page.tsx` |
| 12 | Email notifications | `src/lib/email/templates.ts` (add website templates) |

---

## Dependencies to Add

```json
{
  "@aws-sdk/client-s3": "^3.x",
  "@aws-sdk/s3-request-presigner": "^3.x"
}
```

---

## Environment Variables

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=eu-west-2
S3_BUCKET_NAME=reckoning-website-assets
VERCEL_TOKEN=
VERCEL_TEAM_ID=
```

---

## Critical Existing Files to Reference

- `src/app/start/website/page.tsx` - Current intake pattern
- `src/app/api/reckoning/generate/route.ts` - Generation pipeline pattern
- `src/lib/validation/confidence.ts` - Validation architecture
- `src/app/admin/reports/[id]/page.tsx` - Admin review UI pattern
- `src/lib/db.ts` - Database query patterns
