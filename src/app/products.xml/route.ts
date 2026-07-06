export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = 'https://review-scout-pi.vercel.app';
  
  // These represent the highly curated Flash Deals on the storefront
  const MOCK_DEALS = [
    { id: "DEAL-1", name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", price: "298.00", oldPrice: "399.99", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80", category: "Electronics > Audio > Headphones" },
    { id: "DEAL-2", name: "Ninja AF101 Air Fryer, 4 Qt, Black/Grey", price: "89.95", oldPrice: "129.99", image: "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&w=800&q=80", category: "Home & Kitchen > Kitchen Appliances > Air Fryers" },
    { id: "DEAL-3", name: "Apple AirPods Pro (2nd Generation)", price: "189.99", oldPrice: "249.00", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", category: "Electronics > Audio > Headphones" },
    { id: "DEAL-4", name: "Bose SoundLink Flex Bluetooth Portable Speaker", price: "119.00", oldPrice: "149.00", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80", category: "Electronics > Audio > Speakers" },
  ];

  // Generate Google Merchant Center compliant XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ReviewScout Flash Deals</title>
    <link>${baseUrl}</link>
    <description>Top AI-Curated Amazon Flash Deals</description>`;

  MOCK_DEALS.forEach((deal) => {
    // Generate the affiliate redirect URL
    const productUrl = `${baseUrl}/api/go?url=${encodeURIComponent(`https://www.amazon.com/s?k=${encodeURIComponent(deal.name)}&tag=reviewscout-20`)}`;
    
    xml += `
    <item>
      <g:id>${deal.id}</g:id>
      <g:title><![CDATA[${deal.name}]]></g:title>
      <g:description><![CDATA[Grab the ${deal.name} at a massive discount during our Flash Sale. Ranked #1 by our AI buying guide.]]></g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${deal.image}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${deal.price} USD</g:price>
      <g:brand>Top Brand</g:brand>
      <g:google_product_category><![CDATA[${deal.category}]]></g:google_product_category>
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
