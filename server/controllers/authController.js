import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { ApiError, asyncHandler, ok, pick } from '../utils/helpers.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicAdmin = (a) => ({
  id: a._id,
  name: a.name,
  email: a.email,
  phone: a.phone,
  role: a.role,
  notifications: a.notifications,
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  ok(res, { token: signToken(admin._id), admin: publicAdmin(admin) });
});

export const me = asyncHandler(async (req, res) => ok(res, publicAdmin(req.admin)));

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = pick(req.body, ['name', 'phone', 'notifications']);
  if (req.body.email && req.body.email.toLowerCase() !== req.admin.email) {
    const taken = await Admin.findOne({ email: req.body.email.toLowerCase() });
    if (taken) throw new ApiError(409, 'That email is already in use');
    updates.email = req.body.email.toLowerCase();
  }
  Object.assign(req.admin, updates);
  await req.admin.save();
  ok(res, publicAdmin(req.admin));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!(await admin.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  admin.password = newPassword;
  await admin.save();
  ok(res, { message: 'Password updated' });
});
