// lib/data/service-catalogue.ts
// Re-exports the service catalogue from the canonical source

import { ServiceItem } from '../types';
import { SERVICE_CATALOGUE as CATALOGUE, getServicesByPurchaseType } from '@/data/services';

// Re-export the main catalogue
export const SERVICE_CATALOGUE: ServiceItem[] = CATALOGUE;

// Re-export the purchaseType helper
export { getServicesByPurchaseType };

// Helper function to get services by persona
export function getServicesForPersona(persona: string): ServiceItem[] {
  return SERVICE_CATALOGUE.filter(s => s.personas.includes(persona as 'launcher' | 'builder' | 'architect'));
}

// Helper function to get services by category
export function getServicesByCategory(category: string): ServiceItem[] {
  return SERVICE_CATALOGUE.filter(s => s.category === category);
}

// Helper function to get service by ID
export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICE_CATALOGUE.find(s => s.id === id);
}
