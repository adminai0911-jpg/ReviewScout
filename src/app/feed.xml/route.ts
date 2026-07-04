import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://review-scout-pi.vercel.app';

export async function GET() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  let files = [];
  try {
    files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  } catch (e) {
    console.error('Content directory not found');
  }

  const posts = files.map(file => {
    const rawContent = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const { data } = matter(rawContent);
    const slug = file.replace('.md', '');
    return {
      title: data.title || slug,
      description: data.description || `Read the full review of ${slug}`,
      slug: slug,
      date: data.date || new Date().toISOString()
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let rssItemsXml = '';
  posts.forEach(post => {
    rssItemsXml += `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.description}]]></description>
        <guid isPermaLink="true">${SITE_URL}/${post.slug}</guid>
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
