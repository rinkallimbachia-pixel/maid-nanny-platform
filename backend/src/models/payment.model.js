const { getDb } = require('../config/database');

async function createForBooking(payload) {
  const db = await getDb();
  await db.run(
    `INSERT INTO payments (booking_id, amount, method, status)
     VALUES (?, ?, ?, 'pending')
     ON CONFLICT(booking_id) DO UPDATE SET amount = excluded.amount, method = excluded.method`,
    [payload.bookingId, payload.amount, payload.method || 'upi']
  );
  return findByBooking(payload.bookingId);
}

async function findByBooking(bookingId) {
  const db = await getDb();
  return db.get('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
}

async function updateStatus(id, status) {
  const db = await getDb();
  await db.run(
    `UPDATE payments
     SET status = ?, paid_at = CASE WHEN ? = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END
     WHERE id = ?`,
    [status, status, id]
  );
  return db.get('SELECT * FROM payments WHERE id = ?', [id]);
}

async function helperEarnings(helperUserId) {
  const db = await getDb();
  return db.all(
    `SELECT p.*, b.helper_id, b.user_id
     FROM payments p
     JOIN bookings b ON b.id = p.booking_id
     JOIN helpers h ON h.id = b.helper_id
     WHERE h.user_id = ?
     ORDER BY p.id DESC`,
    [helperUserId]
  );
}

module.exports = { createForBooking, findByBooking, updateStatus, helperEarnings };
