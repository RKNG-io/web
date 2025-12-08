# Appointment Bot Spec

**Status:** Draft — awaiting decisions
**Purpose:** Non-invasive chat widget for booking calls on the Reckoning site
**Tone:** Warm, clear, low-pressure (anti-chirpy)

---

## What It Does

A small chat bubble in the bottom-right corner. When clicked, it opens a conversational flow that:

1. Asks what they need (buttons, not typing)
2. Captures light context (tags for your prep)
3. Shows real calendar availability
4. Books the slot and confirms

Total time: 30–45 seconds. No account required.

---

## Where It Lives

- **Position:** Fixed bottom-right, all pages
- **Trigger:** Small button (fuchsia, Outfit font, no shadow)
- **Expanded:** Chat panel ~350px wide, slides up
- **Mobile:** Full-width drawer from bottom

Doesn't block content. Doesn't auto-open. Doesn't nag.

---

## The Flow

### Step 1 — Open

User clicks bubble. Bot says:

> "I can help you book a call in under a minute.
> What are you looking for?"

Buttons:
- Book a discovery call
- Ask about a service
- Just browsing

### Step 2 — Context (if booking)

> "What's the main thing you want to achieve?"

Buttons based on personas:
- Starting a new business
- Streamlining operations
- Scaling what's working
- Something else (free text)

This tags the booking in your calendar/CRM so you're prepped.

### Step 3 — Availability

Bot fetches your calendar and shows:

> "Here are my next openings:"

- Tuesday 11:00
- Wednesday 15:00
- Friday 10:30

User picks one.

### Step 4 — Details

> "Perfect. What name and email should I use for the booking?"

Single input or two fields. Parses and confirms.

### Step 5 — Done

> "All set. Confirmation sent to [email].
> You'll get a short prep note before the call."

Buttons:
- View booking
- Add to calendar

---

## Decision Points

### 1. Calendar System

You need something that:
- Has bookable slots you control
- Provides an API or embed for availability
- Sends confirmations automatically

**Options:**

| Option | Cost | Effort | Notes |
|--------|------|--------|-------|
| **Calendly** | Free–£10/mo | Low | Most common, solid API, handles reminders |
| **Cal.com** | Free (self-host) or £12/mo | Low–Medium | Open source, more control, good API |
| **Zoho Bookings** | Included with Zoho One | Low | You already use Zoho Mail — might integrate well |
| **Google Calendar + custom** | Free | High | Raw API, you build everything yourself |

