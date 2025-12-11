# Geo Content Strategy

How Reckoning adapts content, copy, and targeting for different geographic markets.

---

## Current Markets

### Primary: United Kingdom & EU
- **Language**: British English
- **Currency**: GBP (UK), EUR (EU)
- **Terminology**: "tradespeople", "electricians", "van"
- **Payment norms**: Bank transfer (BACS/SEPA), card payments, Open Banking
- **Business culture**: Polite but direct, professional yet warm
- **Compliance**: GDPR, UK data protection, VAT considerations

### Secondary: Ireland
- **Language**: British/Irish English
- **Currency**: EUR
- **Terminology**: Similar to UK
- **Payment norms**: SEPA, card payments
- **Business culture**: Friendly, relationship-focused

### Future: Australia/New Zealand (ANZ)
- **Language**: Australian English
- **Currency**: AUD/NZD
- **Terminology**: "tradies", "sparkies", "ute"
- **Payment norms**: Bank transfer common, less credit card reliance
- **Business culture**: Direct, informal, "no worries" attitude

### Future: United States
- **Language**: American English
- **Currency**: USD
- **Terminology**: "contractors", "electricians", "truck"
- **Payment norms**: Credit card dominant, Venmo/Zelle for small business
- **Business culture**: More formal in business contexts

---

## Terminology Mapping

| Concept | UK/EU (Primary) | ANZ | US |
|---------|-----------------|-----|----|
| Tradesperson | Tradesperson | Tradie | Contractor |
| Electrician | Electrician | Sparky | Electrician |
| Plumber | Plumber | Plumber | Plumber |
| Work vehicle | Van | Ute | Truck |
| Quote | Quotation/Quote | Quote | Estimate |
| Invoice | Invoice | Invoice | Invoice |
| Deposit | Deposit | Deposit | Down payment |
| Bank transfer | BACS/SEPA | Bank transfer | Wire/ACH |
| VAT/Tax | VAT | GST | Sales tax |

---

## Vertical-Specific Adaptations

### Fitness
| Market | Examples | Notes |
|--------|----------|-------|
| ANZ | PT, gym owner, bootcamp instructor | Strong outdoor fitness culture |
| UK | PT, gym owner, fitness instructor | Class-based fitness popular |
| US | Personal trainer, gym owner, coach | Certification-focused language |

### Wellness
| Market | Examples | Notes |
|--------|----------|-------|
| ANZ | Massage therapist, naturopath, physio | Allied health integration |
| UK | Therapist, bodyworker, complementary practitioner | NHS/private divide |
| US | Licensed massage therapist, wellness practitioner | Licensing varies by state |

### Trades
| Market | Examples | Notes |
|--------|----------|-------|
| ANZ | Plumber, sparky, chippy, builder | Strong licensing requirements |
| UK | Plumber, electrician, builder | Gas Safe, Part P certifications |
| US | Plumber, electrician, contractor | State licensing varies |

### Events
| Market | Examples | Notes |
|--------|----------|-------|
| ANZ | DJ, photographer, wedding planner | Outdoor events popular |
| UK | DJ, photographer, event planner | Weather contingencies |
| US | DJ, photographer, event coordinator | Scale varies significantly |

---

## Implementation Strategy

### Phase 1: UK/EU Focus (Current)
1. All copy uses British English
2. Examples reference UK/EU pain points
3. Pricing in GBP (EUR support planned)
4. GDPR-compliant by default
5. VAT-aware pricing display

### Phase 2: Ireland + EU Expansion
1. Add EUR currency support
2. SEPA payment integration
3. Minor localisation tweaks
4. Same automation catalogue (logic is universal)

### Phase 3: ANZ Expansion
1. Add `/au` routes with Australian English
2. Implement geo-detection (IP-based)
3. Localise terminology ("tradies", "sparkies")
4. AUD pricing
5. GST handling

### Phase 4: US Expansion
1. Add `/us` routes with American English
2. Significant copy rewrites (cultural differences)
3. USD pricing
4. State-specific compliance awareness

---

## Technical Implementation

### URL Structure Options

**Option A: Subdomain**
```
au.rkng.io (default)
uk.rkng.io
us.rkng.io
```
- Pro: Clean separation
- Con: SEO complexity, SSL per domain

