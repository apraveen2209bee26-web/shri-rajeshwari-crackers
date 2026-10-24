import CommunityItem from '../models/CommunityItem.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getOverview = asyncHandler(async (_req, res) => {
  const [totalUsers, itemStatusGroups, itemTypeGroups, recentItems] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      CommunityItem.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      CommunityItem.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
      ]),
      CommunityItem.find().populate('author', 'name email companyName institutionName').sort({ createdAt: -1 }).limit(6),
    ]);

  const statusSummary = itemStatusGroups.reduce(
    (result, entry) => ({
      ...result,
      [entry._id]: entry.count,
    }),
    {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );

  const typeSummary = itemTypeGroups.reduce(
    (result, entry) => ({
      ...result,
      [entry._id]: entry.count,
    }),
    {
      post: 0,
      event: 0,
      job: 0,
    },
  );

  res.json({
    success: true,
    overview: {
      totalUsers,
      pendingItems: statusSummary.pending,
      approvedItems: statusSummary.approved,
      rejectedItems: statusSummary.rejected,
      postCount: typeSummary.post,
      eventCount: typeSummary.event,
      jobCount: typeSummary.job,
      recentItems,
    },
  });
});

const getAdminItems = asyncHandler(async (req, res) => {
  const allowedTypes = ['post', 'event', 'job'];
  const allowedStatuses = ['pending', 'approved', 'rejected'];
  const type = allowedTypes.includes(req.query.type) ? req.query.type : null;
  const status = allowedStatuses.includes(req.query.status) ? req.query.status : null;

  const items = await CommunityItem.find({
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
  })
    .populate('author', 'name email role companyName institutionName')
    .populate('moderatedBy', 'name role')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    items,
  });
});

const moderateItem = asyncHandler(async (req, res) => {
  const { status, moderationNote } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('A valid moderation status is required');
  }

  const item = await CommunityItem.findById(req.params.itemId).populate(
    'author',
    'name email role companyName institutionName',
  );

  if (!item) {
    res.status(404);
    throw new Error('Community item not found');
  }

  item.status = status;
  item.moderationNote = moderationNote?.trim() || '';
  item.moderatedAt = new Date();
  item.moderatedBy = req.user._id;
  await item.save();

  const populatedItem = await CommunityItem.findById(item._id)
    .populate('author', 'name email role companyName institutionName')
    .populate('moderatedBy', 'name role');

  res.json({
    success: true,
    message: `Item marked as ${status}`,
    item: populatedItem,
  });
});

export { getAdminItems, getOverview, moderateItem };
