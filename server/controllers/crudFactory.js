import { ApiError, asyncHandler, ok, pick, parsePagination, pagination } from '../utils/helpers.js';

// Small generic CRUD used by Testimonials and FAQs (identical shape).
export function makeCrud(Model, fields, label) {
  return {
    listPublic: asyncHandler(async (_req, res) => {
      ok(res, await Model.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }));
    }),
    listAdmin: asyncHandler(async (req, res) => {
      const { page, limit, skip } = parsePagination(req.query, 20);
      const [items, total] = await Promise.all([
        Model.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(),
      ]);
      ok(res, items, { pagination: pagination(total, page, limit) });
    }),
    create: asyncHandler(async (req, res) => {
      ok(res, await Model.create(pick(req.body, fields)), {}, 201);
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) throw new ApiError(404, `${label} not found`);
      Object.assign(item, pick(req.body, fields));
      await item.save();
      ok(res, item);
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw new ApiError(404, `${label} not found`);
      ok(res, { message: `${label} deleted` });
    }),
  };
}
