# Reckoning — Design Rules

**Status:** Canonical reference for all visual implementation
**Source:** Extracted from build instructions, December 2024

---

## Typography

- **Outfit** is the ONLY font. No fallbacks to Inter, Roboto, or system fonts.
- Headlines: Outfit Semibold (600), tight tracking (-0.02em)
- Body: Outfit Regular (400)
- Never use Source Serif except for pull quotes

## Colours (exact hex values)

```
Primary:
  charcoal: #2d2926
  ice: #F2F6F9

Accents:
  fuchsia: #D14BA8 (CTAs, links, rising line)
  mint: #B6E2D3 (sections, success states)
  blue: #A8C3D1 (secondary, borders)

Extended:
  ink: #1a1a1a
  stone: #E5E7E9
  fuchsia-dark: #a33a85
  mint-light: #d4efe6
  blue-light: #c5d8e3

Semantic:
  success: #2A7F78
  warning: #C3B273
  error: #c45d5d
```

## Spacing

- Generous whitespace. When in doubt, add more space.
- Section padding: 6rem (96px) vertical
- Component gaps: 1.5rem–2.5rem
- Let content breathe

## What NOT to Do

- NO gradients on backgrounds (solid colours only)
- NO generic box shadows
- NO border-radius > 10px (buttons use 6px)
- NO stock photo aesthetic
- NO purple gradients, blue-purple anything
- NO "startup landing page" clichés
- NO dense grids or busy layouts
- NO more than 2 accent colours per section
- NO Inter, Roboto, Arial, system-ui as primary

## What TO Do

- Typography-led hierarchy
- Confident use of whitespace
- Fuchsia for CTAs and key moments only
- Charcoal backgrounds for emphasis
- Ice backgrounds for content sections
- Mint for feature highlights
- Clean borders (1px solid stone)
- Subtle hover states (transform, border colour change)

## Responsive Breakpoints

- Mobile: 600px
- Tablet: 900px
- Desktop: 1024px+

## Quality Bar

Before shipping, every page must:

1. **Feel like Reckoning** — warm, confident, not generic
2. **Load fast** — under 2s on 3G
3. **Work on mobile** — thumb-friendly, readable
4. **Have no broken states** — loading, error, empty all handled
5. **Match the brand guidelines exactly** — colours, fonts, spacing
