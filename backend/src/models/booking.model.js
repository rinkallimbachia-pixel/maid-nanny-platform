const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO bookings (user_id, helper_id, service_date, status, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [payload.userId, payload.helperId, payload.serviceDate, payload.status || 'pending', payload.notes || null]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get(
    `SELECT b.*, u.full_name AS user_name, hu.full_name AS helper_name, s.name AS service_name
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN helpers h ON h.id = b.helper_id
     JOIN users hu ON hu.id = h.user_id
     LEFT JOIN services s ON s.id = h.service_id
     WHERE b.id = ?`,
    [id]
  );
}

async function listByUser(userId, role) {
  const db = await getDb();
  if (role === 'admin') {
    return db.all('SELECT * FROM bookings ORDER BY id DESC');
  }
  if (role === 'helper') {
    return db.all(
      `SELECT b.* FROM bookings b
       JOIN helpers h ON h.id = b.helper_id
       WHERE h.user_id = ?
       ORDER BY b.id DESC`,
      [userId]
    );
  }
  return db.all('SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC', [userId]);
}

async function updateStatus(bookingId, status) {
  const db = await getDb();
  await db.run('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, bookingId]);
  return findById(bookingId);
}

module.exports = { create, findById, listByUser, updateStatus };
