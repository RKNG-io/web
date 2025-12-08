# Reckoning  -  Report Generation System Specification

**Version:** 1.0  
**Purpose:** Ensure every Reckoning report is accurate, personal, on-brand, and safe before reaching the client.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Questionnaire                                                              │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Prompt    │───▶│   Claude    │───▶│  Validate   │───▶│  Confidence │  │
│  │   Builder   │    │    API      │    │   Output    │    │   Scorer    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘  │
│                                                                   │         │
│                                              ┌────────────────────┴───┐     │
│                                              │                        │     │
│                                              ▼                        ▼     │
│                                        HIGH (≥90%)              LOW (<90%)  │
│                                              │                        │     │
│                                              ▼                        ▼     │
│                                     ┌─────────────┐          ┌───────────┐  │
│                                     │  Auto-send  │          │   Queue   │  │
│                                     │  Generate   │          │    for    │  │
│                                     │    PDF      │          │  Review   │  │
│                                     └─────────────┘          └─────┬─────┘  │
│                                              │                     │        │
│                                              ▼                     ▼        │
│                                          Client              Admin Dashboard│
│                                                                    │        │
│                                                     ┌──────────────┼────┐   │
│                                                     ▼              ▼    ▼   │
│                                                  Approve    Edit    Regen   │
│                                                     │                       │
│                                                     ▼                       │
│                                                  Client                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Structured Output Schema

Claude MUST return this exact JSON structure. Any deviation = validation failure.

### Report JSON Schema

```typescript
// types/report.ts

export interface ReckoningReport {
  version: "1.0";
  generated_at: string; // ISO timestamp
  
  meta: {
    persona: "launcher" | "builder" | "architect";
    submission_id: string;
    model: string;
    prompt_version: string;
  };
  
  recipient: {
    name: string;                    // From questionnaire
    business_name: string | null;    // May not exist yet (launchers)
    business_type: string;           // e.g., "coaching", "freelance design"
    industry: string | null;         // e.g., "health & wellness"
  };
  
  sections: {
    opening: OpeningSection;
    snapshot: SnapshotSection;
    diagnosis: DiagnosisSection;
    journey_map: JourneyMapSection;
    next_step: NextStepSection;
    closing: ClosingSection;
  };
  
  recommendations: {
    services: ServiceRecommendation[];
    package: "launcher" | "builder" | "architect" | null;
  };
  
  // For validation  -  echo back key inputs
  input_echo: {
    name: string;
    persona: string;
    primary_goal: string;
    biggest_blocker: string;
    quoted_phrases: string[]; // Their exact words we used
  };
}

interface OpeningSection {
  headline: string;  // Personal, uses their name
  body: string;      // 2-3 sentences, reflects their goal back
}

interface SnapshotSection {
  stage: string;
  stage_description: string;
  strengths: string[];        // 2-4 items
  blockers: string[];         // 2-4 items  
}

interface DiagnosisSection {
  primary_blocker: {
    title: string;
    explanation: string;
    impact: string;
  };
  secondary_blockers: Array<{
    title: string;
    explanation: string;
  }>;
  cost_of_inaction: {
    narrative: string;
    calculation: {
      hours_per_week: number;
      hourly_value: number;
      weeks_per_year: number;
      annual_cost: number;
    } | null;  // Only if we have enough data
  };
}

interface JourneyMapSection {
  overview: string;
  phases: [Phase, Phase, Phase]; // Always exactly 3 phases
}

interface Phase {
  number: 1 | 2 | 3;
  title: string;
  duration: string;  // e.g., "Week 1-2"
  focus: string;
  tasks: Array<{
    task: string;
    diy_option: string | null;
    service_id: string | null;
    priority: "must" | "should" | "could";
  }>;
}

interface NextStepSection {
  headline: string;
  the_one_thing: {
    action: string;
    why_this: string;
    how_to_start: string;
  };
  diy_path: {
    description: string;
    first_step: string;
    resources: string[];
  };
  supported_path: {
    description: string;
    recommended_service: string;
    service_id: string;
    price_from: number;
  };
}

interface ClosingSection {
  message: string;  // Encouraging, permission-giving
  sign_off: string; // e.g., "Your time is now."
}

interface ServiceRecommendation {
  service_id: string;
  service_name: string;
  relevance: string;    // Why this service for them
  priority: 1 | 2 | 3;  // 1 = highest
  price_from: number;
}
```

