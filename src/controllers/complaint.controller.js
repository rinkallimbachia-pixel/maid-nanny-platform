const BookingModel = require('../models/booking.model');
const ComplaintModel = require('../models/complaint.model');

async function createComplaint(req, res) {
  const { bookingId, issue } = req.body;
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  if (Number(booking.user_id) !== Number(req.user.id)) {
    return res.status(403).json({ message: 'You can create complaint only for your booking.' });
  }
  const complaint = await ComplaintModel.create({
    bookingId,
    userId: req.user.id,
    helperId: booking.helper_id,
    issue: issue.trim(),
  });
  return res.status(201).json(complaint);
}

async function myComplaints(req, res) {
  const complaints = await ComplaintModel.listByUser(req.user.id);
  return res.json({ data: complaints });
}

module.exports = { createComplaint, myComplaints };
