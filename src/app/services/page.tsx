'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CartProvider } from '@/components/services/CartContext';
import { CartDrawer } from '@/components/services/CartDrawer';
import { ServicesVersionA } from './VersionA';
import { ServicesVersionB } from './VersionB';

function ServicesContent() {
  const searchParams = useSearchParams();
  const version = searchParams.get('v') || 'a';

  return (
    <CartProvider>
      {version === 'b' ? <ServicesVersionB /> : <ServicesVersionA />}
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
