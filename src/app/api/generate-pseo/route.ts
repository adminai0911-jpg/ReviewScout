import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// The pSEO Matrix
const PRODUCTS = [
  "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", 
  "Sennheiser Momentum 4", "Anker Soundcore Space Q45"
];

const LOCATIONS = [
  { city: "Tokyo", country: "Japan", lang: "ja" },
  { city: "Berlin", country: "Germany", lang: "de" },
  { city: "Paris", country: "France", lang: "fr" },
  { city: "Madrid", country: "Spain", lang: "es" },
  { city: "London", country: "UK", lang: "en" },
  { city: "Seoul", country: "South Korea", lang: "ko" }
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
