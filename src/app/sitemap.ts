import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://reviewscout.tech';
  
  const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
  
  if (!fs.existsSync(contentDir)) {
      return [
        {
          url: baseUrl,
          lastModified: new Date(),
          changeFrequency: 'always',
          priority: 1,
        }
      ];
  }

  const files = fs.readdirSync(contentDir);
  const categories = new Set<string>();
  
  const articles: MetadataRoute.Sitemap = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      if (data.category) {
        categories.add(data.category.toLowerCase());
      }
      
      return {
        url: `${baseUrl}/article/${file.replace('.md', '')}`,
        lastModified: data.date ? new Date(data.date) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

  const categoryPages: MetadataRoute.Sitemap = Array.from(categories).map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...categoryPages,
    ...articles,
  ];
}
