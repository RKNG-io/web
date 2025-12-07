'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ServiceItem } from '@/lib/types';
import { Bundle, findMatchingBundle, findNearBundles, getBundleById } from '@/lib/data/bundles';
import { getServiceById } from '@/lib/data/service-catalogue';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface CartItem {
  type: 'service' | 'bundle';
  id: string;
  name: string;
  price: number;
  originalPrice?: number;  // For bundles, the à la carte total
  quantity: number;
  serviceIds?: string[];   // For bundles, the included service IDs
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartContextType {
  // State
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addService: (service: ServiceItem) => void;
  addBundle: (bundle: Bundle) => void;
  addMultipleServices: (services: ServiceItem[]) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Helpers
  isInCart: (serviceId: string) => boolean;

  // Computed
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  itemCount: number;

  // Bundle detection
  matchedBundle: Bundle | undefined;
  nearBundles: { bundle: Bundle; missing: string[]; have: string[] }[];

  // Agency comparison
  agencyTotal: number;
  agencySavings: number;
}

// ═══════════════════════════════════════════════════════════════
// DISCOUNT TIERS (à la carte only — bundles have fixed prices)
// ═══════════════════════════════════════════════════════════════

const DISCOUNT_TIERS = [
  { minItems: 2, discount: 0.05 },   // 5% off 2+ items
  { minItems: 4, discount: 0.10 },   // 10% off 4+ items
  { minItems: 6, discount: 0.15 },   // 15% off 6+ items
];

function getDiscountForItemCount(count: number): number {
  const tier = DISCOUNT_TIERS
    .filter(t => count >= t.minItems)
    .sort((a, b) => b.discount - a.discount)[0];
  return tier?.discount || 0;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    isOpen: false,
  });

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────

  const addService = useCallback((service: ServiceItem) => {
    setState(prev => {
      // Check if already in cart
      const existing = prev.items.find(i => i.id === service.id && i.type === 'service');
      if (existing) {
        return prev; // Don't add duplicates
      }

      // Check if this service is part of a bundle already in cart
      const bundleWithService = prev.items.find(
        i => i.type === 'bundle' && i.serviceIds?.includes(service.id)
      );
      if (bundleWithService) {
        return prev; // Already covered by a bundle
      }

      const newItem: CartItem = {
        type: 'service',
        id: service.id,
        name: service.name,
        price: service.basePrice,
        quantity: 1,
      };

      return {
        ...prev,
        items: [...prev.items, newItem],
        isOpen: true,
      };
    });
  }, []);

  const addBundle = useCallback((bundle: Bundle) => {
    setState(prev => {
      // Check if already in cart
      const existing = prev.items.find(i => i.id === bundle.id && i.type === 'bundle');
      if (existing) {
        return prev;
      }

      // Remove any individual services that are part of this bundle
      const filteredItems = prev.items.filter(
        i => i.type !== 'service' || !bundle.includes.includes(i.id)
      );

      const newItem: CartItem = {
        type: 'bundle',
        id: bundle.id,
        name: bundle.name,
        price: bundle.bundlePrice,
        originalPrice: bundle.alaCarteTotal,
        quantity: 1,
        serviceIds: bundle.includes,
      };

      return {
        ...prev,
        items: [...filteredItems, newItem],
        isOpen: true,
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, items: [] }));
  }, []);

  const toggleCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const addMultipleServices = useCallback((services: ServiceItem[]) => {
    setState(prev => {
      let newItems = [...prev.items];

      for (const service of services) {
        // Check if already in cart
        const existing = newItems.find(i => i.id === service.id && i.type === 'service');
        if (existing) continue;

        // Check if this service is part of a bundle already in cart
        const bundleWithService = newItems.find(
          i => i.type === 'bundle' && i.serviceIds?.includes(service.id)
        );
        if (bundleWithService) continue;

        newItems.push({
          type: 'service',
          id: service.id,
          name: service.name,
          price: service.basePrice,
          quantity: 1,
        });
      }

      return {
        ...prev,
        items: newItems,
        isOpen: true,
      };
    });
  }, []);

  const isInCart = useCallback((serviceId: string): boolean => {
    return state.items.some(
      i => (i.type === 'service' && i.id === serviceId) ||
           (i.type === 'bundle' && i.serviceIds?.includes(serviceId))
    );
  }, [state.items]);

  // ─────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────

  const computed = useMemo(() => {
    const { items } = state;

    // Separate bundles and services
    const bundles = items.filter(i => i.type === 'bundle');
    const services = items.filter(i => i.type === 'service');

    // Calculate subtotal (before à la carte discount)
    const bundleTotal = bundles.reduce((sum, b) => sum + b.price, 0);
    const serviceTotal = services.reduce((sum, s) => sum + s.price, 0);
    const subtotal = bundleTotal + serviceTotal;

    // À la carte discount only applies to individual services
    const serviceCount = services.length;
    const discountPercent = getDiscountForItemCount(serviceCount);
    const serviceDiscount = Math.round(serviceTotal * discountPercent);
    const discount = serviceDiscount;

    const total = subtotal - discount;

    // Bundle detection (for services only)
    const serviceIds = services.map(s => s.id);
    const matchedBundle = findMatchingBundle(serviceIds);
    const nearBundles = findNearBundles(serviceIds);

    // Agency comparison
    const agencyTotal = items.reduce((sum, item) => {
      if (item.type === 'bundle') {
        const bundle = getBundleById(item.id);
        if (bundle) {
          return sum + bundle.includes.reduce((s, id) => {
            const service = getServiceById(id);
            return s + (service?.agencyComparison || 0);
          }, 0);
        }
      } else {
        const service = getServiceById(item.id);
        return sum + (service?.agencyComparison || 0);
      }
      return sum;
    }, 0);

    return {
      subtotal,
      discount,
      discountPercent,
      total,
      itemCount: items.length,
      matchedBundle,
      nearBundles,
      agencyTotal,
      agencySavings: agencyTotal - total,
    };
  }, [state.items]);

  // ─────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────

  const value: CartContextType = {
    items: state.items,
    isOpen: state.isOpen,
    addService,
    addBundle,
    addMultipleServices,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    ...computed,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