### JSON Schema for Claude

Include this in the system prompt to force structured output:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "generated_at", "meta", "recipient", "sections", "recommendations", "input_echo"],
  "properties": {
    "version": { "const": "1.0" },
    "generated_at": { "type": "string", "format": "date-time" },
    "meta": {
      "type": "object",
      "required": ["persona", "submission_id", "model", "prompt_version"],
      "properties": {
        "persona": { "enum": ["launcher", "builder", "architect"] },
        "submission_id": { "type": "string" },
        "model": { "type": "string" },
        "prompt_version": { "type": "string" }
      }
    },
    "recipient": {
      "type": "object",
      "required": ["name", "business_type"],
      "properties": {
        "name": { "type": "string", "minLength": 1 },
        "business_name": { "type": ["string", "null"] },
        "business_type": { "type": "string" },
        "industry": { "type": ["string", "null"] }
      }
    },
    "sections": {
      "type": "object",
      "required": ["opening", "snapshot", "diagnosis", "journey_map", "next_step", "closing"]
    },
    "recommendations": {
      "type": "object",
      "required": ["services", "package"],
      "properties": {
        "services": { "type": "array", "minItems": 1, "maxItems": 5 },
        "package": { "enum": ["launcher", "builder", "architect", null] }
      }
    },
    "input_echo": {
      "type": "object",
      "required": ["name", "persona", "primary_goal", "biggest_blocker", "quoted_phrases"],
      "properties": {
        "quoted_phrases": { "type": "array", "minItems": 2 }
      }
    }
  }
}
```

---

## 2. Validation Rules

### Schema Validation (Hard Fail)

These MUST pass or the report is rejected:

```typescript
// lib/validation/schema.ts

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSchema(report: unknown): ValidationResult {
  const errors: string[] = [];
  
  // Required fields exist
  if (!report.version) errors.push("Missing version");
  if (!report.meta?.persona) errors.push("Missing persona");
  if (!report.recipient?.name) errors.push("Missing recipient name");
  if (!report.sections?.opening) errors.push("Missing opening section");
  if (!report.sections?.snapshot) errors.push("Missing snapshot section");
  if (!report.sections?.diagnosis) errors.push("Missing diagnosis section");
  if (!report.sections?.journey_map) errors.push("Missing journey_map section");
  if (!report.sections?.next_step) errors.push("Missing next_step section");
  if (!report.sections?.closing) errors.push("Missing closing section");
  if (!report.input_echo) errors.push("Missing input_echo");
  
  // Journey map has exactly 3 phases
  if (report.sections?.journey_map?.phases?.length !== 3) {
    errors.push("Journey map must have exactly 3 phases");
  }
  
  // At least 1 service recommendation
  if (!report.recommendations?.services?.length) {
    errors.push("Must have at least 1 service recommendation");
  }
  
  // Input echo has quoted phrases
  if (!report.input_echo?.quoted_phrases?.length || 
      report.input_echo.quoted_phrases.length < 2) {
    errors.push("Must include at least 2 quoted phrases from user");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

### Input Echo Validation (Hard Fail)

The report MUST use their actual answers:

```typescript
// lib/validation/input-echo.ts

export function validateInputEcho(
  report: ReckoningReport, 
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Name must match
  const submittedName = submission.answers.name?.toLowerCase().trim();
  const reportName = report.recipient.name?.toLowerCase().trim();
  
  if (submittedName !== reportName) {
    errors.push(`Name mismatch: submitted "${submittedName}", report uses "${reportName}"`);
  }
  
  // Persona must match
  const submittedPersona = submission.persona;
  const reportPersona = report.meta.persona;
  
  if (submittedPersona !== reportPersona) {
    errors.push(`Persona mismatch: submitted "${submittedPersona}", report uses "${reportPersona}"`);
  }
  
  // Quoted phrases must exist in original answers
  const allAnswerText = Object.values(submission.answers)
    .filter(v => typeof v === 'string')
    .join(' ')
    .toLowerCase();
  
  for (const phrase of report.input_echo.quoted_phrases) {
    const phraseClean = phrase.toLowerCase().replace(/['"]/g, '');
    if (!allAnswerText.includes(phraseClean) && phraseClean.length > 10) {
      warnings.push(`Quoted phrase not found in answers: "${phrase}"`);
    }
  }
  
  // Check for hallucination red flags
  const hallucination_patterns = [
    /you (mentioned|said|told us) you have \d+ employees/i,
    /your team of \d+/i,
    /your \$[\d,]+ revenue/i,
    /your [\d,]+ (clients|customers)/i,
  ];
  
  const reportText = JSON.stringify(report.sections);
  for (const pattern of hallucination_patterns) {
    if (pattern.test(reportText)) {
      // Check if this info was actually provided
      const match = reportText.match(pattern)?.[0];
      if (match && !allAnswerText.includes(match.toLowerCase())) {
        warnings.push(`Possible hallucination: "${match}"`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

### Brand Voice Validation (Soft Fail → Flag for Review)

Check for banned phrases and tone issues:

```typescript
// lib/validation/brand-voice.ts

const BANNED_PHRASES = [
  // Prescriptive language
  "you should",
  "you need to",
  "you must",
  "you have to",
  "what you need to understand",
  
  // Fear-based
  "most businesses fail",
  "you're leaving money on the table",
  "don't miss out",
  "act now",
  "limited time",
  
  // Patronising
  "the real problem is",
  "what you don't realise",
  "you might not know",
  "the truth is",
  
  // Generic/corporate
  "leverage",
  "synergy",
  "optimise your workflow",
  "streamline your processes",
  "unlock your potential",
  "take your business to the next level",
  
  // Sales pressure
  "buy now",
  "don't wait",
  "you can't afford not to",
  "this is a no-brainer",
];

const REQUIRED_TONE_MARKERS = [
  // Permission-giving
  /you (could|can|might)/i,
  /when you're ready/i,
  /both paths work/i,
  /run with it yourself/i,
  
  // Personal
  /your (name|business|goal)/i,
];

export function validateBrandVoice(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const reportText = JSON.stringify(report.sections).toLowerCase();
  
  // Check for banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (reportText.includes(phrase.toLowerCase())) {
      warnings.push(`Banned phrase found: "${phrase}"`);
    }
  }
  
  // Check for required tone markers (at least 2)
  let toneMarkerCount = 0;
  for (const pattern of REQUIRED_TONE_MARKERS) {
    if (pattern.test(reportText)) {
      toneMarkerCount++;
    }
  }
  
  if (toneMarkerCount < 2) {
    warnings.push("Missing permission-giving language (expected at least 2 markers)");
  }
  
  // Check opening uses their name
  if (!report.sections.opening.headline.includes(report.recipient.name)) {
    warnings.push("Opening headline doesn't use recipient's name");
  }
  
  // Check closing is encouraging
  const closingText = report.sections.closing.message.toLowerCase();
  const encouragingWords = ["ready", "can", "will", "possible", "beginning", "start"];
  const hasEncouragement = encouragingWords.some(word => closingText.includes(word));
  
  if (!hasEncouragement) {
    warnings.push("Closing message may not be encouraging enough");
  }
  
  return {
    valid: true,  // Brand voice issues are warnings, not hard failures
    errors,
    warnings
  };
}
```

---

### Maths Validation (Hard Fail if Calculation Present)

If we show numbers, they must add up:

```typescript
// lib/validation/maths.ts

