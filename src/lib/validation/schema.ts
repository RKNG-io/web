// Schema validation for Claude API output

import type { ReckoningReport, ValidationResult } from '@/types/report';

// JSON Schema for Claude structured output - FULL NESTED STRUCTURE
export const REPORT_JSON_SCHEMA = {
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
      "required": ["opening", "snapshot", "diagnosis", "journey_map", "next_step", "closing"],
      "properties": {
        "opening": {
          "type": "object",
          "required": ["headline", "body"],
          "properties": {
            "headline": { "type": "string", "description": "Personalised headline using their name and specific details" },
            "body": { "type": "string", "description": "Opening paragraph with insight and direct quotes" }
          }
        },
        "snapshot": {
          "type": "object",
          "required": ["stage", "stage_description", "strengths", "blockers"],
          "properties": {
            "stage": { "type": "string", "description": "Current business stage (e.g. 'Pre-launch', 'Revenue-generating')" },
            "stage_description": { "type": "string", "description": "Brief explanation of where they are" },
            "strengths": {
              "type": "array",
              "items": { "type": "string" },
              "minItems": 2,
              "maxItems": 4,
              "description": "Their clear strengths/advantages (NOT echoes like 'you identified...')"
            },
            "blockers": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["blocker", "why_blocked", "unlock"],
                "properties": {
                  "blocker": { "type": "string" },
                  "why_blocked": { "type": "string" },
                  "unlock": { "type": "string" }
                }
              },
              "minItems": 1,
              "maxItems": 3
            }
          }
        },
        "diagnosis": {
          "type": "object",
          "required": ["primary_blocker", "cost_of_inaction"],
          "properties": {
            "primary_blocker": {
              "type": "object",
              "required": ["title", "explanation", "impact"],
              "properties": {
                "title": { "type": "string", "description": "Name of the blocker" },
                "explanation": { "type": "string", "description": "Why this is blocking them (with insight)" },
                "impact": { "type": "string", "description": "What changes when this is unlocked" }
              }
            },
            "cost_of_inaction": {
              "type": "object",
              "required": ["narrative"],
              "properties": {
                "narrative": { "type": "string", "description": "What happens if they don't act" },
                "calculation": {
                  "type": "object",
                  "properties": {
                    "hours_per_week": { "type": "number" },
                    "hourly_value": { "type": "number" },
                    "weeks_per_year": { "type": "number", "maximum": 52 },
                    "annual_cost": { "type": "number" }
                  }
                }
              }
            },
            "secondary_blockers": { "type": "array", "items": { "type": "object" } }
          }
        },
        "journey_map": {
          "type": "object",
          "required": ["overview", "phases"],
          "properties": {
            "overview": { "type": "string" },
            "phases": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "items": {
                "type": "object",
                "required": ["number", "title", "duration", "focus", "tasks", "completion_criteria"],
                "properties": {
                  "number": { "type": "integer", "minimum": 1, "maximum": 3 },
                  "title": { "type": "string" },
                  "duration": { "type": "string" },
                  "focus": { "type": "string" },
                  "tasks": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["task", "priority"],
                      "properties": {
                        "task": { "type": "string" },
                        "priority": { "enum": ["must", "should", "could"] }
                      }
                    },
                    "minItems": 2,
                    "maxItems": 4
                  },
                  "completion_criteria": { "type": "string", "description": "What does 'done' look like? e.g., '3+ people have paid a deposit'" }
                }
              }
            }
          }
        },
        "next_step": {
          "type": "object",
          "required": ["headline", "the_one_thing", "diy_path", "supported_path"],
          "properties": {
            "headline": { "type": "string" },
            "the_one_thing": {
              "type": "object",
              "required": ["action", "why_this", "how_to_start"],
              "properties": {
                "action": { "type": "string", "description": "ONE specific action completable this week" },
                "why_this": { "type": "string" },
                "how_to_start": { "type": "string" }
              }
            },
            "diy_path": {
              "type": "object",
              "required": ["description", "first_step", "resources"],
              "properties": {
                "description": { "type": "string", "description": "How they could do it themselves" },
                "first_step": { "type": "string" },
                "resources": { "type": "array", "items": { "type": "string" } }
              }
            },
            "supported_path": {
              "type": "object",
              "required": ["description", "service_id", "price_from"],
              "properties": {
                "description": { "type": "string" },
                "service_id": { "type": "string", "description": "ID from the services catalogue" },
                "price_from": { "type": "number" }
              }
            }
          }
        },
        "closing": {
          "type": "object",
          "required": ["message", "sign_off"],
          "properties": {
            "message": { "type": "string", "description": "Warm closing that references their situation" },
            "sign_off": { "type": "string", "description": "Final encouragement presenting both paths as valid" }
          }
        }
      }
    },
    "recommendations": {
      "type": "object",
      "required": ["services", "package"],
      "properties": {
        "services": {
          "type": "array",
          "minItems": 1,
          "maxItems": 5,
          "items": {
            "type": "object",
            "required": ["service_id", "service_name", "why_recommended", "priority", "price_from"],
            "properties": {
              "service_id": { "type": "string" },
              "service_name": { "type": "string" },
              "why_recommended": { "type": "string" },
              "priority": { "type": "integer", "minimum": 1, "maximum": 5 },
              "price_from": { "type": "number" }
            }
          }
        },
        "package": { "enum": ["launcher", "builder", "architect", null] }
      }
    },
    "input_echo": {
      "type": "object",
      "required": ["name", "persona", "primary_goal", "biggest_blocker", "quoted_phrases"],
      "properties": {
        "name": { "type": "string" },
        "persona": { "enum": ["launcher", "builder", "architect"] },
        "primary_goal": { "type": "string" },
        "biggest_blocker": { "type": "string" },
        "quoted_phrases": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 2,
          "maxItems": 5,
          "description": "Direct quotes from their answers (2-5 phrases)"
        }
      }
    }
  }
};

