const express = require('express');
const { body } = require('express-validator');
const { createPayment, updatePaymentStatus, helperEarnings } = require('../controllers/payment.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household', 'admin'),
  [body('bookingId').isInt(), body('amount').isFloat({ gt: 0 }), body('method').optional().isString()],
  validateRequest,
  createPayment
);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole('admin'),
  [body('status').isIn(['pending', 'paid', 'failed', 'refunded'])],
  validateRequest,
  updatePaymentStatus
);
router.get('/helpers/me/earnings', authMiddleware, requireRole('helper'), helperEarnings);

module.exports = router;
