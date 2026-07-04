const https = require('https');

const SITEMAP_URL = 'https://review-scout-pi.vercel.app/sitemap.xml';

const searchEngines = [
    {
        name: 'Bing / Yahoo / DuckDuckGo',
        url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    // Google deprecated the HTTP ping endpoint in Dec 2023. 
    // Submitting directly via Google Search Console (which you already did) is the fastest and only way now!
];

console.log(`\n🚀 Forcing Search Engine Indexing for: ${SITEMAP_URL}\n`);

searchEngines.forEach(engine => {
    https.get(engine.url, (res) => {
        if (res.statusCode === 200) {
            console.log(`✅ Successfully pinged ${engine.name}`);
        } else {
            console.log(`⚠️ Failed to ping ${engine.name} (Status: ${res.statusCode})`);
        }
    }).on('error', (e) => {
        console.error(`❌ Error pinging ${engine.name}:`, e.message);
    });
});
