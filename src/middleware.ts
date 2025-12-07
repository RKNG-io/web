import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple admin auth using a session cookie
// In production, use proper auth (e.g., NextAuth, Clerk)

const ADMIN_COOKIE_NAME = 'reckoning_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);

    if (!sessionCookie?.value) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the session token (simple hash check)
    const expectedToken = generateSessionToken();
    if (sessionCookie.value !== expectedToken) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

// Generate a session token based on the admin password
// This is a simple approach - in production use proper session management
function generateSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD || 'reckoning-admin-2025';
  // Simple hash - not cryptographically secure but sufficient for basic protection
  let hash = 0;
  const str = password + 'reckoning-salt';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export const config = {
  matcher: ['/admin/:path*'],
};
