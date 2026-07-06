const https = require('https');

const SITEMAP_URL = 'https://review-scout-pi.vercel.app/sitemap.xml';

const PING_URLS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
];

console.log('🚀 Initiating Zero-Cost Algorithm Pinger...');
console.log(`📡 Target Sitemap: ${SITEMAP_URL}\n`);

PING_URLS.forEach((url) => {
  console.log(`Ping -> ${url}`);
  
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ SUCCESS: Search engine notified. They will crawl the sitemap shortly.`);
    } else {
      console.log(`⚠️ WARNING: Received status code ${res.statusCode} from ${url}`);
    }
  }).on('error', (e) => {
    console.error(`❌ ERROR: Failed to ping search engine. ${e.message}`);
  });
});

// Note: To fully automate this, you would run this script daily via a cron job
// or GitHub Actions workflow.
