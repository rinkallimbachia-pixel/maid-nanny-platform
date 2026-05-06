const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO sos_alerts (booking_id, raised_by, note, status)
     VALUES (?, ?, ?, 'open')`,
    [payload.bookingId, payload.raisedBy, payload.note || null]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM sos_alerts WHERE id = ?', [id]);
}

async function listAll() {
  const db = await getDb();
  return db.all(
    `SELECT s.*, u.full_name AS raised_by_name
     FROM sos_alerts s
     JOIN users u ON u.id = s.raised_by
     ORDER BY s.id DESC`
  );
}

async function resolve(id, status) {
  const db = await getDb();
  await db.run(
    `UPDATE sos_alerts
     SET status = ?, resolved_at = CASE WHEN ? = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END
     WHERE id = ?`,
    [status, status, id]
  );
  return findById(id);
}

module.exports = { create, findById, listAll, resolve };
