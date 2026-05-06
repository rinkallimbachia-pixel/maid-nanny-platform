const express = require('express');
const { body } = require('express-validator');
const { createLeaveRequest, myLeaves, allLeaves, reviewLeave } = require('../controllers/leave.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('helper'),
  [body('fromDate').isISO8601(), body('toDate').isISO8601(), body('reason').trim().isLength({ min: 8 })],
  validateRequest,
  createLeaveRequest
);
router.get('/me', authMiddleware, requireRole('helper'), myLeaves);
router.get('/admin', authMiddleware, requireRole('admin'), allLeaves);
router.patch(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  [body('status').isIn(['approved', 'rejected'])],
  validateRequest,
  reviewLeave
);

module.exports = router;
