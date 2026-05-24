const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['author', 'admin']).withMessage('Role must be author or admin'),
  validate
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Ticket validators
const ticketValidator = [
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 20 }).withMessage('Please provide at least 20 characters of description'),
  body('book').optional({ nullable: true }).isMongoId().withMessage('Invalid book ID'),
  validate
];

// Response validators
const responseValidator = [
  body('message').trim().notEmpty().withMessage('Response message is required'),
  body('isInternal').optional().isBoolean().withMessage('isInternal must be boolean'),
  validate
];

// Ticket update validators
const ticketUpdateValidator = [
  body('status').optional().isIn(['Open', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['Critical', 'High', 'Medium', 'Low']).withMessage('Invalid priority'),
  body('category').optional().isIn([
    'Royalty & Payments',
    'ISBN & Metadata Issues',
    'Printing & Quality',
    'Distribution & Availability',
    'Book Status & Production Updates',
    'General Inquiry'
  ]).withMessage('Invalid category'),
  validate
];

module.exports = {
  registerValidator,
  loginValidator,
  ticketValidator,
  responseValidator,
  ticketUpdateValidator
};
