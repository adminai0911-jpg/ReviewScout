const { spawn } = require('child_process');
const n8n = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['n8n'], { stdio: 'inherit' });
n8n.on('error', (err) => console.error('Failed to start n8n:', err));
