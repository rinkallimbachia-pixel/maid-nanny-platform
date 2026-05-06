const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO complaints (booking_id, user_id, helper_id, issue, status)
     VALUES (?, ?, ?, ?, 'open')`,
    [payload.bookingId, payload.userId, payload.helperId, payload.issue]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get(
    `SELECT c.*, u.full_name AS user_name, hu.full_name AS helper_name
     FROM complaints c
     JOIN users u ON u.id = c.user_id
     JOIN helpers h ON h.id = c.helper_id
     JOIN users hu ON hu.id = h.user_id
     WHERE c.id = ?`,
    [id]
  );
}

async function listAll() {
  const db = await getDb();
  return db.all(
    `SELECT c.*, u.full_name AS user_name, hu.full_name AS helper_name
     FROM complaints c
     JOIN users u ON u.id = c.user_id
     JOIN helpers h ON h.id = c.helper_id
     JOIN users hu ON hu.id = h.user_id
     ORDER BY c.id DESC`
  );
}

async function listByUser(userId) {
  const db = await getDb();
  return db.all('SELECT * FROM complaints WHERE user_id = ? ORDER BY id DESC', [userId]);
}

async function resolve(complaintId, status, resolutionNotes) {
  const db = await getDb();
  const resolvedAt = status === 'resolved' ? 'CURRENT_TIMESTAMP' : 'NULL';
  await db.run(
    `UPDATE complaints
     SET status = ?, resolution_notes = ?, resolved_at = ${resolvedAt}
     WHERE id = ?`,
    [status, resolutionNotes || null, complaintId]
  );
  return findById(complaintId);
}

module.exports = { create, findById, listAll, listByUser, resolve };
