import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const PRODUCTS = [
  "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4", "Anker Soundcore Space Q45",
  "Amazon Echo Dot", "Google Nest Hub", "Philips Hue Starter Kit", "Ring Video Doorbell", "iRobot Roomba j7+",
  "DJI Mini 4 Pro", "GoPro HERO12 Black", "Sony ZV-E10", "Insta360 X3", "Canon EOS R50",
  "MacBook Air M3", "iPad Pro 11-inch", "Microsoft Surface Pro 9", "Samsung Galaxy Tab S9", "Dell XPS 15",
  "Apple Watch Series 9", "Garmin Fenix 7", "Oura Ring Gen3", "Whoop 4.0", "Fitbit Charge 6",
  "Dyson V15 Detect", "Ninja Creami", "Breville Barista Express", "Instant Pot Duo", "Vitamix 5200"
];

const LOCATIONS = [
  { city: "Mumbai", country: "India", lang: "hi" },
  { city: "Chennai", country: "India", lang: "ta" },
  { city: "Hyderabad", country: "India", lang: "te" },
  { city: "Bengaluru", country: "India", lang: "kn" },
  { city: "Kochi", country: "India", lang: "ml" },
  { city: "Kolkata", country: "India", lang: "bn" },
  { city: "Pune", country: "India", lang: "mr" },
  { city: "Delhi", country: "India", lang: "en" },
  { city: "New York", country: "United States", lang: "en" },
  { city: "Toronto", country: "Canada", lang: "en" },
  { city: "Montreal", country: "Canada", lang: "fr" },
  { city: "Mexico City", country: "Mexico", lang: "es" },
  { city: "London", country: "United Kingdom", lang: "en" },
  { city: "Berlin", country: "Germany", lang: "de" },
  { city: "Paris", country: "France", lang: "fr" },
  { city: "Rome", country: "Italy", lang: "it" },
  { city: "Madrid", country: "Spain", lang: "es" },
  { city: "Amsterdam", country: "Netherlands", lang: "nl" },
  { city: "Stockholm", country: "Sweden", lang: "sv" },
  { city: "Warsaw", country: "Poland", lang: "pl" },
  { city: "Brussels", country: "Belgium", lang: "fr" },
  { city: "Dublin", country: "Ireland", lang: "en" },
  { city: "Tokyo", country: "Japan", lang: "ja" },
  { city: "Sydney", country: "Australia", lang: "en" },
  { city: "Singapore", country: "Singapore", lang: "en" },
  { city: "Dubai", country: "United Arab Emirates", lang: "ar" },
  { city: "Riyadh", country: "Saudi Arabia", lang: "ar" },
  { city: "Istanbul", country: "Turkey", lang: "tr" },
  { city: "Cairo", country: "Egypt", lang: "ar" },
  { city: "São Paulo", country: "Brazil", lang: "pt" }
];

const INTENT_MODIFIERS = [
  "price drop deals 2026",
  "honest review and verdict",
  "discount sale and lowest price",
  "is it worth buying",
  "buying guide and comparison",
  "secret coupon deals",
  "for commuting and travel",
  "for office work and productivity"
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://review-scout-bbbc.vercel.app';
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    }
  ];

  // Generate 4,500+ high-intent buyer query URLs
  PRODUCTS.forEach(product => {
    INTENT_MODIFIERS.forEach(intent => {
      LANGUAGES.forEach(lang => {
        const title = `${product} ${intent}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        routes.push({
          url: `${baseUrl}/${lang.code}/article/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: {
            languages: {
              [lang.code]: `${baseUrl}/${lang.code}/article/${slug}`,
              'x-default': `${baseUrl}/en/article/${slug}`,
            },
          },
        });
      });
    });
  });

  return routes;
}
