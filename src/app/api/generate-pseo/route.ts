import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; // Max allowed for Vercel Hobby tier

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize Gemini with load balancing across 9 keys
const getGenAI = () => {
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
  if (!keysStr) return null;
  const keys = keysStr.split(',').map(k => k.trim());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return new GoogleGenerativeAI(randomKey);
};

// The Massive pSEO Matrix (1000+ Combinations)
const PRODUCTS = [
  "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4", "Anker Soundcore Space Q45",
  "Amazon Echo Dot", "Google Nest Hub", "Philips Hue Starter Kit", "Ring Video Doorbell", "iRobot Roomba j7+",
  "DJI Mini 4 Pro", "GoPro HERO12 Black", "Sony ZV-E10", "Insta360 X3", "Canon EOS R50",
  "MacBook Air M3", "iPad Pro 11-inch", "Microsoft Surface Pro 9", "Samsung Galaxy Tab S9", "Dell XPS 15",
  "Apple Watch Series 9", "Garmin Fenix 7", "Oura Ring Gen3", "Whoop 4.0", "Fitbit Charge 6",
  "Dyson V15 Detect", "Ninja Creami", "Breville Barista Express", "Instant Pot Duo", "Vitamix 5200"
];

const LOCATIONS = [
  { city: "Mumbai", country: "India", lang: "hi", languageName: "Hindi" },
  { city: "Chennai", country: "India", lang: "ta", languageName: "Tamil" },
  { city: "Hyderabad", country: "India", lang: "te", languageName: "Telugu" },
  { city: "Bengaluru", country: "India", lang: "kn", languageName: "Kannada" },
  { city: "Kochi", country: "India", lang: "ml", languageName: "Malayalam" },
  { city: "Kolkata", country: "India", lang: "bn", languageName: "Bengali" },
  { city: "Pune", country: "India", lang: "mr", languageName: "Marathi" },
  { city: "Delhi", country: "India", lang: "en", languageName: "English" },
  { city: "New York", country: "United States", lang: "en", languageName: "English" },
  { city: "Toronto", country: "Canada", lang: "en", languageName: "English" },
  { city: "Montreal", country: "Canada", lang: "fr", languageName: "French" },
  { city: "Mexico City", country: "Mexico", lang: "es", languageName: "Spanish" },
  { city: "London", country: "United Kingdom", lang: "en", languageName: "English" },
  { city: "Berlin", country: "Germany", lang: "de", languageName: "German" },
  { city: "Paris", country: "France", lang: "fr", languageName: "French" },
  { city: "Rome", country: "Italy", lang: "it", languageName: "Italian" },
  { city: "Madrid", country: "Spain", lang: "es", languageName: "Spanish" },
  { city: "Amsterdam", country: "Netherlands", lang: "nl", languageName: "Dutch" },
  { city: "Stockholm", country: "Sweden", lang: "sv", languageName: "Swedish" },
  { city: "Warsaw", country: "Poland", lang: "pl", languageName: "Polish" },
  { city: "Brussels", country: "Belgium", lang: "fr", languageName: "French" },
  { city: "Dublin", country: "Ireland", lang: "en", languageName: "English" },
  { city: "Tokyo", country: "Japan", lang: "ja", languageName: "Japanese" },
  { city: "Sydney", country: "Australia", lang: "en", languageName: "English" },
  { city: "Singapore", country: "Singapore", lang: "en", languageName: "English" },
  { city: "Dubai", country: "United Arab Emirates", lang: "ar", languageName: "Arabic" },
  { city: "Riyadh", country: "Saudi Arabia", lang: "ar", languageName: "Arabic" },
  { city: "Istanbul", country: "Turkey", lang: "tr", languageName: "Turkish" },
  { city: "Cairo", country: "Egypt", lang: "ar", languageName: "Arabic" },
  { city: "São Paulo", country: "Brazil", lang: "pt", languageName: "Portuguese" }
];

const USE_CASES = [
  "for Commuting", "for Office Work", "for Home Use", "for Travel", "for Professionals"
];

