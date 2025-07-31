const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// ✅ Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, isAdmin: false });
    await user.save();

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `http://localhost:3001/reset-password?token=${token}`;

    await sendEmail(email, '🔒 Reset Your Password', `
      <h2>Hello ${user.username},</h2>
      <p>You requested to reset your password.</p>
      <a href="${resetLink}" style="padding:10px 20px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
      <p>If you didn't request this, you can ignore this email.</p>
    `);

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
