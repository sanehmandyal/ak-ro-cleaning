import Gallery from '../models/Gallery.js';
import { ApiError, asyncHandler, ok, pick, parsePagination, pagination } from '../utils/helpers.js';
import { deleteImage } from '../middleware/upload.js';

const FIELDS = ['title', 'description', 'category', 'type', 'image', 'beforeImage', 'afterImage', 'isPublished', 'order'];

const imageIds = (g) => [g.image?.publicId, g.beforeImage?.publicId, g.afterImage?.publicId].filter(Boolean);

export const listPublic = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 24, 60);
  const filter = { isPublished: true };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.type) filter.type = req.query.type;
  const [items, total, categories] = await Promise.all([
    Gallery.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(filter),
    Gallery.distinct('category', { isPublished: true }),
  ]);
  ok(res, items, { pagination: pagination(total, page, limit), categories: categories.sort() });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 12, 60);
  const filter = {};
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.search) filter.title = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const [items, total, categories] = await Promise.all([
    Gallery.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(filter),
    Gallery.distinct('category'),
  ]);
  ok(res, items, { pagination: pagination(total, page, limit), categories: categories.sort() });
});

function assertImages(data) {
  if (data.type === 'before-after') {
    if (!data.beforeImage?.url || !data.afterImage?.url) {
      throw new ApiError(422, 'Before and after images are both required');
    }
  } else if (!data.image?.url) {
    throw new ApiError(422, 'An image is required');
  }
}

export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  assertImages(data);
  const item = await Gallery.create(data);
  ok(res, item, {}, 201);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Gallery item not found');
  const before = imageIds(item);
  Object.assign(item, pick(req.body, FIELDS));
  assertImages(item);
  await item.save();
  const after = imageIds(item);
  await Promise.all(before.filter((id) => !after.includes(id)).map(deleteImage));
  ok(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Gallery item not found');
  await Promise.all(imageIds(item).map(deleteImage));
  await item.deleteOne();
  ok(res, { message: 'Gallery item deleted' });
});
