-- Reckoning Initial Schema
-- Run with: psql $DATABASE_URL -f 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reckonings table (questionnaire responses and generated reports)
CREATE TABLE IF NOT EXISTS reckonings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(32) UNIQUE NOT NULL,
  persona VARCHAR(20) NOT NULL CHECK (persona IN ('launcher', 'builder', 'architect')),
  answers JSONB NOT NULL,
  report JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'reviewed')),
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  email VARCHAR(255),
  name VARCHAR(255)
);

-- Intake requests table (bypass questionnaire direct requests)
CREATE TABLE IF NOT EXISTS intake_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('website', 'automations', 'social')),
  answers JSONB NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_preference VARCHAR(20),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'converted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (purchases from services catalogue)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reckoning_id UUID REFERENCES reckonings(id),
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reckonings_token ON reckonings(token);
CREATE INDEX IF NOT EXISTS idx_reckonings_status ON reckonings(status);
CREATE INDEX IF NOT EXISTS idx_reckonings_created_at ON reckonings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intake_requests_status ON intake_requests(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_reckoning ON orders(reckoning_id);

-- Add comment for documentation
COMMENT ON TABLE reckonings IS 'Questionnaire responses and AI-generated reports';
COMMENT ON TABLE intake_requests IS 'Direct service requests (bypass questionnaire)';
COMMENT ON TABLE orders IS 'Service purchases via Stripe';
