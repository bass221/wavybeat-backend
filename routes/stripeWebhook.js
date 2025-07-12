// routes/stripeWebhook.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const sendEmail = require('../utils/emailService');

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Stripe webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;
    const paymentIntentId = session.payment_intent;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      await sendEmail(
        customerEmail,
        '🎧 BeatWave Order Receipt',
        `
          <h2>Thanks for your purchase!</h2>
          <p>Your payment of <strong>$${paymentIntent.amount / 100}</strong> was successful.</p>
          <p>Order ID: ${session.id}</p>
          <p>If you have any questions, contact us at support@beatwave.com</p>
        `
      );

      console.log('✅ Receipt sent to', customerEmail);
    } catch (err) {
      console.error('❌ Error sending receipt:', err.message);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
