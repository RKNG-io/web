// Persona-specific questionnaire flows
// Extracted from the questionnaire prototype

import type { ConditionExpression } from '@/lib/questionnaire/condition-evaluator';

export interface PersonaQuestion {
  id: string;
  type: 'welcome' | 'single' | 'multi' | 'text' | 'contact' | 'presence';
  question?: string;
  title?: string; // For welcome screens
  content?: string; // For welcome screens
  subtext?: string;
  placeholder?: string;
  optional?: boolean;
  options?: {
    value: string;
    label: string;
    description?: string;
  }[];

  // Conditional logic
  showIf?: ConditionExpression;  // Show only when condition is true
  skipIf?: ConditionExpression;  // Skip when condition is true

  // Journey phase (for emotional arc preservation)
  phase?: 'warmup' | 'context' | 'reality' | 'blockers' | 'vision' | 'practical';

  // Industry-specific marker
  industrySpecific?: boolean;
}

export interface Persona {
  id: 'launcher' | 'builder' | 'architect';
  name: string;
  description: string;
  questions: PersonaQuestion[];
}

export const PERSONAS: Record<string, Persona> = {
  launcher: {
    id: 'launcher',
    name: 'Launcher',
    description: "You're ready to start but haven't fully launched yet",
    questions: [
      {
        id: 'welcome',
        type: 'welcome',
        title: 'This is your moment.',
        content: `
          <p class="welcome-text">You're here because something in you knows it's time.</p>
          <p class="welcome-text">Be honest with the next few questions. There are no wrong answers. Just you, telling the truth about where you are and where you want to be.</p>
          <div class="time-estimate">Takes 10-12 minutes. Worth it.</div>
        `
      },
      {
        id: 'who_they_help',
        type: 'text',
        question: 'Who do you help  - and what changes for them?',
        subtext: 'Your clients, your people. What\'s different in their lives because of you?',
        placeholder: "I help people who are...",
        phase: 'warmup',
      },
      {
        id: 'business_type',
        type: 'single',
        question: 'What will you do for people?',
        subtext: 'Pick the closest fit',
        phase: 'context',
        options: [
          { value: 'help_solve', label: 'Help them solve a problem', description: 'Coaching, consulting, therapy, advice' },
          { value: 'make_build', label: 'Make or build something for them', description: 'Design, photography, trades, creative work' },
          { value: 'teach', label: 'Teach them something', description: 'Courses, tutoring, workshops, training' },
          { value: 'sell_product', label: 'Sell them a product', description: 'Physical or digital products, food' },
          { value: 'other', label: 'Something else', description: "We'll ask you to describe it" }
        ]
      },
      {
        id: 'delivery_mode',
        type: 'single',
        question: 'Will you work with clients online, in person, or both?',
        phase: 'context',
        // Skip for product sellers  - they're selling products, not services
        skipIf: { questionId: 'business_type', operator: 'equals', value: 'sell_product' },
        options: [
          { value: 'online', label: 'Mostly online / remote' },
          { value: 'in_person', label: 'Mostly in person / local' },
          { value: 'both', label: 'Both' }
        ]
      },
      {
        id: 'why_now',
        type: 'multi',
        question: 'Why now?',
        subtext: 'Select all that apply',
        phase: 'context',
        options: [
          { value: 'waiting', label: "I've been thinking about this for years and I'm done waiting" },
          { value: 'change', label: 'Something changed  - job, life, realisation' },
          { value: 'side_hustle', label: "I'm already doing this on the side and ready to go all in" },
          { value: 'exploring', label: "I'm not 100% sure it's 'now' but I'm exploring" }
        ]
      },
      {
        id: 'business_stage',
        type: 'single',
        question: 'How would you describe where you are today?',
        phase: 'context',
        options: [
          { value: 'idea', label: 'I have an idea but haven\'t started' },
          { value: 'started', label: 'I\'ve started but have no paying clients yet' },
          { value: 'few_clients', label: 'I have a few paying clients (1-5)' },
          { value: 'regular', label: 'I have regular clients but it\'s not my main income' },
          { value: 'full_time', label: 'I\'m already doing this full-time but want to level up' }
        ]
      },
      {
        id: 'whats_in_place',
        type: 'multi',
        question: 'What do you have in place already?',
        subtext: 'Select everything you\'ve sorted',
        phase: 'reality',
        options: [
          { value: 'name', label: 'Business name decided' },
          { value: 'registered', label: 'Business registered (sole trader, Ltd, etc.)' },
          { value: 'bank', label: 'Business bank account' },
          { value: 'website', label: 'Website or landing page' },
          { value: 'email', label: 'Professional email (not @gmail)' },
          { value: 'social', label: 'Social media presence' },
          { value: 'email_list', label: 'Email list / way to capture leads' },
          { value: 'testimonials', label: 'Testimonials or social proof' },
          { value: 'insurance', label: 'Insurance (if applicable)' },
          { value: 'contracts', label: 'Contracts or terms of service' },
          { value: 'accounting', label: 'Accounting / bookkeeping setup' }
        ]
      },
      {
        id: 'website_feeling',
        type: 'single',
        question: 'When you imagine sending someone to your website (or where you show up online), how do you feel?',
        phase: 'reality',
        // Only show if they have a website or social presence
        showIf: {
          operator: 'OR',
          conditions: [
            { questionId: 'whats_in_place', operator: 'includes', value: 'website' },
            { questionId: 'whats_in_place', operator: 'includes', value: 'social' },
          ],
        },
        options: [
          { value: 'proud', label: 'Proud  - it represents me well' },
          { value: 'okay', label: 'It\'s okay but needs work' },
          { value: 'hesitant', label: 'Hesitant  - it needs work' },
          { value: 'avoiding', label: 'I\'ve been avoiding thinking about it' }
        ]
      },
      {
        id: 'income_goal',
        type: 'single',
        question: 'What do you need this business to earn in the first year?',
        phase: 'practical',
        options: [
          { value: 'side_income', label: 'Side income  - £500-1k/month to start' },
          { value: 'part_replace', label: 'Partial replacement  - £1-2k/month' },
          { value: 'full_replace', label: 'Full income replacement  - £2-4k/month' },
          { value: 'ambitious', label: 'Ambitious  - £4k+/month' },
          { value: 'unsure', label: "Not sure yet  - depends on what's possible" }
        ]
      },
      {
        id: 'whats_missing',
        type: 'multi',
        question: 'What feels most broken or missing right now?',
        subtext: 'Select your top concerns',
        phase: 'blockers',
        options: [
          { value: 'professional', label: "I don't look professional enough online" },
          { value: 'pricing', label: "I don't know how to price my services" },
          { value: 'booking', label: 'I have no system for booking or scheduling' },
          { value: 'payments', label: 'Taking payments feels awkward or manual' },
          { value: 'clients', label: "I'm not sure how to find clients" },
          { value: 'legal', label: "I don't have contracts or feel legally protected" },
          { value: 'manual', label: "I'm doing everything manually and it's exhausting" },
          { value: 'priorities', label: "I don't know what to prioritise" }
        ]
      },
      {
        id: 'blockers',
        type: 'multi',
        question: "What's actually stopping you from being further along?",
        phase: 'blockers',
        options: [
          { value: 'time', label: "Time  - I'm still working another job" },
          { value: 'money', label: "Money  - I can't invest much yet" },
          { value: 'knowledge', label: "Knowledge  - I don't know the steps" },
          { value: 'confidence', label: "Confidence  - I'm not sure I'm ready" },
          { value: 'tech', label: 'Tech  - I find the tools overwhelming' },
          { value: 'perfectionism', label: "Perfectionism  - I keep waiting until it's 'right'" },
          { value: 'fear', label: "Fear  - what if it doesn't work?" },
          { value: 'nothing', label: "Nothing specific  - I just haven't done it" }
        ]
      },
      {
        id: 'timeline',
        type: 'single',
        question: 'When do you want to be "live"  - a real business that clients can find and pay?',
        phase: 'practical',
        options: [
          { value: 'already', label: 'Already am, just need to improve things' },
          { value: 'month', label: 'Within the next month' },
          { value: 'three_months', label: 'Within 3 months' },
          { value: 'six_months', label: 'Within 6 months' },
          { value: 'exploring', label: 'No fixed timeline  - just exploring' }
        ]
      },
      {
        id: 'biggest_risk',
        type: 'single',
        question: "What's the biggest risk you're weighing up?",
        phase: 'blockers',
        options: [
          { value: 'no_demand', label: "Spending time/money and no one buys" },
          { value: 'not_ready', label: "Launching before I'm properly set up" },
          { value: 'underpricing', label: "Pricing too low and getting stuck there" },
          { value: 'overcommit', label: "Taking on too much and burning out" },
          { value: 'wrong_thing', label: "Building the wrong thing entirely" },
          { value: 'none', label: "I've thought through the risks  - I'm ready" }
        ]
      },
      {
        id: 'time_available',
        type: 'single',
        question: 'How much time can you realistically dedicate to building this each week?',
        phase: 'practical',
        // Skip if they're already full-time  - we already know the answer
        skipIf: { questionId: 'business_stage', operator: 'equals', value: 'full_time' },
        options: [
          { value: 'minimal', label: 'Less than 2 hours' },
          { value: 'some', label: '2-5 hours' },
          { value: 'decent', label: '5-10 hours' },
          { value: 'serious', label: '10+ hours' },
          { value: 'full_time', label: "I'm going full-time on this" }
        ]
      },
      {
        id: 'first_clients',
        type: 'single',
        question: 'How will you get your first paying clients?',
        phase: 'practical',
        options: [
          { value: 'network', label: 'People I already know  - friends, family, contacts' },
          { value: 'referrals', label: 'Referrals from existing connections' },
          { value: 'social', label: 'Social media presence' },
          { value: 'local', label: 'Local marketing  - flyers, events, word of mouth' },
          { value: 'online', label: 'Online marketing  - SEO, ads, content' },
          { value: 'no_idea', label: "Honestly? I don't know yet" }
        ]
      },
      {
        id: 'anything_else',
        type: 'text',
        question: 'Anything else on your mind?',
        subtext: 'Completely optional  - only if something is burning.',
        placeholder: "Anything else...",
        optional: true,
        phase: 'practical',
      },
      {
        id: 'online_presence',
        type: 'presence',
        question: 'Where can we find you online?',
        subtext: 'Optional  - if you share these, we\'ll include a free presence review in your Reckoning.',
        optional: true,
        phase: 'practical',
      },
      {
        id: 'contact',
        type: 'contact',
        question: 'Where should we send your Reckoning?',
        subtext: 'Your report will be ready in about 30 seconds.',
        phase: 'practical',
      }
    ]
  },

  builder: {
    id: 'builder',
    name: 'Builder',
    description: "You're making it work but everything is duct tape",
    questions: [
      {
        id: 'welcome',
        type: 'welcome',
        title: "You're making it work. Let's see where the time goes.",
        content: `
          <p class="welcome-text">This isn't about feelings. It's about facts  - how you spend your hours, what drains you, and what would actually help.</p>
          <p class="welcome-text">Be honest about the mess.</p>
          <div class="time-estimate">Takes 8-10 minutes.</div>
        `
      },
      {
        id: 'business_type',
        type: 'single',
        question: "What's your business?",
        phase: 'context',
        options: [
          { value: 'coaching', label: 'Coaching / Consulting', description: 'Life, business, career, health coaching' },
          { value: 'creative', label: 'Creative Services', description: 'Design, photography, video, copywriting' },
          { value: 'fitness', label: 'Fitness / Wellness', description: 'Personal training, yoga, nutrition, massage' },
          { value: 'food', label: 'Food / Hospitality', description: 'Catering, meal prep, baking, cafe' },
          { value: 'therapy', label: 'Therapy / Counselling', description: 'Clinical or therapeutic services' },
          { value: 'professional', label: 'Professional Services', description: 'Bookkeeping, VA, legal, HR' },
          { value: 'trades', label: 'Trades / Local Services', description: 'Plumber, electrician, barber, salon' },
          { value: 'ecommerce', label: 'Products / E-commerce', description: 'Physical or digital products' },
          { value: 'other', label: 'Something else', description: "We'll ask you to describe it" }
        ]
      },
      {
        id: 'duration',
        type: 'single',
        question: 'How long have you been running it?',
        phase: 'context',
        options: [
          { value: 'under_6', label: 'Less than 6 months' },
          { value: '6_12', label: '6 months - 1 year' },
          { value: '1_2', label: '1-2 years' },
          { value: '2_5', label: '2-5 years' },
          { value: 'over_5', label: '5+ years' }
        ]
      },
      {
        id: 'hours_worked',
        type: 'single',
        question: 'How many hours a week do you work ON the business?',
        phase: 'context',
        options: [
          { value: 'under_20', label: 'Under 20 hours' },
          { value: '20_30', label: '20-30 hours' },
          { value: '30_40', label: '30-40 hours' },
          { value: '40_50', label: '40-50 hours' },
          { value: 'over_50', label: '50+ hours' }
        ]
      },
      {
        id: 'tasks_dreaded',
        type: 'multi',
        question: 'What tasks do you dread or keep putting off?',
        subtext: 'Select all that apply',
        phase: 'reality',
        options: [
          { value: 'invoicing', label: 'Chasing unpaid invoices' },
          { value: 'social', label: 'Posting on social media' },
          { value: 'followup', label: 'Following up with leads' },
          { value: 'website', label: 'Updating my website' },
          { value: 'bookkeeping', label: 'Doing my bookkeeping' },
          { value: 'enquiries', label: 'Responding to enquiries' },
          { value: 'scheduling', label: 'Scheduling / calendar management' },
          { value: 'proposals', label: 'Creating proposals or quotes' },
          { value: 'content', label: 'Writing content or copy' },
          { value: 'tech', label: 'Dealing with tech / tools' },
          { value: 'none', label: "None  - I'm pretty on top of things" }
        ]
      },
      {
        id: 'most_annoying',
        type: 'text',
        question: "What's the most annoying part of your week?",
        subtext: 'The recurring task or situation that makes you think "there has to be a better way."',
        placeholder: "The thing that annoys me most is...",
        phase: 'reality',
      },
      {
        id: 'magic_wand',
        type: 'text',
        question: 'If you could make ONE thing just happen without you, what would it be?',
        subtext: "The thing you'd wave a magic wand at.",
        placeholder: "I wish this would just happen automatically...",
        phase: 'vision',
      },
      {
        id: 'payment_system',
        type: 'single',
        question: 'What does "getting paid" look like?',
        phase: 'reality',
        options: [
          { value: 'manual_chase', label: 'I send manual invoices and chase when needed' },
          { value: 'software_chase', label: 'I have invoicing software but still chase sometimes' },
          { value: 'automated', label: 'Payments are mostly automated (deposits, subscriptions, etc.)' },
          { value: 'mess', label: "It's a mess  - I forget to invoice or price on the spot" }
        ]
      },
      {
        id: 'booking_system',
        type: 'single',
        question: 'How do clients book or enquire?',
        phase: 'reality',
        options: [
          { value: 'manual', label: 'They email or message me, I reply when I can' },
          { value: 'partial', label: 'I have a booking system but still get random requests' },
          { value: 'automated', label: 'Fully automated  - they book and pay without me' },
          { value: 'inconsistent', label: 'Different clients do different things  - no single system' }
        ]
      },
      {
        id: 'typical_day',
        type: 'text',
        question: 'Walk me through a typical work day.',
        subtext: 'From when you start to when you stop. What eats time that shouldn\'t?',
        placeholder: "A typical day looks like...",
        phase: 'reality',
      },
      {
        id: 'whats_working',
        type: 'text',
        question: "What's working well that you want to protect?",
        subtext: "The parts of your business that feel good  - we won't mess with those.",
        placeholder: "What's working well is...",
        optional: true,
        phase: 'vision',
      },
      {
        id: 'online_presence',
        type: 'presence',
        question: 'Where can we find you online?',
        subtext: 'Optional  - if you share these, we\'ll include a free presence review in your Reckoning.',
        optional: true,
        phase: 'practical',
      },
      {
        id: 'contact',
        type: 'contact',
        question: 'Where should we send your Reckoning?',
        subtext: 'Your report will be ready in about 30 seconds.',
        phase: 'practical',
      }
    ]
  },

  architect: {
    id: 'architect',
    name: 'Architect',
    description: "You've built something real but it's running you",
    questions: [
      {
        id: 'welcome',
        type: 'welcome',
        title: 'You built something real. Let\'s see what\'s running you.',
        content: `
          <p class="welcome-text">This is an operations audit  - not therapy. I need to understand where your time goes, what still runs through you, and what would actually give you your life back.</p>
          <p class="welcome-text">Be blunt.</p>
          <div class="time-estimate">Takes 10-12 minutes.</div>
        `
      },
      {
        id: 'business_description',
        type: 'text',
        question: "What's your business?",
        subtext: 'In a sentence: what do you do, who for, and roughly how big?',
        placeholder: "We run a...",
        phase: 'warmup',
      },
      {
        id: 'team_size',
        type: 'single',
        question: 'How many people work in the business?',
        phase: 'context',
        options: [
          { value: 'solo', label: 'Just me' },
          { value: '2_5', label: '2-5 people' },
          { value: '6_15', label: '6-15 people' },
          { value: '16_30', label: '16-30 people' },
          { value: 'over_30', label: '30+ people' }
        ]
      },
      {
        id: 'revenue',
        type: 'single',
        question: "What's annual revenue?",
        phase: 'context',
        options: [
          { value: 'under_100k', label: 'Under £100k' },
          { value: '100_250k', label: '£100k - £250k' },
          { value: '250_500k', label: '£250k - £500k' },
          { value: '500k_1m', label: '£500k - £1m' },
          { value: 'over_1m', label: '£1m+' },
          { value: 'prefer_not', label: 'Prefer not to say' }
        ]
      },
      {
        id: 'hours_worked',
        type: 'single',
        question: 'How many hours a week are YOU working?',
        phase: 'context',
        options: [
          { value: 'under_40', label: 'Under 40' },
          { value: '40_50', label: '40-50' },
          { value: '50_60', label: '50-60' },
          { value: 'over_60', label: '60+' },
          { value: 'stopped_counting', label: "I've stopped counting" }
        ]
      },
      {
        id: 'bottleneck_areas',
        type: 'multi',
        question: "What still runs through you that shouldn't?",
        phase: 'reality',
        options: [
          { value: 'decisions', label: 'Approving decisions staff could make' },
          { value: 'questions', label: 'Answering questions they should know' },
          { value: 'complaints', label: 'Handling customer complaints' },
          { value: 'quoting', label: 'Quoting / pricing jobs' },
          { value: 'scheduling', label: 'Scheduling / rotas' },
          { value: 'invoicing', label: 'Invoicing / chasing payments' },
          { value: 'enquiries', label: 'Responding to enquiries' },
          { value: 'social', label: 'Posting on social media' },
          { value: 'ordering', label: 'Ordering / inventory' },
          { value: 'hr', label: 'Hiring / HR issues' },
          { value: 'everything', label: "Everything  - I'm the hub of the wheel" }
        ]
      },
      {
        id: 'what_breaks',
        type: 'text',
        question: 'If you disappeared for two weeks, what would break?',
        subtext: 'Be specific. What decisions, processes, or fires only you can handle?',
        placeholder: "If I was gone, the things that would break are...",
        phase: 'reality',
      },
      {
        id: 'repetitive_task',
        type: 'text',
        question: "What's the most repetitive task you do each week?",
        subtext: 'The thing you do over and over that someone (or something) else should handle.',
        placeholder: "Every week I spend time on...",
        phase: 'reality',
      },
      {
        id: 'needs_systematising',
        type: 'multi',
        question: 'What do you keep meaning to systematise but haven\'t?',
        phase: 'reality',
        options: [
          { value: 'staff_onboarding', label: 'Staff onboarding / training' },
          { value: 'client_onboarding', label: 'Client onboarding' },
          { value: 'quoting', label: 'Quoting / proposals' },
          { value: 'invoicing', label: 'Invoicing / payments' },
          { value: 'scheduling', label: 'Scheduling / bookings' },
          { value: 'comms', label: 'Customer communications' },
          { value: 'reporting', label: 'Reporting / dashboards' },
          { value: 'inventory', label: 'Inventory / ordering' },
          { value: 'sops', label: 'Standard operating procedures' },
          { value: 'nothing', label: "Nothing  - we're pretty systematised" }
        ]
      },
      {
        id: 'time_sink',
        type: 'single',
        question: "What's the single biggest time sink you want to eliminate?",
        phase: 'blockers',
        options: [
          { value: 'admin', label: 'Admin  - emails, paperwork, scheduling' },
          { value: 'staff_questions', label: 'Staff questions  - things they should handle themselves' },
          { value: 'customer_issues', label: 'Customer issues  - complaints, queries, exceptions' },
          { value: 'manual_processes', label: 'Manual processes  - things that should be automated' },
          { value: 'firefighting', label: 'Firefighting  - fixing problems instead of preventing them' },
          { value: 'context_switching', label: 'Context switching  - too many interruptions' }
        ]
      },
      {
        id: 'typical_day',
        type: 'text',
        question: 'Walk me through yesterday.',
        subtext: 'What did you actually do? Where did the time go?',
        placeholder: "Yesterday I...",
        phase: 'reality',
      },
      {
        id: 'time_back_goal',
        type: 'single',
        question: 'If you got 10 hours a week back, what would you do with it?',
        phase: 'vision',
        options: [
          { value: 'grow', label: 'Work on growing the business' },
          { value: 'family', label: 'Spend time with family / on myself' },
          { value: 'more_revenue', label: 'Take on more clients / revenue' },
          { value: 'holiday', label: 'Finally take a proper holiday' },
          { value: 'strategic', label: 'Think strategically instead of reactively' },
          { value: 'no_idea', label: "I don't know  - I can't imagine it" }
        ]
      },
      {
        id: 'success_outcome',
        type: 'text',
        question: 'What outcome would make this worth your time?',
        subtext: 'What does success look like in 6 months?',
        placeholder: "In 6 months, I want to...",
        phase: 'vision',
      },
      {
        id: 'online_presence',
        type: 'presence',
        question: 'Where can we find you online?',
        subtext: 'Optional  - if you share these, we\'ll include a free presence review in your Reckoning.',
        optional: true,
        phase: 'practical',
      },
      {
        id: 'contact',
        type: 'contact',
        question: 'Where should we send your Reckoning?',
        subtext: 'Your report will be ready in about 30 seconds.',
        phase: 'practical',
      }
    ]
  }
};