**My recommendation:** Start with **Calendly** or **Zoho Bookings** (since you're in Zoho already). Both have APIs that return available slots and create bookings.

**Your call:** Which appeals? Or should I dig into Zoho Bookings specifically?

---

### 2. Chat Interface

How do we build the actual chat UI?

**Options:**

| Option | Cost | Effort | Notes |
|--------|------|--------|-------|
| **Custom-built** | Free | Medium | Full control, matches brand perfectly, no third-party |
| **Crisp** | Free–£25/mo | Low | Widget drops in, has bot builder, decent customisation |
| **Intercom** | £60+/mo | Low | Enterprise-grade, overkill for this |
| **Tawk.to** | Free | Low | Basic but free, less customisable |
| **Botpress/Voiceflow** | Free–£50/mo | Medium | Conversation design tools, more complex |

**My recommendation:** **Custom-built**.

Reasons:
- Your brand rules are strict (Outfit font only, no shadows, specific colours)
- Third-party widgets rarely match perfectly
- The flow is simple enough (5 steps, button-driven)
- It becomes part of your "silent demo" — shows what you can build

**Your call:** Custom (I build it) or third-party (faster but less control)?

---

### 3. Intelligence Level

How smart should the bot be?

**Options:**

| Level | What it does | Effort |
|-------|--------------|--------|
| **Button-only** | Fixed paths, user picks from options | Low |
| **Light NLP** | Recognises "next week" → filters dates | Medium |
| **Full AI** | Free-form chat, Claude-powered responses | High |

**My recommendation:** Start **button-only**, add light NLP later if needed.

Button-driven is:
- Faster to build
- More predictable
- Still feels smooth
- Easier to maintain

You can always add "type a question" later.

**Your call:** Buttons only, or do you want free-text from day one?

---

### 4. Data Storage

Where do conversations and bookings live?

**Options:**

| Option | Notes |
|--------|-------|
| **Your PostgreSQL** | Already set up, keeps everything in one place |
| **Calendar system only** | Calendly/Zoho stores the booking, no local record |
| **Both** | Local log + calendar booking (recommended) |

**My recommendation:** Store in PostgreSQL, sync to calendar.

You get:
- Full conversation history
- Analytics on what people ask
- Ability to follow up on abandoned chats
- Booking records even if you switch calendar providers

---

### 5. Call Types

What kinds of calls should people be able to book?

**Suggested starting set:**

| Call Type | Duration | Purpose |
|-----------|----------|---------|
| Discovery call | 15 min | Free intro, understand their needs |
| Strategy session | 45 min | Deeper dive, paid or for serious leads |
| Quick question | 10 min | Fast clarification, low commitment |

**Your call:** What call types do you actually want to offer? Different durations? Paid vs free?

---

### 6. Availability Rules

When are you bookable?

Things to decide:
- Which days? (Mon–Fri?)
- Which hours? (10:00–17:00?)
- Buffer between calls? (15 min?)
- How far ahead can people book? (2 weeks? 1 month?)
- Minimum notice? (24 hours?)

Most calendar tools handle this — you'd configure it there.

---

## Technical Implementation

Assuming custom-built + Calendly/Zoho API + PostgreSQL:

### Components Needed

```
web/src/components/chat/
├── ChatWidget.tsx        # The floating button
├── ChatPanel.tsx         # The expanded conversation
├── ChatMessage.tsx       # Individual message bubble
├── ChatOptions.tsx       # Button group for choices
├── AvailabilityPicker.tsx # Calendar slot selector
└── BookingConfirm.tsx    # Final confirmation
```

### API Routes

```
web/src/app/api/chat/
├── route.ts              # Start conversation, get session ID
├── availability/route.ts # Fetch calendar slots
└── book/route.ts         # Create booking
```

### Database Tables

```sql
-- Conversation log
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(64) UNIQUE NOT NULL,
  persona VARCHAR(50),
  intent VARCHAR(100),
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  messages JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking records
CREATE TABLE chat_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id),
  call_type VARCHAR(50) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calendar_event_id VARCHAR(255),
  calendar_event_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Integration Points

1. **Calendar API** — Fetch availability, create events
2. **Email** — Confirmation via Resend (already in stack) or calendar's built-in
3. **Existing questionnaire** — Could pre-fill chat if they've done the Reckoning

---

## What's Not Included (Yet)

- Live human chat handoff (could add later)
- SMS reminders (calendar tools usually handle this)
- Payment for paid calls (could integrate Stripe)
- AI-powered responses (buttons first)
- Analytics dashboard (just database queries initially)

---

## Next Steps

Once you've made the decisions above, I can:

1. Set up the database tables
2. Build the chat components
3. Integrate with your chosen calendar
4. Style it to brand spec
5. Test the full flow

---

## Your Decisions Needed

| # | Question | Options |
|---|----------|---------|
| 1 | Calendar system | Calendly / Cal.com / Zoho Bookings / Other |
| 2 | Chat interface | Custom-built / Third-party widget |
| 3 | Intelligence | Buttons only / Light NLP / Full AI |
| 4 | Data storage | PostgreSQL + calendar / Calendar only |
| 5 | Call types | What calls, what durations? |
| 6 | Availability | Days, hours, buffer, notice period? |

Let me know your choices and I'll move to implementation.
