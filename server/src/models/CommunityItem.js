import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorRole: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const communityItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['post', 'event', 'job'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 220,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    institutionName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    eventStartAt: Date,
    eventEndAt: Date,
    applyUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    moderationNote: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    moderatedAt: Date,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
);

const CommunityItem = mongoose.model('CommunityItem', communityItemSchema);

export default CommunityItem;
