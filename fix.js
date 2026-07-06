const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src', 'content', 'articles');
const files = fs.readdirSync(dir);
let fixed = 0;
files.forEach(f => {
    if (!f.endsWith('.md')) return;
    const fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf-8');
    let lines = content.split(/\r?\n/);
    let inFrontMatter = false;
    let pinnedCount = 0;
    let newLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim() === '---') {
            inFrontMatter = !inFrontMatter;
            newLines.push(line);
            continue;
        }
        if (inFrontMatter && line.trim().startsWith('pinned:')) {
            pinnedCount++;
            if (pinnedCount > 1) {
                continue; // Skip duplicate
            }
        }
        newLines.push(line);
    }
    const newContent = newLines.join('\n');
    if (content !== newContent) {
        fs.writeFileSync(fp, newContent);
        fixed++;
        console.log('Fixed', f);
    }
});
console.log('Total Fixed:', fixed);
