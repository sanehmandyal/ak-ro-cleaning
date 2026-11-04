import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
  { _id: false }
);

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    category: { type: String, trim: true, default: 'General' },
    type: { type: String, enum: ['single', 'before-after'], default: 'single' },
    image: { type: imageSchema, default: () => ({}) },
    beforeImage: { type: imageSchema, default: () => ({}) },
    afterImage: { type: imageSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);
