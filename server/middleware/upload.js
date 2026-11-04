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

export function uploadBuffer(buffer, folder = 'ro-cleaning') {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      'Image storage is not configured. Set the CLOUDINARY_* environment variables on the server.'
    );
  }
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

export async function deleteImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete failed:', err.message);
  }
}
