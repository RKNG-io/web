'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { getServiceById } from '@/lib/data/service-catalogue';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    clearCart,
    subtotal,
    discount,
    discountPercent,
    total,
    itemCount,
    nearBundles,
    agencySavings,
    addBundle,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            type: item.type,
            name: item.name,
            price: item.price,
            serviceIds: item.serviceIds,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed');
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone">
          <h2 className="text-xl font-semibold text-charcoal">
            Your selection
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-charcoal/60">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-charcoal/60 hover:text-charcoal transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal/60 mb-4">Your cart is empty</p>
              <p className="text-sm text-charcoal/40">
                Browse services and bundles to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-ice rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.type === 'bundle' && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-fuchsia/10 text-fuchsia rounded">
                          Bundle
                        </span>
                      )}
                      <h3 className="font-medium text-charcoal">{item.name}</h3>
                    </div>

                    {item.type === 'bundle' && item.serviceIds && (
                      <p className="text-sm text-charcoal/60 mt-1">
                        Includes {item.serviceIds.length} services
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-charcoal">
                        £{item.price}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-charcoal/40 line-through">
                          £{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-charcoal/40 hover:text-fuchsia transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Near bundle suggestions */}
          {nearBundles.length > 0 && (
            <div className="mt-6 p-4 bg-mint/10 border border-mint rounded-lg">
              <h4 className="text-sm font-medium text-charcoal mb-2">
                Complete a bundle and save more
              </h4>
              {nearBundles.slice(0, 1).map(({ bundle, missing }) => (
                <div key={bundle.id} className="text-sm">
                  <p className="text-charcoal/70 mb-2">
                    Add {missing.length} more {missing.length === 1 ? 'service' : 'services'} to get the{' '}
                    <strong>{bundle.name}</strong> bundle and save £{bundle.savings}
                  </p>
                  <ul className="text-charcoal/60 mb-3 space-y-1">
                    {missing.map(id => {
                      const service = getServiceById(id);
                      return service ? (
                        <li key={id}>• {service.name} (£{service.basePrice})</li>
                      ) : null;
                    })}
                  </ul>
                  <button
                    onClick={() => addBundle(bundle)}
                    className="text-sm font-medium text-fuchsia hover:text-fuchsia/80 transition-colors"
                  >
                    Switch to bundle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone p-6 space-y-4">
            {/* Pricing breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal/60">
                <span>Subtotal</span>
                <span>£{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-mint">
                  <span>Discount ({Math.round(discountPercent * 100)}%)</span>
                  <span>-£{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold text-charcoal pt-2 border-t border-stone">
                <span>Total</span>
                <span>£{total}</span>
              </div>

              {agencySavings > 0 && (
                <div className="flex justify-between text-xs text-charcoal/50">
                  <span>Agency price comparison</span>
                  <span>You save £{agencySavings}</span>
                </div>
              )}
            </div>

            {/* Error message */}
            {checkoutError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-3">
                {checkoutError}
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="block w-full py-3 px-4 bg-fuchsia text-white text-center font-medium rounded-lg hover:bg-fuchsia/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Redirecting to payment...' : 'Checkout'}
            </button>

            <button
              onClick={clearCart}
              disabled={isCheckingOut}
              className="block w-full text-center text-sm text-charcoal/60 hover:text-charcoal transition-colors disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Keep default export for backwards compatibility
export default CartDrawer;
