const UserModel = require('../models/user.model');
const BookingModel = require('../models/booking.model');
const HelperModel = require('../models/helper.model');
const ComplaintModel = require('../models/complaint.model');
const { getDb } = require('../config/database');

async function approveHelper(req, res) {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected.' });
  }
  const helper = await HelperModel.updateVerificationStatus(req.params.id, status);
  if (!helper) {
    return res.status(404).json({ message: 'Helper not found.' });
  }
  return res.json(helper);
}

async function allBookings(req, res) {
  const bookings = await BookingModel.listByUser(req.user.id, 'admin');
  return res.json({ data: bookings });
}

async function manageUsers(_req, res) {
  const users = await UserModel.findAll();
  return res.json({ data: users });
}

async function pendingHelpers(_req, res) {
  const helpers = await HelperModel.list({});
  return res.json({ data: helpers.filter((item) => item.verification_status === 'pending') });
}

async function listComplaints(_req, res) {
  const complaints = await ComplaintModel.listAll();
  return res.json({ data: complaints });
}

async function resolveComplaint(req, res) {
  const { status, resolutionNotes } = req.body;
  const complaint = await ComplaintModel.resolve(req.params.id, status, resolutionNotes);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found.' });
  }
  return res.json(complaint);
}

async function analyticsOverview(_req, res) {
  const db = await getDb();
  const [users, verifiedHelpers, bookings, completed, ratings, monthlyUsers, cancellations] = await Promise.all([
    db.get("SELECT COUNT(*) AS count FROM users WHERE role = 'household'"),
    db.get("SELECT COUNT(*) AS count FROM helpers WHERE verification_status = 'approved'"),
    db.get('SELECT COUNT(*) AS count FROM bookings'),
    db.get("SELECT COUNT(*) AS count FROM bookings WHERE status = 'accepted'"),
    db.get('SELECT COALESCE(AVG(rating), 0) AS avg FROM reviews'),
    db.get("SELECT COUNT(*) AS count FROM users WHERE created_at >= datetime('now', '-30 day')"),
    db.get("SELECT COUNT(*) AS count FROM bookings WHERE status = 'rejected'"),
  ]);

  const completionRate = bookings.count ? Number(((completed.count / bookings.count) * 100).toFixed(1)) : 0;
  return res.json({
    data: {
      households: users.count,
      verifiedHelpers: verifiedHelpers.count,
      totalBookings: bookings.count,
      bookingCompletionRate: completionRate,
      customerSatisfaction: Number(Number(ratings.avg || 0).toFixed(2)),
      monthlyActiveUsers: monthlyUsers.count,
      cancellationRatio: bookings.count ? Number(((cancellations.count / bookings.count) * 100).toFixed(1)) : 0,
    },
  });
}

module.exports = {
  approveHelper,
  allBookings,
  manageUsers,
  pendingHelpers,
  listComplaints,
  resolveComplaint,
  analyticsOverview,
};
