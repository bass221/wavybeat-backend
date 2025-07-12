// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const orderRoutes = require('./routes/OrderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const beatRoutes = require('./routes/beatRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ ADD THIS
const emailRoutes = require('./routes/emailRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/beats', beatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/checkout', paymentRoutes); // Optional/legacy
app.use('/api/auth', authRoutes); // ✅ REGISTER AUTH ROUTES
app.use('/api/orders', orderRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/stripe', require('./routes/stripeWebhook'));
app.use('/api/webhook', require('./routes/webHook')); // no auth middleware here!

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
