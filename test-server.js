console.log('🎯 DIRECT TEST: Node.js is working!');
console.log('📦 Node version:', process.version);
console.log('🌍 Environment variables:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  - PORT:', process.env.PORT || 'not set');
console.log('  - PWD:', process.env.PWD || process.cwd());

console.log('🔄 Testing basic HTTP server...');

import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log('📞 Request received:', req.method, req.url);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Basic HTTP server is working!',
    timestamp: new Date().toISOString(),
    port: PORT,
    method: req.method,
    url: req.url
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ SUCCESS: Basic HTTP server started!');
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ HTTP Server error:', err);
  process.exit(1);
});

console.log('⏳ HTTP server setup complete, waiting...');