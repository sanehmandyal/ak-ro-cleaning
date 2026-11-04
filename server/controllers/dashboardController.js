import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Gallery from '../models/Gallery.js';
import Contact from '../models/Contact.js';
import { asyncHandler, ok } from '../utils/helpers.js';

export const stats = asyncHandler(async (_req, res) => {
  const [total, pending, confirmed, completed, rejected, unreadBookings, services, gallery, unreadContacts, recentContacts, recentBookings] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'rejected' }),
      Booking.countDocuments({ isRead: false }),
      Service.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);
  ok(res, {
    bookings: { total, pending, confirmed, completed, rejected, unread: unreadBookings },
    services, gallery, unreadContacts, recentContacts, recentBookings,
  });
});
