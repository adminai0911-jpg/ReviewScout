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

const USE_CASES = ["for Commuting", "for Office Work", "for Home Use", "for Travel", "for Professionals"];

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

  // Generate 1,000+ pSEO matrix URLs dynamically
  PRODUCTS.forEach(product => {
    LOCATIONS.forEach(location => {
      USE_CASES.forEach(useCase => {
        const title = `Best ${product} ${useCase} in ${location.city}, ${location.country}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        routes.push({
          url: `${baseUrl}/${location.lang}/article/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              [location.lang]: `${baseUrl}/${location.lang}/article/${slug}`,
              'x-default': `${baseUrl}/en/article/${slug}`,
            },
          },
        });
      });
    });
  });

  return routes;
}
