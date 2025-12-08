# Business Type Checklists

Conditional Q5 options based on business type selected in Q2b.

---

## Universal (All Business Types)

These appear for everyone:

```
□ Business name decided
□ Business registered (sole trader, Ltd, etc.)
□ Business bank account
□ Website or landing page
□ Professional email (not @gmail)
□ Social media presence
□ Email list / way to capture leads
□ Testimonials or social proof
□ Insurance (if applicable)
□ Contracts or terms of service
□ Accounting / bookkeeping setup
```

---

## By Business Type

### Coaching / Consulting / Advisory

```
□ Way for clients to book discovery calls
□ Services and pricing defined
□ Session packages structured
□ Client intake / onboarding form
□ Way to take payments
□ Scheduling system for ongoing sessions
□ Client portal or resource delivery
□ Cancellation / rescheduling policy
```

### Therapy / Counselling

```
□ Professional registration / accreditation
□ Clinical supervision arrangement
□ Confidential booking system
□ Secure client notes system
□ Consent and privacy forms
□ Insurance (professional indemnity)
□ Cancellation policy
□ Crisis / safeguarding protocol documented
```

### Personal Training / Fitness

```
□ Qualification / certification
□ Insurance (public liability + professional)
□ PAR-Q / health screening form
□ Liability waiver
□ Session booking system
□ Package pricing defined
□ Programme delivery method (app, PDF, in-person)
□ Venue / location sorted (gym, outdoor, online)
```

### Food / Meal Prep / Catering

```
□ Food hygiene certificate (Level 2 minimum)
□ Kitchen registered with local council
□ Kitchen setup (home, commercial, rented)
□ Menu and pricing defined
□ Ordering system
□ Payment collection method
□ Delivery or collection process
□ Packaging and labelling sorted
□ Allergen documentation
□ Food safety management system
□ Insurance (public liability + product)
```

### Photography / Videography

```
□ Portfolio (online)
□ Booking and enquiry system
□ Packages and pricing defined
□ Contracts / usage rights
□ Deposit and payment system
□ Gallery delivery method
□ Backup and storage system
□ Equipment insurance
□ Second shooter / backup plan
```

### Design / Creative Services

```
□ Portfolio (online)
□ Services and pricing defined
□ Enquiry / booking process
□ Contracts / scope of work template
□ Proposal / quote template
□ Invoicing system
□ Revision policy defined
□ File delivery method
□ Asset storage / handover process
```

### Teaching / Tutoring

```
□ DBS check (if working with children)
□ Qualifications documented
□ Session booking system
□ Pricing and packages defined
□ Payment collection method
□ Lesson materials / curriculum
□ Parent/guardian communication (if applicable)
□ Cancellation policy
□ Progress tracking method
```

### E-commerce / Maker / Artist

```
□ Products ready to sell
□ Product photography
□ Pricing defined
□ Online shop / checkout
□ Payment processing
□ Shipping method and pricing
□ Packaging sorted
□ Returns policy
□ Inventory tracking
□ Supplier relationships (if applicable)
```

### VA / Freelance Admin / Professional Services

```
□ Services defined
□ Pricing structure (hourly, retainer, project)
□ Proposal / quote template
□ Contracts
□ Time tracking system
□ Invoicing system
□ Client communication method
□ File sharing / collaboration setup
□ Confidentiality / NDA template
```

---

## AI-Generated for "Other" Business Types

When someone selects "Other" and describes their business, the AI generates custom checklist items.

### Example: "Mobile dog grooming"

```json
{
  "checklist": [
    { "item": "Dog grooming qualification or certification", "priority": 1 },
    { "item": "Vehicle set up for grooming", "priority": 1 },
    { "item": "Insurance (public liability + care, custody, control)", "priority": 1, "regulatory": true },
    { "item": "Booking and scheduling system", "priority": 2 },
    { "item": "Service area / travel radius defined", "priority": 2 },
    { "item": "Pricing per breed / size", "priority": 2 },
    { "item": "Cancellation and no-show policy", "priority": 3 }
  ],
  "questions": [
    {
      "text": "Do you have a vehicle set up for mobile grooming?",
      "type": "single",
      "options": [
        "Yes  -  fully equipped",
        "Partially  -  needs some work",
        "No  -  still planning this"
      ]
    },
    {
      "text": "What services will you offer?",
      "type": "multi",
      "options": [
        "Full groom",
        "Bath and dry",
        "Nail trimming",
        "Puppy introductions",
        "De-shedding treatments",
        "Other"
      ]
    }
  ],
  "flags": [
    {
      "type": "regulatory",
      "message": "Mobile dog grooming typically requires public liability insurance and may require 'care, custody and control' cover. Check local council requirements for operating a mobile business."
    }
  ]
}
```

---

## Priority Levels

| Priority | Meaning |
|----------|---------|
| 1 | Must have before launching / critical |
| 2 | Important, should have soon |
| 3 | Nice to have, can wait |

---

## Regulatory Flags

Items marked `regulatory: true` are legal/compliance requirements that should be:
- Highlighted prominently in the report
- Not skipped or deferred
- Linked to resources where possible
