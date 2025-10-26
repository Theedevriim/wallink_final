console.log('🔄 Starting Wallink Backend Server...');
console.log('📦 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🚪 Port:', process.env.PORT || '3000');

const express = require('express');
const cors = require('cors');

console.log('✅ Dependencies loaded successfully');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

console.log('✅ Middleware configured');

// Health check endpoints
app.get('/', (req, res) => {
  console.log('📞 Root endpoint called');
  res.json({
    name: 'Wallink Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  console.log('📞 Health check called');
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Placeholder API
app.use('/api/sponsor', (req, res) => {
  res.status(503).json({ 
    error: 'Service temporarily unavailable',
    message: 'Sponsor functionality is being deployed'
  });
});

console.log('✅ Routes configured');

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

console.log('✅ Error handlers configured');

// Start server
console.log(`🚀 Starting server on 0.0.0.0:${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log('🎉 SUCCESS: Server started successfully!');
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📍 Server address:`, address);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/api/health`);
});

server.on('error', (err) => {
  console.error('❌ FATAL: Server failed to start');
  console.error('❌ Error code:', err.code);
  console.error('❌ Error message:', err.message);
  console.error('❌ Stack trace:', err.stack);
  process.exit(1);
});

server.on('listening', () => {
  console.log('👂 Server listening event fired');
});

// Process monitoring
process.on('exit', (code) => {
  console.log(`🚪 Process exiting with code: ${code}`);
});

process.on('SIGTERM', () => {
  console.log('📶 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('💀 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💀 Unhandled Rejection:', reason);
  process.exit(1);
});

console.log('🛡️ Process monitors configured');
console.log('⏳ Server initialization complete, waiting for startup...');