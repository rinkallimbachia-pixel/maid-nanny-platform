const express = require('express');
const { body } = require('express-validator');
const { createSos, listSos, updateSos } = require('../controllers/sos.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('household', 'helper', 'admin'),
  [body('bookingId').isInt(), body('note').optional().isString()],
  validateRequest,
  createSos
);
router.get('/admin', authMiddleware, requireRole('admin'), listSos);
router.patch(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  [body('status').isIn(['in_progress', 'resolved'])],
  validateRequest,
  updateSos
);

module.exports = router;
