const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const sendEmail = require('../utils/emailService'); // same used in forgot password

router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const email = paymentIntent.receipt_email;

      if (email) {
        sendEmail(
          email,
          '🧾 Your Beatwave Payment Receipt',
          `<h2>Thanks for your order!</h2>
           <p>Your payment of $${paymentIntent.amount_received / 100} was successful.</p>
           <p>We hope you enjoy your beats! 🎵</p>`
        );
      }

      console.log('✅ Payment succeeded:', paymentIntent.id);
    }

    res.json({ received: true });
  }
);

module.exports = router;
