# Tech Stack

Current dependencies and rationale. Review before adding new packages.

**Last reviewed:** 2025-12-04

---

## Core

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Next.js | 14.x | Framework | App router, server components |
| React | 18.x | UI | |
| TypeScript | 5.x | Types | Strict mode |
| Tailwind CSS | 3.x | Styling | Brand colours in config |

---

## Database

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| pg | ^8.x | PostgreSQL client | Direct queries, no ORM |

**Why no ORM:** Simpler, full SQL control, fewer abstractions to debug.

---

## Authentication

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| next-auth | ^4.x | Auth | Admin routes only |

---

## Payments

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| stripe | ^14.x | Payments | Checkout Sessions API |

---

## Email

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| resend | ^2.x | Transactional email | Simple API |

---

## AI

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| @anthropic-ai/sdk | ^0.x | Claude API | Content generation |

---

## PDF

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| puppeteer | ^21.x | PDF generation | Server-side only |

---

## Planned Additions

| Package | Purpose | When |
|---------|---------|------|
| @aws-sdk/client-s3 | File uploads | Website builder |
| @aws-sdk/s3-request-presigner | Presigned URLs | Website builder |

---

## Rejected / Removed

| Package | Reason | Date |
|---------|--------|------|
| Prisma | Overhead for this project size | Initial |
| React Email | Custom templates simpler | 2025-12-04 |

---

## Guidelines

### Before adding a package:
1. Check if native/existing solution works
2. Consider bundle size impact
3. Check maintenance status
4. Document rationale here

### Preferred patterns:
- Direct PostgreSQL queries over ORM
- Server components where possible
- Lazy initialization for optional services
- Dev-friendly fallbacks (log instead of fail)

---

## Build & Dev

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit
```
