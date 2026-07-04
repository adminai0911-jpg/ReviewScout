require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const affiliateId = "inamazon0f2-21";

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContentWithFailover(prompt, apiKeys, grokKey) {
    for (const key of apiKeys) {
        try {
            const ai = new GoogleGenAI({ apiKey: key });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return response.text.trim();
        } catch (error) {
            console.log(`⚠️ Gemini Key Failed (Possibly Rate Limited)`);
        }
    }
    console.error(`🚀 All Gemini keys exhausted! Will retry later...`);
    throw new Error("All AI models currently rate limited.");
}

async function runInfiniteGenerator() {
    console.log(`\n♾️ [PHASE 2] INFINITE pSEO Article Generator Booting Up (MULTI-MODEL EDITION)...\n`);
    
    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEYS) {
        console.log(`❌ ERROR: GEMINI_API_KEY or GEMINI_API_KEYS is missing.`);
        return;
    }

    let apiKeys = [];
    if (process.env.GEMINI_API_KEYS) {
        apiKeys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim());
    } else {
        apiKeys = [process.env.GEMINI_API_KEY.trim()];
    }

    apiKeys = apiKeys.sort(() => Math.random() - 0.5);
    const grokKey = process.env.XAI_API_KEY;

    console.log(`🔑 Loaded ${apiKeys.length} Gemini API Key(s) for massive scaling.`);
    if (grokKey) console.log(`🔑 Loaded 1 Grok xAI Key for Failover.`);
    
    let totalGenerated = 0;

    while (true) {
        try {
            console.log(`\n=========================================================`);
            
            const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];
            const targetLanguage = languages[Math.floor(Math.random() * languages.length)];
            
            console.log(`🌍 Step 1: Inventing a new Amazon/SaaS niche for the ${targetLanguage} market...`);
            
            const topicPrompt = `You are a creative Amazon Affiliate marketer and High-Ticket Software Affiliate. 
            Invent ONE highly specific, long-tail product search query that someone might type into Google.
            It can be from ANY category on Amazon (e.g., Industrial tools, obscure hobbies, specialized medical supplies), OR it can be a High-Ticket SaaS/Software tool (e.g., Best AI Video Editors, Best CRM for Plumbers, Best Web Hosting).
            
            CRITICAL: The entire output MUST be natively written in ${targetLanguage}.
            
            Return ONLY a valid JSON object in this exact format, with no markdown formatting or extra text:
            {
                "slug": "kebab-case-seo-optimized-url-in-target-language",
                "title": "Full SEO Title (e.g. Los Mejores Zapatos para Correr en 2026)",
                "product": "Name of specific product type in target language",
                "audience": "Specific type of person who buys this in target language",
                "budget": "Price constraint (e.g., Under $50, Premium) in target language",
                "category": "One short word representing the broad SEO category in English (e.g. Photography, Home, Gaming, Tools, Audio)",
                "language": "${targetLanguage}"
            }`;

            let jsonString = await generateContentWithFailover(topicPrompt, apiKeys, grokKey);
            
            if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
            if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
            if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
            
            const topic = JSON.parse(jsonString.trim());
            
            const slug = topic.slug.toLowerCase().replace(/[^a-z0-9\-]+/g, '').replace(/(^-|-$)+/g, '');
            const filePath = path.join(contentDir, `${slug}.md`);

            if (fs.existsSync(filePath)) {
                console.log(`⚠️  Topic already exists, thinking of a new one...`);
                continue;
            }

            console.log(`🎯 Chosen Topic: Best ${topic.product} for ${topic.audience} (${topic.budget})`);
            console.log(`✍️ Step 2: Writing the SEO Article using Multi-Model Engine...`);

            const articlePrompt = `You are an expert product reviewer, high-converting copywriter, and SEO specialist writing natively in ${targetLanguage}.
            Write a comprehensive, highly-engaging buyer's guide in ${targetLanguage} for the search query: "${topic.title}"
            
            CRITICAL MONETIZATION RULES:
            1. Every time you mention a specific product, you MUST make it a clickable affiliate link.
            2. If it is a physical product (like Amazon), use this URL format: [Product Name](https://www.amazon.com/s?k=PRODUCT+NAME+HERE&tag=reviewscout-20)
            3. If it is a software/SaaS product, use this URL format: [Product Name](https://automesion.com/?ref=reviewscout)
            4. Do NOT output raw URLs, always use markdown links.

            Return ONLY valid Markdown format. Do not use any markdown code blocks (\`\`\`). Just raw markdown.
            
            The structure must be:
            ---
            title: "${topic.title}"
            date: "${new Date().toISOString().split('T')[0]}"
            category: "${topic.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"
            language: "${targetLanguage}"
            pinned: false
            ---
            
            # ${topic.title}
            
            CRITICAL: To optimize for AI Search Engines (ChatGPT, Gemini, Perplexity), you MUST include highly structured data.
            EVERYTHING MUST BE WRITTEN IN ${targetLanguage}.
            
            Structure the article exactly like this:
            1. An engaging introduction addressing the specific needs of ${topic.audience}.
            2. **TL;DR Comparison Table**: Create a Markdown Table comparing the Top 3 products.
            3. Top 3 product recommendations. 
               - CRITICAL PSYCHOLOGY HACK: You must explicitly label the #1 product recommendation as the "👑 Editor's Top Pick" (translated to ${targetLanguage}).
               - For each product, make it sound like a real Amazon product for this niche.
               - Write a **Pros & Cons List** using bullet points.
               - Include a markdown link formatted EXACTLY like this: [Check Price on Amazon](https://amazon.com/dp/B08XYZ?tag=${affiliateId})
            4. A buying guide section.
            5. A conclusion.
            
            Do not include any extra text outside the markdown.`;

            let articleMarkdown = await generateContentWithFailover(articlePrompt, apiKeys, grokKey);
            
            if (articleMarkdown.startsWith('```markdown')) articleMarkdown = articleMarkdown.substring(11);
            else if (articleMarkdown.startsWith('```')) articleMarkdown = articleMarkdown.substring(3);
            if (articleMarkdown.endsWith('```')) articleMarkdown = articleMarkdown.substring(0, articleMarkdown.length - 3);

            fs.writeFileSync(filePath, articleMarkdown.trim());
            console.log(`✅ Saved to ${slug}.md`);
            totalGenerated++;
            
            if (totalGenerated % 5 === 0) {
                console.log(`\n🚀 [AUTO-DEPLOY] Pushing 5 new articles to GitHub to trigger Vercel build...`);
                try {
                    const { execSync } = require('child_process');
                    execSync('git add src/content/articles/*.md');
                    execSync('git commit -m "Auto-generated 5 new SEO articles"');
                    execSync('git push origin main');
                    console.log(`✅ Successfully pushed to GitHub. Vercel is now building your live site!`);
                } catch (err) {
                    console.log(`⚠️ Auto-Push failed. (Ensure you have linked a remote GitHub repository).`);
                }
            }
            
            console.log(`\n⏳ Cooling down for 60 seconds...`);
            await sleep(60000);

        } catch (err) {
            console.log(`❌ Generation Failed: ${err.message}`);
            console.log(`⚠️ Pausing for 2 minutes before retrying...`);
            await sleep(120000);
        }
    }
}

runInfiniteGenerator();
