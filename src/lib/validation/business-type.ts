// Business type matching validation — ensures services match the business

import type { ReckoningReport, QuestionnaireSubmission } from '@/types/report';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface BusinessTypeServices {
  relevant: string[];
  irrelevant: string[];
  keywords: string[];
}

const BUSINESS_TYPE_MAP: Record<string, BusinessTypeServices> = {
  'food': {
    keywords: ['food', 'meal', 'prep', 'catering', 'restaurant', 'bakery', 'chef', 'cook', 'kitchen'],
    relevant: ['ordering', 'payment', 'delivery', 'menu', 'website', 'food-photography'],
    irrelevant: ['client-intake', 'booking-system', 'course', 'membership', 'calendar']
  },
  'coaching': {
    keywords: ['coach', 'coaching', 'therapy', 'therapist', 'counsell', 'mentor', 'consultant'],
    relevant: ['booking', 'calendar', 'intake', 'payment', 'email', 'website', 'client'],
    irrelevant: ['ordering', 'delivery', 'inventory', 'shipping', 'e-commerce', 'store']
  },
  'freelance': {
    keywords: ['freelance', 'designer', 'developer', 'writer', 'photographer', 'creative', 'agency'],
    relevant: ['portfolio', 'website', 'inquiry', 'invoice', 'contract', 'payment', 'project'],
    irrelevant: ['booking-calendar', 'delivery', 'membership', 'inventory', 'shipping']
  },
  'ecommerce': {
    keywords: ['e-commerce', 'ecommerce', 'shop', 'store', 'product', 'sell online', 'retail'],
    relevant: ['store', 'payment', 'inventory', 'shipping', 'product', 'website'],
    irrelevant: ['booking', 'intake', 'calendar', 'client-management']
  },
  'service': {
    keywords: ['service', 'cleaner', 'plumber', 'tradesperson', 'handyman', 'local business'],
    relevant: ['booking', 'invoice', 'website', 'reviews', 'payment', 'calendar'],
    irrelevant: ['e-commerce', 'inventory', 'shipping', 'course']
  },
  'membership': {
    keywords: ['membership', 'community', 'subscription', 'club', 'network', 'circle'],
    relevant: ['community', 'payment', 'subscription', 'email', 'website', 'landing'],
    irrelevant: ['delivery', 'inventory', 'shipping', 'physical']
  },
  'course': {
    keywords: ['course', 'training', 'education', 'teach', 'workshop', 'online course'],
    relevant: ['landing', 'email', 'payment', 'course-platform', 'website'],
    irrelevant: ['delivery', 'inventory', 'shipping', 'booking-calendar']
  }
};

function detectBusinessType(submission: QuestionnaireSubmission, report: ReckoningReport): string | null {
  // Gather text to search
  const searchText = [
    submission.answers.business_idea,
    submission.answers.what_are_you_building,
    submission.answers.business_type,
    submission.answers.describe_your_business,
    report.recipient?.business_type,
  ].filter(Boolean).join(' ').toLowerCase();

  // Find matching business type
  for (const [type, config] of Object.entries(BUSINESS_TYPE_MAP)) {
    for (const keyword of config.keywords) {
      if (searchText.includes(keyword)) {
        return type;
      }
    }
  }

  return null;
}

export function validateBusinessTypeMatch(
  report: ReckoningReport,
  submission: QuestionnaireSubmission
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Detect business type
  const businessType = detectBusinessType(submission, report);

  if (!businessType) {
    warnings.push(
      `Business type not recognised from answers. Manual review recommended for service relevance.`
    );
    return { valid: true, errors, warnings };
  }

  const typeConfig = BUSINESS_TYPE_MAP[businessType];

  // Check recommended services
  const services = report.recommendations?.services || [];

  for (const service of services) {
    const serviceId = (service.service_id || '').toLowerCase();
    const serviceName = (service.service_name || '').toLowerCase();
    const serviceText = `${serviceId} ${serviceName}`;

    // Check if service is irrelevant for this business type
    const isIrrelevant = typeConfig.irrelevant.some(term =>
      serviceText.includes(term)
    );

    if (isIrrelevant) {
      errors.push(
        `Service "${service.service_name}" may not be relevant for ${businessType} business. ` +
        `Expected services related to: ${typeConfig.relevant.slice(0, 4).join(', ')}.`
      );
    }
  }

  // Check if any highly relevant services are recommended
  const allServiceText = services.map(s =>
    `${s.service_id} ${s.service_name}`.toLowerCase()
  ).join(' ');

  const hasRelevantService = typeConfig.relevant.slice(0, 3).some(term =>
    allServiceText.includes(term)
  );

  if (!hasRelevantService && services.length > 0) {
    warnings.push(
      `No core services for ${businessType} business found. ` +
      `Consider: ${typeConfig.relevant.slice(0, 3).join(', ')}.`
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}
