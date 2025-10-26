import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Try to import routes and config, but don't crash if they fail
let sponsorRoutes;
let suiConfig;

try {
  const sponsorModule = await import('./routes/sponsor.routes.js');
  sponsorRoutes = sponsorModule.default;
  console.log('✅ Sponsor routes loaded');
} catch (error) {
  console.warn('⚠️  Could not load sponsor routes:', error.message);
  sponsorRoutes = null;
}

try {
  const configModule = await import('./config/sui.config.js');
  suiConfig = configModule.default;
  console.log('✅ Sui config loaded');
} catch (error) {
  console.warn('⚠️  Could not load sui config:', error.message);
  suiConfig = null;
}

// ES modules için __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multiple environment file locations to try
const envPaths = [
  path.join(__dirname, '../../.env'),           // backend/.env
  path.join(__dirname, '../../../.env'),       // root/.env
  '.env'                                        // current directory
];

// Try to load environment variables from multiple locations
let envLoaded = false;
for (const envPath of envPaths) {
  try {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`✅ Environment loaded from: ${envPath}`);
      envLoaded = true;
      break;
    }
  } catch (error) {
    console.log(`⚠️  Could not load env from ${envPath}:`, error.message);
  }
}

if (!envLoaded) {
  console.log('⚠️  No .env file found, using environment variables from system');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment status
console.log('🔧 Environment Status:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`- PORT: ${PORT}`);
console.log(`- SUI_NETWORK: ${process.env.SUI_NETWORK || 'not set (will use testnet)'}`);
console.log(`- SUI_RPC_URL: ${process.env.SUI_RPC_URL ? 'set' : 'not set (will use default)'}`);
console.log(`- LINKTREE_PACKAGE_ID: ${process.env.LINKTREE_PACKAGE_ID ? 'set' : 'not set'}`);
console.log(`- ALLOWED_ORIGINS: ${process.env.ALLOWED_ORIGINS || 'not set (will use localhost)'}`);

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

// Only add sponsor routes if they loaded successfully
if (sponsorRoutes) {
  app.use('/api/sponsor', sponsorRoutes);
  console.log('✅ Sponsor routes mounted');
} else {
  app.use('/api/sponsor', (req, res) => {
    res.status(503).json({ error: 'Sponsor routes not available' });
  });
  console.log('⚠️  Sponsor routes not available, using fallback');
}

app.get('/', (req, res) => {
  res.json({
    name: 'zkLogin Linktree Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      network: process.env.SUI_NETWORK || 'testnet (default)',
      port: PORT,
      hasPackageId: !!process.env.LINKTREE_PACKAGE_ID,
    },
    services: {
      sponsorRoutes: sponsorRoutes ? 'available' : 'unavailable',
      suiConfig: suiConfig ? 'available' : 'unavailable',
    },
    endpoints: sponsorRoutes ? {
      createProfile: 'POST /api/sponsor/create-profile',
      addLink: 'POST /api/sponsor/add-link',
      updateLink: 'POST /api/sponsor/update-link',
      removeLink: 'POST /api/sponsor/remove-link',
      updateProfile: 'POST /api/sponsor/update-profile',
      execute: 'POST /api/sponsor/execute',
    } : {
      message: 'Sponsor endpoints not available'
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
