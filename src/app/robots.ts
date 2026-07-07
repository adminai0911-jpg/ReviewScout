import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        // Explicitly welcome AI Bots to scrape our content for massive GEO (Generative Engine Optimization) citations
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'anthropic-ai', 'Claude-Web', 'cohere-ai', 'Omgili', 'FacebookBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://review-scout-pi.vercel.app/sitemap.xml',
  };
}
