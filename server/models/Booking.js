import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['pending', 'confirmed', 'rejected', 'completed'];

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceTitle: { type: String, required: true },
    address: { type: String, required: true, trim: true, maxlength: 400 },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true, trim: true },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: BOOKING_STATUSES, default: 'pending' },
    adminNotes: { type: String, trim: true, maxlength: 2000, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ phone: 1, service: 1, preferredDate: 1 });

export default mongoose.model('Booking', bookingSchema);
