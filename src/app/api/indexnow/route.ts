import { NextResponse } from 'next/server';

export async function GET() {
  const host = 'review-scout-bbbc.vercel.app';
  const key = 'reviewscout2026indexnowkey';
  const keyLocation = `https://${host}/${key}.txt`;

  const PRODUCTS = [
    "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4", "Anker Soundcore Space Q45",
    "Amazon Echo Dot", "Google Nest Hub", "Philips Hue Starter Kit", "Ring Video Doorbell", "iRobot Roomba j7+",
    "DJI Mini 4 Pro", "GoPro HERO12 Black", "Sony ZV-E10", "Insta360 X3", "Canon EOS R50",
    "MacBook Air M3", "iPad Pro 11-inch", "Microsoft Surface Pro 9", "Samsung Galaxy Tab S9", "Dell XPS 15",
    "Apple Watch Series 9", "Garmin Fenix 7", "Oura Ring Gen3", "Whoop 4.0", "Fitbit Charge 6",
    "Dyson V15 Detect", "Ninja Creami", "Breville Barista Express", "Instant Pot Duo", "Vitamix 5200"
  ];

  const LOCATIONS = [
    { city: "London", country: "United Kingdom", lang: "en" },
    { city: "New York", country: "United States", lang: "en" },
    { city: "Toronto", country: "Canada", lang: "en" },
    { city: "Montreal", country: "Canada", lang: "fr" },
    { city: "Mexico City", country: "Mexico", lang: "es" },
    { city: "Berlin", country: "Germany", lang: "de" },
    { city: "Paris", country: "France", lang: "fr" },
    { city: "Rome", country: "Italy", lang: "it" },
    { city: "Madrid", country: "Spain", lang: "es" },
    { city: "Amsterdam", country: "Netherlands", lang: "nl" },
    { city: "Mumbai", country: "India", lang: "hi" },
    { city: "Chennai", country: "India", lang: "ta" },
    { city: "Hyderabad", country: "India", lang: "te" },
    { city: "Bengaluru", country: "India", lang: "kn" },
    { city: "Tokyo", country: "Japan", lang: "ja" },
    { city: "Sydney", country: "Australia", lang: "en" },
    { city: "Singapore", country: "Singapore", lang: "en" },
    { city: "Dubai", country: "United Arab Emirates", lang: "ar" },
    { city: "São Paulo", country: "Brazil", lang: "pt" }
  ];

  const USE_CASES = ["for Commuting", "for Office Work", "for Home Use", "for Travel"];

  const urlList: string[] = [];
  PRODUCTS.forEach(p => {
    LOCATIONS.forEach(l => {
      USE_CASES.forEach(u => {
        if (urlList.length < 200) {
          const slug = `best-${p}-${u}-in-${l.city}-${l.country}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          urlList.push(`https://${host}/${l.lang}/article/${slug}`);
        }
      });
    });
  });

  const payload = {
    host,
    key,
    keyLocation,
    urlList
  };

  try {
    // Send to IndexNow API (Bing, Yandex, Seznam, Naver)
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    return NextResponse.json({
      success: true,
      message: `Submitted ${urlList.length} pSEO URLs directly to Bing & Yandex IndexNow API!`,
      status: res.status,
      submittedUrls: urlList.slice(0, 10)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
