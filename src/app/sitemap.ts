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

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('slug, created_at, category, language');
      
      if (!error && data && data.length > 0) {
        const categories = new Set<string>();
        const languages = new Set<string>();
        
        data.forEach(item => {
          if (item.category) categories.add(item.category);
          if (item.language) languages.add(item.language.toLowerCase());
          
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

        languages.forEach(lang => {
          routes.push({
            url: `${baseUrl}/language/${lang}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
          });
        });
      }
    } catch(e) {
      console.error('Error generating sitemap:', e);
    }
  }

  return routes;
}
