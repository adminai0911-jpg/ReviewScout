const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const { generateContentWithFailover } = require('./seo_generator');

const parser = new Parser();
const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const logFile = path.join(__dirname, 'news_jacker_log.json');

// Ensure log file exists to track processed news
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([]));
}

const RSS_FEEDS = [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss'
];

async function runNewsJacker() {
    console.log(`\n===========================================`);
    console.log(`🗞️ News-Jacker Bot Started! Scanning for breaking news...`);
    
    let processedNews = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    const apiKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];

    for (const feedUrl of RSS_FEEDS) {
        try {
            console.log(`📡 Scanning: ${feedUrl}`);
            const feed = await parser.parseURL(feedUrl);
            
            // Check the 5 most recent articles
            for (const item of feed.items.slice(0, 5)) {
                if (processedNews.includes(item.link)) {
                    continue; // Already hijacked this news
                }

                const pubDate = new Date(item.pubDate);
                const now = new Date();
                const hoursOld = (now - pubDate) / (1000 * 60 * 60);

                // Only hijack news if it's less than 6 hours old (Trending!)
                if (hoursOld < 6) {
                    console.log(`🚨 BREAKING NEWS DETECTED: "${item.title}"`);
                    console.log(`⏳ Age: ${hoursOld.toFixed(1)} hours. Initiating hijack...`);

                    const prompt = `You are an elite SEO writer for ReviewScout. A major breaking tech news story just dropped:
Title: "${item.title}"
Snippet: "${item.contentSnippet || item.content}"

Write a massive, 1,000-word SEO-optimized blog post about this breaking news.
IMPORTANT RULES:
1. Make it unique, do not just copy the snippet. Expand on why this matters to consumers.
2. Include markdown formatting (H2, H3, bolding, lists).
3. At the end of the article, insert a pitch for our automation tool: "Tired of missing breaking trends? Automate your entire business workflow with [Automesion SaaS](https://automesion.com/?ref=reviewscout)."
4. Output raw markdown. No wrapping blockquotes.`;

                    const content = await generateContentWithFailover(prompt, apiKeys, process.env.XAI_API_KEY);
                    
                    if (content) {
                        const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
                        const fileName = `breaking-${slug}.md`;
                        const finalMarkdown = `---\ntitle: "${item.title.replace(/"/g, "'")}"\ndate: "${new Date().toISOString()}"\nauthor: "AI News Desk"\n---\n\n${content}`;
                        
                        fs.writeFileSync(path.join(contentDir, fileName), finalMarkdown);
                        console.log(`✅ Hijack Successful! Published: ${fileName}`);
                        
                        // Mark as processed
                        processedNews.push(item.link);
                        fs.writeFileSync(logFile, JSON.stringify(processedNews));
                        
                        // Only process one breaking news per cycle to avoid spamming
                        return;
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Error parsing ${feedUrl}:`, err.message);
        }
    }
    
    console.log(`💤 No breaking news found. Sleeping for 2 hours...`);
}

// Run immediately, then every 2 hours
runNewsJacker();
setInterval(runNewsJacker, 2 * 60 * 60 * 1000);
