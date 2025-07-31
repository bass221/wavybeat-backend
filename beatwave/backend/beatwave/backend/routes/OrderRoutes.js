// backend/routes/OrderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Get user's email
const sendOrderEmail = require('../utils/emailService'); // ✅ Email sender

// ✅ Middleware to decode JWT
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized - No Token' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// 🛒 POST /api/orders – Save Order + Send Email
router.post('/', authenticateUser, async (req, res) => {
  const { items, total } = req.body;

  try {
    // 1. Save order to DB
    const order = new Order({
      userId: req.user.id,
      beats: items.map((b) => ({
        title: b.title,
        price: b.price,
        beatId: b._id,
      })),
      total,
    });

    await order.save();

    // 2. Fetch user's email
    const user = await User.findById(req.user.id);

    // 3. Build email HTML
    const html = `
      <h2>Thank you for your BeatWave order! 🎵</h2>
      <p>You successfully purchased the following beats:</p>
      <ul>
        ${items.map((b) => `<li><strong>${b.title}</strong> – $${b.price}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${total}</p>
      <br/>
      <p>Log in to your BeatWave account to view and download your beats.</p>
      <p>🔥 Thank you for using BeatWave!</p>
    `;

    // 4. Send email
    await sendOrderEmail(
      user.email,
      'Your BeatWave Order Confirmation 🎧',
      html
    );

    res.status(201).json(order);
  } catch (err) {
    console.error('❌ Order save or email error:', err);
    res.status(500).json({ error: 'Failed to save order and send email' });
  }
});

// 📦 GET /api/orders – Get orders for logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
