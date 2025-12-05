'use client';

import { Suspense } from 'react';
import { CartProvider } from '@/components/services/CartContext';
import { CartDrawer } from '@/components/services/CartDrawer';
import { ServicesVersionA } from './VersionA';

function ServicesContent() {
  return (
    <CartProvider>
      <ServicesVersionA />
      <CartDrawer />
    </CartProvider>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ice flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
