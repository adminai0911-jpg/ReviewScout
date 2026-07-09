import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = 'https://review-scout-bbbc.vercel.app';
  
  let articles: any[] = [];
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('slug, title, category, created_at, language')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (!error && data) {
        articles = data;
      }
    } catch(e) {
      console.error('Error generating RSS:', e);
    }
  }

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>ReviewScout - AI Powered Buying Guides</title>
    <link>${baseUrl}</link>
    <description>The ultimate destination for data-driven product reviews and Amazon Flash Deals.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

  articles.forEach((article) => {
    // Generate the Pollinations AI image URL dynamically
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("Professional 4K product photography of " + article.title + ", studio lighting, highly detailed, photorealistic, clean background")}?width=1200&height=630&nologo=true`;
    
    xml += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <pubDate>${new Date(article.created_at || new Date()).toUTCString()}</pubDate>
      <description><![CDATA[Check out our latest AI-driven analysis and buying guide for ${article.title}. Find the best specs, pros, cons, and lowest prices available right now.]]></description>
      ${article.category ? `<category><![CDATA[${article.category}]]></category>` : ''}
      <media:content url="${imageUrl}" type="image/jpeg" medium="image" width="1200" height="630" />
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
