import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(request: Request) {
  // Security: Verify the Vercel Cron header to prevent unauthorized bot triggering
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }

  try {
    // 1. Fetch a random highly-converting pSEO article
    const { data: articles, error } = await supabase
      .from('articles')
      .select('title, slug, language')
      .limit(10);
      
    if (error || !articles || articles.length === 0) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    // Pick a random article to post
    const article = articles[Math.floor(Math.random() * articles.length)];
    const lang = (article.language || 'en').toLowerCase().substring(0, 2);
    const url = `https://review-scout-pi.vercel.app/${lang}/article/${article.slug}`;

    // 2. Generate the AI Visual for Social Media
    const safeTitle = encodeURIComponent(article.title.split(' ').slice(0, 5).join(' ') + ' cinematic product shot studio lighting');
    const uniqueSeed = article.title.length * (article.title.charCodeAt(0) || 1) * 999;
    const imageUrl = `https://image.pollinations.ai/prompt/${safeTitle}?width=1200&height=630&nologo=true&seed=${uniqueSeed}&model=flux`;

    // 3. Generate Viral Copy
    const viralHashtags = "#AmazonFinds #Deals #TechReview";
    const postBody = `🚨 PRICE DROP ALERT 🚨\n\nWe just found an insane deal on the ${article.title}. \n\nOur AI price tracker confirms this is the lowest price in 30 days.\n\nCheck stock here 👇\n${url} \n\n${viralHashtags}`;

    // 4. Distribute to the Omnichannel Network (Buffer GraphQL API)
    // Support Dual-Buffer Accounts for 6+ Platforms bypass
    const key1 = process.env.BUFFER_API_KEY_1 || process.env.BUFFER_API_KEY;
    const key2 = process.env.BUFFER_API_KEY_2;

    if (!key1 && !key2) {
      return NextResponse.json({ error: 'Buffer API Keys are missing' }, { status: 500 });
    }

    const channels = [];
    
    // Account 1 (Legacy fallback to BUFFER_API_KEY if BUFFER_API_KEY_1 isn't set)
    if (key1) {
      if (process.env.BUFFER_TWITTER_CHANNEL_ID) channels.push({ id: process.env.BUFFER_TWITTER_CHANNEL_ID, name: 'Twitter', apiKey: key1 });
      if (process.env.BUFFER_FACEBOOK_CHANNEL_ID) channels.push({ id: process.env.BUFFER_FACEBOOK_CHANNEL_ID, name: 'Facebook', apiKey: key1 });
      if (process.env.BUFFER_PINTEREST_CHANNEL_ID) channels.push({ id: process.env.BUFFER_PINTEREST_CHANNEL_ID, name: 'Pinterest', apiKey: key1 });
    }
    
    // Account 2
    if (key2) {
      if (process.env.BUFFER_INSTAGRAM_ID) channels.push({ id: process.env.BUFFER_INSTAGRAM_ID, name: 'Instagram', apiKey: key2 });
      if (process.env.BUFFER_LINKEDIN_ID) channels.push({ id: process.env.BUFFER_LINKEDIN_ID, name: 'LinkedIn', apiKey: key2 });
      if (process.env.BUFFER_TIKTOK_CHANNEL_ID) channels.push({ id: process.env.BUFFER_TIKTOK_CHANNEL_ID, name: 'TikTok', apiKey: key2 });
      if (process.env.BUFFER_YOUTUBE_CHANNEL_ID) channels.push({ id: process.env.BUFFER_YOUTUBE_CHANNEL_ID, name: 'YouTube', apiKey: key2 });
    }

    const bufferQuery = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess {
            post { id }
          }
        }
      }
    `;

    const socialEngines: Record<string, any> = {};

    for (const channel of channels) {
      const bufferVariables = {
        input: {
          channelId: channel.id,
          text: postBody,
          mode: "shareNow",
          schedulingType: "automatic",
          assets: [ { image: { url: imageUrl } } ]
        }
      };

      try {
        const bufferResponse = await fetch('https://api.buffer.com', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${channel.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: bufferQuery, variables: bufferVariables })
        });

        if (bufferResponse.ok) {
          const bData = await bufferResponse.json();
          if (bData.errors) {
            socialEngines[channel.name] = `Error: ${JSON.stringify(bData.errors)}`;
          } else {
            socialEngines[channel.name] = 'Posted Successfully';
          }
        } else {
          socialEngines[channel.name] = `HTTP Error: ${bufferResponse.status}`;
        }
      } catch (err: any) {
        socialEngines[channel.name] = `Failed: ${err.message}`;
      }
    }

    // 5. Blast Web Push Notifications to all Subscribers
    let pushSuccessCount = 0;
    let pushFailCount = 0;
    
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:adminai0911@gmail.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      const { data: subscribers } = await supabase.from('push_subscriptions').select('*');
      
      if (subscribers && subscribers.length > 0) {
        const pushPayload = JSON.stringify({
          title: "🔥 PRICE DROP ALERT 🔥",
          body: `We just found an insane deal on the ${article.title}. Click to view!`,
          icon: "https://review-scout-pi.vercel.app/favicon.ico",
          url: url
        });

        for (const sub of subscribers) {
          try {
            await webpush.sendNotification({
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth }
            }, pushPayload);
            pushSuccessCount++;
          } catch (err: any) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            }
            pushFailCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Autonomous Social Distribution & Push Blast Complete',
      payload: {
        article: article.title,
        socialCopy: postBody,
        imageAsset: imageUrl,
        networkStatus: socialEngines,
        pushBlast: { sent: pushSuccessCount, failedOrCleaned: pushFailCount }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
