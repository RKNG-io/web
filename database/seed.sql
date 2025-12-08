-- Seed data for development/testing
-- Run with: psql $DATABASE_URL -f seed.sql

-- Sample Launcher reckoning
INSERT INTO reckonings (token, persona, answers, name, email, status) VALUES
(
  'test-launcher-001',
  'launcher',
  '{
    "business_idea": "I want to start a copywriting business for tech startups",
    "current_stage": "idea",
    "biggest_block": "I don''t know what to charge or how to find clients",
    "time_available": "10-20 hours",
    "budget_range": "under-500",
    "tech_comfort": "comfortable",
    "name": "Sarah",
    "email": "sarah@test.com"
  }',
  'Sarah',
  'sarah@test.com',
  'pending'
);

-- Sample Builder reckoning
INSERT INTO reckonings (token, persona, answers, name, email, status) VALUES
(
  'test-builder-001',
  'builder',
  '{
    "business_type": "Virtual assistant services",
    "monthly_revenue": "3000-5000",
    "time_on_admin": "15-20 hours",
    "biggest_frustration": "Client onboarding takes forever and I''m always chasing invoices",
    "automation_experience": "basic",
    "growth_goal": "double revenue without doubling hours",
    "name": "Marcus",
    "email": "marcus@test.com"
  }',
  'Marcus',
  'marcus@test.com',
  'pending'
);

-- Sample Architect reckoning
INSERT INTO reckonings (token, persona, answers, name, email, status) VALUES
(
  'test-architect-001',
  'architect',
  '{
    "business_model": "Marketing consultancy with 3 contractors",
    "team_size": "3-5",
    "monthly_revenue": "20000+",
    "current_systems": ["project-management", "invoicing", "email"],
    "bottleneck": "I''m the bottleneck for every client decision",
    "growth_goal": "Take a month off without the business stopping",
    "name": "Diana",
    "email": "diana@test.com"
  }',
  'Diana',
  'diana@test.com',
  'pending'
);

-- Sample intake request
INSERT INTO intake_requests (type, answers, name, email, status) VALUES
(
  'website',
  '{
    "pages_needed": "landing, about, services, contact",
    "has_copy": "partial",
    "has_branding": "yes",
    "deadline": "2 weeks",
    "budget": "500-1000"
  }',
  'Test User',
  'test@test.com',
  'new'
);
