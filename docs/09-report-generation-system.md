# Report Generation System

## Overview

AI-powered report generation using Claude API with structured output validation.

## Flow

```
Questionnaire Submit
       ↓
Format Answers as Context
       ↓
Select Persona Prompt
       ↓
Call Claude API
       ↓
Parse JSON Response
       ↓
Validate Output
       ↓
Calculate Confidence Score
       ↓
Store in Database
       ↓
Redirect to Report Page
```

## Validation Layers

### 1. Schema Validation
- JSON structure matches expected format
- All required sections present
- No missing fields

### 2. Input Echo Validation
- Report references user's name
- Uses at least 2 of their exact phrases
- Numbers match what they provided

### 3. Brand Voice Validation
- No banned phrases detected
- Uses blocked/unlocked framing
- DIY path presented equally

### 4. Maths Validation
- Time calculations add up
- Cost calculations are accurate
- ROI claims are grounded

### 5. Services Validation
- Recommended services exist in catalogue
- Prices match current pricing
- No discontinued services

## Confidence Scoring

Score from 0.0 to 1.0 based on:
- Schema validity (0.2)
- Input echo count (0.2)
- Brand voice compliance (0.2)
- Maths accuracy (0.2)
- Services validity (0.2)

Reports with confidence < 0.7 flagged for manual review.

## Admin Dashboard

### Report Queue
- All pending reviews
- Filter by confidence score
- Sort by date

### Report Review
- Side-by-side: answers vs report
- Edit report sections
- Approve or regenerate

### Actions
- Approve (mark as reviewed)
- Regenerate (try again with same inputs)
- Edit (manual corrections)
- Archive (don't send)

## Error Handling

### Generation Failures
1. Retry once automatically
2. If still failing, queue for manual review
3. Show user "taking longer than expected" message

### Validation Failures
1. Log specific failures
2. Flag for review
3. May still show to user with disclaimer
