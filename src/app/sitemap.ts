import { MetadataRoute } from 'next';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://review-scout-pi.vercel.app';
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    }
  ];

  let loadedFromSupabase = false;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('slug, created_at, category');
      
      if (!error && data && data.length > 0) {
        const categories = new Set<string>();
        data.forEach(item => {
          if (item.category) categories.add(item.category);
          routes.push({
            url: `${baseUrl}/article/${item.slug}`,
            lastModified: new Date(item.created_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });

        categories.forEach(cat => {
          routes.push({
            url: `${baseUrl}/category/${cat}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
          });
        });

        loadedFromSupabase = true;
      }
    } catch(e) {}
  }

  if (!loadedFromSupabase) {
    const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir);
      const categories = new Set<string>();
      
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          routes.push({
            url: `${baseUrl}/article/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
          try {
             const fc = fs.readFileSync(path.join(contentDir, file), 'utf-8');
             const match = fc.match(/category:\s*([^\n]+)/);
             if (match) categories.add(match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          } catch(e) {}
        }
      });
      
      categories.forEach(cat => {
        routes.push({
          url: `${baseUrl}/category/${cat}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        });
      });
    }
  }

  return routes;
}
