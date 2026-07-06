require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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
            const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: prompt });
            return response.text.trim();
        } catch (error) {
            const msg = error.message || "";
            console.log(`⚠️ Gemini Key Error: ${msg}`);
            // If it's a safety or bad request error, it will fail on all keys, so abort early.
            if (msg.includes('SAFETY') || msg.includes('400')) {
                throw new Error(`Content Blocked by Safety Filters: ${msg}`);
            }
            console.log(`🔄 Rotating to next API key...`);
            await sleep(3000); // Wait 3 seconds before trying next key to prevent IP ban
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

    // Do NOT randomize keys. Use the first one until it hits a 429, then rotate sequentially.
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

            // Check if topic exists in Supabase
            if (supabase) {
                const { data } = await supabase.from('articles').select('slug').eq('slug', slug).single();
                if (data) {
                    console.log(`⚠️  Topic already exists in DB, thinking of a new one...`);
                    continue;
                }
            } else {
                console.log(`❌ Supabase is not configured. Aborting.`);
                return;
            }

            // Push to Supabase Database for infinite scalability
            if (supabase) {
                console.log(`☁️ Pushing article to Supabase Database...`);
                try {
                    const { error } = await supabase.from('articles').insert([{
                        slug: slug,
                        title: topic.title,
                        category: topic.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        content: articleMarkdown,
                        date: new Date().toISOString().split('T')[0],
                        language: targetLanguage
                    }]);
                    if (error) {
                        console.log(`⚠️ Supabase push failed (Table might not exist yet): ${error.message}`);
                    } else {
                        console.log(`✅ Successfully pushed ${slug} to Supabase!`);
                    }
                } catch (e) {
                    console.log(`⚠️ Supabase error: ${e.message}`);
                }
            }

            totalGenerated++;
            
            console.log(`\n⏳ Cooling down for 60 seconds to protect Gemini API limits...`);
            await sleep(60000);

        } catch (err) {
            console.log(`❌ Generation Failed: ${err.message}`);
            console.log(`⚠️ Pausing for 2 minutes before retrying...`);
            await sleep(120000);
        }
    }
}

runInfiniteGenerator();