export function validateSchema(report: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const r = report as ReckoningReport;
  
  // Required fields exist
  if (!r.version) errors.push("Missing version");
  if (!r.meta?.persona) errors.push("Missing persona");
  if (!r.meta?.submission_id) errors.push("Missing submission_id");
  if (!r.recipient?.name) errors.push("Missing recipient name");
  if (!r.recipient?.business_type) errors.push("Missing business_type");
  
  // Sections validation
  if (!r.sections?.opening) errors.push("Missing opening section");
  if (!r.sections?.snapshot) errors.push("Missing snapshot section");
  if (!r.sections?.diagnosis) errors.push("Missing diagnosis section");
  if (!r.sections?.journey_map) errors.push("Missing journey_map section");
  if (!r.sections?.next_step) errors.push("Missing next_step section");
  if (!r.sections?.closing) errors.push("Missing closing section");
  
  // Opening section
  if (r.sections?.opening) {
    if (!r.sections.opening.headline) errors.push("Missing opening headline");
    if (!r.sections.opening.body) errors.push("Missing opening body");
  }
  
  // Snapshot section
  if (r.sections?.snapshot) {
    if (!r.sections.snapshot.stage) errors.push("Missing snapshot stage");
    if (!r.sections.snapshot.strengths?.length) errors.push("Missing snapshot strengths");
    if (!r.sections.snapshot.blockers?.length) errors.push("Missing snapshot blockers");
  }
  
  // Diagnosis section
  if (r.sections?.diagnosis) {
    if (!r.sections.diagnosis.primary_blocker?.title) errors.push("Missing primary blocker");
    if (!r.sections.diagnosis.cost_of_inaction?.narrative) errors.push("Missing cost of inaction");
  }
  
  // Journey map has exactly 3 phases
  if (r.sections?.journey_map?.phases?.length !== 3) {
    errors.push("Journey map must have exactly 3 phases");
  }

  // Each phase should have completion_criteria
  if (r.sections?.journey_map?.phases) {
    for (const phase of r.sections.journey_map.phases) {
      if (!phase.completion_criteria) {
        warnings.push(`Phase ${phase.number || '?'} missing completion_criteria`);
      }
    }
  }
  
  // Next step section
  if (r.sections?.next_step) {
    if (!r.sections.next_step.the_one_thing?.action) errors.push("Missing the_one_thing action");
    if (!r.sections.next_step.diy_path?.description) errors.push("Missing diy_path");
    if (!r.sections.next_step.supported_path?.service_id) errors.push("Missing supported_path service");
  }
  
  // Closing section
  if (r.sections?.closing) {
    if (!r.sections.closing.message) errors.push("Missing closing message");
    if (!r.sections.closing.sign_off) errors.push("Missing closing sign_off");
  }
  
  // Input echo validation
  if (!r.input_echo) {
    errors.push("Missing input_echo");
  } else {
    if (!r.input_echo.name) errors.push("Missing input_echo name");
    if (!r.input_echo.persona) errors.push("Missing input_echo persona");
    if (!r.input_echo.quoted_phrases?.length || r.input_echo.quoted_phrases.length < 2) {
      errors.push("Must include at least 2 quoted phrases from user");
    }
  }
  
  // At least 1 service recommendation
  if (!r.recommendations?.services?.length) {
    errors.push("Must have at least 1 service recommendation");
  } else if (r.recommendations.services.length > 5) {
    warnings.push("More than 5 service recommendations — consider trimming");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
