const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  await db.run(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, datetime('now', '+30 day'))`,
    [payload.userId, payload.token]
  );
}

async function findValid(token) {
  const db = await getDb();
  return db.get(
    `SELECT * FROM refresh_tokens
     WHERE token = ?
       AND revoked_at IS NULL
       AND expires_at > CURRENT_TIMESTAMP`,
    [token]
  );
}

async function revoke(token) {
  const db = await getDb();
  await db.run('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = ?', [token]);
}

module.exports = { create, findValid, revoke };
