const ReviewModel = require('../models/review.model');
const BookingModel = require('../models/booking.model');

async function createReview(req, res) {
  const { bookingId, helperId, rating, comment } = req.body;
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  if (Number(booking.user_id) !== Number(req.user.id)) {
    return res.status(403).json({ message: 'You can review only your own booking.' });
  }
  if (!['accepted', 'completed'].includes(booking.status)) {
    return res.status(400).json({ message: 'Review can be submitted only after service is accepted/completed.' });
  }
  const existingReviews = await ReviewModel.listByHelper(helperId);
  const alreadyReviewed = existingReviews.some((item) => Number(item.booking_id) === Number(bookingId));
  if (alreadyReviewed) {
    return res.status(409).json({ message: 'Review already submitted for this booking.' });
  }
  const review = await ReviewModel.create({
    bookingId,
    userId: req.user.id,
    helperId,
    rating,
    comment,
  });
  return res.status(201).json(review);
}

module.exports = { createReview };
