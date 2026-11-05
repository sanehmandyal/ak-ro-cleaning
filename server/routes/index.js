import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload, uploadBuffer } from '../middleware/upload.js';
import * as v from '../middleware/validators.js';
import * as auth from '../controllers/authController.js';
import * as services from '../controllers/serviceController.js';
import * as bookings from '../controllers/bookingController.js';
import * as contacts from '../controllers/contactController.js';
import * as gallery from '../controllers/galleryController.js';
import * as settings from '../controllers/settingsController.js';
import { stats } from '../controllers/dashboardController.js';
import { makeCrud } from '../controllers/crudFactory.js';
import Testimonial from '../models/Testimonial.js';
import FAQ from '../models/FAQ.js';
import { asyncHandler, ok, ApiError } from '../utils/helpers.js';
import { sitemap, robots } from '../controllers/seoFilesController.js';

const router = Router();

const testimonials = makeCrud(Testimonial, ['name', 'location', 'service', 'rating', 'message', 'isPublished', 'order'], 'Testimonial');
const faqs = makeCrud(FAQ, ['question', 'answer', 'isPublished', 'order'], 'FAQ');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' } });
const formLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' } });

const admin = [protect, authorize('superadmin', 'admin')];

// ---------- Public ----------
router.get('/settings', settings.getSettings);
router.get('/seo/:page', settings.getSeo);
router.get('/services', services.listPublic);
router.get('/services/:slug', services.getBySlug);
router.get('/gallery', gallery.listPublic);
router.get('/testimonials', testimonials.listPublic);
router.get('/faqs', faqs.listPublic);
router.post('/bookings', formLimiter, v.bookingRules, validate, bookings.createPublic);
router.post('/contact', formLimiter, v.contactRules, validate, contacts.createPublic);
router.get('/sitemap.xml', sitemap);
router.get('/robots.txt', robots);

// ---------- Auth ----------
router.post('/auth/login', loginLimiter, v.loginRules, validate, auth.login);
router.get('/auth/me', admin, auth.me);
router.put('/auth/profile', admin, v.profileRules, validate, auth.updateProfile);
router.put('/auth/password', admin, v.passwordRules, validate, auth.changePassword);

// ---------- Admin ----------
router.get('/admin/stats', admin, stats);

router.post('/admin/upload', admin, upload.array('images', 20), asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No image received');
  const folder = ['services', 'gallery', 'site', 'seo'].includes(req.body.folder) ? req.body.folder : 'misc';
  const results = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer, `ro-cleaning/${folder}`, f.mimetype)));
  ok(res, results, {}, 201);
}));

router.get('/admin/services', admin, services.listAdmin);
router.get('/admin/services/:id', admin, services.getAdmin);
router.post('/admin/services', admin, v.serviceCreateRules, validate, services.create);
router.put('/admin/services/:id', admin, v.serviceRules, validate, services.update);
router.delete('/admin/services/:id', admin, services.remove);

router.get('/admin/bookings', admin, bookings.list);
router.get('/admin/bookings/:id', admin, bookings.getOne);
router.put('/admin/bookings/:id', admin, v.bookingUpdateRules, validate, bookings.update);
router.delete('/admin/bookings/:id', admin, bookings.remove);

router.get('/admin/contacts', admin, contacts.list);
router.put('/admin/contacts/:id', admin, contacts.markRead);
router.delete('/admin/contacts/:id', admin, contacts.remove);

router.get('/admin/gallery', admin, gallery.listAdmin);
router.post('/admin/gallery', admin, v.galleryRules, validate, gallery.create);
router.put('/admin/gallery/:id', admin, gallery.update);
router.delete('/admin/gallery/:id', admin, gallery.remove);

router.get('/admin/testimonials', admin, testimonials.listAdmin);
router.post('/admin/testimonials', admin, v.testimonialRules, validate, testimonials.create);
router.put('/admin/testimonials/:id', admin, testimonials.update);
router.delete('/admin/testimonials/:id', admin, testimonials.remove);

router.get('/admin/faqs', admin, faqs.listAdmin);
router.post('/admin/faqs', admin, v.faqRules, validate, faqs.create);
router.put('/admin/faqs/:id', admin, faqs.update);
router.delete('/admin/faqs/:id', admin, faqs.remove);

router.put('/admin/settings', admin, settings.updateSettings);
router.get('/admin/seo', admin, settings.getAllSeo);
router.put('/admin/seo/:page', admin, settings.updateSeo);

export default router;
