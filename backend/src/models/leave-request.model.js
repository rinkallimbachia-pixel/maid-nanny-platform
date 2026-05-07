const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO leave_requests (helper_id, from_date, to_date, reason, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [payload.helperId, payload.fromDate, payload.toDate, payload.reason]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM leave_requests WHERE id = ?', [id]);
}

async function listByHelper(helperId) {
  const db = await getDb();
  return db.all('SELECT * FROM leave_requests WHERE helper_id = ? ORDER BY id DESC', [helperId]);
}

async function listAll() {
  const db = await getDb();
  return db.all(
    `SELECT lr.*, u.full_name AS helper_name
     FROM leave_requests lr
     JOIN helpers h ON h.id = lr.helper_id
     JOIN users u ON u.id = h.user_id
     ORDER BY lr.id DESC`
  );
}

async function review(id, status, reviewedBy) {
  const db = await getDb();
  await db.run(
    `UPDATE leave_requests
     SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, reviewedBy, id]
  );
  return findById(id);
}

module.exports = { create, findById, listByHelper, listAll, review };
