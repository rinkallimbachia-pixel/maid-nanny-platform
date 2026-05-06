const express = require('express');
const { body } = require('express-validator');
const {
  approveHelper,
  allBookings,
  manageUsers,
  pendingHelpers,
  listComplaints,
  resolveComplaint,
  analyticsOverview,
} = require('../controllers/admin.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(authMiddleware, requireRole('admin'));
router.patch('/helpers/:id/approve', [body('status').isIn(['approved', 'rejected'])], validateRequest, approveHelper);
router.get('/helpers/pending', pendingHelpers);
router.get('/bookings', allBookings);
router.get('/users', manageUsers);
router.get('/complaints', listComplaints);
router.patch(
  '/complaints/:id/resolve',
  [body('status').isIn(['in_review', 'resolved']), body('resolutionNotes').optional().isString()],
  validateRequest,
  resolveComplaint
);
router.get('/analytics/overview', analyticsOverview);

module.exports = router;
