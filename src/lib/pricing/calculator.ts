// pricing/calculator.ts
// Pricing calculator with bundle discounts, comparisons, and ROI framing

import { 
  ServiceItem, 
  SelectedItem, 
  PricingResult, 
  PersonaType 
} from '../types';
import { SERVICE_CATALOGUE, getServiceById } from '../data/service-catalogue';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

interface PricingConfig {
  // Discount tiers based on item count
  bundleDiscounts: {
    minItems: number;
    discount: number;  // percentage as decimal
  }[];
  
  // Cost of inaction multipliers
  costOfInaction: {
    hourlyRate: number;           // Assumed hourly value of their time
    monthsProjection: number;     // How far forward to project
    leadValue: number;            // Assumed value of a lost lead
  };
}

const PRICING_CONFIG: PricingConfig = {
  bundleDiscounts: [
    { minItems: 2, discount: 0.10 },   // 10% off 2+ items
    { minItems: 4, discount: 0.15 },   // 15% off 4+ items
    { minItems: 6, discount: 0.20 },   // 20% off 6+ items
    { minItems: 8, discount: 0.25 },   // 25% off 8+ items
  ],
  costOfInaction: {
    hourlyRate: 50,          // £50/hr assumed value
    monthsProjection: 12,
    leadValue: 200           // Average value of a lost lead
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN CALCULATOR
// ═══════════════════════════════════════════════════════════════

interface CalculatorInput {
  selectedItems: SelectedItem[];
  questionnaireData: {
    hoursLostPerWeek?: number;
    persona: PersonaType;
    costOfInactionLife?: string;  // Their "I didn't build this to..." answer
  };
}

export function calculatePricing(input: CalculatorInput): PricingResult {
  const { selectedItems, questionnaireData } = input;
  
  // ─────────────────────────────────────────
  // CORE PRICING
  // ─────────────────────────────────────────
  
  const items = selectedItems.map(({ service, quantity }) => ({
    id: service.id,
    name: service.name,
    unitPrice: service.basePrice,
    quantity,
    subtotal: service.basePrice * quantity
  }));
  
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Determine discount tier
  const itemCount = selectedItems.length;
  const applicableDiscount = PRICING_CONFIG.bundleDiscounts
    .filter(tier => itemCount >= tier.minItems)
    .sort((a, b) => b.discount - a.discount)[0];
  
  const discountPercentage = applicableDiscount?.discount || 0;
  const discount = Math.round(subtotal * discountPercentage);
  const total = subtotal - discount;
  
  // ─────────────────────────────────────────
  // AGENCY COMPARISON
  // ─────────────────────────────────────────
  
  const agencyTotal = selectedItems.reduce(
    (sum, { service, quantity }) => sum + (service.agencyComparison * quantity),
    0
  );
  const agencySavings = agencyTotal - total;
  const agencySavingsPercentage = agencyTotal > 0 
    ? Math.round((agencySavings / agencyTotal) * 100) 
    : 0;
  
  // ─────────────────────────────────────────
  // COST OF INACTION
  // ─────────────────────────────────────────
  
  const hoursLostPerWeek = questionnaireData.hoursLostPerWeek || 5;
  const hoursPerMonth = hoursLostPerWeek * 4;
  const hoursPerYear = hoursLostPerWeek * 52;
  const timeMonetaryValue = hoursPerYear * PRICING_CONFIG.costOfInaction.hourlyRate;
  
  // Calculate potential time saved from selected services
  const timeSavedPerMonth = selectedItems.reduce(
    (sum, { service }) => sum + (service.timeSavedPerMonth || 0),
    0
  );
  
  // Revenue potential (qualitative, based on services selected)
  const revenueServices = selectedItems
    .filter(({ service }) => service.revenuePotential)
    .map(({ service }) => service.revenuePotential as string);
  
  const costOfInaction = {
    timeLost: {
      hoursPerMonth,
      hoursPerYear,
      monetaryValue: timeMonetaryValue
    },
    revenueLost: {
      description: revenueServices.length > 0 
        ? revenueServices.join('. ')
        : 'Missed opportunities from lack of professional systems',
      estimate: PRICING_CONFIG.costOfInaction.leadValue * 12  // 12 lost leads/year assumed
    },
    lifeCost: questionnaireData.costOfInactionLife || 
      'Another year in the same place, wondering "what if"'
  };
  
  // ─────────────────────────────────────────
  // ROI FRAMING
  // ─────────────────────────────────────────
  
  const monthlyValueGenerated = timeSavedPerMonth * PRICING_CONFIG.costOfInaction.hourlyRate;
  const paybackMonths = monthlyValueGenerated > 0 
    ? Math.ceil(total / monthlyValueGenerated)
    : null;
  
  const roi = {
    paybackPeriod: paybackMonths 
      ? `Pays for itself in ${paybackMonths} month${paybackMonths === 1 ? '' : 's'}`
      : 'Investment in your professional foundation',
    yearOneValue: (timeSavedPerMonth * 12 * PRICING_CONFIG.costOfInaction.hourlyRate) + 
                  costOfInaction.revenueLost.estimate
  };
  
  // ─────────────────────────────────────────
  // SUGGESTIONS
  // ─────────────────────────────────────────
  
  const selectedIds = new Set(selectedItems.map(i => i.service.id));
  const suggestions: { service: ServiceItem; reason: string }[] = [];
  
  // Check for suggested pairings
  for (const { service } of selectedItems) {
    for (const suggestedId of service.suggestedWith) {
      if (!selectedIds.has(suggestedId)) {
        const suggestedService = getServiceById(suggestedId);
        if (suggestedService && !suggestions.find(s => s.service.id === suggestedId)) {
          suggestions.push({
            service: suggestedService,
            reason: `Works great with ${service.name}`
          });
        }
      }
    }
  }
  
  // Check for high-impact items they might have missed
  const highImpactMissing = SERVICE_CATALOGUE
    .filter(s => 
      s.impact === 'high' && 
      s.personas.includes(questionnaireData.persona) &&
      !selectedIds.has(s.id) &&
      !suggestions.find(sug => sug.service.id === s.id)
    )
    .slice(0, 2);
  
  for (const service of highImpactMissing) {
    suggestions.push({
      service,
      reason: 'High impact, often overlooked'
    });
  }
  
  return {
    items,
    subtotal,
    discount,
    discountPercentage,
    total,
    agencyTotal,
    agencySavings,
    agencySavingsPercentage,
    costOfInaction,
    roi,
    suggestions: suggestions.slice(0, 3)  // Max 3 suggestions
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString()}`;
}

/**
 * Get discount tier description
 */
export function getDiscountDescription(itemCount: number): string | null {
  const nextTier = PRICING_CONFIG.bundleDiscounts.find(t => t.minItems > itemCount);
  if (!nextTier) return null;
  
  const itemsNeeded = nextTier.minItems - itemCount;
  return `Add ${itemsNeeded} more item${itemsNeeded === 1 ? '' : 's'} for ${nextTier.discount * 100}% off`;
}

/**
 * Calculate package pricing (for pre-built bundles)
 */
export function calculatePackagePrice(serviceIds: string[]): {
  alaCarteTotal: number;
  packagePrice: number;
  savings: number;
} {
  const services = serviceIds
    .map(id => getServiceById(id))
    .filter((s): s is ServiceItem => s !== undefined);
  
  const alaCarteTotal = services.reduce((sum, s) => sum + s.basePrice, 0);
  
  // Apply bundle discount based on item count
  const itemCount = services.length;
  const applicableDiscount = PRICING_CONFIG.bundleDiscounts
    .filter(tier => itemCount >= tier.minItems)
    .sort((a, b) => b.discount - a.discount)[0];
  
  const discountPercentage = applicableDiscount?.discount || 0;
  const packagePrice = Math.round(alaCarteTotal * (1 - discountPercentage));
  
  return {
    alaCarteTotal,
    packagePrice,
    savings: alaCarteTotal - packagePrice
  };
}

/**
 * Get services filtered for a persona and optionally business type
 */
export function getFilteredServices(
  persona: PersonaType,
  businessType?: string
): ServiceItem[] {
  return SERVICE_CATALOGUE.filter(service => {
    // Must be available for this persona
    if (!service.personas.includes(persona)) return false;
    
    // If business type specified and service has type restrictions, check match
    if (businessType && service.businessTypes.length > 0) {
      if (!service.businessTypes.includes(businessType as any)) return false;
    }
    
    return true;
  });
}