**Option B: Path prefix**
```
rkng.io/au/for/fitness (default, can omit /au)
rkng.io/uk/for/fitness
rkng.io/us/for/fitness
```
- Pro: Single domain, easier SEO
- Con: More complex routing

**Option C: Query parameter (transitional)**
```
rkng.io/for/fitness?region=uk
```
- Pro: Easiest to implement
- Con: Not SEO-friendly

**Recommendation**: Start with Option C for testing, migrate to Option B for production.

### Content Structure

```typescript
// src/lib/geo/config.ts
export type Region = 'uk' | 'eu' | 'au' | 'us'

export const REGION_CONFIG: Record<Region, {
  currency: string
  currencySymbol: string
  language: string
  terminology: Record<string, string>
  taxLabel: string
}> = {
  uk: {
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en-GB',
    terminology: {
      tradesperson: 'tradesperson',
      electrician: 'electrician',
      // ...
    },
    taxLabel: 'VAT',
  },
  eu: {
    currency: 'EUR',
    currencySymbol: '€',
    language: 'en-GB', // British English for EU
    terminology: {
      tradesperson: 'tradesperson',
      electrician: 'electrician',
      // ...
    },
    taxLabel: 'VAT',
  },
  au: {
    currency: 'AUD',
    currencySymbol: '$',
    language: 'en-AU',
    terminology: {
      tradesperson: 'tradie',
      electrician: 'sparky',
      // ...
    },
    taxLabel: 'GST',
  },
  us: {
    currency: 'USD',
    currencySymbol: '$',
    language: 'en-US',
    terminology: {
      tradesperson: 'contractor',
      electrician: 'electrician',
      // ...
    },
    taxLabel: 'Tax',
  },
}
```

### Geo Detection

```typescript
// src/lib/geo/detect.ts
export async function detectRegion(request: Request): Promise<Region> {
  // 1. Check URL parameter
  const url = new URL(request.url)
  const regionParam = url.searchParams.get('region')
  if (isValidRegion(regionParam)) return regionParam

  // 2. Check cookie (user preference)
  const cookies = request.headers.get('cookie')
  const regionCookie = parseCookie(cookies, 'rk_region')
  if (isValidRegion(regionCookie)) return regionCookie

  // 3. Geo-IP detection (Vercel provides this)
  const country = request.headers.get('x-vercel-ip-country')
  return mapCountryToRegion(country)
}

function mapCountryToRegion(country: string | null): Region {
  switch (country) {
    // UK
    case 'GB':
      return 'uk'
    // EU countries
    case 'IE': // Ireland
    case 'DE': // Germany
    case 'FR': // France
    case 'NL': // Netherlands
    case 'ES': // Spain
    case 'IT': // Italy
    case 'BE': // Belgium
    case 'AT': // Austria
    case 'PT': // Portugal
    case 'SE': // Sweden
    case 'DK': // Denmark
    case 'FI': // Finland
    case 'PL': // Poland
      return 'eu'
    // ANZ
    case 'AU':
    case 'NZ':
      return 'au'
    // North America
    case 'US':
    case 'CA':
      return 'us'
    default:
      return 'uk' // Default to UK
  }
}
```

---

## Content Localisation Checklist

When expanding to a new region:

### Copy Changes
- [ ] Update vertical page headlines/descriptions
- [ ] Localise pain points to regional context
- [ ] Update intake flow questions
- [ ] Localise results page copy
- [ ] Update email templates
- [ ] Review CTA button text

### Technical Changes
- [ ] Add currency formatting
- [ ] Configure Stripe for region
- [ ] Set up regional email sender
- [ ] Add hreflang tags for SEO
- [ ] Implement region switcher UI

### SEO Changes
- [ ] Create region-specific meta descriptions
- [ ] Update canonical URLs
- [ ] Add hreflang alternate links
- [ ] Submit to regional Google Search Console

---

## Measurement

Track by region:
- Page views per vertical per region
- Intake completion rate per region
- Time to complete intake per region
- Conversion rate per region
- Average order value per region

This data will inform:
- Which regions to prioritise
- Which verticals resonate where
- Copy effectiveness by market

---

## Notes

- Don't over-localise initially - start with currency and obvious terminology
- Test with real users before major rollout
- Consider timezone for email sends
- Legal/compliance varies by region (GDPR for UK, etc.)
