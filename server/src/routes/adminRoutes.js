import express from 'express';

import {
  getAdminItems,
  getOverview,
  moderateItem,
} from '../controllers/adminController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/overview', getOverview);
router.get('/community', getAdminItems);
router.patch('/community/:itemId/moderation', moderateItem);

export default router;
