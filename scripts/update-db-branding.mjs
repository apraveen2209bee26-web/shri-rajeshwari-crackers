import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const setting = await prisma.adminSetting.upsert({
      where: { key: 'shop_name' },
      update: { value: 'Sri Rajeshwari Crackers' },
      create: { key: 'shop_name', value: 'Sri Rajeshwari Crackers' }
    });
    console.log('AdminSetting shop_name updated:', setting);

    // Update branches
    const branches = await prisma.branchLocation.findMany();
    for (const b of branches) {
      if (b.name && (b.name.includes('Shri') || b.name.includes('Shree'))) {
        const newName = b.name.replace(/Shri|Shree/g, 'Sri');
        await prisma.branchLocation.update({
          where: { id: b.id },
          data: { name: newName }
        });
        console.log(`Updated branch ${b.id}: ${b.name} -> ${newName}`);
      }
    }

    // Update product descriptions if any
    const products = await prisma.product.findMany({
      where: {
        description: {
          contains: 'Shri'
        }
      }
    });
    for (const p of products) {
      if (p.description) {
        const newDesc = p.description.replace(/Shri|Shree/g, 'Sri');
        await prisma.product.update({
          where: { id: p.id },
          data: { description: newDesc }
        });
        console.log(`Updated product ${p.sNo} description.`);
      }
    }
  } catch (err) {
    console.log('Database update note:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
