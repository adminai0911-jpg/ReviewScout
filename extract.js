const fs = require('fs');
const text = fs.readFileSync('temp.html', 'utf16le');
const match = text.match(/<link rel="canonical" href="([^"]+)"/);
console.log('Canonical:', match ? match[1] : 'Not found');
