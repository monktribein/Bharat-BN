import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || request.nextUrl.hostname || '';

  // Auto-transfer any traffic on *.vercel.app directly to the official production domain bharatbn.com
  if (host.includes('vercel.app')) {
    const prodUrl = new URL(pathname + request.nextUrl.search, 'https://bharatbn.com');
    return NextResponse.redirect(prodUrl, 308);
  }

  // Skip static assets, Next internal files, direct API endpoints, and known Next.js routes
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/people') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/biz') ||
    pathname.startsWith('/claim') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/enterprise') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check backend URL Registry for route ownership (WordPress vs Next.js)
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000';
  const wpOrigin = process.env.WORDPRESS_ORIGIN_URL;

  try {
    const res = await fetch(`${backendUrl}/api/v1/url-registry/resolve?path=${encodeURIComponent(pathname)}`, {
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const data = await res.json();

      // If owned by legacy WordPress and origin configured, transparently rewrite/proxy to WordPress origin
      if (data.owner === 'wordpress' && wpOrigin) {
        const wpTargetUrl = new URL(pathname + request.nextUrl.search, wpOrigin);
        return NextResponse.rewrite(wpTargetUrl);
      }
    }
  } catch (err) {
    // Graceful fallback to Next.js on network error or timeout
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

