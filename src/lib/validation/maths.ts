// Maths validation — ensure calculations are accurate

import type { ReckoningReport, ValidationResult } from '@/types/report';

export function validateCalculations(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const calc = report.sections?.diagnosis?.cost_of_inaction?.calculation;

  if (calc) {
    // Verify the calculation adds up
    const expected = calc.hours_per_week * calc.hourly_value * calc.weeks_per_year;
    
    if (Math.abs(expected - calc.annual_cost) > 1) {
      errors.push(
        `Calculation error: ${calc.hours_per_week} × £${calc.hourly_value} × ${calc.weeks_per_year} ` +
        `= £${expected}, but report shows £${calc.annual_cost}`
      );
    }
    
    // Sanity checks
    if (calc.hours_per_week > 60) {
      errors.push(`Unrealistic hours_per_week: ${calc.hours_per_week}`);
    }
    if (calc.hours_per_week < 0) {
      errors.push(`Invalid hours_per_week: ${calc.hours_per_week}`);
    }
    if (calc.hourly_value > 500) {
      errors.push(`Unrealistic hourly_value: £${calc.hourly_value}`);
    }
    if (calc.hourly_value < 0) {
      errors.push(`Invalid hourly_value: £${calc.hourly_value}`);
    }
    if (calc.weeks_per_year > 52) {
      errors.push(`weeks_per_year cannot exceed 52`);
    }
    if (calc.weeks_per_year < 0) {
      errors.push(`Invalid weeks_per_year: ${calc.weeks_per_year}`);
    }
  }
  
  // Check service prices are reasonable
  const services = report.recommendations?.services || [];
  for (const service of services) {
    if (service.price_from < 0) {
      errors.push(`Invalid price for ${service.service_name}: £${service.price_from}`);
    }
    if (service.price_from > 10000) {
      warnings.push(`High price for ${service.service_name}: £${service.price_from} — verify correct`);
    }
  }

  // Check next_step service price
  const nextStepPrice = report.sections?.next_step?.supported_path?.price_from;
  if (nextStepPrice !== undefined && nextStepPrice < 0) {
    errors.push(`Invalid next_step service price: £${nextStepPrice}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateRoiClaims(text: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for unsubstantiated ROI claims
  const roiPatterns = [
    /(\d+)x return/gi,
    /(\d+)% increase/gi,
    /save (\d+) hours/gi,
    /worth £(\d+)/gi,
  ];
  
  for (const pattern of roiPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const num = parseInt(match[1], 10);
      // Flag extreme claims
      if ((match[0].includes('x') && num > 10) || 
          (match[0].includes('%') && num > 500) ||
          (match[0].includes('hours') && num > 40) ||
          (match[0].includes('£') && num > 50000)) {
        warnings.push(`Potentially exaggerated claim: "${match[0]}"`);
      }
    }
  }
  
  return {
    valid: true,
    errors,
    warnings
  };
}
