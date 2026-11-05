import multer from 'multer';
import { Readable } from 'stream';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiError } from '../utils/helpers.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

// Memory storage only: nothing is ever written to the server disk.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPG, PNG, WebP, AVIF or GIF images are allowed'));
    }
    cb(null, true);
  },
});

export function uploadBuffer(buffer, folder = 'ro-cleaning', mimetype = 'image/jpeg') {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (err, result) => {
          if (err) return reject(new ApiError(502, `Image upload failed: ${err.message}`));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      Readable.from(buffer).pipe(stream);
    });
  }

  // Fallback: when Cloudinary is not configured, save as data URI so admins can upload images immediately
  const mime = mimetype || 'image/jpeg';
  const base64 = buffer.toString('base64');
  return Promise.resolve({
    url: `data:${mime};base64,${base64}`,
    publicId: `inline_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  });
}

export async function deleteImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete failed:', err.message);
  }
}
