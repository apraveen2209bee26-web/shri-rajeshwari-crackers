import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

const buildProductsQuery = (query = {}) => {
  const filters = {
    status: 'active',
  };

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { shortDescription: { $regex: query.search, $options: 'i' } },
      { categories: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.category) {
    filters.categories = {
      $regex: `^${query.category}$`,
      $options: 'i',
    };
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  return filters;
};

const getSortOption = (sort = 'latest') => {
  const sortMap = {
    latest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { soldCount: -1, featured: -1 },
    stock: { stock: -1 },
  };

  return sortMap[sort] || sortMap.latest;
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const skip = (page - 1) * limit;

  const filters = buildProductsQuery(req.query);
  const [products, total] = await Promise.all([
    Product.find(filters).sort(getSortOption(req.query.sort)).skip(skip).limit(limit),
    Product.countDocuments(filters),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({
    featured: true,
    status: 'active',
  })
    .sort({ soldCount: -1, createdAt: -1 })
    .limit(8);

  res.json({
    success: true,
    products,
  });
});

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('categories', { status: 'active' });

  res.json({
    success: true,
    categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    status: 'active',
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    categories: { $in: product.categories },
    status: 'active',
  })
    .limit(4)
    .sort({ featured: -1, soldCount: -1 });

  res.json({
    success: true,
    product,
    relatedProducts,
  });
});

export { getProducts, getFeaturedProducts, getCategories, getProductBySlug };

