const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { OpenAI } = require('openai');
const matter = require('gray-matter');
require('dotenv').config();

// Configuration
const ARTICLES_DIR = path.join(__dirname, 'src', 'content', 'articles');
const PROCESSED_LOG = path.join(__dirname, 'viral_processed.log');
const XAI_API_KEY = process.env.XAI_API_KEY;
const N8N_WEBHOOK = process.env.MAKE_WEBHOOK_URL; // We will rename this variable later, for now we reuse it

if (!XAI_API_KEY) {
    console.error("❌ ERROR: XAI_API_KEY is missing in .env");
    process.exit(1);
}

// xAI uses the OpenAI SDK format
const openai = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

// Initialize Processed Log
if (!fs.existsSync(PROCESSED_LOG)) fs.writeFileSync(PROCESSED_LOG, '');

function getProcessedFiles() {
    return new Set(fs.readFileSync(PROCESSED_LOG, 'utf8').split('\n').filter(Boolean));
}

function markAsProcessed(filename) {
    fs.appendFileSync(PROCESSED_LOG, filename + '\n');
}

/**
 * Generate a viral social media caption using Grok (xAI)
 */
async function generateViralCaption(articleData) {
    try {
        const response = await openai.chat.completions.create({
            model: "grok-beta",
            messages: [
                {
                    role: "system",
                    content: "You are a highly skilled viral social media marketer. Write a highly engaging, high-CTR post. Keep it under 280 characters. Use psychological triggers (curiosity gap, FOMO). Sound like a real tech expert. Output ONLY the raw text."
                },
                {
                    role: "user",
                    content: `Write a viral post for: "${articleData.title}"`
                }
            ],
        });
        return response.choices[0].message.content.trim();
    } catch (err) {
        console.error("❌ Grok xAI API Error:", err.message);
        return `Check out our latest expert review on ${articleData.title}! 🚀 #Tech #Review`;
    }
}

/**
 * Process a new article and send to n8n Webhook
 */
async function processArticle(filepath) {
    const filename = path.basename(filepath);
    const processed = getProcessedFiles();

    if (processed.has(filename)) return;

    console.log(`\n🔥 New Article Detected for Viral Push: ${filename}`);

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const parsed = matter(content);
        const data = parsed.data;

        // Generate Viral Caption with Grok
        console.log(`🤖 Generating viral caption with Grok (xAI)...`);
        const viralText = await generateViralCaption(data);
        console.log(`💬 Caption generated: "${viralText}"`);

        const slug = filename.replace('.md', '');
        const articleLink = `https://reviewscout.tech/article/${slug}`;

        if (!N8N_WEBHOOK) {
            console.log(`⚠️ Webhook URL missing in .env! Skipping auto-post, but here is your generated post:\n\n${viralText}\n\n${articleLink}\n`);
            return;
        }

        // Post to n8n Webhook
        console.log(`🚀 Pushing to n8n Webhook...`);
        const payload = {
            title: data.title || "ReviewScout Guide",
            description: `${viralText}\n\n${articleLink}`,
            link: articleLink
        };

        const res = await fetch(N8N_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            console.log(`✅ Successfully sent to n8n Webhook!`);
            markAsProcessed(filename);
        } else {
            console.error(`❌ Webhook failed: ${res.status}`);
        }
    } catch (err) {
        console.error(`❌ Error processing article ${filename}:`, err);
    }
}

console.log(`\n👁️ Viral n8n Bot Online. Powered by Grok (xAI).`);

// Watch for new articles
chokidar.watch(ARTICLES_DIR, { persistent: true, ignoreInitial: true }).on('add', filepath => {
    processArticle(filepath);
});
