const express = require('express');
const { body } = require('express-validator');
const { register, login, forgotPassword, resetPassword, refreshSession, logout } = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['household', 'helper', 'admin']),
  ],
  validateRequest,
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validateRequest, login);
router.post('/forgot-password', [body('email').isEmail()], validateRequest, forgotPassword);
router.post(
  '/reset-password',
  [body('token').trim().notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  resetPassword
);
router.post('/refresh', [body('refreshToken').trim().notEmpty()], validateRequest, refreshSession);
router.post('/logout', [body('refreshToken').optional().isString()], validateRequest, logout);

module.exports = router;
