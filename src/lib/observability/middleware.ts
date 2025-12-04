import { NextRequest, NextResponse } from 'next/server';
import { logApiCall, logError } from './events';

type NextHandler = (request: NextRequest) => Promise<NextResponse>;

interface ObservabilityConfig {
  name: string;
  project?: string;
  logSuccess?: boolean;
  logErrors?: boolean;
}

/**
 * Wrap an API route handler with observability logging
 *
 * Usage:
 * ```typescript
 * export const POST = withObservability(
 *   async (request: NextRequest) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   { name: 'checkout', project: 'reckoning' }
 * );
 * ```
 */
export function withObservability(
  handler: NextHandler,
  config: ObservabilityConfig
): NextHandler {
  const { name, project, logSuccess = true, logErrors = true } = config;

  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.nextUrl.pathname;
    const sessionId = request.headers.get('x-session-id') || undefined;

    try {
      const response = await handler(request);
      const durationMs = Date.now() - startTime;
      const statusCode = response.status;

      // Log successful calls
      if (logSuccess) {
        await logApiCall(
          url,
          method,
          statusCode,
          durationMs,
          'api',
          name,
          sessionId,
          project
        ).catch(console.error); // Don't fail the request if logging fails
      }

      return response;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      // Log errors
      if (logErrors && error instanceof Error) {
        await Promise.all([
          logApiCall(url, method, 500, durationMs, 'api', name, sessionId, project),
          logError(error, 'api', name, sessionId, project, { url, method }),
        ]).catch(console.error);
      }

      throw error;
    }
  };
}

/**
 * Create a middleware that logs all API calls for a route group
 *
 * Usage in middleware.ts:
 * ```typescript
 * export const config = {
 *   matcher: '/api/:path*',
 * };
 *
 * export default createObservabilityMiddleware({ project: 'reckoning' });
 * ```
 */
export function createObservabilityMiddleware(config?: {
  project?: string;
  excludePaths?: string[];
}) {
  const { project, excludePaths = ['/api/observability'] } = config || {};

  return async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip excluded paths
    if (excludePaths.some(p => path.startsWith(p))) {
      return NextResponse.next();
    }

    const startTime = Date.now();
    const method = request.method;
    const sessionId = request.headers.get('x-session-id') || undefined;

    // Let the request proceed
    const response = NextResponse.next();

    // Log the call (fire and forget)
    const durationMs = Date.now() - startTime;
    logApiCall(path, method, 200, durationMs, 'api', path, sessionId, project).catch(
      console.error
    );

    return response;
  };
}

/**
 * Helper to add session ID to outgoing requests
 */
export function addSessionHeader(
  headers: HeadersInit | undefined,
  sessionId: string
): HeadersInit {
  const newHeaders = new Headers(headers);
  newHeaders.set('x-session-id', sessionId);
  return newHeaders;
}
