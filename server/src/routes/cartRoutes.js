import express from 'express';

import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/clear', clearCart);

export default router;

