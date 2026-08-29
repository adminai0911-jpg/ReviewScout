import { NextResponse } from 'next/server';

export async function GET() {
  const host = 'review-scout-bbbc.vercel.app';
  const key = 'reviewscout2026indexnowkey';
  const keyLocation = `https://${host}/${key}.txt`;

  const PRODUCTS = [
    "Sony WH-1000XM5", "Apple AirPods Max", "Bose QuietComfort Ultra", "Sennheiser Momentum 4",
    "DJI Mini 4 Pro", "GoPro HERO12 Black", "MacBook Air M3", "iPad Pro 11-inch", "Apple Watch Series 9", "Dyson V15 Detect"
  ];

  const LOCATIONS = [
    { city: "London", country: "United Kingdom", lang: "en" },
    { city: "New York", country: "United States", lang: "en" },
    { city: "Toronto", country: "Canada", lang: "en" },
    { city: "Berlin", country: "Germany", lang: "de" },
    { city: "Paris", country: "France", lang: "fr" },
    { city: "Mumbai", country: "India", lang: "hi" },
    { city: "Tokyo", country: "Japan", lang: "ja" },
    { city: "Sydney", country: "Australia", lang: "en" }
  ];

  const urlList: string[] = [];
  PRODUCTS.forEach(p => {
    LOCATIONS.forEach(l => {
      const slug = `best-${p}-for-commuting-in-${l.city}-${l.country}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      urlList.push(`https://${host}/${l.lang}/article/${slug}`);
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
