const windows = new Map();

function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}:${req.path}`;
    const now = Date.now();
    const entry = windows.get(key);
    if (!entry || now > entry.expiresAt) {
      windows.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
    entry.count += 1;
    windows.set(key, entry);
    return next();
  };
}

module.exports = { rateLimit };
