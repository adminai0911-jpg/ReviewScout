require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const contentDir = path.join(__dirname, 'src', 'content', 'articles');

async function migrate() {
    console.log('🚀 Starting migration of local articles to Supabase...');
    
    if (!fs.existsSync(contentDir)) {
        console.log('❌ Content directory not found.');
        return;
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    console.log(`📁 Found ${files.length} articles to migrate.`);

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
        const slug = file.replace('.md', '');
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(fileContent);
        
        const title = parsed.data.title || slug.split('-').join(' ');
        const category = (parsed.data.category || 'uncategorized').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const date = parsed.data.date || new Date().toISOString().split('T')[0];
        const language = parsed.data.language || 'English';

        try {
            const { error } = await supabase.from('articles').insert([{
                slug: slug,
                title: title,
                category: category,
                content: fileContent,
                date: date,
                language: language
            }]);

            if (error) {
                // Ignore duplicates
                if (error.code === '23505') {
                    console.log(`⚠️ ${slug} already exists in DB. Skipping.`);
                } else {
                    console.log(`❌ Failed to push ${slug}:`, error.message);
                    failCount++;
                }
            } else {
                console.log(`✅ Migrated: ${slug}`);
                successCount++;
            }
        } catch (err) {
            console.log(`❌ Error on ${slug}:`, err.message);
            failCount++;
        }
    }

    console.log(`\n🎉 Migration Complete! Successfully pushed ${successCount} articles to Supabase. Failed: ${failCount}`);
}

migrate();
