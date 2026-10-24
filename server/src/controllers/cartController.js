import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { calculateCartSummary } from '../services/cartService.js';

const getPopulatedCart = async (userId) =>
  Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    model: 'Product',
  });

const getCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user._id);

  res.json({
    success: true,
    cart: calculateCartSummary(cart),
  });
});

const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product is required');
  }

  const product = await Product.findById(productId);

  if (!product || product.status !== 'active') {
    res.status(404);
    throw new Error('Product not available');
  }

  const normalizedQuantity = Math.max(Number(quantity), product.minOrderQuantity || 1);

  if (normalizedQuantity > product.stock) {
    res.status(400);
    throw new Error('Requested quantity exceeds available stock');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const updatedQuantity = existingItem.quantity + normalizedQuantity;
    if (updatedQuantity > product.stock) {
      res.status(400);
      throw new Error('Total quantity exceeds available stock');
    }
    existingItem.quantity = updatedQuantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity: normalizedQuantity,
    });
  }

  await cart.save();

  const updatedCart = await getPopulatedCart(req.user._id);

  res.status(201).json({
    success: true,
    message: 'Added to cart successfully',
    cart: calculateCartSummary(updatedCart),
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.productId;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') {
    res.status(404);
    throw new Error('Product not available');
  }

  const normalizedQuantity = Number(quantity);

  if (Number.isNaN(normalizedQuantity) || normalizedQuantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  if (normalizedQuantity > product.stock) {
    res.status(400);
    throw new Error('Requested quantity exceeds available stock');
  }

  item.quantity = normalizedQuantity;
  await cart.save();

  const updatedCart = await getPopulatedCart(req.user._id);

  res.json({
    success: true,
    message: 'Cart updated successfully',
    cart: calculateCartSummary(updatedCart),
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  const updatedCart = await getPopulatedCart(req.user._id);

  res.json({
    success: true,
    message: 'Item removed from cart',
    cart: calculateCartSummary(updatedCart),
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.json({
      success: true,
      message: 'Cart is already empty',
      cart: calculateCartSummary(null),
    });
    return;
  }

  cart.items = [];
  await cart.save();

  res.json({
    success: true,
    message: 'Cart cleared successfully',
    cart: calculateCartSummary(cart),
  });
});

export { getCart, addItemToCart, updateCartItem, removeCartItem, clearCart };
