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
        question: 'What kind of business are you building?',
        phase: 'context',
        options: [
          { value: 'coaching', label: 'Coaching', description: 'Life, business, career, health coaching' },
          { value: 'creative', label: 'Creative Services', description: 'Design, photography, video, writing' },
          { value: 'fitness', label: 'Fitness / Wellness', description: 'Personal training, yoga, nutrition' },
          { value: 'food', label: 'Food / Meal Prep', description: 'Catering, meal prep, baking' },
          { value: 'therapy', label: 'Therapy / Counselling', description: 'Clinical or therapeutic services' },
          { value: 'professional', label: 'Professional Services', description: 'VA, bookkeeping, consulting' },
          { value: 'ecommerce', label: 'Products / E-commerce', description: 'Physical or digital products' },
          { value: 'other', label: 'Something else', description: "We'll ask you to describe it" }
        ]
      },
      {
        id: 'delivery_mode',
        type: 'single',
        question: 'Will you work with clients online, in person, or both?',
        phase: 'context',
        // Skip for e-commerce  - they're selling products, not services
        skipIf: { questionId: 'business_type', operator: 'equals', value: 'ecommerce' },
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
        title: "You're doing it. Let's make it easier.",
        content: `
          <p class="welcome-text">You didn't wait for permission. You figured it out, found clients, made it work.</p>
          <p class="welcome-text">But <strong>"working"</strong> and <strong>"working well"</strong> aren't the same thing.</p>
          <p class="welcome-text">The next few questions are about getting honest  - what's solid, what's duct tape, and what would actually make this feel like a business instead of a hustle.</p>
          <div class="time-estimate">Takes about 10 minutes. No judgement.</div>
        `
      },
      {
        id: 'duration',
        type: 'single',
        question: 'How long have you been doing this?',
        phase: 'warmup',
        options: [
          { value: 'under_6', label: 'Less than 6 months' },
          { value: '6_12', label: '6 months – 1 year' },
          { value: '1_2', label: '1-2 years' },
          { value: '2_5', label: '2-5 years' },
          { value: 'over_5', label: '5+ years' }
        ]
      },
      {
        id: 'business_type',
        type: 'single',
        question: "What's your business?",
        phase: 'context',
        options: [
          { value: 'design', label: 'Design / creative services' },
          { value: 'photography', label: 'Photography / videography' },
          { value: 'copywriting', label: 'Copywriting / content' },
          { value: 'web_dev', label: 'Web development' },
          { value: 'marketing', label: 'Marketing / social media' },
          { value: 'coaching', label: 'Coaching / consulting' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'income_situation',
        type: 'single',
        question: 'What does income look like right now?',
        phase: 'context',
        options: [
          { value: 'inconsistent', label: 'Inconsistent  - some months good, some scary' },
          { value: 'steady', label: 'Steady but modest (covers basics, not much more)' },
          { value: 'comfortable', label: "Comfortable  - I'm making it work" },
          { value: 'good', label: "Good  - but I'm working too hard for it" },
          { value: 'great', label: 'Great  - I just need better systems' }
        ]
      },
      {
        id: 'client_source',
        type: 'single',
        question: 'Where do most of your clients come from?',
        phase: 'context',
        options: [
          { value: 'referrals', label: 'Referrals / word of mouth' },
          { value: 'social', label: 'Social media' },
          { value: 'website', label: 'My website / SEO' },
          { value: 'marketplace', label: 'Freelance platforms (Upwork, Fiverr, etc.)' },
          { value: 'networking', label: 'Networking / events' },
          { value: 'repeat', label: 'Repeat clients mostly' },
          { value: 'random', label: 'Random / I have no idea honestly' }
        ]
      },
      {
        id: 'website_feeling',
        type: 'single',
        question: 'If a dream client landed on your website right now, how would you feel?',
        phase: 'reality',
        options: [
          { value: 'great', label: 'Great  - it represents me well' },
          { value: 'fine', label: 'Fine  - it does the job' },
          { value: 'nervous', label: "Nervous  - it's outdated or underwhelming" },
          { value: 'horrified', label: "Horrified  - please don't look at it" },
          { value: 'none', label: 'What website?' }
        ]
      },
      {
        id: 'duct_tape',
        type: 'multi',
        question: "What's held together by duct tape?",
        subtext: 'Select all that apply. No judgement.',
        phase: 'reality',
        options: [
          { value: 'pricing', label: 'My pricing  - I make it up each time' },
          { value: 'website', label: 'My website  - outdated, embarrassing, or nonexistent' },
          { value: 'contracts', label: "My contracts  - inconsistent or I don't use them" },
          { value: 'invoicing', label: 'My invoicing  - manual, awkward, often late' },
          { value: 'scheduling', label: 'My scheduling  - back-and-forth emails, no system' },
          { value: 'communication', label: 'My client communication  - scattered everywhere' },
          { value: 'portfolio', label: "My portfolio  - doesn't show my best work" },
          { value: 'boundaries', label: 'My boundaries  - I say yes to everything' },
          { value: 'processes', label: 'My processes  - I reinvent the wheel every project' },
          { value: 'all', label: 'Honestly? Most of it' }
        ]
      },
      {
        id: 'costs',
        type: 'multi',
        question: 'What is the mess actually costing you?',
        phase: 'blockers',
        options: [
          { value: 'money', label: 'Money  - I underprice, forget to invoice, or lose leads' },
          { value: 'time', label: 'Time  - I waste hours on admin that should be automated' },
          { value: 'energy', label: "Energy  - I'm exhausted by the chaos" },
          { value: 'reputation', label: 'Reputation  - I look less professional than I am' },
          { value: 'confidence', label: 'Confidence  - I feel like a fraud' },
          { value: 'opportunities', label: 'Opportunities  - better clients go elsewhere' },
          { value: 'sanity', label: "Sanity  - I can't switch off, everything feels urgent" }
        ]
      },
      {
        id: 'hours_lost',
        type: 'single',
        question: 'How many hours a week do you lose to admin, chasing, or chaos?',
        phase: 'blockers',
        options: [
          { value: '1_2', label: '1-2 hours' },
          { value: '3_5', label: '3-5 hours' },
          { value: '5_10', label: '5-10 hours' },
          { value: 'over_10', label: '10+ hours' },
          { value: 'constant', label: "I have no idea  - it's constant background noise" }
        ]
      },
      {
        id: 'one_thing',
        type: 'single',
        question: "What's the ONE thing that would make the biggest difference right now?",
        phase: 'vision',
        options: [
          { value: 'website', label: 'A website that actually works for me' },
          { value: 'pricing', label: 'Clear pricing and packages' },
          { value: 'contracts', label: 'Proper contracts' },
          { value: 'booking', label: 'A booking / scheduling system' },
          { value: 'invoicing', label: 'Better invoicing and getting paid faster' },
          { value: 'crm', label: 'A way to manage clients without losing track' },
          { value: 'templates', label: "Templates and processes so I'm not starting from scratch" },
          { value: 'boundaries', label: 'Boundaries  - learning to say no' },
          { value: 'whole_thing', label: 'Honestly, I need someone to look at the whole thing' }
        ]
      },
      {
        id: 'growth_goal',
        type: 'single',
        question: "What's your priority for the next 6 months?",
        phase: 'practical',
        options: [
          { value: 'more_clients', label: 'Get more clients  - I need more work' },
          { value: 'better_clients', label: 'Get better clients  - raise my rates' },
          { value: 'less_chaos', label: 'Less chaos  - systems so I stop firefighting' },
          { value: 'hire', label: 'Hire help  - I can\'t do it all myself' },
          { value: 'passive', label: 'Passive income  - products, courses, recurring revenue' },
          { value: 'clarity', label: 'Clarity  - I need to figure out what I actually want' }
        ]
      },
      {
        id: 'typical_day',
        type: 'text',
        question: 'Walk me through a typical work day. What eats your time that shouldn\'t?',
        subtext: 'The admin, the chasing, the things you do because there\'s no system.',
        placeholder: "A typical day looks like... The things that eat my time are...",
        phase: 'reality',
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
        title: 'You built something real.',
        content: `
          <p class="welcome-text">Employees. Customers. Revenue. Responsibility.</p>
          <p class="welcome-text">But somewhere along the way, the thing you built started <strong>running you</strong>.</p>
          <p class="welcome-text">This isn't about working harder. It's about building the systems that let you step back  - and have it all keep working.</p>
          <p class="welcome-text">These questions are direct. I need to understand what's actually happening, not the version you tell people at networking events.</p>
          <div class="time-estimate">Takes about 12 minutes. Could save you 10 hours a week.</div>
        `
      },
      {
        id: 'business_description',
        type: 'text',
        question: "What's your business?",
        subtext: 'In a sentence: what do you do, and who do you do it for?',
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
          { value: '1_3', label: '1-3 (including me)' },
          { value: '4_10', label: '4-10' },
          { value: '11_25', label: '11-25' },
          { value: '25_50', label: '25-50' },
          { value: 'over_50', label: '50+' }
        ]
      },
      {
        id: 'revenue',
        type: 'single',
        question: "What's annual revenue (roughly)?",
        phase: 'context',
        options: [
          { value: 'under_50k', label: 'Under £50k' },
          { value: '50_100k', label: '£50k-£100k' },
          { value: '100_250k', label: '£100k-£250k' },
          { value: '250_500k', label: '£250k-£500k' },
          { value: '500k_1m', label: '£500k-£1m' },
          { value: 'over_1m', label: '£1m+' },
          { value: 'prefer_not', label: 'Prefer not to say' }
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
        id: 'bottleneck_areas',
        type: 'multi',
        question: 'What still runs through you that shouldn\'t?',
        phase: 'reality',
        options: [
          { value: 'decisions', label: 'Approving every decision' },
          { value: 'questions', label: 'Answering staff questions they should know' },
          { value: 'complaints', label: 'Handling customer complaints' },
          { value: 'scheduling', label: 'Scheduling / rotas' },
          { value: 'ordering', label: 'Ordering / inventory' },
          { value: 'quoting', label: 'Quoting / pricing' },
          { value: 'invoicing', label: 'Invoicing / chasing payments' },
          { value: 'social', label: 'Posting on social media' },
          { value: 'enquiries', label: 'Responding to enquiries' },
          { value: 'hr', label: 'Hiring / firing / HR issues' },
          { value: 'fixing', label: "Fixing things when they go wrong" },
          { value: 'everything', label: "Everything  - I'm the hub of the wheel" }
        ]
      },
      {
        id: 'hours_worked',
        type: 'single',
        question: 'How many hours a week are you working?',
        phase: 'blockers',
        options: [
          { value: 'under_40', label: 'Under 40' },
          { value: '40_50', label: '40-50' },
          { value: '50_60', label: '50-60' },
          { value: '60_70', label: '60-70' },
          { value: 'over_70', label: '70+' },
          { value: 'stopped_counting', label: "I've stopped counting" }
        ]
      },
      {
        id: 'last_holiday',
        type: 'single',
        question: 'When did you last take a proper holiday  - fully offline?',
        phase: 'blockers',
        options: [
          { value: 'recent', label: 'In the last 3 months' },
          { value: '6_12', label: '6 months – 1 year ago' },
          { value: 'over_year', label: 'Over a year ago' },
          { value: 'cant_remember', label: "I can't remember" },
          { value: 'never', label: "I've never fully switched off since starting" }
        ]
      },
      {
        id: 'personal_costs',
        type: 'multi',
        question: 'What is this costing you outside of work?',
        phase: 'blockers',
        options: [
          { value: 'family', label: 'Time with family / partner / kids' },
          { value: 'health', label: 'Health  - sleep, exercise, stress' },
          { value: 'friendships', label: "Friendships  - I've disappeared" },
          { value: 'hobbies', label: 'Hobbies  - things I used to enjoy' },
          { value: 'peace', label: "Mental peace  - I can't switch off" },
          { value: 'patience', label: "Patience  - I'm shorter with people I love" },
          { value: 'joy', label: 'Joy  - I built this to be free, not trapped' },
          { value: 'okay', label: "Nothing major  - I'm managing okay" }
        ]
      },
      {
        id: 'time_sink',
        type: 'single',
        question: "What's the single biggest time sink you want to eliminate?",
        phase: 'blockers',
        options: [
          { value: 'admin', label: 'Admin  - emails, paperwork, scheduling' },
          { value: 'staff_questions', label: 'Staff questions  - things they should handle' },
          { value: 'customer_issues', label: 'Customer issues  - complaints, queries, exceptions' },
          { value: 'manual_processes', label: 'Manual processes  - things that should be automated' },
          { value: 'firefighting', label: 'Firefighting  - fixing problems instead of preventing them' },
          { value: 'everything', label: 'Everything runs through me  - I am the bottleneck' }
        ]
      },
      {
        id: 'priority_outcome',
        type: 'single',
        question: "What's the main outcome you're looking for?",
        phase: 'practical',
        options: [
          { value: 'time_back', label: 'Get 10+ hours a week back' },
          { value: 'holiday', label: 'Take a proper holiday without checking in' },
          { value: 'grow', label: 'Grow revenue without working more hours' },
          { value: 'sell', label: 'Build something I could sell or step back from' },
          { value: 'sanity', label: 'Just make the chaos stop' },
          { value: 'all', label: 'All of the above' }
        ]
      },
      {
        id: 'typical_day',
        type: 'text',
        question: 'Walk me through a typical day. What drains your energy or time that you wish didn\'t?',
        subtext: 'The tasks that make you think "this isn\'t what I built this for."',
        placeholder: "A typical day looks like... The things that drain me are...",
        phase: 'reality',
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
