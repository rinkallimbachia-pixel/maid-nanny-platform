const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO users (full_name, email, password_hash, role, city)
     VALUES (?, ?, ?, ?, ?)`,
    [payload.fullName, payload.email, payload.passwordHash, payload.role, payload.city || null]
  );
  return findById(result.lastID);
}

async function findByEmail(email) {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

async function findById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

async function findAll() {
  const db = await getDb();
  return db.all('SELECT id, full_name, email, role, city, created_at FROM users ORDER BY id DESC');
}

async function updatePassword(userId, passwordHash) {
  const db = await getDb();
  await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  return findById(userId);
}

module.exports = { create, findByEmail, findById, findAll, updatePassword };
