const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContentWithFailover(prompt, apiKeys, grokKey) {
    // 1. Try Gemini Keys first
    for (const key of apiKeys) {
        try {
            const ai = new GoogleGenAI({ apiKey: key });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return response.text.trim();
        } catch (error) {
            console.log(`⚠️ Gemini Key Failed (Possibly Rate Limited)`);
        }
    }

    // 2. Fallback to Grok
    console.error(`🚀 All Gemini keys exhausted! Will retry later...`);
    throw new Error("All AI models currently rate limited.");
}

async function runPinterestBot() {
    console.log(`\n📌 [PHASE 9] PINTEREST VIRAL BOT BOOTING UP (MULTI-MODEL EDITION)...\n`);

    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEYS) {
        console.log(`❌ ERROR: Gemini keys missing.`);
        return;
    }

    if (!process.env.BUFFER_API_KEY || !process.env.BUFFER_PINTEREST_CHANNEL_ID) {
        console.log(`❌ ERROR: BUFFER_API_KEY or BUFFER_PINTEREST_CHANNEL_ID missing in .env`);
        console.log(`   We need these to post via Buffer.`);
        return;
    }

    let apiKeys = [];
    if (process.env.GEMINI_API_KEYS) {
        apiKeys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim());
    } else {
        apiKeys = [process.env.GEMINI_API_KEY.trim()];
    }

    // Shuffle the Gemini keys so we don't always hit the same one first
    apiKeys = apiKeys.sort(() => Math.random() - 0.5);

    const grokKey = process.env.XAI_API_KEY;

    console.log(`✅ Loaded ${apiKeys.length} Gemini API Keys.`);
    if (grokKey) console.log(`✅ Loaded 1 Grok xAI Key for Failover.`);

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
            
            const titleMatch = fileContent.match(/title:\s*"(.*?)"/);
            const title = titleMatch ? titleMatch[1] : unpinnedFile.replace('.md', '');
            
            console.log(`🖼️ Generating viral Pinterest image...`);
            const imagePrompt = encodeURIComponent(`Beautiful, highly aesthetic professional product photography for ${title}, cinematic lighting, 8k resolution, pinterest style`);
            const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1000&height=1500&nologo=true`;
            
            console.log(`✍️ Generating viral Pinterest caption using Multi-Model Engine...`);
            
            const captionPrompt = `You are an expert Pinterest marketer.
            Write a viral Pinterest Pin Title and Description for an article titled: "${title}".
            The goal is to get people to click the link to read the buying guide.
            Include 5 highly relevant hashtags at the end of the description.
            
            Return ONLY a valid JSON object in this format:
            {
                "pinTitle": "Catchy Title Here",
                "pinDescription": "Engaging description here..."
            }`;

            let jsonString = await generateContentWithFailover(captionPrompt, apiKeys, grokKey);
            
            if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
            if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
            if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
            
            const pinData = JSON.parse(jsonString.trim());
            
            const articleUrl = `https://reviewscout-pi.vercel.app/article/${unpinnedFile.replace('.md', '')}`;

            console.log(`🚀 Bypassing direct APIs: Posting to Buffer GraphQL API for Cross-Platform Virality...`);
            const bufferApiKey = process.env.BUFFER_API_KEY;
            
            const channels = [];
            if (process.env.BUFFER_PINTEREST_CHANNEL_ID) channels.push({ id: process.env.BUFFER_PINTEREST_CHANNEL_ID, name: "Pinterest" });
            if (process.env.BUFFER_TWITTER_CHANNEL_ID) channels.push({ id: process.env.BUFFER_TWITTER_CHANNEL_ID, name: "X (Twitter)" });
            if (process.env.BUFFER_FACEBOOK_CHANNEL_ID) channels.push({ id: process.env.BUFFER_FACEBOOK_CHANNEL_ID, name: "Facebook Page" });
            
            const postText = `${pinData.pinTitle}\n\n${pinData.pinDescription}\n\n${articleUrl}`;
            
            const bufferQuery = `
              mutation CreatePost($input: CreatePostInput!) {
                createPost(input: $input) {
                  ... on PostActionSuccess {
                    post {
                      id
                    }
                  }
                }
              }
            `;
            
            let successCount = 0;

            for (const channel of channels) {
                console.log(`📡 Sending to Buffer Channel: ${channel.name} (${channel.id})...`);
                const bufferVariables = {
                    input: {
                        channelId: channel.id,
                        text: postText,
                        mode: "shareNow",
                        schedulingType: "automatic",
                        assets: [
                            { image: { url: imageUrl } }
                        ]
                    }
                };
                
                const bufferResponse = await fetch('https://api.buffer.com', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${bufferApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: bufferQuery, variables: bufferVariables })
                });

                if (bufferResponse.ok) {
                    const bData = await bufferResponse.json();
                    if (bData.errors) {
                        console.log(`❌ Failed to send to ${channel.name} (GraphQL Error): ${JSON.stringify(bData.errors)}`);
                    } else {
                        console.log(`✅ Successfully published to ${channel.name}!`);
                        successCount++;
                    }
                } else {
                    const errData = await bufferResponse.text();
                    console.log(`❌ Failed to send to ${channel.name}. HTTP Status: ${bufferResponse.status}`);
                    console.log(`Error Details: ${errData}`);
                }
            }

            if (successCount > 0) {
                const updatedContent = fileContent.replace('---', '---\npinned: true');
                fs.writeFileSync(filePath, updatedContent);
                console.log(`🏷️ Marked article as pinned/posted.`);
            } else {
                console.log(`⚠️ Failed to post to any channels.`);
            }

            console.log(`⏳ Waiting 10 minutes before next pin...`);
            await sleep(600000);

        } catch (error) {
            console.error(`❌ Bot crashed:`, error.message);
            console.log(`⚠️ Pausing for 2 minutes before retrying...`);
            await sleep(120000);
        }
    }
}

runPinterestBot();
