import crypto from 'crypto';

import Razorpay from 'razorpay';

let razorpayClient;

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured');
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
};

const createRazorpayOrder = async ({ amount, receipt, notes }) => {
  const client = getRazorpayClient();

  return client.orders.create({
    amount,
    currency: 'INR',
    receipt,
    notes,
  });
};

const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

export { createRazorpayOrder, verifyRazorpaySignature };

