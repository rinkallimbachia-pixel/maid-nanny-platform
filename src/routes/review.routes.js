const express = require('express');
const { body } = require('express-validator');
const { createReview } = require('../controllers/review.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household'),
  [body('bookingId').isInt(), body('helperId').isInt(), body('rating').isInt({ min: 1, max: 5 })],
  validateRequest,
  createReview
);

module.exports = router;
