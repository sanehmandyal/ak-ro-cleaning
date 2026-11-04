import mongoose from 'mongoose';

export const SEO_PAGES = [
  'home',
  'about',
  'services',
  'water-tank-cleaning',
  'ro-water-purifier-cleaning',
  'bathroom-kitchen-cleaning',
  'glass-window-cleaning',
  'gallery',
  'contact',
  'booking',
  'locations',
];

const seoSchema = new mongoose.Schema(
  {
    page: { type: String, enum: SEO_PAGES, required: true, unique: true },
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    keywords: { type: String, trim: true, default: '' },
    canonicalUrl: { type: String, trim: true, default: '' },
    ogTitle: { type: String, trim: true, default: '' },
    ogDescription: { type: String, trim: true, default: '' },
    ogImage: { type: String, trim: true, default: '' },
    ogImagePublicId: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SEOSettings', seoSchema);
