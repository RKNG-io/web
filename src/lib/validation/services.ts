// Services validation — ensure recommended services exist and prices match

import type { ReckoningReport, ValidationResult } from '@/types/report';
import { services } from '@/data/services-adapter';

export function validateServices(report: ReckoningReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const validServiceIds = new Set(services.map(s => s.id));
  const activeServices = services.filter(s => s.status === 'active');
  const activeServiceIds = new Set(activeServices.map(s => s.id));
  
  // Check each recommended service
  const recommendedServices = report.recommendations?.services || [];
  for (const rec of recommendedServices) {
    // Check if service exists
    if (!validServiceIds.has(rec.service_id)) {
      errors.push(`Invalid service_id: "${rec.service_id}" — not in catalogue`);
      continue;
    }
    
    // Check if service is active
    if (!activeServiceIds.has(rec.service_id)) {
      errors.push(`Discontinued service recommended: "${rec.service_id}"`);
      continue;
    }
    
    // Check price matches catalogue
    const service = services.find(s => s.id === rec.service_id);
    if (service && Math.abs(service.price - rec.price_from) > 0) {
      warnings.push(
        `Price mismatch for ${rec.service_id}: catalogue says £${service.price}, ` +
        `report says £${rec.price_from}`
      );
    }
    
    // Check name matches
    if (service && service.name !== rec.service_name) {
      warnings.push(
        `Name mismatch for ${rec.service_id}: catalogue says "${service.name}", ` +
        `report says "${rec.service_name}"`
      );
    }
  }
  
  // Check next_step service exists
  const nextStepServiceId = report.sections?.next_step?.supported_path?.service_id;
  if (nextStepServiceId) {
    if (!validServiceIds.has(nextStepServiceId)) {
      errors.push(`Invalid service_id in next_step: "${nextStepServiceId}"`);
    } else if (!activeServiceIds.has(nextStepServiceId)) {
      errors.push(`Discontinued service in next_step: "${nextStepServiceId}"`);
    }
  }
  
  // Check journey_map task service references
  const phases = report.sections?.journey_map?.phases || [];
  for (const phase of phases) {
    for (const task of phase.tasks || []) {
      if (task.service_id && !validServiceIds.has(task.service_id)) {
        warnings.push(`Invalid service_id in journey_map task: "${task.service_id}"`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function getServiceById(id: string) {
  return services.find(s => s.id === id) || null;
}

export function getActiveServices() {
  return services.filter(s => s.status === 'active');
}

export function getServicesByCategory(category: string) {
  return services.filter(s => s.category === category && s.status === 'active');
}

export function getServicesByPersona(persona: 'launcher' | 'builder' | 'architect') {
  return services.filter(s => 
    s.status === 'active' && 
    (!s.personas || s.personas.includes(persona))
  );
}
