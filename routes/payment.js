import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';

const router = express.Router();

// Initialize Razorpay with direct keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_QV9SfOLROu5Gli',
  key_secret: 'rs8eUJQpzRrL62XFWGP6unNm'
});

// Debug environment variables
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

// Handle preflight requests
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.sendStatus(200);
});

// Create a new order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', customer } = req.body;

    // Ensure amount is a number and convert to paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create payment record in database
    const payment = new Payment({
      orderId: order.id,
      amount: amount, // Store original amount in rupees
      currency,
      customer,
      status: 'created'
    });
    await payment.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: amountInPaise, // Send amount in paise to frontend
        currency: order.currency
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating order'
    });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'paid'
        }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying payment'
    });
  }
});

// Get payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting payment status'
    });
  }
});

// Webhook endpoint for Razorpay events
router.post('/webhook', (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature in production
    // const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    // const signature = req.headers['x-razorpay-signature'];

    console.log('Webhook received:', event);

    switch (event.event) {
      case 'payment.captured':
        console.log('Payment captured:', event.payload.payment.entity);
        // Handle successful payment
        break;

      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity);
        // Handle failed payment
        break;

      case 'order.paid':
        console.log('Order paid:', event.payload.order.entity);
        // Handle order completion
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    res.json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Demo test endpoint
router.post('/demo-order', async (req, res) => {
  try {
    const options = {
      amount: 100 * 100, // ₹100 in paise
      currency: 'INR',
      receipt: `demo_receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (error) {
    console.error('Error creating demo order:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint to check if payment routes are working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment routes are working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/payment/create-order': 'Create a new payment order',
      'POST /api/payment/verify': 'Verify payment signature',
      'GET /api/payment/status/:orderId': 'Get payment status',
      'POST /api/payment/webhook': 'Handle Razorpay webhooks'
    }
  });
});

export default router;
