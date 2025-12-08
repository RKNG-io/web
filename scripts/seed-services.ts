#!/usr/bin/env npx ts-node

/**
 * Seed services catalogue
 * Run with: npx ts-node scripts/seed-services.ts
 */

import { SERVICE_CATALOGUE } from '../src/data/services';

async function seedServices() {
  console.log('Services catalogue:');
  console.log('==================');

  const categories = [...new Set(SERVICE_CATALOGUE.map((s) => s.category))];

  for (const category of categories) {
    console.log(`\n${category.toUpperCase()}`);
    console.log('-'.repeat(40));

    const categoryServices = SERVICE_CATALOGUE.filter((s) => s.category === category);
    for (const service of categoryServices) {
      console.log(`  ${service.name}`);
      console.log(`    Price: £${service.basePrice}`);
      if (service.personas) {
        console.log(`    Personas: ${service.personas.join(', ')}`);
      }
    }
  }

  console.log('\n==================');
  console.log(`Total services: ${SERVICE_CATALOGUE.length}`);
}

seedServices().catch(console.error);
