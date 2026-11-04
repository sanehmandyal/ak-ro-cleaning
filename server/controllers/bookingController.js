import Booking, { BOOKING_STATUSES } from '../models/Booking.js';
import Service from '../models/Service.js';
import { ApiError, asyncHandler, ok, pick, escapeRegex, parsePagination, pagination } from '../utils/helpers.js';

export const createPublic = asyncHandler(async (req, res) => {
  const { name, phone, email, service: serviceId, address, preferredDate, preferredTime, message } = req.body;
  const service = await Service.findOne({ _id: serviceId, isAvailable: true });
  if (!service) throw new ApiError(400, 'The selected service is not available');

  const date = new Date(preferredDate);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Prevent duplicate submissions: same phone + service + day that is still open
  const duplicate = await Booking.findOne({
    phone,
    service: service._id,
    preferredDate: { $gte: startOfDay, $lt: endOfDay },
    status: { $in: ['pending', 'confirmed'] },
  });
  if (duplicate) {
    throw new ApiError(409, 'You already have a booking for this service on that date. We will contact you shortly.');
  }

  const booking = await Booking.create({
    name, phone, email, service: service._id, serviceTitle: service.title,
    address, preferredDate: startOfDay, preferredTime, message,
  });
  ok(res, { id: booking._id, reference: booking._id.toString().slice(-8).toUpperCase() }, {}, 201);
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 10);
  const filter = {};
  if (req.query.status && BOOKING_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { serviceTitle: rx }, { address: rx }];
  }
  if (req.query.from || req.query.to) {
    filter.preferredDate = {};
    if (req.query.from) filter.preferredDate.$gte = new Date(req.query.from);
    if (req.query.to) {
      const to = new Date(req.query.to);
      to.setHours(23, 59, 59, 999);
      filter.preferredDate.$lte = to;
    }
  }
  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);
  ok(res, items, { pagination: pagination(total, page, limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (!booking.isRead) {
    booking.isRead = true;
    await booking.save();
  }
  ok(res, booking);
});

export const update = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  Object.assign(booking, pick(req.body, ['status', 'adminNotes', 'isRead']));
  await booking.save();
  ok(res, booking);
});

export const remove = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  ok(res, { message: 'Booking deleted' });
});
