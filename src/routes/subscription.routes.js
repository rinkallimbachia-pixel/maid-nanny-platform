const express = require('express');
const { body } = require('express-validator');
const {
  createSubscription,
  mySubscriptions,
  updateSubscriptionStatus,
  toggleRenewal,
} = require('../controllers/subscription.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household', 'user'),
  [
    body('bookingId').optional().isInt(),
    body('helperId').optional().isInt(),
    body('planType').isIn(['hourly', 'monthly', 'yearly']),
    body('startDate').isISO8601(),
  ],
  validateRequest,
  createSubscription
);
router.get('/me', authMiddleware, requireRole('household', 'user'), mySubscriptions);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole('household', 'user', 'admin'),
  [body('status').isIn(['active', 'paused', 'cancelled'])],
  validateRequest,
  updateSubscriptionStatus
);
router.patch(
  '/:id/renewal',
  authMiddleware,
  requireRole('household', 'user'),
  [body('renewalEnabled').isBoolean()],
  validateRequest,
  toggleRenewal
);

module.exports = router;
