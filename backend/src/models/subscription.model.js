const { getDb } = require('../config/database');

function nextBillingDate(startDate, planType) {
  if (planType === 'hourly') return "datetime(?, '+1 day')";
  if (planType === 'yearly') return "datetime(?, '+1 year')";
  return "datetime(?, '+1 month')";
}

async function create(payload) {
  const db = await getDb();
  const expr = nextBillingDate(payload.startDate, payload.planType);
  const result = await db.run(
    `INSERT INTO subscriptions (user_id, helper_id, booking_id, plan_type, status, start_date, next_billing_date, renewal_enabled)
     VALUES (?, ?, ?, ?, 'active', ?, ${expr}, 1)`,
    [payload.userId, payload.helperId, payload.bookingId || null, payload.planType, payload.startDate, payload.startDate]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM subscriptions WHERE id = ?', [id]);
}

async function listByUser(userId) {
  const db = await getDb();
  return db.all('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC', [userId]);
}

async function updateStatus(id, status) {
  const db = await getDb();
  await db.run('UPDATE subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
  return findById(id);
}

async function toggleRenewal(id, enabled) {
  const db = await getDb();
  await db.run('UPDATE subscriptions SET renewal_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [enabled ? 1 : 0, id]);
  return findById(id);
}

module.exports = { create, findById, listByUser, updateStatus, toggleRenewal };
