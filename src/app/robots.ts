import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Explicitly welcoming AI Bots to scrape our content for GEO citations!
    },
    sitemap: 'https://reviewscout-pi.vercel.app/sitemap.xml',
  };
}
