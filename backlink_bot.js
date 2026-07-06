require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const googleIt = require('google-it');
const nodemailer = require('nodemailer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateBacklinkGuestPost(topic, targetSite) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are a professional guest post writer. Write a high-quality, 800-word article about "${topic}".
    The article is intended to be published on the blog: ${targetSite}.
    CRITICAL: You MUST include a natural, relevant backlink to our site. Use this EXACT markdown for the backlink somewhere in the body:
    [expert reviews and gear recommendations](https://review-scout-pi.vercel.app/)
    
    Make the article highly engaging, formatted in Markdown, with H2s, H3s, and bullet points.`;
    
    const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: prompt });
    return response.text.trim();
}

async function sendEmail(toEmail, subject, text, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"ReviewScout Partnerships" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: subject,
        text: text,
        html: html
    };

    return await transporter.sendMail(mailOptions);
}

async function runBacklinkBot() {
    console.log(`\n🔗 [PHASE 10] AUTONOMOUS BACKLINK BUILDER BOT BOOTING UP...\n`);

    const niches = ["technology", "home improvement", "gadgets", "outdoor gear", "software"];
    
    while (true) {
        try {
            const niche = niches[Math.floor(Math.random() * niches.length)];
            const query = `"${niche}" "write for us" OR "guest post"`;
            console.log(`🔍 Scraping Google for Guest Post Opportunities in niche: [${niche}]`);

            const results = await googleIt({ query, limit: 10 });
            
            for (const result of results) {
                console.log(`\n🎯 Found Target Blog: ${result.link}`);
                
                // Simulated email extraction (In production, we'd fetch the HTML and run a regex)
                // For demonstration, we will route it to the TEST_EMAIL_TO to prevent spamming real sites
                const contactEmail = process.env.TEST_EMAIL_TO; 
                
                console.log(`✉️ Found Contact Email: ${contactEmail}`);
                console.log(`✍️ Generating custom Guest Post via Gemini...`);
                
                const guestPost = await generateBacklinkGuestPost(niche, result.link);
                
                const emailHtml = `
                    <div style="font-family: sans-serif; color: #333;">
                        <p>Hi there,</p>
                        <p>I was reading your blog and absolutely loved your recent content. I write extensively about <b>${niche}</b> and wanted to see if you accept guest contributions?</p>
                        <p>I've actually gone ahead and written a full, exclusive 800-word article tailored specifically for your audience. You can review it below.</p>
                        <p>If you like it, you are welcome to publish it on your site for free! All I ask is that you keep the single backlink included in the article.</p>
                        <hr>
                        <h3>Guest Post Submission:</h3>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                            ${guestPost.replace(/\n/g, '<br>')}
                        </div>
                        <hr>
                        <p>Let me know if you are able to publish this!</p>
                        <p>Best regards,<br>ReviewScout Team</p>
                    </div>
                `;

                console.log(`🚀 Sending Cold Email Pitch + Guest Post to ${contactEmail}...`);
                await sendEmail(contactEmail, `Guest Post Submission for your ${niche} blog`, "Guest post attached.", emailHtml);
                console.log(`✅ Backlink Pitch Successfully Sent!`);
                
                console.log(`⏳ Waiting 15 minutes before the next outreach...`);
                await sleep(15 * 60 * 1000); // 15 mins
            }

        } catch (err) {
            console.log(`❌ Backlink Bot Error: ${err.message}`);
            await sleep(5 * 60 * 1000); // 5 mins
        }
    }
}

runBacklinkBot();
