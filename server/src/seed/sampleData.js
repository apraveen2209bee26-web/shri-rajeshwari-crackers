import Product from '../models/Product.js';
import User from '../models/User.js';

const sampleProducts = [
  {
    name: 'Royal Celebration Box',
    sku: 'CRK-ROYAL-001',
    shortDescription: 'A premium family combo with fountains, sparklers, and aerial shells.',
    description:
      'Curated for festive evenings, this premium cracker box brings together crowd-favorite aerial shots, color fountains, sparklers, and safe celebration essentials in one value-packed combo.',
    categories: ['Gift Boxes', 'Festival Packs'],
    tags: ['family', 'premium', 'festival'],
    highlights: ['Color fountains', 'Multi-shot aerials', 'Family celebration combo'],
    specifications: [
      { label: 'Safety class', value: 'Standard festive use' },
      { label: 'Best for', value: 'Family parties and gifting' },
    ],
    price: 2499,
    originalPrice: 2999,
    stock: 35,
    minOrderQuantity: 1,
    featured: true,
    status: 'active',
    image: {
      url: 'https://res.cloudinary.com/demo/image/upload/v1720012345/samples/firecracker_box.jpg',
      alt: 'Royal celebration cracker gift box',
    },
  },
  {
    name: 'Skyburst Rockets Pack',
    sku: 'CRK-SKY-002',
    shortDescription: 'High-altitude rockets with vibrant burst effects.',
    description:
      'This rocket bundle is built for dramatic night displays with crisp lift, rich color bursts, and festive variety for large open spaces.',
    categories: ['Rockets', 'Aerial'],
    tags: ['rockets', 'outdoor'],
    highlights: ['Mixed burst patterns', 'Bright night colors', 'Party-ready bundle'],
    specifications: [
      { label: 'Usage', value: 'Outdoor open areas only' },
      { label: 'Pack size', value: '12 rockets' },
    ],
    price: 899,
    originalPrice: 1099,
    stock: 80,
    minOrderQuantity: 1,
    featured: true,
    status: 'active',
    image: {
      url: 'https://res.cloudinary.com/demo/image/upload/v1720012345/samples/rocket_fireworks.jpg',
      alt: 'Colorful fireworks rockets pack',
    },
  },
  {
    name: 'Kids Sparkle Set',
    sku: 'CRK-KIDS-003',
    shortDescription: 'Low-noise sparkle fun with pencils, flowers, and crackling wheels.',
    description:
      'A softer festive set designed for children with supervised use, featuring bright sparklers, flower pots, and gentle visual effects.',
    categories: ['Kids', 'Sparklers'],
    tags: ['kids', 'low-noise'],
    highlights: ['Beginner-friendly', 'Bright sparkler effects', 'Low-noise enjoyment'],
    specifications: [
      { label: 'Noise level', value: 'Low' },
      { label: 'Supervision', value: 'Adult supervision required' },
    ],
    price: 499,
    originalPrice: 649,
    stock: 120,
    minOrderQuantity: 1,
    featured: true,
    status: 'active',
    image: {
      url: 'https://res.cloudinary.com/demo/image/upload/v1720012345/samples/sparkler_set.jpg',
      alt: 'Kids sparkle cracker set',
    },
  },
  {
    name: 'Temple Fountain Trio',
    sku: 'CRK-FNT-004',
    shortDescription: 'Three-stage fountain set with gold and silver showers.',
    description:
      'Ideal for elegant celebrations, this fountain trio creates a steady cascade of light with layered transitions from gold to silver and crackling finishes.',
    categories: ['Fountains', 'Ground Effects'],
    tags: ['fountain', 'visual'],
    highlights: ['Gold-to-silver transitions', 'Steady duration', 'Elegant ambience'],
    specifications: [
      { label: 'Effect', value: 'Ground fountain' },
      { label: 'Pack size', value: '3 fountains' },
    ],
    price: 699,
    originalPrice: 829,
    stock: 64,
    minOrderQuantity: 1,
    featured: false,
    status: 'active',
    image: {
      url: 'https://res.cloudinary.com/demo/image/upload/v1720012345/samples/fountain_fireworks.jpg',
      alt: 'Ground fountain fireworks trio',
    },
  },
];

const seedAdminUser = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@crackershop.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'Store Admin',
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  });
};

const seedSampleProducts = async () => {
  const hasProducts = await Product.countDocuments();
  if (hasProducts > 0) {
    return;
  }

  const withSlugs = sampleProducts.map((product) => ({
    ...product,
    slug: product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
  }));

  await Product.insertMany(withSlugs);
};

export { seedAdminUser, seedSampleProducts };
