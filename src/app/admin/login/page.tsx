'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid password');
        setLoading(false);
        return;
      }

      // Success - redirect to original destination
      router.push(from);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ice flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-[10px] p-8 border border-stone">
          <h1 className="text-2xl font-semibold text-charcoal mb-2">Admin Login</h1>
          <p className="text-charcoal/60 text-sm mb-6">
            Enter the admin password to access the dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-stone focus:border-fuchsia focus:ring-1 focus:ring-fuchsia outline-none transition-colors"
                placeholder="Enter password"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-fuchsia/10 border border-fuchsia/30 rounded-md text-sm text-fuchsia">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 bg-charcoal text-white font-medium rounded-md hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-charcoal/50 mt-6">
          Reckoning Admin
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ice flex items-center justify-center">
        <div className="text-charcoal/60">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
