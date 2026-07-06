import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImages() {
  console.log("🚀 Starting database scan for missing images...");
  
  // Fetch all articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, content');
    
  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }
  
  console.log(`Found ${articles.length} total articles.`);
  
  let updatedCount = 0;
  
  for (const article of articles) {
    // Check if the article already has pollinations.ai images
    if (!article.content.includes('pollinations.ai')) {
      console.log(`Fixing missing image for: ${article.title}`);
      
      const imageUrl = `![Hero Image](https://image.pollinations.ai/prompt/Professional%204K%20product%20photography%20of%20${encodeURIComponent(article.title)}%2C%20studio%20lighting%2C%20highly%20detailed%2C%20photorealistic%2C%20clean%20background?width=1200&height=600&nologo=true)\n\n`;
      
      const newContent = imageUrl + article.content;
      
      const { error: updateError } = await supabase
        .from('articles')
        .update({ content: newContent })
        .eq('id', article.id);
        
      if (updateError) {
        console.error(`Failed to update ${article.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`✅ Successfully injected 4K images into ${updatedCount} old articles!`);
}

fixImages();
