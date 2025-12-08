# Database Schema

## Overview

PostgreSQL database for storing questionnaire responses, generated reports, and user data.

## Tables

### reckonings

```sql
CREATE TABLE reckonings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(32) UNIQUE NOT NULL,
  persona VARCHAR(20) NOT NULL,
  answers JSONB NOT NULL,
  report JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  email VARCHAR(255),
  name VARCHAR(255)
);
```

### intake_requests

```sql
CREATE TABLE intake_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL, -- 'website', 'automations', 'social'
  answers JSONB NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_preference VARCHAR(20),
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reckoning_id UUID REFERENCES reckonings(id),
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_reckonings_token ON reckonings(token);
CREATE INDEX idx_reckonings_status ON reckonings(status);
CREATE INDEX idx_intake_requests_status ON intake_requests(status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
```

## Status Values

### Reckoning Status
- `pending` - Questionnaire submitted, report generating
- `completed` - Report generated successfully
- `failed` - Generation failed
- `reviewed` - Admin reviewed

### Intake Status
- `new` - Just submitted
- `quoted` - Quote sent
- `converted` - Became a customer
- `closed` - Not proceeding

### Order Status
- `pending` - Checkout started
- `paid` - Payment received
- `fulfilled` - Work delivered
- `refunded` - Money returned
