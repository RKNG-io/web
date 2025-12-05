'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CartProvider, useCart } from '@/components/services/CartContext';
import { CartDrawer } from '@/components/services/CartDrawer';
import { ServicesVersionA } from './VersionA';
import { getBundleById } from '@/lib/data/bundles';

function BundleAutoAdd() {
  const searchParams = useSearchParams();
  const { addBundle, openCart } = useCart();

  useEffect(() => {
    const bundleId = searchParams.get('bundle');
    if (bundleId) {
      const bundle = getBundleById(bundleId);
      if (bundle) {
        addBundle(bundle);
        openCart();
      }
    }
  }, [searchParams, addBundle, openCart]);

  return null;
}

function ServicesContent() {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <BundleAutoAdd />
      </Suspense>
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
