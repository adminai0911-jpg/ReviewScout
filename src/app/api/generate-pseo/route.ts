import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// The Massive pSEO Matrix (1000+ Combinations)
const PRODUCTS = [
  // Tech & Audio
  "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4", "Anker Soundcore Space Q45",
  // Smart Home
  "Amazon Echo Dot", "Google Nest Hub", "Philips Hue Starter Kit", "Ring Video Doorbell", "iRobot Roomba j7+",
  // Photography & Video
  "DJI Mini 4 Pro", "GoPro HERO12 Black", "Sony ZV-E10", "Insta360 X3", "Canon EOS R50",
  // Laptops & Tablets
  "MacBook Air M3", "iPad Pro 11-inch", "Microsoft Surface Pro 9", "Samsung Galaxy Tab S9", "Dell XPS 15",
  // Fitness & Health
  "Apple Watch Series 9", "Garmin Fenix 7", "Oura Ring Gen3", "Whoop 4.0", "Fitbit Charge 6",
  // Home Appliances
  "Dyson V15 Detect", "Ninja Creami", "Breville Barista Express", "Instant Pot Duo", "Vitamix 5200"
];

const LOCATIONS = [
  // India & Regional Languages
  { city: "Mumbai", country: "India", lang: "hi" },
  { city: "Chennai", country: "India", lang: "ta" },
  { city: "Hyderabad", country: "India", lang: "te" },
  { city: "Bengaluru", country: "India", lang: "kn" },
  { city: "Kochi", country: "India", lang: "ml" },
  { city: "Kolkata", country: "India", lang: "bn" },
  { city: "Pune", country: "India", lang: "mr" },
  { city: "Delhi", country: "India", lang: "en" },
  // North America
  { city: "New York", country: "United States", lang: "en" },
  { city: "Toronto", country: "Canada", lang: "en" },
  { city: "Montreal", country: "Canada", lang: "fr" },
  { city: "Mexico City", country: "Mexico", lang: "es" },
  // Europe
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
  // Asia & Oceania
  { city: "Tokyo", country: "Japan", lang: "ja" },
  { city: "Sydney", country: "Australia", lang: "en" },
  { city: "Singapore", country: "Singapore", lang: "en" },
  // Middle East & Africa
  { city: "Dubai", country: "United Arab Emirates", lang: "ar" },
  { city: "Riyadh", country: "Saudi Arabia", lang: "ar" },
  { city: "Istanbul", country: "Turkey", lang: "tr" },
  { city: "Cairo", country: "Egypt", lang: "ar" },
  // South America
  { city: "São Paulo", country: "Brazil", lang: "pt" }
];

const USE_CASES = [
  "for Commuting", "for Office Calls", "for Audiophiles", "for Gym & Workout", "for Students"
];

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Generate a random combination
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const useCase = USE_CASES[Math.floor(Math.random() * USE_CASES.length)];

  const title = `Best ${product} ${useCase} in ${location.city}, ${location.country}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const content = `
## The Ultimate Guide to the ${product} ${useCase} in ${location.city}

If you are living in or traveling to ${location.city}, finding the right audio gear is critical. 
The **${product}** has emerged as the absolute best choice ${useCase}.

### Why ${location.city} Locals Love It
Due to the unique environment of ${location.country}, the active noise cancellation and durability of the ${product} make it the top choice for daily use.

### Pros:
- Industry-leading noise cancellation perfect for ${location.city} transport
- Incredible battery life
- Fast charging

### Cons:
- Premium price tag (but worth it for the ${useCase} experience)

### Verdict
👑 **Editor's Top Pick for ${location.city}**

Don't wait. Use our verified links below to secure the best price and ensure authentic delivery in ${location.country}.
  `.trim();

  try {
    const { data, error } = await supabase.from('articles').insert([{
      title,
      slug,
      content,
      language: location.lang,
      category: 'Electronics',
      date: new Date().toISOString().split('T')[0]
    }]).select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `pSEO article generated: ${title}`,
      data
    });
  } catch (error: any) {
    // If it's a unique constraint violation on slug, just return success (already exists)
    if (error.code === '23505') {
      return NextResponse.json({ success: true, message: 'Article already exists' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
