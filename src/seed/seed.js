const { getDb } = require('../config/database');
const { hashPassword } = require('../utils/hash');

async function initSchema() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('household','helper','admin')),
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS helpers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      service_id INTEGER,
      experience_years INTEGER DEFAULT 0,
      availability TEXT DEFAULT 'part-time',
      verification_status TEXT DEFAULT 'pending',
      bio TEXT,
      hourly_rate REAL DEFAULT 0,
      monthly_rate REAL DEFAULT 0,
      yearly_rate REAL DEFAULT 0,
      document_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      helper_id INTEGER NOT NULL,
      service_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      helper_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      helper_id INTEGER NOT NULL,
      issue TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_review', 'resolved')),
      resolution_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      helper_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
      marked_by INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(booking_id, date),
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE,
      FOREIGN KEY(marked_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      helper_id INTEGER NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      reviewed_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE,
      FOREIGN KEY(reviewed_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL UNIQUE,
      amount REAL NOT NULL,
      method TEXT NOT NULL DEFAULT 'upi',
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'failed', 'refunded')),
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sos_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      raised_by INTEGER NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(raised_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      revoked_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      helper_id INTEGER NOT NULL,
      booking_id INTEGER,
      plan_type TEXT NOT NULL CHECK(plan_type IN ('hourly', 'monthly', 'yearly')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paused', 'cancelled')),
      start_date TEXT NOT NULL,
      next_billing_date TEXT NOT NULL,
      renewal_enabled INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(helper_id) REFERENCES helpers(id) ON DELETE CASCADE,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    );
  `);
}

async function seedData() {
  const db = await getDb();
  const usersCount = await db.get('SELECT COUNT(*) AS count FROM users');
  if (usersCount.count > 0) return;

  const [adminPass, userPass, helperPass] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('user123'),
    hashPassword('helper123'),
  ]);

  await db.run("INSERT INTO services (name, description) VALUES ('Maid', 'Home cleaning and chores')");
  await db.run("INSERT INTO services (name, description) VALUES ('Nanny', 'Child care and supervision')");
  const maid = await db.get("SELECT id FROM services WHERE name = 'Maid'");
  const nanny = await db.get("SELECT id FROM services WHERE name = 'Nanny'");

  await db.run(
    'INSERT INTO users (full_name, email, password_hash, role, city) VALUES (?, ?, ?, ?, ?)',
    ['Platform Admin', 'admin@example.com', adminPass, 'admin', 'Surat']
  );
  const userInsert = await db.run(
    'INSERT INTO users (full_name, email, password_hash, role, city) VALUES (?, ?, ?, ?, ?)',
    ['Rinkal User', 'user@example.com', userPass, 'household', 'Surat']
  );
  const helperInsert = await db.run(
    'INSERT INTO users (full_name, email, password_hash, role, city) VALUES (?, ?, ?, ?, ?)',
    ['Pooja Helper', 'helper@example.com', helperPass, 'helper', 'Surat']
  );
  const helperInsert2 = await db.run(
    'INSERT INTO users (full_name, email, password_hash, role, city) VALUES (?, ?, ?, ?, ?)',
    ['Neha Nanny', 'helper2@example.com', helperPass, 'helper', 'Ahmedabad']
  );

  await db.run(
    `INSERT INTO helpers (user_id, service_id, experience_years, availability, verification_status, bio, hourly_rate, monthly_rate, yearly_rate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [helperInsert.lastID, maid.id, 4, 'full-time', 'approved', 'Experienced maid', 250, 16000, 180000]
  );
  await db.run(
    `INSERT INTO helpers (user_id, service_id, experience_years, availability, verification_status, bio, hourly_rate, monthly_rate, yearly_rate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [helperInsert2.lastID, nanny.id, 3, 'part-time', 'pending', 'Patient nanny for child care', 300, 18000, 210000]
  );

  const helperRow = await db.get('SELECT id FROM helpers WHERE user_id = ?', [helperInsert.lastID]);
  await db.run(
    'INSERT INTO bookings (user_id, helper_id, service_date, status, notes) VALUES (?, ?, ?, ?, ?)',
    [userInsert.lastID, helperRow.id, '2026-05-10', 'pending', 'Morning shift required']
  );
  const bookingRow = await db.get('SELECT id FROM bookings WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userInsert.lastID]);
  await db.run(
    'INSERT INTO complaints (booking_id, user_id, helper_id, issue, status) VALUES (?, ?, ?, ?, ?)',
    [bookingRow.id, userInsert.lastID, helperRow.id, 'Helper arrived late twice this week.', 'in_review']
  );
  await db.run(
    'INSERT INTO payments (booking_id, amount, method, status) VALUES (?, ?, ?, ?)',
    [bookingRow.id, 1600, 'upi', 'pending']
  );
  await db.run(
    `INSERT INTO subscriptions (user_id, helper_id, booking_id, plan_type, status, start_date, next_billing_date, renewal_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userInsert.lastID, helperRow.id, bookingRow.id, 'monthly', 'active', '2026-05-10', '2026-06-10', 1]
  );
}

async function runSeed() {
  await initSchema();
  await seedData();
  console.log('SQLite initialized with sample data.');
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runSeed };
