const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.GMAIL_USER;
const SMTP_PASS = process.env.GMAIL_PASS;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: Supabase keys missing in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

const affiliateId = "inamazon0f2-21";

const welcomeEmailTemplate = `
<h2>Welcome to the Wealth Matrix! 🚀</h2>
<p>Thank you for subscribing to our exclusive insider circle.</p>
<p>If you are looking to truly scale your income and business automatically, you need to check out our premium software:</p>
<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #2563eb;">🤖 Automesion - The Ultimate AI Business Automation Suite</h3>
    <p>Stop doing manual work. Automesion puts your entire business on autopilot for just $997/mo.</p>
    <a href="https://automesion.com/?ref=reviewscout" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Your Free Trial Now</a>
</div>
<hr>
<p>And as promised, here are the top 3 best-selling tech deals on Amazon right now:</p>
<ul>
    <li><a href="https://www.amazon.com/s?k=best+tech+deals&tag=${affiliateId}">🔥 Top Trending Tech Deals</a></li>
    <li><a href="https://www.amazon.com/s?k=smart+home+gadgets&tag=${affiliateId}">🏠 Smart Home Essentials</a></li>
    <li><a href="https://www.amazon.com/s?k=budget+laptops&tag=${affiliateId}">💻 Budget Laptops Under $500</a></li>
</ul>
<p>We will email you every week with more exclusive software secrets and deal alerts!</p>
<br>
<p><small>As an Amazon Associate we earn from qualifying purchases.</small></p>
`;

async function checkNewSubscribers() {
    try {
        console.log(`\n🔍 Checking Supabase for new subscribers...`);
        
        const tenMinutesAgo = new Date(Date.now() - 10 * 60000).toISOString();
        
        const { data, error } = await supabase
            .from('subscribers')
            .select('email, created_at')
            .gte('created_at', tenMinutesAgo);

        if (error) throw error;

        if (!data || data.length === 0) {
            console.log("No new subscribers found in the last 10 minutes.");
            return;
        }

        console.log(`Found ${data.length} new subscribers! Sending Welcome Funnel Emails...`);

        if (!SMTP_USER || !SMTP_PASS) {
            console.log(`⚠️ SMTP Credentials missing in .env! Skipping actual email send. Emails to process:`, data.map(s => s.email));
            return;
        }

        for (const subscriber of data) {
            console.log(`📧 Sending to ${subscriber.email}...`);
            await transporter.sendMail({
                from: `"ReviewScout Deals" <${SMTP_USER}>`,
                to: subscriber.email,
                subject: "Welcome! Here are your exclusive Amazon Deals 🚀",
                html: welcomeEmailTemplate
            });
            console.log(`✅ Sent successfully!`);
        }
        
    } catch (err) {
        console.error("❌ Error running email funnel:", err.message);
    }
}

// Run once immediately, then every 10 minutes
console.log("💰 Wealth Funnel Bot Online. Scanning for subscribers every 10 minutes...");
checkNewSubscribers();
setInterval(checkNewSubscribers, 10 * 60000);
