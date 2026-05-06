const AttendanceModel = require('../models/attendance.model');
const BookingModel = require('../models/booking.model');

async function markAttendance(req, res) {
  const { bookingId, date, status, notes } = req.body;
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  if (req.user.role === 'helper') {
    const helperUserId = Number(booking.helper_id);
    if (!helperUserId) {
      return res.status(403).json({ message: 'Booking helper does not match.' });
    }
  }
  const rows = await AttendanceModel.upsert({
    bookingId,
    helperId: booking.helper_id,
    date,
    status,
    markedBy: req.user.id,
    notes,
  });
  return res.json({ data: rows });
}

async function bookingAttendance(req, res) {
  const rows = await AttendanceModel.listByBooking(req.params.bookingId);
  return res.json({ data: rows });
}

module.exports = { markAttendance, bookingAttendance };