export function validateCalculations(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const calc = report.sections.diagnosis.cost_of_inaction.calculation;
  
  if (calc) {
    const expected = calc.hours_per_week * calc.hourly_value * calc.weeks_per_year;
    
    if (Math.abs(expected - calc.annual_cost) > 1) {
      errors.push(
        `Calculation error: ${calc.hours_per_week} × £${calc.hourly_value} × ${calc.weeks_per_year} ` +
        `= £${expected}, but report shows £${calc.annual_cost}`
      );
    }
    
    // Sanity checks
    if (calc.hours_per_week > 60) {
      errors.push(`Unrealistic hours_per_week: ${calc.hours_per_week}`);
    }
    if (calc.hourly_value > 500) {
      errors.push(`Unrealistic hourly_value: £${calc.hourly_value}`);
    }
    if (calc.weeks_per_year > 52) {
      errors.push(`weeks_per_year cannot exceed 52`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

### Service Validation (Hard Fail)

Recommended services must exist in our catalogue:

```typescript
// lib/validation/services.ts

import { services } from '@/data/services';

export function validateServices(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const validServiceIds = new Set(services.map(s => s.id));
  
  for (const rec of report.recommendations.services) {
    if (!validServiceIds.has(rec.service_id)) {
      errors.push(`Invalid service_id: "${rec.service_id}"`);
    }
    
    // Check price matches catalogue
    const service = services.find(s => s.id === rec.service_id);
    if (service && Math.abs(service.price_from - rec.price_from) > 0) {
      warnings.push(
        `Price mismatch for ${rec.service_id}: catalogue says £${service.price_from}, ` +
        `report says £${rec.price_from}`
      );
    }
  }
  
  // Check next_step service exists
  const nextStepServiceId = report.sections.next_step.supported_path.service_id;
  if (!validServiceIds.has(nextStepServiceId)) {
    errors.push(`Invalid service_id in next_step: "${nextStepServiceId}"`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## 3. Confidence Scoring

Combine validation results into a single confidence score:

```typescript
// lib/validation/confidence.ts

interface ConfidenceResult {
  score: number;  // 0-100
  autoApprove: boolean;
  flags: string[];
  validationResults: {
    schema: ValidationResult;
    inputEcho: ValidationResult;
    brandVoice: ValidationResult;
    maths: ValidationResult;
    services: ValidationResult;
  };
}

export function calculateConfidence(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ConfidenceResult {
  
  const results = {
    schema: validateSchema(report),
    inputEcho: validateInputEcho(report, submission),
    brandVoice: validateBrandVoice(report),
    maths: validateCalculations(report),
    services: validateServices(report),
  };
  
  // Hard failures = 0 confidence
  const hardFailures = [
    ...results.schema.errors,
    ...results.inputEcho.errors,
    ...results.maths.errors,
    ...results.services.errors,
  ];
  
  if (hardFailures.length > 0) {
    return {
      score: 0,
      autoApprove: false,
      flags: hardFailures,
      validationResults: results,
    };
  }
  
  // Start at 100, deduct for warnings
  let score = 100;
  const flags: string[] = [];
  
  // Collect all warnings
  const allWarnings = [
    ...results.inputEcho.warnings,
    ...results.brandVoice.warnings,
    ...results.services.warnings,
  ];
  
  // Deduct 5 points per warning, max 50 point deduction
  const warningDeduction = Math.min(allWarnings.length * 5, 50);
  score -= warningDeduction;
  flags.push(...allWarnings);
  
  // Bonus points for good signals
  if (report.input_echo.quoted_phrases.length >= 4) {
    score += 5;  // Extra personalisation
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  return {
    score,
    autoApprove: score >= 90 && allWarnings.length <= 2,
    flags,
    validationResults: results,
  };
}
```

---

## 4. API Route Implementation

```typescript
// app/api/reckoning/route.ts

import Anthropic from '@anthropic-ai/sdk';
import { calculateConfidence } from '@/lib/validation/confidence';
import { buildPrompt } from '@/lib/prompts/builder';
import { db } from '@/lib/db';
import { generatePDF } from '@/lib/pdf/generator';
import { sendReckoningEmail } from '@/lib/email/send';

export async function POST(request: Request) {
  const { submissionId } = await request.json();
  
  // 1. Fetch submission
  const submission = await db.questionnaireSubmissions.findUnique({
    where: { id: submissionId }
  });
  
  if (!submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 });
  }
  
  // 2. Build prompt
  const { systemPrompt, userMessage } = buildPrompt(submission);
  
  // 3. Call Claude
  const anthropic = new Anthropic();
  
  let report: ReckoningReport;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });
      
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }
      
      // Parse JSON
      report = JSON.parse(content.text);
      
      // 4. Validate
      const confidence = calculateConfidence(report, submission);
      
      if (confidence.score === 0 && attempts < maxAttempts) {
        // Hard failure  -  retry with error feedback
        console.log(`Attempt ${attempts} failed:`, confidence.flags);
        continue;
      }
      
      // 5. Store report
      const reckoning = await db.reckonings.create({
        data: {
          submission_id: submissionId,
          persona: report.meta.persona,
          status: confidence.autoApprove ? 'ready' : 'pending_review',
          report_data: report,
          confidence_score: confidence.score,
          validation_flags: confidence.flags,
          share_token: generateShareToken(),
        }
      });
      
      // 6. If auto-approved, generate PDF and notify
      if (confidence.autoApprove) {
        const pdfUrl = await generatePDF(reckoning.id, report);
        
        await db.reckonings.update({
          where: { id: reckoning.id },
          data: { pdf_url: pdfUrl }
        });
        
        await sendReckoningEmail({
          to: submission.email,
          name: report.recipient.name,
          reckoningUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/reckoning/${reckoning.share_token}`,
        });
      } else {
        // Notify admin of pending review
        await notifyAdminPendingReview(reckoning.id, confidence.flags);
      }
      
      return Response.json({
        success: true,
        reckoningId: reckoning.id,
        shareToken: reckoning.share_token,
        status: reckoning.status,
        confidence: confidence.score,
      });
      
    } catch (error) {
      console.error(`Attempt ${attempts} error:`, error);
      if (attempts >= maxAttempts) {
        // Store failed attempt for manual intervention
        await db.reckonings.create({
          data: {
            submission_id: submissionId,
            persona: submission.persona,
            status: 'failed',
            report_data: {},
            error_log: error.message,
          }
        });
        
        return Response.json({ error: 'Generation failed' }, { status: 500 });
      }
    }
  }
}

function generateShareToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'rk_';
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
```

---

## 5. Admin Dashboard

### Routes

```
/admin                    → Dashboard overview
/admin/reports            → All reports (filterable by status)
/admin/reports/[id]       → Single report review
/admin/reports/[id]/edit  → Edit report
```

### Dashboard Overview

```typescript
// app/admin/page.tsx

export default async function AdminDashboard() {
  const stats = await getReportStats();
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Reckoning Admin</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Pending Review" 
          value={stats.pending} 
          href="/admin/reports?status=pending_review"
          urgent={stats.pending > 0}
        />
        <StatCard 
          label="Auto-Approved (24h)" 
          value={stats.autoApproved24h} 
        />
        <StatCard 
          label="Total Generated" 
          value={stats.total} 
        />
        <StatCard 
          label="Avg Confidence" 
          value={`${stats.avgConfidence}%`} 
        />
      </div>
      
      {/* Pending reviews */}
      {stats.pending > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Needs Your Attention</h2>
          <PendingReportsList limit={5} />
        </section>
      )}
      
      {/* Recent reports */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <RecentReportsList limit={10} />
      </section>
    </div>
  );
}
```

### Report Review Page

```typescript
// app/admin/reports/[id]/page.tsx

export default async function ReportReview({ params }: { params: { id: string } }) {
  const reckoning = await db.reckonings.findUnique({
    where: { id: params.id },
    include: { submission: true }
  });
  
  if (!reckoning) notFound();
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Report for {reckoning.report_data.recipient.name}
          </h1>
          <p className="text-gray-500">
            {reckoning.report_data.meta.persona} • 
            Confidence: {reckoning.confidence_score}%
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" href={`/admin/reports/${params.id}/edit`}>
            Edit
          </Button>
          <RegenerateButton reckoningId={params.id} />
          <ApproveButton reckoningId={params.id} />
        </div>
      </div>
      
      {/* Validation flags */}
      {reckoning.validation_flags.length > 0 && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-warning mb-2">Flagged Issues</h3>
          <ul className="list-disc list-inside text-sm">
            {reckoning.validation_flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Two-column layout: Answers | Report */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* Left: Original answers */}
        <div className="bg-ice rounded-lg p-6">
          <h2 className="font-semibold mb-4">Questionnaire Answers</h2>
          <AnswersDisplay answers={reckoning.submission.answers} />
        </div>
        
        {/* Right: Generated report */}
        <div className="bg-white border border-stone rounded-lg p-6">
          <h2 className="font-semibold mb-4">Generated Report</h2>
          <ReportPreview report={reckoning.report_data} />
        </div>
        
      </div>
    </div>
  );
}
```

### Report Actions

```typescript
// app/admin/reports/[id]/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

export async function approveReport(reckoningId: string) {
  const reckoning = await db.reckonings.findUnique({
    where: { id: reckoningId },
    include: { submission: true }
  });
  
  // Generate PDF if not exists
  if (!reckoning.pdf_url) {
    const pdfUrl = await generatePDF(reckoningId, reckoning.report_data);
    await db.reckonings.update({
      where: { id: reckoningId },
      data: { pdf_url: pdfUrl }
    });
  }
  
  // Update status
  await db.reckonings.update({
    where: { id: reckoningId },
    data: { status: 'ready' }
  });
  
  // Send email
  await sendReckoningEmail({
    to: reckoning.submission.email,
    name: reckoning.report_data.recipient.name,
    reckoningUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/reckoning/${reckoning.share_token}`,
  });
  
  revalidatePath('/admin/reports');
  revalidatePath(`/admin/reports/${reckoningId}`);
}

export async function regenerateReport(reckoningId: string) {
  const reckoning = await db.reckonings.findUnique({
    where: { id: reckoningId }
  });
  
  // Mark as regenerating
  await db.reckonings.update({
    where: { id: reckoningId },
    data: { status: 'generating' }
  });
  
  // Trigger regeneration
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/reckoning`, {
    method: 'POST',
    body: JSON.stringify({ 
      submissionId: reckoning.submission_id,
      regenerate: true,
      previousReckoningId: reckoningId 
    }),
  });
  
  revalidatePath('/admin/reports');
}

export async function updateReport(reckoningId: string, updates: Partial<ReckoningReport>) {
  const reckoning = await db.reckonings.findUnique({
    where: { id: reckoningId }
  });
  
  const updatedReport = {
    ...reckoning.report_data,
    ...updates,
    sections: {
      ...reckoning.report_data.sections,
      ...updates.sections,
    }
  };
  
  // Re-validate
  const confidence = calculateConfidence(updatedReport, reckoning.submission);
  
  await db.reckonings.update({
    where: { id: reckoningId },
    data: {
      report_data: updatedReport,
      confidence_score: confidence.score,
      validation_flags: confidence.flags,
      edited_at: new Date(),
      edited_by: 'admin',  // TODO: proper auth
    }
  });
  
  revalidatePath(`/admin/reports/${reckoningId}`);
}
```

---

## 6. Prompt Builder

Construct the prompt from persona template + questionnaire answers:

```typescript
// lib/prompts/builder.ts

import { launcherPrompt } from './personas/launcher';
import { builderPrompt } from './personas/builder';
import { architectPrompt } from './personas/architect';
import { baseSystemPrompt } from './base';
import { jsonSchema } from './schema';

const personaPrompts = {
  launcher: launcherPrompt,
  builder: builderPrompt,
  architect: architectPrompt,
};

export function buildPrompt(submission: QuestionnaireSubmission) {
  const persona = submission.persona as keyof typeof personaPrompts;
  const personaPrompt = personaPrompts[persona];
  
  const systemPrompt = `
${baseSystemPrompt}

${personaPrompt}

## Output Format

You MUST respond with valid JSON matching this schema exactly:

\`\`\`json
${JSON.stringify(jsonSchema, null, 2)}
\`\`\`

Do not include any text outside the JSON object.
Do not wrap the JSON in markdown code blocks.
Return ONLY the JSON object.
`;

  const userMessage = `
## Questionnaire Submission

**Submission ID:** ${submission.id}
**Persona:** ${persona}
**Submitted:** ${submission.created_at}

## Their Answers

${formatAnswers(submission.answers)}

---

Generate their Reckoning report based on these answers. Remember to:

1. Use their name (${submission.answers.name}) in the opening
2. Quote their exact words at least 2-3 times
3. Match recommendations to their specific blockers
4. Keep all calculations accurate
5. Maintain warm, permission-giving tone throughout
6. Never use banned phrases (you should, you must, most businesses fail, etc.)

Return ONLY valid JSON matching the schema.
`;

  return { systemPrompt, userMessage };
}

function formatAnswers(answers: Record<string, unknown>): string {
  return Object.entries(answers)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `**${formatKey(key)}:**\n${value.map(v => `- ${v}`).join('\n')}`;
      }
      return `**${formatKey(key)}:** ${value}`;
    })
    .join('\n\n');
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
```

---

## 7. Database Additions

Add these columns to the `reckonings` table:

```sql
ALTER TABLE reckonings ADD COLUMN confidence_score INTEGER;
ALTER TABLE reckonings ADD COLUMN validation_flags JSONB DEFAULT '[]';
ALTER TABLE reckonings ADD COLUMN error_log TEXT;
ALTER TABLE reckonings ADD COLUMN edited_at TIMESTAMPTZ;
ALTER TABLE reckonings ADD COLUMN edited_by TEXT;
ALTER TABLE reckonings ADD COLUMN generation_attempts INTEGER DEFAULT 1;
```

---

## 8. Monitoring & Alerts

### Metrics to Track

| Metric | Alert Threshold |
|--------|-----------------|
| Reports pending review | > 5 |
| Avg confidence score (24h) | < 80% |
| Generation failures (24h) | > 2 |
| Time in pending queue | > 4 hours |

### Notification (Simple Email)

```typescript
// lib/notifications/admin.ts

export async function notifyAdminPendingReview(
  reckoningId: string, 
  flags: string[]
) {
  await resend.emails.send({
    from: 'Reckoning <system@rkng.com>',
    to: 'liz@rkng.com',  // TODO: from env
    subject: `Report needs review: ${reckoningId}`,
    text: `
A new report needs your review.

Flags:
${flags.map(f => `- ${f}`).join('\n')}

Review: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/reports/${reckoningId}
    `.trim(),
  });
}
```

---

## Summary

| Component | File(s) |
|-----------|---------|
| **Report schema** | `types/report.ts` |
| **Validation** | `lib/validation/*.ts` |
| **Confidence scoring** | `lib/validation/confidence.ts` |
| **API route** | `app/api/reckoning/route.ts` |
| **Prompt builder** | `lib/prompts/builder.ts` |
| **Admin dashboard** | `app/admin/**` |
| **Actions** | `app/admin/reports/[id]/actions.ts` |

**Auto-approve threshold:** 90% confidence + ≤2 warnings

**Review queue for:** <90% confidence OR >2 warnings OR any hard failure

---

*Hand this to Claude CLI. It has the full spec for the QA system.*
