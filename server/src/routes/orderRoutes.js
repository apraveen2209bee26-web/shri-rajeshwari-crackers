import express from 'express';

import {
  createCheckoutOrder,
  getMyOrders,
  getOrderById,
  trackOrderByNumber,
  verifyOrderPayment,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/checkout', createCheckoutOrder);
router.post('/verify-payment', verifyOrderPayment);
router.get('/my-orders', getMyOrders);
router.get('/track/:orderNumber', trackOrderByNumber);
router.get('/:orderId', getOrderById);

export default router;

