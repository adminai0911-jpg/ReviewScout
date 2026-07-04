const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getAudioUrl } = require('google-tts-api');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const { generateContentWithFailover } = require('./seo_generator'); // Reusing existing Gemini logic
require('dotenv').config();

// Tell fluent-ffmpeg where the static binary is
ffmpeg.setFfmpegPath(ffmpegStatic);

const contentDir = path.join(__dirname, 'src', 'content');
const videoDir = path.join(__dirname, 'videos');

// Ensure videos directory exists
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}

// Reuse the keys from .env
const apiKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];

async function downloadFile(url, dest) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
}

async function createVideoFromArticle(filePath, fileName) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    const slug = fileName.replace('.md', '');
    
    // Parse frontmatter (rudimentary parsing)
    const titleMatch = fileContent.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug;
    
    console.log(`🎬 Processing Article: ${title}`);
    
    // 1. Generate 30s Script with Gemini
    const scriptPrompt = `You are a viral TikTok and YouTube Shorts creator. 
    Write a fast-paced, high-energy 30-second video script based on this article title: "${title}".
    
    RULES:
    - Keep it under 60 words so it fits in 30 seconds.
    - Start with a strong hook!
    - End with a call to action to "Check the link in the comments for the full review!"
    - DO NOT include stage directions, brackets, or speaker names. Return ONLY the spoken text.
    `;
    
    console.log(`🧠 Writing viral script using Gemini...`);
    let script = await generateContentWithFailover(scriptPrompt, apiKeys, process.env.XAI_API_KEY);
    script = script.replace(/[^a-zA-Z0-9.,!? ]/g, ''); // Clean up weird characters for TTS
    
    if (!script || script.length < 10) {
        console.log(`❌ Script generation failed. Skipping.`);
        return false;
    }
    console.log(`📜 Script: ${script}`);
    
    // 2. Generate Audio using Google TTS
    console.log(`🎙️ Generating AI Voiceover...`);
    const audioUrl = getAudioUrl(script, {
        lang: 'en-US',
        slow: false,
        host: 'https://translate.google.com',
    });
    
    const audioPath = path.join(videoDir, `${slug}.mp3`);
    await downloadFile(audioUrl, audioPath);
    console.log(`✅ Audio saved to ${audioPath}`);
    
    // 3. Get AI Background Image
    console.log(`🎨 Generating AI Background Image...`);
    const imagePrompt = encodeURIComponent(`Cinematic, hyper-realistic 4k background for a tech review video about: ${title}, dark aesthetic, neon accents`);
    const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1080&height=1920&nologo=true`;
    
    const imagePath = path.join(videoDir, `${slug}.jpg`);
    await downloadFile(imageUrl, imagePath);
    console.log(`✅ Image saved to ${imagePath}`);
    
    // 4. Stitch Video with FFmpeg
    const outputPath = path.join(videoDir, `${slug}.mp4`);
    console.log(`🎞️ Rendering MP4 Video with FFmpeg... This may take a moment.`);
    
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(imagePath)
            .loop() // Loop the single image
            .input(audioPath)
            // Use the shortest input (the audio duration) as the total video length
            .outputOptions([
                '-c:v libx264',
                '-tune stillimage',
                '-c:a aac',
                '-b:a 192k',
                '-pix_fmt yuv420p',
                '-shortest' // End video when audio ends
            ])
            .save(outputPath)
            .on('end', async () => {
                console.log(`🚀 Video successfully rendered at: ${outputPath}`);
                
                try {
                    console.log(`☁️ Uploading video to transfer.sh to get a public URL for Buffer...`);
                    // Use curl to upload the video and get the temporary URL
                    const uploadUrl = execSync(`curl --upload-file "${outputPath}" "https://transfer.sh/${slug}.mp4"`).toString().trim();
                    console.log(`✅ Uploaded to: ${uploadUrl}`);
                    
                    console.log(`📡 Pushing to YouTube, Instagram, and LinkedIn via Buffer...`);
                    const bufferApiKey = process.env.BUFFER_VIDEO_API_KEY;
                    const channels = [];
                    if (process.env.BUFFER_YOUTUBE_ID) channels.push({ id: process.env.BUFFER_YOUTUBE_ID, name: "YouTube Shorts" });
                    if (process.env.BUFFER_INSTAGRAM_ID) channels.push({ id: process.env.BUFFER_INSTAGRAM_ID, name: "Instagram Reels" });
                    if (process.env.BUFFER_LINKEDIN_ID) channels.push({ id: process.env.BUFFER_LINKEDIN_ID, name: "LinkedIn" });
                    
                    const postText = `Check out this ultimate AI Review for ${title}! 🔥 #tech #review #ai #automation`;
                    
                    const bufferQuery = `
                      mutation CreatePost($input: CreatePostInput!) {
                        createPost(input: $input) {
                          ... on PostActionSuccess {
                            post { id }
                          }
                        }
                      }
                    `;
                    
                    for (const channel of channels) {
                        console.log(`📲 Sending to ${channel.name}...`);
                        const bufferVariables = {
                            input: {
                                channelId: channel.id,
                                text: postText,
                                mode: "shareNow",
                                schedulingType: "automatic",
                                assets: [
                                    { video: { url: uploadUrl } }
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
                            if (bData.errors) console.log(`❌ Buffer GraphQL Error for ${channel.name}: ${JSON.stringify(bData.errors)}`);
                            else console.log(`✅ Successfully published to ${channel.name}!`);
                        } else {
                            console.log(`❌ HTTP Error for ${channel.name}: ${bufferResponse.status}`);
                        }
                    }
                } catch (uploadErr) {
                    console.error(`❌ Upload/Buffer Error:`, uploadErr.message);
                }
                
                // Cleanup temp files
                fs.unlinkSync(imagePath);
                fs.unlinkSync(audioPath);
                
                // Mark article as video generated
                const updatedContent = fileContent.replace('---', '---\nvideo: true');
                fs.writeFileSync(filePath, updatedContent);
                
                resolve(true);
            })
            .on('error', (err) => {
                console.error(`❌ FFmpeg Error: ${err.message}`);
                reject(err);
            });
    });
}

async function runVideoBot() {
    console.log(`\n===========================================`);
    console.log(`🎥 AI Video Bot Started! Searching for new articles...`);
    
    if (!fs.existsSync(contentDir)) {
        console.log(`⚠️ Content directory not found: ${contentDir}`);
        return;
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    let processed = false;

    for (const file of files) {
        const filePath = path.join(contentDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Look for articles that haven't had a video generated yet
        if (!content.includes('video: true')) {
            console.log(`\n📄 Found un-videoed article: ${file}`);
            try {
                const success = await createVideoFromArticle(filePath, file);
                if (success) {
                    processed = true;
                    break; // Only do one per cycle to avoid rate limits
                }
            } catch (err) {
                console.error(`❌ Failed to create video for ${file}:`, err);
            }
        }
    }

    if (!processed) {
        console.log(`💤 No new articles to process. Sleeping for 15 minutes...`);
    } else {
        console.log(`⏳ Video generation complete. Sleeping for 15 minutes...`);
    }
}

// Run immediately, then every 15 minutes
runVideoBot();
setInterval(runVideoBot, 15 * 60 * 1000);
