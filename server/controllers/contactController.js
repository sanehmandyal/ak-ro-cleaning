import Contact from '../models/Contact.js';
import { ApiError, asyncHandler, ok, escapeRegex, parsePagination, pagination } from '../utils/helpers.js';

export const createPublic = asyncHandler(async (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  // light duplicate protection: identical message in the last 10 minutes
  const recent = await Contact.findOne({
    name, message, createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  });
  if (recent) throw new ApiError(409, 'This message was already received. Thank you!');
  await Contact.create({ name, phone, email, subject, message });
  ok(res, { message: 'Thanks! We have received your message and will get back to you soon.' }, {}, 201);
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 10);
  const filter = {};
  if (req.query.unread === 'true') filter.isRead = false;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { subject: rx }, { message: rx }];
  }
  const [items, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);
  ok(res, items, { pagination: pagination(total, page, limit) });
});

export const markRead = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead !== false },
    { new: true }
  );
  if (!item) throw new ApiError(404, 'Inquiry not found');
  ok(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Contact.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Inquiry not found');
  ok(res, { message: 'Inquiry deleted' });
});
