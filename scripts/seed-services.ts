#!/usr/bin/env npx ts-node

/**
 * Seed services catalogue
 * Run with: npx ts-node scripts/seed-services.ts
 */

import { services } from '../web/src/data/services';

async function seedServices() {
  console.log('Services catalogue:');
  console.log('==================');
  
  const categories = [...new Set(services.map((s) => s.category))];
  
  for (const category of categories) {
    console.log(`\n${category.toUpperCase()}`);
    console.log('-'.repeat(40));
    
    const categoryServices = services.filter((s) => s.category === category);
    for (const service of categoryServices) {
      console.log(`  ${service.name}`);
      console.log(`    Price: £${service.price}`);
      console.log(`    Status: ${service.status}`);
      if (service.personas) {
        console.log(`    Personas: ${service.personas.join(', ')}`);
      }
    }
  }

  console.log('\n==================');
  console.log(`Total services: ${services.length}`);
  console.log(`Active: ${services.filter((s) => s.status === 'active').length}`);
  console.log(`Discontinued: ${services.filter((s) => s.status === 'discontinued').length}`);
}

seedServices().catch(console.error);
