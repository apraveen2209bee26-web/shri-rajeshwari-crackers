import mongoose from 'mongoose';

import slugify from '../utils/slugify.js';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: String,
    alt: String,
  },
  { _id: false },
);

const specificationSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: [specificationSchema],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    image: {
      type: imageSchema,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre('validate', function ensureSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;

