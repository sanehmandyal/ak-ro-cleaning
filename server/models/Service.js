import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
    description: { type: String, trim: true, default: '' },
    image: { type: imageSchema, default: () => ({}) },
    icon: { type: String, default: 'Sparkles' },
    benefits: [{ type: String, trim: true }],
    process: [{ title: { type: String, trim: true }, description: { type: String, trim: true } }],
    whyChooseUs: [{ type: String, trim: true }],
    faqs: [{ question: { type: String, trim: true }, answer: { type: String, trim: true } }],
    price: {
      amount: { type: Number, min: 0, default: 0 },
      unit: { type: String, trim: true, default: '' },
      label: { type: String, trim: true, default: '' },
    },
    ctaText: { type: String, trim: true, default: 'Book this service' },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      keywords: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true }
);

serviceSchema.index({ title: 'text', shortDescription: 'text' });

export default mongoose.model('Service', serviceSchema);
