const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      tokenType: 'refresh',
    },
    jwtSecret,
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { generateToken, generateRefreshToken, verifyToken };
