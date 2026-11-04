import { body } from 'express-validator';

const phoneRule = (field = 'phone', required = true) => {
  const chain = body(field).trim();
  return (required ? chain.notEmpty().withMessage('Mobile number is required') : chain.optional({ values: 'falsy' }))
    .matches(/^\+?[0-9][0-9\s-]{8,14}$/)
    .withMessage('Enter a valid mobile number');
};

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const profileRules = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').optional().trim().isEmail().withMessage('Enter a valid email'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone is too long'),
];

export const passwordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('New password must contain a letter')
    .matches(/[0-9]/).withMessage('New password must contain a number'),
];

export const bookingRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  phoneRule(),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Enter a valid email'),
  body('service').isMongoId().withMessage('Please select a service'),
  body('address').trim().isLength({ min: 5, max: 400 }).withMessage('Please enter your full address'),
  body('preferredDate')
    .isISO8601().withMessage('Select a preferred date')
    .custom((v) => {
      const d = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) throw new Error('Preferred date cannot be in the past');
      return true;
    }),
  body('preferredTime').trim().notEmpty().withMessage('Select a preferred time').isLength({ max: 40 }),
  body('message').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }).withMessage('Message is too long'),
];

export const bookingUpdateRules = [
  body('status').optional().isIn(['pending', 'confirmed', 'rejected', 'completed']).withMessage('Invalid status'),
  body('adminNotes').optional().isLength({ max: 2000 }).withMessage('Notes are too long'),
];

export const contactRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  phoneRule('phone', false),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Enter a valid email'),
  body('subject').optional({ values: 'falsy' }).trim().isLength({ max: 150 }),
  body('message').trim().isLength({ min: 5, max: 2000 }).withMessage('Message must be 5-2000 characters'),
];

export const serviceRules = [
  body('title').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2-120 characters'),
  body('price.amount').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];
export const serviceCreateRules = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Title is required (2-120 characters)'),
  ...serviceRules.slice(1),
];

export const galleryRules = [
  body('title').trim().isLength({ min: 1, max: 120 }).withMessage('Title is required'),
  body('type').optional().isIn(['single', 'before-after']).withMessage('Invalid type'),
];

export const testimonialRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name is required'),
  body('message').trim().isLength({ min: 5, max: 800 }).withMessage('Message must be 5-800 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
];

export const faqRules = [
  body('question').trim().isLength({ min: 3, max: 300 }).withMessage('Question is required'),
  body('answer').trim().isLength({ min: 2, max: 2000 }).withMessage('Answer is required'),
];
