const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { clientOrigin, uploadDir } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const helperRoutes = require('./routes/helper.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const adminRoutes = require('./routes/admin.routes');
const complaintRoutes = require('./routes/complaint.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const paymentRoutes = require('./routes/payment.routes');
const sosRoutes = require('./routes/sos.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const { rateLimit } = require('./middleware/rate-limit.middleware');

fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
const allowedOrigins = new Set([clientOrigin, 'http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:4500', 'http://127.0.0.1:4500']);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', rateLimit({ windowMs: 60 * 1000, max: 30 }));
app.use('/api/auth', authRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', rateLimit({ windowMs: 60 * 1000, max: 40 }));
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;
