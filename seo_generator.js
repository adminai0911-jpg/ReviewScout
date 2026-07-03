require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const affiliateId = "inamazon0f2-21";

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

// Helper function to pause the script
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runInfiniteGenerator() {
    console.log(`\n♾️ [PHASE 2] INFINITE pSEO Article Generator Booting Up...\n`);
    
    if (!process.env.GEMINI_API_KEY) {
        console.log(`❌ ERROR: GEMINI_API_KEY is missing.`);
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    let totalGenerated = 0;

    // Infinite loop: it will run forever until you stop the script
    while (true) {
        try {
            console.log(`\n=========================================================`);
            console.log(`🧠 Step 1: Inventing a new, highly-profitable Amazon niche...`);
            
            // Generate a random, highly specific niche that hasn't been done 1000 times
            const topicPrompt = `You are a creative Amazon Affiliate marketer. 
            Invent ONE highly specific, long-tail product search query that someone might type into Google.
            It can be from ANY category on Amazon (e.g., Industrial tools, obscure hobbies, specialized medical supplies, weird sports, professional equipment, anything!).
            
            Return ONLY a valid JSON object in this exact format, with no markdown formatting or extra text:
            {
                "product": "Name of specific product type",
                "audience": "Specific type of person who buys this",
                "budget": "Price constraint (e.g., Under $50, Premium)"
            }`;

            const topicResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: topicPrompt });
            let jsonString = topicResponse.text.trim();
            
            // Clean up if AI added markdown code blocks
            if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
            if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
            if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
            
            const topic = JSON.parse(jsonString.trim());
            
            const rawSlug = `best-${topic.product}-for-${topic.audience}-${topic.budget}`;
            const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const filePath = path.join(contentDir, `${slug}.md`);

            // If by sheer coincidence it generated one we already have, skip to next loop
            if (fs.existsSync(filePath)) {
                console.log(`⚠️  Topic already exists, thinking of a new one...`);
                continue;
            }

            console.log(`🎯 Chosen Topic: Best ${topic.product} for ${topic.audience} (${topic.budget})`);
            console.log(`✍️ Step 2: Writing the SEO Article...`);

            const articlePrompt = `You are an expert SEO copywriter and Amazon Affiliate marketer optimizing for both Google and AI Search Engines (AIO/GEO). 
            Write a highly engaging, 800-word blog post targeting the exact long-tail keyword: 
            "Best ${topic.product} for ${topic.audience} ${topic.budget} in 2026"
            
            The article MUST be formatted in Markdown.
            Include a Frontmatter header at the top like this:
            ---
            title: "Best ${topic.product} for ${topic.audience} (${topic.budget})"
            keyword: "best ${topic.product} for ${topic.audience}"
            date: "${new Date().toISOString().split('T')[0]}"
            ---
            
            CRITICAL: To optimize for AI Search Engines (ChatGPT, Gemini, Perplexity), you MUST include highly structured data.
            
            Structure the article exactly like this:
            1. An engaging introduction addressing the specific needs of ${topic.audience}.
            2. **TL;DR Comparison Table**: Create a Markdown Table comparing the Top 3 products (Columns: Product Name, Best Feature, Price Category).
            3. Top 3 product recommendations. For each product:
               - Make it sound like a real Amazon product for this niche.
               - Write a **Pros & Cons List** using bullet points.
               - Include a markdown link formatted EXACTLY like this: [Check Price on Amazon](https://amazon.com/dp/B08XYZ?tag=${affiliateId})
            4. A buying guide section.
            5. A conclusion.
            
            Do not include any extra text outside the markdown.`;

            const articleResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: articlePrompt });
            let articleMarkdown = articleResponse.text.trim();
            
            if (articleMarkdown.startsWith('```markdown')) articleMarkdown = articleMarkdown.substring(11);
            else if (articleMarkdown.startsWith('```')) articleMarkdown = articleMarkdown.substring(3);
            if (articleMarkdown.endsWith('```')) articleMarkdown = articleMarkdown.substring(0, articleMarkdown.length - 3);

            fs.writeFileSync(filePath, articleMarkdown.trim());
            console.log(`✅ Saved to ${slug}.md`);
            totalGenerated++;
            
            // Auto-Deploy to Vercel via GitHub every 5 articles
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
            
            // Sleep for 60 seconds to avoid Google Gemini free-tier rate limits
            console.log(`\n⏳ Cooling down for 60 seconds to avoid AI speed limits...`);
            await sleep(60000);

        } catch (err) {
            console.log(`❌ Generation Failed: ${err.message}`);
            console.log(`⚠️ Pausing for 2 minutes before retrying...`);
            await sleep(120000);
        }
    }
}

runInfiniteGenerator();
