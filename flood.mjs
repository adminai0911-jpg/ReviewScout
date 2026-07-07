import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS = [
  "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4", "Anker Soundcore Space Q45",
  "MacBook Pro M3", "Dell XPS 15", "Lenovo ThinkPad X1", "ASUS ROG Zephyrus", "HP Spectre x360",
  "iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra", "Google Pixel 8 Pro", "OnePlus 12", "Xiaomi 14 Pro",
  "Sony A7 IV", "Canon EOS R6", "Nikon Z6 II", "Fujifilm X-T5", "Panasonic Lumix S5 II",
  "DJI Mini 4 Pro", "GoPro HERO 12", "Insta360 X3", "Oculus Quest 3", "PS5 Slim",
  "Xbox Series X", "Nintendo Switch OLED", "Steam Deck OLED", "ASUS ROG Ally", "Logitech G Pro X Superlight",
  "Razer DeathAdder V3", "Keychron Q1 Pro", "Wooting 60HE", "LG C3 OLED TV", "Samsung S90C OLED",
  "Dyson V15 Detect", "Roomba j7+", "Ninja Creami", "Breville Barista Express", "Vitamix 5200",
  "Yeti Tundra 45", "Patagonia Torrentshell", "Arc'teryx Beta AR", "Osprey Atmos AG 65", "Garmin Fenix 7",
  "Apple Watch Ultra 2", "Oura Ring Gen 3", "Whoop 4.0", "Theragun Pro", "Hypervolt 2 Pro"
];

const LOCATIONS = [
  { city: "Tokyo", country: "Japan", lang: "ja" }, { city: "Berlin", country: "Germany", lang: "de" },
  { city: "Paris", country: "France", lang: "fr" }, { city: "Madrid", country: "Spain", lang: "es" },
  { city: "London", country: "UK", lang: "en" }, { city: "Seoul", country: "South Korea", lang: "ko" },
  { city: "New York", country: "USA", lang: "en" }, { city: "Los Angeles", country: "USA", lang: "en" },
  { city: "Toronto", country: "Canada", lang: "en" }, { city: "Sydney", country: "Australia", lang: "en" },
  { city: "Rome", country: "Italy", lang: "it" }, { city: "Milan", country: "Italy", lang: "it" },
  { city: "Barcelona", country: "Spain", lang: "es" }, { city: "Munich", country: "Germany", lang: "de" },
  { city: "Lyon", country: "France", lang: "fr" }, { city: "Osaka", country: "Japan", lang: "ja" },
  { city: "Busan", country: "South Korea", lang: "ko" }, { city: "Rio de Janeiro", country: "Brazil", lang: "pt" },
  { city: "Sao Paulo", country: "Brazil", lang: "pt" }, { city: "Lisbon", country: "Portugal", lang: "pt" },
  { city: "Mexico City", country: "Mexico", lang: "es" }, { city: "Buenos Aires", country: "Argentina", lang: "es" },
  { city: "Bogota", country: "Colombia", lang: "es" }, { city: "Lima", country: "Peru", lang: "es" },
  { city: "Santiago", country: "Chile", lang: "es" }
]; // 25 locations

const USE_CASES = [
  "for Professionals", "for Beginners", "for Travel", "for Everyday Use",
  "for Gaming", "for Productivity", "for Fitness", "for Creators"
]; // 8 use cases

// 50 * 25 * 8 = 10,000 exact combinations

async function floodDatabase() {
  console.log('Initiating World Domination Database Flood...');
  let totalInjected = 0;
  
  const batch = [];
  
  for (const product of PRODUCTS) {
    for (const location of LOCATIONS) {
      for (const useCase of USE_CASES) {
        const title = `Best ${product} ${useCase} in ${location.city}, ${location.country}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        const content = `
## The Ultimate Guide to the ${product} ${useCase} in ${location.city}

If you are living in or traveling to ${location.city}, finding the right gear is critical. 
The **${product}** has emerged as the absolute best choice ${useCase}.

### Why ${location.city} Locals Love It
Due to the unique environment of ${location.country}, the premium build and reliability of the ${product} make it the top choice for daily use.

### Top Reasons to Buy:
- Industry-leading performance perfect for ${location.city}
- Incredible durability and battery life
- Fast global shipping to ${location.country}

### Verdict
👑 **Editor's Top Pick for ${location.city}**

Don't wait. Use our verified links below to secure the best price and ensure authentic delivery in ${location.country} before stock runs out.
        `.trim();

        batch.push({
          title,
          slug,
          content,
          language: location.lang,
          category: 'Global Gear',
          date: new Date().toISOString().split('T')[0]
        });

        if (batch.length === 100) {
          try {
            const { error } = await supabase.from('articles').upsert(batch, { onConflict: 'slug', ignoreDuplicates: true });
            if (error) {
                console.error("Batch error:", error.message);
            } else {
                totalInjected += 100;
                process.stdout.write(`\rInjected ${totalInjected} / 10000 pages...`);
            }
          } catch(e) {
            console.error("Fatal batch error");
          }
          batch.length = 0; // clear batch
        }
      }
    }
  }
  
  // push remaining
  if (batch.length > 0) {
     await supabase.from('articles').upsert(batch, { onConflict: 'slug', ignoreDuplicates: true });
     totalInjected += batch.length;
  }

  console.log(`\nFlood Complete! ${totalInjected} highly-optimized pages injected into Supabase.`);
}

floodDatabase();
