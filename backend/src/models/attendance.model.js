const { getDb } = require('../config/database');

async function upsert(payload) {
  const db = await getDb();
  await db.run(
    `INSERT INTO attendance_logs (booking_id, helper_id, date, status, marked_by, notes)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(booking_id, date) DO UPDATE SET
       status = excluded.status,
       marked_by = excluded.marked_by,
       notes = excluded.notes`,
    [payload.bookingId, payload.helperId, payload.date, payload.status, payload.markedBy, payload.notes || null]
  );
  return listByBooking(payload.bookingId);
}

async function listByBooking(bookingId) {
  const db = await getDb();
  return db.all(
    `SELECT a.*, u.full_name AS marked_by_name
     FROM attendance_logs a
     JOIN users u ON u.id = a.marked_by
     WHERE a.booking_id = ?
     ORDER BY a.date DESC`,
    [bookingId]
  );
}

module.exports = { upsert, listByBooking };
