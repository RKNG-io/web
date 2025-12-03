# Reckoning Results Page

Dynamic route for displaying generated Reckoning reports.

## Overview

This page displays a comprehensive, personalised Reckoning report based on the user's questionnaire responses. The report includes strategic insights, diagnosis of current challenges, a roadmap forward, cost of waiting analysis, and recommended services.

## Features

### Page Sections

1. **Hero Header** - Report title with generation date
2. **Opening Message** - Personalised greeting based on persona
3. **Snapshot** - Current state, goal, and gap analysis
4. **Diagnosis** - Key issues holding the user back (with impact levels)
5. **Journey Map** - Phased roadmap with actions and timelines
6. **Cost of Waiting** - Financial, time, and opportunity costs
7. **Next Step CTA** - Primary recommendation with urgency indicator
8. **Recommended Services** - Personalised service packages
9. **Final CTA** - Action buttons for next steps

### Components

- **ReportSection** - Consistent section wrapper with optional title/subtitle
- **DiagnosisCard** - Displays individual diagnosis with impact badge and evidence
- **JourneyPhase** - Shows journey phases with timeline and actions
- **CostCard** - Displays cost of waiting items by type (financial/time/opportunity)

### States

- **Loading** - Spinner whilst fetching report from localStorage
- **Not Found** - Friendly error when report doesn't exist
- **Report Display** - Full report with all sections

## Data Storage (MVP)

Reports are stored in `localStorage` with the key format: `reckoning-{id}`

### Storing a Report

```javascript
const report = {
  id: 'unique-id',
  generatedAt: new Date().toISOString(),
  // ... rest of report data
};

localStorage.setItem(`reckoning-${report.id}`, JSON.stringify(report));
```

### Testing with Mock Data

1. Import mock data in your browser console or test file:

```javascript
// In browser console
const mockReport = /* copy from /src/lib/mockReportData.ts */;
localStorage.setItem('reckoning-test-123', JSON.stringify(mockReport));
```

2. Navigate to `/reckoning/test-123`

## Type Definitions

See `/src/types/reckoning.ts` for complete TypeScript interfaces:

- `ReckoningReport` - Complete report structure
- `ReckoningSnapshot` - Current state/goal/gap
- `DiagnosisIssue` - Individual diagnosis item
- `JourneyPhase` - Journey roadmap phase
- `JourneyAction` - Actions within a phase
- `CostOfWaiting` - Cost item (financial/time/opportunity)
- `NextStep` - Primary recommended action
- `RecommendedService` - Service package details

## Styling

- Uses brand colours from `/src/app/globals.css`
- Card-based layout with visual hierarchy
- Responsive design (mobile-first)
- Accessible colour contrast and focus states

## Future Enhancements

- PDF generation and download
- Email delivery of reports
- Share functionality
- Backend API integration
- Report history/archive
- Print-optimised styles
