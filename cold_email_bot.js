const googleIt = require('google-it');
const nodemailer = require('nodemailer');
const { generateContentWithFailover } = require('./seo_generator');
require('dotenv').config();

// Keywords to scrape businesses for
const NICHES = [
    "plumbing services in texas",
    "real estate agencies in miami",
    "accounting firms in new york",
    "dental clinics in california"
];

async function runColdEmailSniper() {
    console.log(`\n===========================================`);
    console.log(`🎯 Cold Email Sniper Started! Hunting for leads...`);
    
    // Pick a random niche for today
    const query = NICHES[Math.floor(Math.random() * NICHES.length)];
    console.log(`🔍 Scraping Google for: "${query}"`);

    let results = [];
    try {
        results = await googleIt({ query: query, limit: 10 });
    } catch (e) {
        console.error("❌ Scraping failed:", e.message);
        return;
    }

    if (!results || results.length === 0) {
        console.log(`💤 No leads found. Sleeping...`);
        return;
    }

    console.log(`🎯 Found ${results.length} raw leads. Analyzing...`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const apiKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];
    let sentCount = 0;

    for (const lead of results) {
        // Skip massive directories
        if (lead.link.includes('yelp.com') || lead.link.includes('bbb.org') || lead.link.includes('facebook.com')) {
            continue;
        }

        console.log(`\n🧠 Analyzing target: ${lead.title}`);
        
        // Use Gemini to write a hyper-personalized pitch based on the search snippet
        const prompt = `You are a cold email sales expert selling a $997/mo AI automation SaaS called "Automesion". 
I scraped this local business from Google:
Business Name/Title: ${lead.title}
Website Snippet: ${lead.snippet}

Write a highly personalized, 3-sentence cold email to the owner.
Rule 1: Mention a detail from their snippet so they know it's not spam.
Rule 2: Pitch how Automesion can replace 3 of their employees by automating their entire workflow.
Rule 3: Call to action is to reply to this email for a free demo.
Rule 4: Output ONLY the email body. No subject line, no greetings like [Owner Name]. Just start the email.`;

        const emailBody = await generateContentWithFailover(prompt, apiKeys, process.env.XAI_API_KEY);
        
        if (emailBody) {
            console.log(`✉️ Crafted personalized pitch:`);
            console.log(emailBody);
            
            // In a true production environment, we would scrape the homepage for the `mailto:` link.
            // For safety and avoiding spamming real businesses from this script during testing, 
            // we will simulate the send or send to the admin's email.
            // Replace 'adminai0911@gmail.com' with the actual scraped email in production.
            
            const targetEmail = 'adminai0911@gmail.com'; 
            
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: targetEmail, 
                subject: `Quick question regarding ${lead.title.split(' ')[0]}`,
                text: emailBody + `\n\n(Sent via ReviewScout Cold Email Sniper. Target URL: ${lead.link})`
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`✅ Sent Cold Email to ${targetEmail} for ${lead.title}`);
                sentCount++;
                
                // Only send 1 email per cycle to avoid Gmail bans
                break;
            } catch (err) {
                console.error(`❌ Email failed:`, err.message);
            }
        }
    }

    console.log(`\n✅ Sniper cycle complete. Sent ${sentCount} cold emails.`);
    console.log(`⏳ Reloading... sleeping for 6 hours.`);
}

// Run immediately, then every 6 hours
runColdEmailSniper();
setInterval(runColdEmailSniper, 6 * 60 * 60 * 1000);
