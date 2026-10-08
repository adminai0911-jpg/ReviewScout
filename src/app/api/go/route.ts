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

  try {
    const urlObj = new URL(targetUrl);
    
    // Only rewrite Amazon links to Amazon.in with the verified tag
    if (urlObj.hostname.includes('amazon.')) {
      urlObj.hostname = 'www.amazon.in';
      urlObj.searchParams.set('tag', fallbackTag);
      
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
