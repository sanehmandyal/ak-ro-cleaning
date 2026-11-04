import WebsiteSettings from '../models/WebsiteSettings.js';
import SEOSettings, { SEO_PAGES } from '../models/SEOSettings.js';
import { ApiError, asyncHandler, ok, pick } from '../utils/helpers.js';
import { deleteImage } from '../middleware/upload.js';

export async function getSettingsDoc() {
  let doc = await WebsiteSettings.findOne({ key: 'main' });
  if (!doc) doc = await WebsiteSettings.create({ key: 'main' });
  return doc;
}

const SETTINGS_FIELDS = [
  'businessName', 'tagline', 'logo', 'hero', 'about', 'whyChooseUs', 'howItWorks', 'team', 'stats',
  'contact', 'businessHours', 'social', 'serviceAreas', 'promoBanner', 'footer', 'notifications',
];

export const getSettings = asyncHandler(async (_req, res) => ok(res, await getSettingsDoc()));

export const updateSettings = asyncHandler(async (req, res) => {
  const doc = await getSettingsDoc();
  const oldIds = [doc.logo?.publicId, doc.hero?.image?.publicId, doc.about?.image?.publicId].filter(Boolean);
  const data = pick(req.body, SETTINGS_FIELDS);
  for (const [key, value] of Object.entries(data)) {
    doc.set(key, value);
  }
  await doc.save();
  const newIds = [doc.logo?.publicId, doc.hero?.image?.publicId, doc.about?.image?.publicId].filter(Boolean);
  await Promise.all(oldIds.filter((id) => !newIds.includes(id)).map(deleteImage));
  ok(res, doc);
});

const SEO_FIELDS = ['title', 'description', 'keywords', 'canonicalUrl', 'ogTitle', 'ogDescription', 'ogImage', 'ogImagePublicId'];

export const getAllSeo = asyncHandler(async (_req, res) => {
  const docs = await SEOSettings.find();
  const byPage = Object.fromEntries(docs.map((d) => [d.page, d]));
  ok(res, SEO_PAGES.map((page) => byPage[page] || { page }));
});

export const getSeo = asyncHandler(async (req, res) => {
  if (!SEO_PAGES.includes(req.params.page)) throw new ApiError(404, 'Unknown page');
  const doc = await SEOSettings.findOne({ page: req.params.page });
  ok(res, doc || { page: req.params.page });
});

export const updateSeo = asyncHandler(async (req, res) => {
  const { page } = req.params;
  if (!SEO_PAGES.includes(page)) throw new ApiError(404, 'Unknown page');
  const existing = await SEOSettings.findOne({ page });
  const data = pick(req.body, SEO_FIELDS);
  const doc = await SEOSettings.findOneAndUpdate({ page }, { $set: data, $setOnInsert: { page } }, {
    new: true, upsert: true, runValidators: true,
  });
  if (existing?.ogImagePublicId && data.ogImagePublicId !== undefined && existing.ogImagePublicId !== doc.ogImagePublicId) {
    await deleteImage(existing.ogImagePublicId);
  }
  ok(res, doc);
});
