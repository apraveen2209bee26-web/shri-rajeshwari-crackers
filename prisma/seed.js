import { PrismaClient } from '@prisma/client';
import { rawProducts } from './seedData.js';

const prisma = new PrismaClient();

function getImageForCategory(category, macroCategory) {
  if (macroCategory === 'Gift Boxes') {
    return '/images/alltype.jpeg';
  }
  if (category.toLowerCase().includes('chakkar') || category.toLowerCase().includes('spinner')) {
    return '/images/sakkaram.jpeg';
  }
  if (category.toLowerCase().includes('shot') || category.toLowerCase().includes('sky') || category.toLowerCase().includes('bomb')) {
    return '/images/banner.jpeg';
  }
  if (category.toLowerCase().includes('sparkler') || category.toLowerCase().includes('fountain')) {
    return '/images/hero-img.jpg';
  }
  return '/images/illustration-diwali-crackers.avif';
}

async function main() {
  console.log('✨ Starting database seed for Shri Rajeshwari Crackers...');

  // Upsert settings
  await prisma.adminSetting.upsert({
    where: { key: 'shop_name' },
    update: { value: 'Shri Rajeshwari Crackers' },
    create: { key: 'shop_name', value: 'Shri Rajeshwari Crackers' }
  });

  await prisma.adminSetting.upsert({
    where: { key: 'whatsapp_number' },
    update: { value: '9159802698' },
    create: { key: 'whatsapp_number', value: '9159802698' }
  });

  await prisma.adminSetting.upsert({
    where: { key: 'secondary_phone' },
    update: { value: '6369732737' },
    create: { key: 'secondary_phone', value: '6369732737' }
  });

  await prisma.adminSetting.upsert({
    where: { key: 'address' },
    update: { value: '12/291/1 Rathnapuri Nagar, Sivakasi' },
    create: { key: 'address', value: '12/291/1 Rathnapuri Nagar, Sivakasi' }
  });

  console.log(`📦 Populating ${rawProducts.length} items from official price list...`);

  for (const item of rawProducts) {
    const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    const image = getImageForCategory(item.category, item.macroCategory);

    await prisma.product.upsert({
      where: { sNo: item.sNo },
      update: {
        name: item.name,
        tamilName: item.tamilName,
        category: item.category,
        macroCategory: item.macroCategory,
        unit: item.unit,
        originalPrice: item.originalPrice,
        price: item.price,
        discount: discount > 0 ? discount : 80,
        inStock: true,
        image,
        featured: item.featured
      },
      create: {
        sNo: item.sNo,
        name: item.name,
        tamilName: item.tamilName,
        category: item.category,
        macroCategory: item.macroCategory,
        unit: item.unit,
        originalPrice: item.originalPrice,
        price: item.price,
        discount: discount > 0 ? discount : 80,
        inStock: true,
        image,
        description: `Premium quality ${item.name} (${item.tamilName}) by Shri Rajeshwari Crackers. Safe, eco-friendly Sivakasi fireworks.`,
        featured: item.featured
      }
    });
  }

  const count = await prisma.product.count();
  console.log(`✅ Database seeding complete! Total products in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
