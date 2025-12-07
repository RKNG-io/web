import type { ReckoningReport } from '@/types/reckoning';

/**
 * Mock Reckoning report data for testing the results page
 *
 * To test the results page:
 * 1. Open browser console
 * 2. Run: localStorage.setItem('reckoning-test-123', JSON.stringify(mockReport))
 * 3. Navigate to /reckoning/test-123
 */
export const mockReport: ReckoningReport = {
  id: 'test-123',
  generatedAt: new Date().toISOString(),
  personaName: 'The Rebuilder',
  openingMessage:
    'You\'ve been here before. You know what failure feels like, and you\'re not willing to repeat it. This time, you want to build something that lasts -with the right support, the right strategy, and the clarity to see it through.',

  snapshot: {
    currentState:
      'You\'re rebuilding after a setback. You have experience, but also scars. You\'re cautious, but ready to move forward with the right foundation.',
    goal:
      'Build a sustainable business that generates consistent income whilst giving you the freedom and stability you deserve.',
    gap:
      'You need strategic guidance, operational systems, and a clear roadmap to avoid past mistakes and build with confidence.',
  },

  diagnosis: [
    {
      id: 'diag-1',
      title: 'Strategic Clarity Gap',
      description:
        'Without a clear strategic foundation, you risk repeating past patterns. You need a validated business model and positioning before scaling.',
      impact: 'high',
      evidence: [
        'Previous business lacked clear market positioning',
        'Difficulty articulating unique value proposition',
        'Uncertain about target market and ideal client',
      ],
    },
    {
      id: 'diag-2',
      title: 'Operational Infrastructure Missing',
      description:
        'Building on shaky foundations leads to burnout and inefficiency. You need systems that support growth without consuming all your time.',
      impact: 'high',
      evidence: [
        'No documented processes or workflows',
        'Manual handling of repetitive tasks',
        'Inconsistent client experience',
      ],
    },
    {
      id: 'diag-3',
      title: 'Financial Planning Uncertainty',
      description:
        'Without clear financial projections and pricing strategy, profitability remains uncertain and stress levels stay high.',
      impact: 'medium',
      evidence: [
        'Unclear pricing model',
        'No financial forecasting',
        'Reactive rather than strategic financial decisions',
      ],
    },
  ],

  journey: [
    {
      id: 'phase-1',
      phase: 'Phase 1',
      title: 'Foundation & Strategy',
      description:
        'Establish your strategic foundation with clear positioning, validated business model, and market research. Define your unique value and ideal client.',
      timeline: 'Weeks 1-4',
      actions: [
        {
          id: 'action-1-1',
          title: 'Strategic Discovery Session',
          description:
            'Deep-dive consultation to map your vision, strengths, and market opportunity',
          duration: '2 sessions',
        },
        {
          id: 'action-1-2',
          title: 'Market & Competitor Analysis',
          description: 'Validate your positioning and identify white space in the market',
          duration: '1 week',
        },
        {
          id: 'action-1-3',
          title: 'Business Model Design',
          description: 'Create a sustainable revenue model with clear service offerings',
          duration: '2 weeks',
        },
      ],
    },
    {
      id: 'phase-2',
      phase: 'Phase 2',
      title: 'Systems & Operations',
      description:
        'Build the operational infrastructure that enables growth. Implement core systems, processes, and tools for efficiency and consistency.',
      timeline: 'Weeks 5-8',
      actions: [
        {
          id: 'action-2-1',
          title: 'Process Mapping & Documentation',
          description: 'Document core workflows for client delivery and operations',
          duration: '1 week',
        },
        {
          id: 'action-2-2',
          title: 'Technology Stack Setup',
          description: 'Implement CRM, project management, and automation tools',
          duration: '2 weeks',
        },
        {
          id: 'action-2-3',
          title: 'Financial Systems Implementation',
          description: 'Set up accounting, invoicing, and financial tracking',
          duration: '1 week',
        },
      ],
    },
    {
      id: 'phase-3',
      phase: 'Phase 3',
      title: 'Launch & Growth',
      description:
        'Execute your go-to-market strategy with confidence. Launch your offer, attract ideal clients, and scale sustainably with ongoing support.',
      timeline: 'Weeks 9-12',
      actions: [
        {
          id: 'action-3-1',
          title: 'Marketing & Sales Strategy',
          description: 'Develop content plan, lead generation, and sales processes',
          duration: '1 week',
        },
        {
          id: 'action-3-2',
          title: 'Launch Campaign Execution',
          description: 'Execute your go-to-market plan with coaching support',
          duration: '2 weeks',
        },
        {
          id: 'action-3-3',
          title: 'Iteration & Optimisation',
          description: 'Review results, gather feedback, and refine your approach',
          duration: '1 week',
        },
      ],
    },
  ],

  costOfWaiting: [
    {
      id: 'cost-1',
      type: 'financial',
      title: 'Revenue Opportunity Lost',
      description:
        'Every month without a clear strategy and operational foundation costs you potential revenue. Based on your target market, you could be generating £5-10K monthly revenue within 90 days.',
      impact: '£30-60K over 6 months',
    },
    {
      id: 'cost-2',
      type: 'time',
      title: 'Inefficiency Tax',
      description:
        'Operating without systems means spending 60-70% of your time on admin and firefighting instead of revenue-generating activities. That\'s 2-3 days per week lost.',
      impact: '300+ hours wasted over 6 months',
    },
    {
      id: 'cost-3',
      type: 'opportunity',
      title: 'Market Window Closing',
      description:
        'Your competitors aren\'t waiting. Every month you delay is market share they\'re capturing, relationships they\'re building, and positioning they\'re claiming.',
      impact: 'First-mover advantage to competitors',
    },
  ],

  nextStep: {
    title: 'Start with Strategic Foundation',
    description:
      'The fastest path forward is to establish your strategic foundation first. Without this, you\'ll waste time, money, and energy building on uncertain ground.',
    urgency: 'high',
    action:
      'Book a complimentary Strategic Clarity Call to map your specific situation and create your custom roadmap.',
  },

  recommendedServices: [
    {
      id: 'service-1',
      name: 'Strategic Foundation Package',
      price: '£2,497',
      description:
        'Complete strategic foundation including business model design, market positioning, and financial planning. Perfect for launching with confidence.',
      features: [
        '4 x 90-minute strategy sessions',
        'Business model canvas & revenue design',
        'Market analysis & positioning strategy',
        'Financial projections & pricing model',
        '30-day implementation support',
      ],
    },
    {
      id: 'service-2',
      name: 'Rebuild Accelerator (90 Days)',
      price: '£6,997',
      description:
        'Complete end-to-end programme from strategy to launch. Hands-on support to build your business the right way, with systems that scale.',
      features: [
        'Everything in Strategic Foundation',
        'Weekly coaching & accountability',
        'Operational systems setup',
        'Marketing & sales strategy',
        'Launch campaign support',
        '90-day unlimited support',
      ],
    },
    {
      id: 'service-3',
      name: 'Strategic Clarity Call',
      price: 'Complimentary',
      description:
        'Free 45-minute consultation to map your situation, identify key priorities, and create your initial roadmap.',
      features: [
        'Situation assessment',
        'Priority identification',
        'Initial roadmap outline',
        'Resource recommendations',
        'No obligation or pressure',
      ],
    },
  ],

  packageName: 'Rebuilder Track',
  packageDescription:
    'You\'ve been through the fire. Now it\'s time to build something that lasts. This track is designed specifically for entrepreneurs rebuilding after setbacks -with the strategic clarity, operational foundation, and support you need to succeed.',
};
