import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication required');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const admin = await Admin.findById(payload.id);
  if (!admin) throw new ApiError(401, 'Account no longer exists');
  req.admin = admin;
  next();
});

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
