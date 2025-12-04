'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface GeneratingStateProps {
  token: string;
  name: string | null;
}

export function GeneratingState({ token, name }: GeneratingStateProps) {
  const router = useRouter();
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll for completion
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/reckoning/status/${token}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ready' || data.status === 'reviewed' || data.status === 'pending_review') {
            router.refresh();
          } else if (data.status === 'failed') {
            router.refresh();
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(checkStatus, 3000);
    
    // Also check immediately after a short delay
    const timeout = setTimeout(checkStatus, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [token, router]);

  const messages = [
    'Analysing your answers',
    'Understanding your situation',
    'Identifying what\'s blocking you',
    'Finding what would unlock you',
    'Matching services to your needs',
    'Writing your personalised report',
    'Almost there',
  ];

  const messageIndex = Math.min(Math.floor(elapsed / 5), messages.length - 1);

  return (
    <div className="min-h-screen bg-ice py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <Link href="/" className="text-2xl font-semibold text-charcoal">
            Reckoning
          </Link>
        </header>

        <div className="bg-white rounded-[10px] p-10 text-center">
          {/* Animated spinner */}
          <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-12 h-12 border-4 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
          </div>

          <h1 className="text-2xl font-semibold text-charcoal mb-4">
            Preparing your Reckoning{dots}
          </h1>

          <p className="text-charcoal/60 mb-2">
            {messages[messageIndex]}
          </p>

          <p className="text-sm text-charcoal/40">
            This usually takes 30-60 seconds
          </p>

          {/* Progress indicator */}
          <div className="mt-8 max-w-xs mx-auto">
            <div className="h-1 bg-stone rounded-full overflow-hidden">
              <div 
                className="h-full bg-fuchsia transition-all duration-1000"
                style={{ width: `${Math.min((elapsed / 45) * 100, 95)}%` }}
              />
            </div>
          </div>

          {elapsed > 60 && (
            <p className="mt-8 text-sm text-charcoal/50">
              Taking longer than usual. Don't worry, we're still working on it.
            </p>
          )}

          {elapsed > 120 && (
            <p className="mt-4 text-sm text-charcoal/50">
              If this is taking too long, you can{' '}
              <Link href="/" className="text-fuchsia hover:underline">
                return home
              </Link>
              . We'll email you when your report is ready.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
