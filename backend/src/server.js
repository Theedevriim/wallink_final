console.log('🔄 Starting application...');
console.log('📦 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'not set');
console.log('🚪 Port from env:', process.env.PORT || 'not set');

import express from 'express';

console.log('✅ Express imported successfully');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`🎯 Using port: ${PORT}`);

// Minimal server
app.get('/', (req, res) => {
  console.log('📞 Root endpoint called');
  res.json({
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeVersion: process.version
  });
});

console.log('🔧 Routes configured');

// Start server with maximum logging
console.log(`🚀 Attempting to start server on 0.0.0.0:${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ SUCCESS: Server started successfully!');
  console.log(`🌐 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Server address:`, server.address());
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  console.error('❌ Error code:', err.code);
  console.error('❌ Error message:', err.message);
  console.error('❌ Stack trace:', err.stack);
  process.exit(1);
});

server.on('listening', () => {
  console.log('🎉 Server listening event fired!');
  console.log('📍 Server details:', server.address());
});

// Process event logging
process.on('exit', (code) => {
  console.log(`🚪 Process exiting with code: ${code}`);
});

process.on('SIGTERM', (signal) => {
  console.log(`📶 Received signal: ${signal}`);
});

process.on('SIGINT', (signal) => {
  console.log(`📶 Received signal: ${signal}`);
});

process.on('uncaughtException', (err) => {
  console.error('💀 Uncaught Exception:', err);
  console.error('💀 Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💀 Unhandled Rejection:', reason);
  console.error('💀 Promise:', promise);
  process.exit(1);
});

console.log('🛡️ Error handlers configured');
console.log('⏳ Waiting for server to start...');

export default app;
