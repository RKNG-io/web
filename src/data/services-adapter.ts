// Adapter to map SERVICE_CATALOGUE to the format expected by validation

import { SERVICE_CATALOGUE } from './services';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'discontinued';
  personas?: string[];
}

// Map SERVICE_CATALOGUE to validation-compatible format
export const services: Service[] = SERVICE_CATALOGUE.map(item => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.basePrice,
  category: item.category,
  status: 'active' as const, // All current services are active
  personas: item.personas,
}));

// Re-export helpers
export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

export function getServicesByCategory(category: string): Service[] {
  return services.filter(s => s.category === category);
}

export function getServicesForPersona(persona: string): Service[] {
  return services.filter(s => !s.personas || s.personas.includes(persona));
}
