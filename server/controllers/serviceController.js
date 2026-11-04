import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { ApiError, asyncHandler, ok, pick, slugify, escapeRegex, parsePagination, pagination } from '../utils/helpers.js';
import { deleteImage } from '../middleware/upload.js';

const FIELDS = [
  'title', 'slug', 'shortDescription', 'description', 'image', 'icon', 'benefits', 'process',
  'whyChooseUs', 'faqs', 'price', 'ctaText', 'isAvailable', 'isPopular', 'order', 'seo',
];

async function uniqueSlug(base, excludeId) {
  let slug = slugify(base) || 'service';
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Service.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}

// Public: list available services
export const listPublic = asyncHandler(async (req, res) => {
  const filter = { isAvailable: true };
  if (req.query.popular === 'true') filter.isPopular = true;
  const services = await Service.find(filter)
    .select('-process -faqs -whyChooseUs -benefits -description')
    .sort({ order: 1, createdAt: 1 });
  ok(res, services);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isAvailable: true });
  if (!service) throw new ApiError(404, 'Service not found');
  ok(res, service);
});

// Admin
export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 20);
  const filter = {};
  if (req.query.search) filter.title = new RegExp(escapeRegex(req.query.search), 'i');
  if (req.query.available === 'true') filter.isAvailable = true;
  if (req.query.available === 'false') filter.isAvailable = false;
  const [items, total] = await Promise.all([
    Service.find(filter).sort({ order: 1, createdAt: 1 }).skip(skip).limit(limit),
    Service.countDocuments(filter),
  ]);
  ok(res, items, { pagination: pagination(total, page, limit) });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  ok(res, service);
});

export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  data.slug = await uniqueSlug(data.slug || data.title);
  const service = await Service.create(data);
  ok(res, service, {}, 201);
});

export const update = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  const data = pick(req.body, FIELDS);
  if (data.slug !== undefined || (data.title && !service.slug)) {
    data.slug = await uniqueSlug(data.slug || data.title || service.title, service._id);
  }
  const oldImage = service.image?.publicId;
  Object.assign(service, data);
  await service.save();
  if (data.image && oldImage && oldImage !== service.image.publicId) await deleteImage(oldImage);
  ok(res, service);
});

export const remove = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  const active = await Booking.countDocuments({
    service: service._id,
    status: { $in: ['pending', 'confirmed'] },
  });
  if (active > 0 && req.query.force !== 'true') {
    throw new ApiError(
      409,
      `This service has ${active} active booking(s). Mark it unavailable instead, or delete again to force.`
    );
  }
  await deleteImage(service.image?.publicId);
  await service.deleteOne();
  ok(res, { message: 'Service deleted' });
});
