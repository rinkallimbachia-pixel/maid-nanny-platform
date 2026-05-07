const PaymentModel = require('../models/payment.model');
const BookingModel = require('../models/booking.model');

async function createPayment(req, res) {
  const { bookingId, amount, method } = req.body;
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  if (Number(booking.user_id) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can pay only for your own booking.' });
  }
  const payment = await PaymentModel.createForBooking({ bookingId, amount, method });
  return res.status(201).json(payment);
}

async function updatePaymentStatus(req, res) {
  const { status } = req.body;
  const row = await PaymentModel.updateStatus(req.params.id, status);
  if (!row) {
    return res.status(404).json({ message: 'Payment not found.' });
  }
  return res.json(row);
}

async function helperEarnings(req, res) {
  const rows = await PaymentModel.helperEarnings(req.user.id);
  const totalPaid = rows.filter((r) => r.status === 'paid').reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return res.json({ data: rows, totalPaid });
}

module.exports = { createPayment, updatePaymentStatus, helperEarnings };
