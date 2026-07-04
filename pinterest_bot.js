const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const webhookUrl = process.env.MAKE_WEBHOOK_URL; 

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runPinterestBot() {
    console.log(`\n📌 [PHASE 9] PINTEREST VIRAL BOT BOOTING UP...\n`);

    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEYS) {
        console.log(`❌ ERROR: Gemini keys missing.`);
        return;
    }

    if (!webhookUrl) {
        console.log(`❌ ERROR: MAKE_WEBHOOK_URL is missing in .env`);
        console.log(`   Please create a Make.com webhook and add it to your .env file.`);
        console.log(`   Example: MAKE_WEBHOOK_URL="https://hook.us1.make.com/xxxxxx"`);
        return;
    }

    let apiKeys = [];
    if (process.env.GEMINI_API_KEYS) {
        apiKeys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim());
    } else {
        apiKeys = [process.env.GEMINI_API_KEY.trim()];
    }

    console.log(`✅ Loaded ${apiKeys.length} API Keys for caption generation.`);
    console.log(`✅ Make.com Webhook connected.`);

    // Infinite Loop
    while (true) {
        try {
            console.log(`\n=========================================================`);
            console.log(`🔍 Scanning for new, un-pinned articles...`);

            if (!fs.existsSync(contentDir)) {
                console.log(`No articles folder found yet. Waiting...`);
                await sleep(60000);
                continue;
            }

            const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
            
            // We need a way to track which articles have been pinned. 
            // We will look for a tag in the frontmatter: "pinned: true"
            let unpinnedFile = null;
            let fileContent = "";
            let filePath = "";

            for (const file of files) {
                const fp = path.join(contentDir, file);
                const content = fs.readFileSync(fp, 'utf-8');
                
                if (!content.includes('pinned: true')) {
                    unpinnedFile = file;
                    fileContent = content;
                    filePath = fp;
                    break;
                }
            }

            if (!unpinnedFile) {
                console.log(`😴 All articles have been pinned. Sleeping for 5 minutes...`);
                await sleep(300000);
                continue;
            }

            console.log(`🎯 Found unpinned article: ${unpinnedFile}`);
            
            // Extract Title and Category for the image prompt
            const titleMatch = fileContent.match(/title:\s*"(.*?)"/);
            const title = titleMatch ? titleMatch[1] : unpinnedFile.replace('.md', '');
            
            console.log(`🖼️ Generating viral Pinterest image...`);
            // Generate a free, keyless AI image using Pollinations
            // We url-encode the prompt. We want a beautiful product photography shot.
            const imagePrompt = encodeURIComponent(`Beautiful, highly aesthetic professional product photography for ${title}, cinematic lighting, 8k resolution, pinterest style`);
            const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1000&height=1500&nologo=true`;
            
            console.log(`✍️ Generating viral Pinterest caption...`);
            
            // Pick a random Gemini key
            const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
            const ai = new GoogleGenAI({ apiKey: randomKey });

            const captionPrompt = `You are an expert Pinterest marketer.
            Write a viral Pinterest Pin Title and Description for an article titled: "${title}".
            The goal is to get people to click the link to read the buying guide.
            Include 5 highly relevant hashtags at the end of the description.
            
            Return ONLY a valid JSON object in this format:
            {
                "pinTitle": "Catchy Title Here",
                "pinDescription": "Engaging description here..."
            }`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: captionPrompt });
            let jsonString = response.text.trim();
            if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
            if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
            if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
            
            const pinData = JSON.parse(jsonString.trim());
            
            const articleUrl = `https://reviewscout-pi.vercel.app/article/${unpinnedFile.replace('.md', '')}`;

            console.log(`🚀 Sending Pin to Make.com Webhook...`);
            
            const webhookPayload = {
                title: pinData.pinTitle,
                description: pinData.pinDescription,
                imageUrl: imageUrl,
                link: articleUrl
            };

            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(webhookPayload)
            });

            if (webhookResponse.ok) {
                console.log(`✅ Successfully pushed to Webhook!`);
                
                // Mark the article as pinned so we don't pin it again
                const updatedContent = fileContent.replace('---', '---\npinned: true');
                fs.writeFileSync(filePath, updatedContent);
                console.log(`🏷️ Marked article as pinned.`);
            } else {
                console.log(`❌ Failed to send to Webhook. HTTP Status: ${webhookResponse.status}`);
            }

            // Wait 10 minutes between pins so Pinterest doesn't ban us for spamming
            console.log(`⏳ Waiting 10 minutes before next pin...`);
            await sleep(600000);

        } catch (error) {
            console.error(`❌ Bot crashed:`, error);
            console.log(`⚠️ Pausing for 2 minutes before retrying...`);
            await sleep(120000);
        }
    }
}

runPinterestBot();
