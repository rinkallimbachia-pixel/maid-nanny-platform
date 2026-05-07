const crypto = require('crypto');
const { getDb } = require('../config/database');

function generateResetToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function create(userId) {
  const db = await getDb();
  const token = generateResetToken();
  await db.run(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES (?, ?, datetime('now', '+1 hour'))`,
    [userId, token]
  );
  return token;
}

async function findValidToken(token) {
  const db = await getDb();
  return db.get(
    `SELECT * FROM password_resets
     WHERE token = ?
       AND used_at IS NULL
       AND expires_at > CURRENT_TIMESTAMP`,
    [token]
  );
}

async function markUsed(id) {
  const db = await getDb();
  await db.run('UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
}

module.exports = { create, findValidToken, markUsed };
