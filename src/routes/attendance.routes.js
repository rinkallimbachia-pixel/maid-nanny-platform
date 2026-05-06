const express = require('express');
const { body } = require('express-validator');
const { markAttendance, bookingAttendance } = require('../controllers/attendance.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('helper', 'admin'),
  [body('bookingId').isInt(), body('date').isISO8601(), body('status').isIn(['present', 'absent', 'late'])],
  validateRequest,
  markAttendance
);
router.get('/booking/:bookingId', authMiddleware, bookingAttendance);

module.exports = router;
