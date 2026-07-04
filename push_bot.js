const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configure VAPID keys for web-push
webpush.setVapidDetails(
    'mailto:adminai0911@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // For read access
);

async function runPushBlaster() {
    console.log(`\n===========================================`);
    console.log(`🚀 Native Push Blaster Bot Started!`);
    
    // Fetch all active subscriptions from Supabase
    const { data: subscribers, error } = await supabase.from('push_subscriptions').select('*');
    
    if (error) {
        console.error("❌ Error fetching subscribers:", error.message);
        return;
    }
    
    if (!subscribers || subscribers.length === 0) {
        console.log(`💤 No subscribers found in database. Sleeping for 1 hour...`);
        return;
    }
    
    console.log(`🎯 Found ${subscribers.length} active push subscribers!`);

    // Define the marketing blast
    // This pushes the high-ticket Automesion SaaS
    const pushPayload = JSON.stringify({
        title: "Automate Your Entire Business 🤖",
        body: "Discover how our $997/mo AI system replaces 5 employees. Click to see the demo!",
        icon: "https://review-scout-pi.vercel.app/favicon.ico",
        url: "https://automesion.com/?ref=reviewscout"
    });

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
            }
        };

        try {
            await webpush.sendNotification(pushSubscription, pushPayload);
            successCount++;
        } catch (err) {
            // If the user revoked permission, the server returns 410 Gone
            if (err.statusCode === 410 || err.statusCode === 404) {
                console.log(`🗑️ Subscriber unsubscribed. Removing from DB...`);
                await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            }
            failCount++;
        }
    }

    console.log(`✅ Push Blast Complete! Sent: ${successCount}, Failed/Cleaned: ${failCount}`);
    console.log(`⏳ Sleeping for 24 hours until next blast...`);
}

// Run immediately, then every 24 hours
runPushBlaster();
setInterval(runPushBlaster, 24 * 60 * 60 * 1000);
