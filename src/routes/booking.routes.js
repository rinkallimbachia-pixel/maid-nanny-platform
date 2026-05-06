const express = require('express');
const { body } = require('express-validator');
const { createBooking, myBookings, helperDecision, completeBooking } = require('../controllers/booking.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household'),
  [body('helperId').isInt(), body('serviceDate').isISO8601()],
  validateRequest,
  createBooking
);
router.get('/me', authMiddleware, myBookings);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole('helper'),
  [body('status').isIn(['accepted', 'rejected'])],
  validateRequest,
  helperDecision
);
router.patch('/:id/complete', authMiddleware, requireRole('helper', 'admin'), completeBooking);

module.exports = router;
