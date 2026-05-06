const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO reviews (booking_id, user_id, helper_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [payload.bookingId, payload.userId, payload.helperId, payload.rating, payload.comment || null]
  );
  return db.get('SELECT * FROM reviews WHERE id = ?', [result.lastID]);
}

async function listByHelper(helperId) {
  const db = await getDb();
  return db.all(
    `SELECT r.*, u.full_name AS reviewer_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.helper_id = ?
     ORDER BY r.id DESC`,
    [helperId]
  );
}

module.exports = { create, listByHelper };
