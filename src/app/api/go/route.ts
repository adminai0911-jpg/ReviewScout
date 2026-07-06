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
  const fallbackTag = 'reviewscout-20';

  // Amazon Storefront Mapping by Country Code
  const amazonStores: Record<string, { domain: string, tag: string }> = {
    'US': { domain: 'amazon.com', tag: 'reviewscout-20' },
    'GB': { domain: 'amazon.co.uk', tag: 'reviewscoutuk-21' },
    'CA': { domain: 'amazon.ca', tag: 'reviewscoutca-20' },
    'DE': { domain: 'amazon.de', tag: 'reviewscoutde-21' },
    'FR': { domain: 'amazon.fr', tag: 'reviewscoutfr-21' },
    'IT': { domain: 'amazon.it', tag: 'reviewscoutit-21' },
    'ES': { localized: true, domain: 'amazon.es', tag: 'reviewscoutes-21' },
    'BR': { domain: 'amazon.com.br', tag: 'reviewscoutbr-20' },
    'AU': { domain: 'amazon.com.au', tag: 'reviewscoutau-22' },
    'IN': { domain: 'amazon.in', tag: 'reviewscoutin-21' },
  };

  try {
    const urlObj = new URL(targetUrl);
    
    // Only rewrite Amazon links
    if (urlObj.hostname.includes('amazon.')) {
      const store = amazonStores[country] || amazonStores['US'];
      
      // Rewrite the domain to the local storefront
      urlObj.hostname = 'www.' + store.domain;
      
      // Rewrite the affiliate tag
      urlObj.searchParams.set('tag', store.tag);
      
      return NextResponse.redirect(urlObj.toString());
    }
  } catch (error) {
    // If URL parsing fails, just fallback to the original URL
    console.error("Invalid URL in Geo-Router:", targetUrl);
  }

  // For non-Amazon links or if parsing fails, just redirect to the original URL
  return NextResponse.redirect(targetUrl);
}
