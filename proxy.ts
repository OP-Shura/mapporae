import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  globalRateLimiter,
  getClientIp,
  getRateLimitHeaders,
  RATE_LIMIT_POLICIES,
} from '@/lib/security/rate-limit';
import { validatePayloadSize } from '@/lib/security/sanitize';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request.headers);

  // 1. Enforce Payload Size Bounds (Max 100KB for standard requests)
  const contentLength = request.headers.get('content-length');
  if (contentLength && !validatePayloadSize(contentLength, 100 * 1024)) {
    return NextResponse.json(
      { error: 'Payload too large. Maximum allowed size is 100KB.' },
      { status: 413 }
    );
  }

  // 2. Strict Rate Limiting for Auth Routes: Max 5 attempts per 15 minutes per IP
  const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/api/auth');
  let authRateLimitHeaders: Record<string, string> = {};

  if (isAuthRoute) {
    const authLimitResult = globalRateLimiter.check(clientIp, RATE_LIMIT_POLICIES.AUTH);
    authRateLimitHeaders = getRateLimitHeaders(authLimitResult);

    if (!authLimitResult.allowed) {
      // For browser callback navigations, redirect with query error or 429
      if (pathname.includes('/callback')) {
        const errorRedirectUrl = new URL('/saved?auth_status=rate_limited', request.url);
        const response = NextResponse.redirect(errorRedirectUrl);
        Object.entries(authRateLimitHeaders).forEach(([key, val]) => response.headers.set(key, val));
        return response;
      }

      return NextResponse.json(
        { error: 'Too many authentication attempts. Please wait 15 minutes before trying again.' },
        { status: 429, headers: authRateLimitHeaders }
      );
    }
  }

  // 3. Rate Limiting for General API Routes: Max 60 requests per minute per IP
  const isApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');
  let apiRateLimitHeaders: Record<string, string> = {};

  if (isApiRoute) {
    const apiLimitResult = globalRateLimiter.check(clientIp, RATE_LIMIT_POLICIES.API);
    apiRateLimitHeaders = getRateLimitHeaders(apiLimitResult);

    if (!apiLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: apiRateLimitHeaders }
      );
    }
  }

  // 4. Update Supabase Session via SSR Cookie Refresh
  const response = await updateSession(request);

  // 5. Attach Rate Limit Headers to the response for client awareness
  if (isAuthRoute) {
    Object.entries(authRateLimitHeaders).forEach(([k, v]) => response.headers.set(k, v));
  } else if (isApiRoute) {
    Object.entries(apiRateLimitHeaders).forEach(([k, v]) => response.headers.set(k, v));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image formats (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
