import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Debug environment variables
console.log('Payment Route - Environment Variables Check:');
console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay credentials in environment variables');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test endpoint to verify Razorpay initialization
router.get('/test', (req, res) => {
  res.json({
    message: 'Payment routes are working!',
    timestamp: new Date().toISOString(),
    razorpayInitialized: !!razorpay
  });
});

// Create a new order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', customer } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Store order details in database
    const payment = new Payment({
      orderId: order.id,
      amount: amount,
      currency,
      customer,
      status: 'created',
      razorpayOrderId: order.id
    });
    await payment.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: amountInPaise,
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

// Verify payment signature
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment status in database
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
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error verifying payment'
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

export default router;
