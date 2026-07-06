const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'src', 'content', 'articles');
const SITE_URL = 'https://review-scout-pi.vercel.app';

async function runSpiderBot() {
    console.log(`\n===========================================`);
    console.log(`🕸️ SEO Spider-Web Bot Started!`);
    
    if (!fs.existsSync(contentDir)) {
        console.log(`⚠️ Content directory not found: ${contentDir}`);
        return;
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    
    if (files.length < 2) {
        console.log(`💤 Not enough articles to link together. Sleeping...`);
        return;
    }

    // Phase 1: Extract all titles and slugs
    const allArticles = [];
    for (const file of files) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
            const parsed = matter(fileContent);
            allArticles.push({
                file: file,
                path: filePath,
                slug: file.replace('.md', ''),
                title: parsed.data.title || file.replace('.md', ''),
                content: parsed.content,
                raw: fileContent
            });
        } catch (e) {
            console.error(`❌ Error parsing ${file}:`, e);
        }
    }

    console.log(`📚 Found ${allArticles.length} articles to cross-link.`);

    // Phase 2: Inject Internal Links (The Spider-Web)
    let linkedCount = 0;
    for (const article of allArticles) {
        // Skip if it already has the Related Reading section
        if (article.content.includes('## 🔗 Related Reading')) {
            continue;
        }

        // Pick 2 random articles that are NOT this article
        const otherArticles = allArticles.filter(a => a.file !== article.file);
        // Shuffle and pick 2
        const shuffled = otherArticles.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        if (selected.length > 0) {
            let linksMarkdown = `\n\n## 🔗 Related Reading\n`;
            for (const sel of selected) {
                linksMarkdown += `- [${sel.title}](/${sel.slug})\n`;
            }

            // Append to file
            const newContent = article.raw + linksMarkdown;
            fs.writeFileSync(article.path, newContent, 'utf-8');
            console.log(`🔗 Injected internal links into: ${article.title}`);
            linkedCount++;
        }
    }

    console.log(`✅ Spider-Web complete. Linked ${linkedCount} articles.`);

    // Phase 3: Auto-Index (Ping Search Engines)
    console.log(`🌍 Pinging Search Engines to force indexing...`);
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    
    const engines = [
        { name: "Google", url: `https://www.google.com/ping?sitemap=${sitemapUrl}` },
        { name: "Bing", url: `https://www.bing.com/ping?sitemap=${sitemapUrl}` }
    ];

    for (const engine of engines) {
        try {
            const response = await fetch(engine.url);
            if (response.ok) {
                console.log(`✅ Successfully pinged ${engine.name}!`);
            } else {
                console.log(`⚠️ ${engine.name} returned status ${response.status}`);
            }
        } catch (err) {
            console.error(`❌ Failed to ping ${engine.name}:`, err.message);
        }
    }

    console.log(`⏳ Spider Bot going to sleep for 12 hours...`);
}

// Run immediately, then every 12 hours
runSpiderBot();
setInterval(runSpiderBot, 12 * 60 * 60 * 1000);
