import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['en', 'de', 'es', 'fr', 'it', 'pt', 'hi', 'zh', 'ja', 'ru', 'ar', 'ko']
let defaultLocale = 'en'

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale
  
  // Very basic parser, could use @formatjs/intl-localematcher for better results
  const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
  if (locales.includes(preferredLocale)) {
    return preferredLocale
  }
  
  return defaultLocale
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for API routes, static files, images, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/feed.xml' ||
    pathname === '/products.xml'
  ) {
    return
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /article/best-camera
    // The new URL is now /en/article/best-camera
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
