import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Simple environment loading
try {
  dotenv.config();
  console.log('✅ Environment variables loaded');
} catch (error) {
  console.log('⚠️  Using system environment variables');
}

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`🚀 Starting server on port ${PORT}`);
console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);

// Basic middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
app.use(express.json());

// Simple health check
app.get('/', (req, res) => {
  res.json({
    name: 'zkLogin Linktree Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Simple API endpoint for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Placeholder for sponsor routes
app.use('/api/sponsor', (req, res) => {
  res.status(503).json({ 
    error: 'Service not yet implemented',
    message: 'Sponsor functionality will be available soon'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Health check available at http://0.0.0.0:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export default app;
