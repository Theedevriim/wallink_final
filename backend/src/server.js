import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sponsorRoutes from './routes/sponsor.routes.js';
import suiConfig from './config/sui.config.js';

// ES modules için __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backend klasöründeki .env dosyasını oku
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
app.use(express.json());
app.use('/api/sponsor', sponsorRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'zkLogin Linktree Backend',
    version: '1.0.0',
    network: process.env.SUI_NETWORK,
    endpoints: {
      createProfile: 'POST /api/sponsor/create-profile',
      addLink: 'POST /api/sponsor/add-link',
      updateLink: 'POST /api/sponsor/update-link',
      removeLink: 'POST /api/sponsor/remove-link',
      updateProfile: 'POST /api/sponsor/update-profile',
      execute: 'POST /api/sponsor/execute',
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⛓️  Network: ${process.env.SUI_NETWORK}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Package ID: ${process.env.LINKTREE_PACKAGE_ID ? 'Set' : 'Not set'}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('💀 Uncaught Exception:', err);
  process.exit(1);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
