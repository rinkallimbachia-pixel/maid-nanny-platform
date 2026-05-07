const BookingModel = require('../models/booking.model');
const HelperModel = require('../models/helper.model');

async function createBooking(req, res) {
  const { helperId, serviceDate, notes } = req.body;
  const helper = await HelperModel.findById(helperId);
  if (!helper) {
    return res.status(404).json({ message: 'Helper not found.' });
  }
  if (helper.verification_status !== 'approved') {
    return res.status(400).json({ message: 'Helper is not approved yet.' });
  }
  const booking = await BookingModel.create({
    userId: req.user.id,
    helperId,
    serviceDate,
    notes,
  });
  return res.status(201).json(booking);
}

async function myBookings(req, res) {
  const bookings = await BookingModel.listByUser(req.user.id, req.user.role);
  return res.json({ data: bookings });
}

async function helperDecision(req, res) {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be accepted or rejected.' });
  }
  const updated = await BookingModel.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  return res.json(updated);
}

async function completeBooking(req, res) {
  const updated = await BookingModel.updateStatus(req.params.id, 'completed');
  if (!updated) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  return res.json(updated);
}

module.exports = { createBooking, myBookings, helperDecision, completeBooking };
