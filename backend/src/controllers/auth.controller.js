const UserModel = require('../models/user.model');
const HelperModel = require('../models/helper.model');
const PasswordResetModel = require('../models/password-reset.model');
const RefreshTokenModel = require('../models/refresh-token.model');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

async function register(req, res) {
  const { fullName, email, password, role, city } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await UserModel.findByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = await UserModel.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role,
    city: city || null,
  });

  if (role === 'helper') {
    await HelperModel.create({ userId: user.id });
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  await RefreshTokenModel.create({ userId: user.id, token: refreshToken });
  return res.status(201).json({
    token,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  await RefreshTokenModel.create({ userId: user.id, token: refreshToken });
  return res.json({
    token,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await UserModel.findByEmail(email.trim().toLowerCase());
  if (!user) {
    return res.json({ message: 'If account exists, password reset instructions have been generated.' });
  }
  const resetToken = await PasswordResetModel.create(user.id);
  return res.json({
    message: 'Password reset token generated for demo mode.',
    resetToken,
    expiresInMinutes: 60,
  });
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  const resetRecord = await PasswordResetModel.findValidToken(token);
  if (!resetRecord) {
    return res.status(400).json({ message: 'Reset token is invalid or expired.' });
  }
  const passwordHash = await hashPassword(newPassword);
  await UserModel.updatePassword(resetRecord.user_id, passwordHash);
  await PasswordResetModel.markUsed(resetRecord.id);
  return res.json({ message: 'Password updated successfully.' });
}

async function refreshSession(req, res) {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = verifyToken(refreshToken);
  } catch {
    return res.status(401).json({ message: 'Refresh token is invalid or expired.' });
  }
  if (payload.tokenType !== 'refresh') {
    return res.status(401).json({ message: 'Invalid refresh token type.' });
  }
  const tokenRow = await RefreshTokenModel.findValid(refreshToken);
  if (!tokenRow) {
    return res.status(401).json({ message: 'Refresh token is invalid or expired.' });
  }
  const user = await UserModel.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found for token.' });
  }
  await RefreshTokenModel.revoke(refreshToken);
  const newAccessToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);
  await RefreshTokenModel.create({ userId: user.id, token: newRefreshToken });
  return res.json({ token: newAccessToken, refreshToken: newRefreshToken });
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshTokenModel.revoke(refreshToken);
  }
  return res.json({ message: 'Logged out.' });
}

module.exports = { register, login, forgotPassword, resetPassword, refreshSession, logout };
