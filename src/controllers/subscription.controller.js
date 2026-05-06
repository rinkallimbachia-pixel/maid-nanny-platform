const SubscriptionModel = require('../models/subscription.model');
const BookingModel = require('../models/booking.model');

async function createSubscription(req, res) {
  const { bookingId, helperId, planType, startDate } = req.body;
  if (!helperId && !bookingId) {
    return res.status(400).json({ message: 'Either bookingId or helperId is required.' });
  }
  let resolvedHelperId = helperId;
  if (bookingId) {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    if (Number(booking.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: 'You can create subscription only for your booking.' });
    }
    resolvedHelperId = booking.helper_id;
  }
  const subscription = await SubscriptionModel.create({
    userId: req.user.id,
    helperId: resolvedHelperId,
    bookingId: bookingId || null,
    planType,
    startDate,
  });
  return res.status(201).json(subscription);
}

async function mySubscriptions(req, res) {
  const rows = await SubscriptionModel.listByUser(req.user.id);
  return res.json({ data: rows });
}

async function updateSubscriptionStatus(req, res) {
  const { status } = req.body;
  const row = await SubscriptionModel.updateStatus(req.params.id, status);
  if (!row) {
    return res.status(404).json({ message: 'Subscription not found.' });
  }
  return res.json(row);
}

async function toggleRenewal(req, res) {
  const { renewalEnabled } = req.body;
  const row = await SubscriptionModel.toggleRenewal(req.params.id, renewalEnabled);
  if (!row) {
    return res.status(404).json({ message: 'Subscription not found.' });
  }
  return res.json(row);
}

module.exports = { createSubscription, mySubscriptions, updateSubscriptionStatus, toggleRenewal };
