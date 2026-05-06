const { getDb } = require('../config/database');

async function create(payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO helpers (
      user_id, service_id, experience_years, availability, verification_status, bio,
      hourly_rate, monthly_rate, yearly_rate, document_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.userId,
      payload.serviceId,
      payload.experienceYears || 0,
      payload.availability || 'part-time',
      payload.verificationStatus || 'pending',
      payload.bio || null,
      payload.hourlyRate || 0,
      payload.monthlyRate || 0,
      payload.yearlyRate || 0,
      payload.documentPath || null,
    ]
  );
  return findById(result.lastID);
}

async function findById(id) {
  const db = await getDb();
  return db.get(
    `SELECT h.*, u.full_name, u.email, u.city, s.name AS service_name
     FROM helpers h
     JOIN users u ON u.id = h.user_id
     LEFT JOIN services s ON s.id = h.service_id
     WHERE h.id = ?`,
    [id]
  );
}

async function findByUserId(userId) {
  const db = await getDb();
  return db.get('SELECT * FROM helpers WHERE user_id = ?', [userId]);
}

async function list(filters = {}) {
  const db = await getDb();
  const conditions = ['1=1'];
  const params = [];

  if (filters.serviceId) {
    conditions.push('h.service_id = ?');
    params.push(filters.serviceId);
  }
  if (filters.availability) {
    conditions.push('h.availability = ?');
    params.push(filters.availability);
  }
  if (filters.minExperience) {
    conditions.push('h.experience_years >= ?');
    params.push(Number(filters.minExperience));
  }
  if (filters.verifiedOnly === 'true') {
    conditions.push("h.verification_status = 'approved'");
  }

  return db.all(
    `SELECT h.*, u.full_name, u.email, u.city, s.name AS service_name
     FROM helpers h
     JOIN users u ON u.id = h.user_id
     LEFT JOIN services s ON s.id = h.service_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY h.id DESC`,
    params
  );
}

async function updateVerificationStatus(helperId, status) {
  const db = await getDb();
  await db.run('UPDATE helpers SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    status,
    helperId,
  ]);
  return findById(helperId);
}

async function updateDocumentPath(helperId, documentPath) {
  const db = await getDb();
  await db.run('UPDATE helpers SET document_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    documentPath,
    helperId,
  ]);
  return findById(helperId);
}

module.exports = {
  create,
  findById,
  findByUserId,
  list,
  updateVerificationStatus,
  updateDocumentPath,
};
