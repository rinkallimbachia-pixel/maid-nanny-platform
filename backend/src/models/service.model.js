const { getDb } = require('../config/database');

async function create(name, description) {
  const db = await getDb();
  const result = await db.run('INSERT INTO services (name, description) VALUES (?, ?)', [name, description || null]);
  return db.get('SELECT * FROM services WHERE id = ?', [result.lastID]);
}

async function findAll() {
  const db = await getDb();
  return db.all('SELECT * FROM services ORDER BY id DESC');
}

module.exports = { create, findAll };
