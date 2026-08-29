import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'de', 'es', 'fr', 'it', 'pt', 'hi', 'zh', 'ja', 'ru', 'ar', 'ko'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;
  
  const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  if (locales.includes(preferredLocale)) {
    return preferredLocale;
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and well-known paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/feed.xml' ||
    pathname === '/products.xml'
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If locale is already present, pass through
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale and redirect
  const locale = getLocale(request);

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url),
    { status: 307 }
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|_vercel).*)'],
};
