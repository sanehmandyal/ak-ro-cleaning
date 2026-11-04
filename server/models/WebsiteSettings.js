import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
  { _id: false }
);

const websiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    businessName: { type: String, default: 'Aqua Ak Enterprises' },
    tagline: { type: String, default: 'Pure Drinking Water. Certified Tank Sanitization. Healthy Families.' },
    logo: { type: imageSchema, default: () => ({}) },
    hero: {
      heading: { type: String, default: 'Professional Cleaning for a Healthier Home & Workplace' },
      description: {
        type: String,
        default:
          'Water tank, RO purifier, bathroom, kitchen and deep cleaning by trained professionals using safe, quality-tested products.',
      },
      image: { type: imageSchema, default: () => ({}) },
    },
    about: {
      intro: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
      experience: { type: String, default: '' },
      image: { type: imageSchema, default: () => ({}) },
      standards: [{ type: String }],
      trustPoints: [{ type: String }],
    },
    whyChooseUs: [{ title: String, description: String, icon: { type: String, default: 'ShieldCheck' } }],
    howItWorks: [{ title: String, description: String }],
    team: [{ name: String, role: String, bio: String, photo: { type: imageSchema, default: () => ({}) } }],
    stats: [{ label: String, value: String }],
    contact: {
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'IN' },
      latitude: { type: String, default: '' },
      longitude: { type: String, default: '' },
      mapEmbedUrl: { type: String, default: '' },
      googleBusinessUrl: { type: String, default: '' },
    },
    businessHours: [{ day: String, hours: String }],
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    serviceAreas: [{ name: String, description: String }],
    promoBanner: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      linkText: { type: String, default: '' },
      linkUrl: { type: String, default: '' },
    },
    footer: {
      about: { type: String, default: '' },
      copyright: { type: String, default: '' },
    },
    notifications: {
      emailOnBooking: { type: Boolean, default: true },
      emailOnContact: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('WebsiteSettings', websiteSettingsSchema);
