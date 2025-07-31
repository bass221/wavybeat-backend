const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const orderRoutes = require('./routes/OrderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const beatRoutes = require('./routes/beatRoutes');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow localhost, production, and Vercel preview domains
const allowedOrigins = [
  'http://localhost:3000',
  'https://wavybeat-frontend.vercel.app',
  'https://wavybeat-frontend-qd38g1e50-bassirous-projects-7878e59b.vercel.app' // Add your preview domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/beats', beatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/checkout', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/stripe', require('./routes/stripeWebhook'));
app.use('/api/webhook', require('./routes/webHook')); // No auth middleware here

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
