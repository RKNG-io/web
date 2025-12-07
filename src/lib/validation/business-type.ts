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
  // Launcher persona types
  'coaching': {
    keywords: ['coach', 'coaching', 'mentor', 'consultant', 'life coach', 'business coach'],
    relevant: ['booking', 'calendar', 'intake', 'payment', 'email', 'website', 'client', 'discovery'],
    irrelevant: ['ordering', 'delivery', 'inventory', 'shipping', 'e-commerce', 'store']
  },
  'therapy': {
    keywords: ['therapy', 'therapist', 'counsell', 'counselor', 'psycho', 'mental health'],
    relevant: ['booking', 'calendar', 'intake', 'payment', 'website', 'client', 'notes', 'consent'],
    irrelevant: ['ordering', 'delivery', 'inventory', 'shipping', 'e-commerce', 'store', 'social']
  },
  'fitness': {
    keywords: ['fitness', 'personal train', 'yoga', 'pilates', 'nutrition', 'wellness', 'pt'],
    relevant: ['booking', 'calendar', 'payment', 'website', 'client', 'retention', 'scheduling'],
    irrelevant: ['ordering', 'delivery', 'inventory', 'e-commerce', 'store']
  },
  'food': {
    keywords: ['food', 'meal', 'prep', 'catering', 'restaurant', 'bakery', 'chef', 'cook', 'kitchen'],
    relevant: ['ordering', 'payment', 'delivery', 'menu', 'website', 'food-photography'],
    irrelevant: ['client-intake', 'booking-system', 'course', 'membership', 'calendar']
  },
  'creative': {
    keywords: ['creative', 'design', 'designer', 'photography', 'photographer', 'video', 'writing', 'artist'],
    relevant: ['portfolio', 'website', 'inquiry', 'invoice', 'contract', 'payment', 'project'],
    irrelevant: ['booking-calendar', 'delivery', 'membership', 'inventory', 'shipping']
  },
  'professional': {
    keywords: ['professional', 'va', 'virtual assistant', 'bookkeep', 'admin', 'consult'],
    relevant: ['website', 'inquiry', 'invoice', 'contract', 'payment', 'project', 'client'],
    irrelevant: ['ordering', 'delivery', 'inventory', 'shipping', 'e-commerce']
  },
  'ecommerce': {
    keywords: ['e-commerce', 'ecommerce', 'shop', 'store', 'product', 'sell online', 'retail', 'etsy', 'shopify'],
    relevant: ['store', 'payment', 'inventory', 'shipping', 'product', 'website', 'abandoned-cart'],
    irrelevant: ['booking', 'intake', 'calendar', 'client-management']
  },
  // Builder persona types
  'design': {
    keywords: ['design', 'graphic', 'brand', 'logo', 'visual'],
    relevant: ['portfolio', 'website', 'inquiry', 'invoice', 'contract', 'payment', 'project'],
    irrelevant: ['booking-calendar', 'delivery', 'membership', 'inventory']
  },
  'photography': {
    keywords: ['photo', 'videograph', 'film', 'shoot'],
    relevant: ['portfolio', 'website', 'booking', 'invoice', 'contract', 'gallery', 'delivery'],
    irrelevant: ['inventory', 'shipping', 'membership', 'e-commerce']
  },
  'copywriting': {
    keywords: ['copy', 'content', 'writer', 'writing', 'blog'],
    relevant: ['portfolio', 'website', 'inquiry', 'invoice', 'contract', 'project'],
    irrelevant: ['booking-calendar', 'delivery', 'inventory', 'shipping']
  },
  'web_dev': {
    keywords: ['web dev', 'developer', 'code', 'programming', 'software'],
    relevant: ['portfolio', 'website', 'inquiry', 'invoice', 'contract', 'project', 'github'],
    irrelevant: ['booking-calendar', 'delivery', 'inventory', 'shipping']
  },
  'marketing': {
    keywords: ['marketing', 'social media', 'ads', 'seo', 'digital'],
    relevant: ['website', 'inquiry', 'invoice', 'contract', 'project', 'analytics', 'reporting'],
    irrelevant: ['booking-calendar', 'delivery', 'inventory', 'shipping']
  },
};

// Default config for 'other' or unrecognised business types
// Permissive — only flags obviously wrong services, doesn't require specific ones
const DEFAULT_BUSINESS_TYPE: BusinessTypeServices = {
  keywords: [],
  relevant: ['website', 'payment', 'client', 'booking', 'invoice', 'project'],
  irrelevant: [] // No hard restrictions for unknown business types
};

function detectBusinessType(submission: QuestionnaireSubmission, report: ReckoningReport): string | null {
  // First, check if business_type is directly answered (new questionnaire format)
  const businessTypeAnswer = submission.answers.business_type;
  if (typeof businessTypeAnswer === 'string' && BUSINESS_TYPE_MAP[businessTypeAnswer]) {
    return businessTypeAnswer;
  }

  // Fallback: search through text for keywords (handles 'other' and legacy formats)
  const searchText = [
    submission.answers.business_idea,
    submission.answers.what_are_you_building,
    submission.answers.describe_your_business,
    submission.answers.who_they_help,
    submission.answers.business_description,
    report.recipient?.business_type,
  ].filter(Boolean).join(' ').toLowerCase();

  // Find matching business type via keywords
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

  // Use detected type config, or fall back to permissive default
  const typeConfig = businessType
    ? BUSINESS_TYPE_MAP[businessType]
    : DEFAULT_BUSINESS_TYPE;

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
