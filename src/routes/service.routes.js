const express = require('express');
const { body } = require('express-validator');
const { createService, listServices } = require('../controllers/service.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.get('/', listServices);
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  [body('name').trim().notEmpty()],
  validateRequest,
  createService
);

module.exports = router;
