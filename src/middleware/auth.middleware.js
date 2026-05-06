const { verifyToken } = require('../utils/jwt');
const UserModel = require('../models/user.model');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found for token.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied for this role.' });
    }
    return next();
  };
}

module.exports = { authMiddleware, requireRole };
