import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import createOrderNumber from '../utils/orderNumber.js';
import { calculateCartSummary } from '../services/cartService.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/razorpayService.js';

const getCartForCheckout = (userId) =>
  Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    model: 'Product',
  });

const validateShippingAddress = (shippingAddress = {}) => {
  const requiredFields = ['fullName', 'phone', 'line1', 'city', 'state', 'postalCode'];
  return requiredFields.every((field) => shippingAddress[field]);
};

const reserveStockForOrder = async (order) => {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
        soldCount: item.quantity,
      },
    });
  }
};

const clearUserCart = (userId) =>
  Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: { items: [] },
    },
  );

const notifyOrderConfirmation = async ({ order, user }) => {
  try {
    await sendOrderConfirmationEmail({ order, user });
  } catch (error) {
    console.error(`Failed to send order confirmation email for ${order.orderNumber}`, error);
  }
};

const createCheckoutOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, notes, paymentMethod = 'razorpay' } = req.body;

  if (!validateShippingAddress(shippingAddress)) {
    res.status(400);
    throw new Error('Complete shipping details are required for checkout');
  }

  if (!['razorpay', 'cod'].includes(paymentMethod)) {
    res.status(400);
    throw new Error('Unsupported payment method selected');
  }

  const cart = await getCartForCheckout(req.user._id);
  const cartSummary = calculateCartSummary(cart);

  if (!cartSummary.items.length) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  for (const item of cartSummary.items) {
    if (item.quantity > item.stock) {
      res.status(400);
      throw new Error(`${item.name} does not have enough stock`);
    }
  }

  const orderNumber = createOrderNumber();
  const orderPayload = {
    user: req.user._id,
    orderNumber,
    items: cartSummary.items.map((item) => ({
      product: item.productId,
      name: item.name,
      slug: item.slug,
      imageUrl: item.image?.url,
      categories: item.categories,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    shippingAddress,
    pricing: {
      subtotal: cartSummary.subtotal,
      shippingFee: cartSummary.shippingFee,
      tax: cartSummary.tax,
      total: cartSummary.total,
      currency: 'INR',
    },
    notes,
  };

  if (paymentMethod === 'cod') {
    const order = await Order.create({
      ...orderPayload,
      payment: {
        provider: 'cod',
        status: 'pending',
      },
      status: 'processing',
      statusHistory: [
        {
          status: 'created',
          label: 'Order placed',
          note: 'Cash on delivery selected by customer',
        },
        {
          status: 'processing',
          label: 'Order confirmed',
          note: 'Order reserved and waiting for dispatch',
        },
      ],
    });

    await reserveStockForOrder(order);
    await clearUserCart(req.user._id);
    await notifyOrderConfirmation({
      order,
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Cash on delivery order placed successfully',
      order,
      paymentMethod: 'cod',
      requiresPayment: false,
    });
    return;
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: cartSummary.total * 100,
    receipt: orderNumber,
    notes: {
      userId: req.user._id.toString(),
      orderNumber,
    },
  });

  const order = await Order.create({
    ...orderPayload,
    payment: {
      provider: 'razorpay',
      status: 'created',
      razorpayOrderId: razorpayOrder.id,
    },
    status: 'created',
    statusHistory: [
      {
        status: 'created',
        label: 'Order placed',
        note: 'Awaiting payment confirmation',
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Checkout created successfully',
    order,
    paymentMethod: 'razorpay',
    requiresPayment: true,
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      name: 'Cracker Shop',
      description: `Payment for order ${order.orderNumber}`,
      prefill: {
        name: shippingAddress.fullName || req.user.name,
        email: req.user.email,
        contact: shippingAddress.phone || req.user.phone,
      },
    },
  });
});

const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.payment.provider !== 'razorpay') {
    res.status(400);
    throw new Error('This order does not require online payment verification');
  }

  if (order.payment.status === 'paid') {
    res.json({
      success: true,
      message: 'Payment already verified',
      order,
    });
    return;
  }

  const signatureValid = verifyRazorpaySignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (!signatureValid || order.payment.razorpayOrderId !== razorpay_order_id) {
    order.payment.status = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Payment signature verification failed');
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product);

    if (!product || product.status !== 'active') {
      res.status(400);
      throw new Error(`${item.name} is not available anymore`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${item.name} is out of stock for the selected quantity`);
    }
  }

  await reserveStockForOrder(order);

  order.payment.status = 'paid';
  order.payment.razorpayOrderId = razorpay_order_id;
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.payment.paidAt = new Date();
  order.status = 'processing';
  order.statusHistory.push({
    status: 'processing',
    label: 'Payment verified',
    note: 'Online payment confirmed and order queued for dispatch',
  });
  await order.save();

  await clearUserCart(req.user._id);
  await notifyOrderConfirmation({
    order,
    user: {
      name: req.user.name,
      email: req.user.email,
    },
  });

  res.json({
    success: true,
    message: 'Payment verified successfully',
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user?._id?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('You cannot view this order');
  }

  res.json({
    success: true,
    order,
  });
});

const trackOrderByNumber = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderNumber: req.params.orderNumber,
    user: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    order,
  });
});

export { createCheckoutOrder, verifyOrderPayment, getMyOrders, getOrderById, trackOrderByNumber };
