const { spawn } = require('child_process');
const n8n = spawn('n8n.cmd', [], { stdio: 'inherit', shell: true });
n8n.on('error', (err) => console.error('Failed to start n8n:', err));
