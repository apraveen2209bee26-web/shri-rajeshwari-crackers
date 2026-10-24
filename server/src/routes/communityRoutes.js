import express from 'express';

import {
  addComment,
  createCommunityItem,
  getCommunityItemBySlug,
  getFeed,
  getMyItems,
} from '../controllers/communityController.js';
import { optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/feed', getFeed);
router.get('/mine', protect, getMyItems);
router.get('/:slug', optionalAuth, getCommunityItemBySlug);
router.post('/', protect, createCommunityItem);
router.post('/:slug/comments', protect, addComment);

export default router;
