import CommunityItem from '../models/CommunityItem.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from '../utils/slugify.js';

const allowedTypes = ['post', 'event', 'job'];

const getValidType = (value) => (allowedTypes.includes(value) ? value : null);

const createUniqueSlug = async (title, currentId) => {
  const baseSlug = slugify(title);
  let nextSlug = baseSlug;
  let suffix = 1;

  while (
    await CommunityItem.exists({
      slug: nextSlug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    suffix += 1;
    nextSlug = `${baseSlug}-${suffix}`;
  }

  return nextSlug;
};

const populateItemQuery = (query) =>
  query.populate('author', 'name email role companyName institutionName bio');

const buildListQuery = (req) => {
  const type = getValidType(req.query.type);

  return {
    ...(type ? { type } : {}),
    status: 'approved',
  };
};

const getFeed = asyncHandler(async (req, res) => {
  const [items, counts] = await Promise.all([
    populateItemQuery(CommunityItem.find(buildListQuery(req)).sort({ createdAt: -1 }).limit(40)),
    CommunityItem.aggregate([
      {
        $match: {
          status: 'approved',
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const summary = counts.reduce(
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
    items,
    summary: {
      all: summary.post + summary.event + summary.job,
      ...summary,
    },
  });
});

const getCommunityItemBySlug = asyncHandler(async (req, res) => {
  const item = await populateItemQuery(
    CommunityItem.findOne({
      slug: req.params.slug,
    }),
  ).populate('comments.author', 'name role companyName institutionName');

  if (!item) {
    res.status(404);
    throw new Error('Community item not found');
  }

  const canView =
    item.status === 'approved' ||
    (req.user && (req.user.role === 'admin' || item.author?._id?.toString() === req.user._id.toString()));

  if (!canView) {
    res.status(404);
    throw new Error('Community item not found');
  }

  res.json({
    success: true,
    item,
  });
});

const createCommunityItem = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    excerpt,
    content,
    location,
    companyName,
    institutionName,
    eventStartAt,
    eventEndAt,
    applyUrl,
    coverImageUrl,
  } = req.body;

  const normalizedType = getValidType(type);

  if (!normalizedType || !title || !content) {
    res.status(400);
    throw new Error('Type, title, and content are required');
  }

  const item = await CommunityItem.create({
    type: normalizedType,
    title: title.trim(),
    slug: await createUniqueSlug(title),
    excerpt: excerpt?.trim(),
    content: content.trim(),
    location: location?.trim(),
    companyName: companyName?.trim() || req.user.companyName,
    institutionName: institutionName?.trim() || req.user.institutionName,
    eventStartAt: eventStartAt || undefined,
    eventEndAt: eventEndAt || undefined,
    applyUrl: applyUrl?.trim(),
    coverImageUrl: coverImageUrl?.trim(),
    status: req.user.role === 'admin' ? 'approved' : 'pending',
    author: req.user._id,
  });

  const populatedItem = await populateItemQuery(CommunityItem.findById(item._id));

  res.status(201).json({
    success: true,
    message:
      req.user.role === 'admin'
        ? 'Item published successfully'
        : 'Submitted successfully. It will appear after admin approval.',
    item: populatedItem,
  });
});

const getMyItems = asyncHandler(async (req, res) => {
  const items = await populateItemQuery(
    CommunityItem.find({
      author: req.user._id,
    }).sort({ createdAt: -1 }),
  );

  const summary = items.reduce(
    (result, item) => ({
      ...result,
      total: result.total + 1,
      [item.status]: result[item.status] + 1,
    }),
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );

  res.json({
    success: true,
    items,
    summary,
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const item = await CommunityItem.findOne({
    slug: req.params.slug,
  });

  if (!item) {
    res.status(404);
    throw new Error('Community item not found');
  }

  const canInteract =
    item.status === 'approved' ||
    req.user.role === 'admin' ||
    item.author.toString() === req.user._id.toString();

  if (!canInteract) {
    res.status(403);
    throw new Error('You cannot comment on this item right now');
  }

  if (!content?.trim()) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  item.comments.unshift({
    author: req.user._id,
    authorName: req.user.name,
    authorRole: req.user.role,
    content: content.trim(),
  });
  item.commentCount = item.comments.length;
  await item.save();

  const populatedItem = await populateItemQuery(CommunityItem.findById(item._id)).populate(
    'comments.author',
    'name role companyName institutionName',
  );

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    item: populatedItem,
  });
});

export { addComment, createCommunityItem, getCommunityItemBySlug, getFeed, getMyItems };
