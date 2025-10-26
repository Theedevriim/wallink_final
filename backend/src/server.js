import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import sponsorRoutes from './routes/sponsor.routes.js';
import suiConfig from './config/sui.config.js';

dotenv.config();

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⛓️  Network: ${process.env.SUI_NETWORK}`);
});

export default app;
