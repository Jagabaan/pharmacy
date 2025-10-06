
import { check, validationResult } from 'express-validator';

export const validateRegister = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  check('address').notEmpty().withMessage('Address is required'),

  // Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  }
];