export async function GET(request: Request) {
  // Security: Verify the Cron header to prevent unauthorized bot triggering
  const authHeader = request.headers.get('authorization');
  const validToken = `Bearer ${process.env.CRON_SECRET || 'ReviewScout-Cron-Token-9f8a7b6c5d4e'}`;
  
  if (authHeader !== validToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Generate a random combination
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const useCase = USE_CASES[Math.floor(Math.random() * USE_CASES.length)];

  const title = `Best ${product} ${useCase} in ${location.city}, ${location.country}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  try {
    // 1. Check if article already exists to prevent duplicate generation cost
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single();
    if (existing) {
      return NextResponse.json({ success: true, message: 'Article already exists, skipping AI generation.' });
    }

    const genAI = getGenAI();
    if (!genAI) {
      return NextResponse.json({ error: 'GEMINI_API_KEYS missing' }, { status: 500 });
    }

    // 2. Call Gemini AI to write the article
    // We switched to gemini-2.5-flash because the Pro model throws a 429 quota error on the free tier.
    // Flash is incredibly fast, highly capable for SEO, and has a massive free tier quota.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are an expert product reviewer and SEO copywriter for a site called "ReviewScout".
      Write a comprehensive, engaging, and highly informative Wirecutter-style product review.
      
      Topic: "${title}"
      Target Language: ${location.languageName}
      Target Keyword/Product: ${product}
      Target City/Region: ${location.city}, ${location.country}

      CRITICAL MONETIZATION RULE: 
      If the keyword is about a Software, SaaS, App, or digital service, YOU MUST recommend a related PHYSICAL HARDWARE product to buy (like a 4K Monitor, Ergonomic Chair, Professional Microphone, etc.).
      
      MULTI-PLATFORM AGGREGATION:
      At the very end of the article, you MUST generate a markdown Price Comparison Table using this exact format with placeholder tracking IDs. DO NOT use Amazon exclusively.
      
      ## 💰 Best Places to Buy [Product Name] Today
      We scour the internet daily to find you the lowest prices from verified global retailers. 
      | Retailer | Price Estimate | Link |
      |----------|---------------|------|
      | **Amazon** | *Fastest Local Shipping* | [Check Price on Amazon](https://amazon.com/placeholder_id) |
      | **AliExpress** | *Lowest Price (Global Shipping)* | [Check Price on AliExpress](https://aliexpress.com/placeholder_id) |
      | **eBay** | *Best for Refurbished/Used* | [Check Price on eBay](https://ebay.com/placeholder_id) |
      | **Etsy / Awin** | *Custom Accessories* | [Search Custom Accessories](https://awin1.com/placeholder_id) |
      | **Digistore24** | *Digital Software Alternative* | [Check Digital Tools](https://digistore24.com/placeholder_id) |
      
      Format the response as a valid JSON object with the following structure:
      {
        "title": "SEO optimized, clickbaity but professional title including the keyword and year",
        "content": "The full article in Markdown format"
      }

      Requirements:
      1. MUST be written entirely in ${location.languageName}.
      2. Format using Markdown (use ## and ### for headings).
      3. Do not include the main Title as an H1 heading (the site handles that). Just start with an introduction paragraph.
      4. Include specific references to ${location.city} and ${location.country} to make it locally relevant.
      5. Include a "Pros:" and "Cons:" bulleted list (the site uses this for special styling).
      6. Include a section that clearly states "👑 Editor's Top Pick".
      7. Be incredibly persuasive, pushing the user to click the verified links to buy on Amazon.
      8. Minimum length: 600 words.
    `;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    
    // Clean potential markdown JSON blocks
    rawText = rawText.replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/im, '').trim();
    
    let parsedTitle = title;
    let parsedContent = rawText;
    
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.title) parsedTitle = parsed.title;
      if (parsed.content) parsedContent = parsed.content;
    } catch (e) {
      console.error("Failed to parse Gemini JSON output, falling back to raw text", e);
    }

    // 3. Save to Supabase
    const { data, error } = await supabase.from('articles').insert([{
      title: parsedTitle,
      slug,
      content: parsedContent,
      language: location.lang,
      category: 'Electronics',
      date: new Date().toISOString().split('T')[0]
    }]).select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `pSEO article autonomously generated by Gemini: ${title}`,
      data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
