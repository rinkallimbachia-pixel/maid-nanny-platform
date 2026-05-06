const SosModel = require('../models/sos.model');
const BookingModel = require('../models/booking.model');

async function createSos(req, res) {
  const { bookingId, note } = req.body;
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  const row = await SosModel.create({
    bookingId,
    raisedBy: req.user.id,
    note,
  });
  return res.status(201).json(row);
}

async function listSos(_req, res) {
  const rows = await SosModel.listAll();
  return res.json({ data: rows });
}

async function updateSos(req, res) {
  const { status } = req.body;
  const row = await SosModel.resolve(req.params.id, status);
  if (!row) {
    return res.status(404).json({ message: 'SOS alert not found.' });
  }
  return res.json(row);
}

module.exports = { createSos, listSos, updateSos };
