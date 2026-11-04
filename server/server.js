import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { configureCloudinary, isCloudinaryConfigured } from './config/cloudinary.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { seed } from './scripts/seed.js';
import Service from './models/Service.js';
import Admin from './models/Admin.js';

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  if (isCloudinaryConfigured()) configureCloudinary();
  else console.warn('Cloudinary is not configured: image uploads will fail until CLOUDINARY_* env vars are set.');
  await connectDB();
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'akrocleaning@gmail.com').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'AkRoCleaning@2026#';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.findOne();
      if (admin) {
        admin.email = adminEmail;
        admin.password = adminPass;
        admin.name = 'AK RO Cleaning Admin';
        await admin.save();
        console.log(`Updated admin account to ${adminEmail}`);
      } else {
        await Admin.create({
          name: 'AK RO Cleaning Admin',
          email: adminEmail,
          password: adminPass,
          role: 'superadmin',
        });
        console.log(`Created admin account ${adminEmail}`);
      }
    } else if (process.env.SYNC_ADMIN_PASSWORD === 'true') {
      admin.password = adminPass;
      await admin.save();
    }
  } catch (err) {
    console.warn('Admin sync notice:', err.message);
  }
  try {
    const serviceCount = await Service.countDocuments();
    const hasImages = await Service.findOne({ 'image.url': { $exists: true, $ne: '' } });
    if (serviceCount === 0 || !hasImages || process.env.FORCE_SEED === 'true') {
      console.log('Database missing rich seed data/images. Running seed...');
      await seed(false);
    }
  } catch (err) {
    console.warn('Auto-seed check error:', err.message);
  }
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
