const express = require('express');
const { body } = require('express-validator');
const { createComplaint, myComplaints } = require('../controllers/complaint.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household'),
  [body('bookingId').isInt(), body('issue').trim().isLength({ min: 10 })],
  validateRequest,
  createComplaint
);
router.get('/me', authMiddleware, requireRole('household'), myComplaints);

module.exports = router;
