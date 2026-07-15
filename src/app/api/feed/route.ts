import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://review-scout-bbbc.vercel.app';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET() {
  let posts: { title: string; description: string; slug: string; date: string; lang: string }[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('slug, title, date, created_at, language')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) {
        posts = data.map(item => ({
          title: item.title || item.slug,
          description: `Read our expert review: ${item.title}`,
          slug: item.slug,
          lang: item.language ? item.language.toLowerCase() : 'en',
          date: item.date || item.created_at || new Date().toISOString()
        }));
      }
    } catch (e) {
      console.error('Feed: Supabase fetch failed', e);
    }
  }

  let rssItemsXml = '';
  posts.forEach(post => {
    rssItemsXml += `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/${(post as any).lang || 'en'}/article/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.description}]]></description>
        <guid isPermaLink="true">${SITE_URL}/${(post as any).lang || 'en'}/article/${post.slug}</guid>
      </item>
    `;
  });

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>ReviewScout RSS Feed</title>
        <link>${SITE_URL}</link>
        <description>The latest reviews and AI automation tools.</description>
        <language>en</language>
        ${rssItemsXml}
      </channel>
    </rss>
  `;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  });
}
