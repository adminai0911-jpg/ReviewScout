import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Detect the user's country from Vercel's Edge headers
  const country = request.headers.get('x-vercel-ip-country') || 'US';

  // Base Amazon Affiliate Tracking ID (Fallback)
  const fallbackTag = 'inamazon0f2-21';

  // Amazon Storefront Mapping by Country Code
  const amazonStores: Record<string, { domain: string, tag: string }> = {
    'US': { domain: 'amazon.com', tag: 'inamazon0f2-21' },
    'GB': { domain: 'amazon.co.uk', tag: 'inamazon0f2-21' },
    'CA': { domain: 'amazon.ca', tag: 'inamazon0f2-21' },
    'DE': { domain: 'amazon.de', tag: 'inamazon0f2-21' },
    'FR': { domain: 'amazon.fr', tag: 'inamazon0f2-21' },
    'IT': { domain: 'amazon.it', tag: 'inamazon0f2-21' },
    'ES': { domain: 'amazon.es', tag: 'inamazon0f2-21' },
    'BR': { domain: 'amazon.com.br', tag: 'inamazon0f2-21' },
    'AU': { domain: 'amazon.com.au', tag: 'inamazon0f2-21' },
    'IN': { domain: 'amazon.in', tag: 'inamazon0f2-21' },
  };

  try {
    const urlObj = new URL(targetUrl);
    
    // Only rewrite Amazon links
    if (urlObj.hostname.includes('amazon.')) {
      const store = amazonStores[country] || { domain: 'amazon.com', tag: fallbackTag };
      
      // Rewrite the domain to the local storefront
      urlObj.hostname = 'www.' + store.domain;
      
      // Rewrite the affiliate tag
      urlObj.searchParams.set('tag', store.tag);
      
      return NextResponse.redirect(urlObj.toString(), {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    return NextResponse.redirect(urlObj.toString(), {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    // If URL parsing fails, redirect safely to homepage
    return NextResponse.redirect(new URL('/', request.url));
  }
}
