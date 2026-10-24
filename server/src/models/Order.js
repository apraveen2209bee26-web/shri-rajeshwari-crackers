import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    slug: String,
    imageUrl: String,
    categories: [String],
    price: Number,
    originalPrice: Number,
    quantity: Number,
    subtotal: Number,
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'India',
    },
    landmark: String,
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: String,
    label: String,
    note: String,
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    pricing: {
      subtotal: Number,
      shippingFee: Number,
      tax: Number,
      total: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    payment: {
      provider: {
        type: String,
        enum: ['razorpay', 'cod'],
        default: 'razorpay',
      },
      status: {
        type: String,
        enum: ['created', 'pending', 'paid', 'failed', 'refunded'],
        default: 'created',
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'created',
    },
    statusHistory: [statusHistorySchema],
    notes: String,
    tracking: {
      courierName: String,
      trackingId: String,
      estimatedDelivery: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
