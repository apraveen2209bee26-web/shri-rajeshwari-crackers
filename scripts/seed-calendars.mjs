import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCalendars = [
  {
    slug: 'wirebound-spiral-flip-wall-calendar',
    name: 'Wirebound Spiral Flip Wall Calendar',
    tamilName: '12 மாத ஸ்பைரல் வால் காலண்டர்',
    category: 'Calendars',
    type: 'Wirebound / Spiral Flip Wall',
    paperGsm: '170 GSM Premium Gloss Art Paper',
    size: '12" x 18" (Double Royal Flip)',
    originalPrice: 250,
    price: 120,
    stock: 250,
    inStock: true,
    image: '/images/calendars/spiral-wall-calendar.svg',
    description: 'High-grade 12-month flip wall calendar bound with durable white wire-o rings and hanging hook. Features gold-embossed deities, Tamil panchangam, auspicious dates (சுபமுகூர்த்தம்), and vibrant festive artwork.',
    features: JSON.stringify([
      '6 to 12 double-sided sheets on 170 GSM art paper',
      'Heavy-duty wire-o spiral ring binding with wall hanger',
      'Tamil & English dates with daily Thithi, Nakshatram & Raghu Kalam',
      'Ideal for home pooja rooms, offices & auspicious gifting'
    ]),
    minOrderQty: 1,
    featured: true,
    sortOrder: 1
  },
  {
    slug: 'tear-off-daily-slip-calendar',
    name: 'Tear-Off Daily Slip Calendar',
    tamilName: 'பாரம்பரிய தினசரி காலண்டர்',
    category: 'Calendars',
    type: 'Tear-Off / Daily Slip',
    paperGsm: '60 GSM Smooth Glazed Daily Paper',
    size: 'Standard 7" x 10" Slip Pad',
    originalPrice: 180,
    price: 85,
    stock: 500,
    inStock: true,
    image: '/images/calendars/daily-slip-calendar.jpg',
    description: 'Traditional Sivakasi daily tear-off calendar. Each day gets its own fresh sheet packed with detailed Tamil Panchangam, daily Rasi Palan, Nalla Neram, Gowri Panchangam, and inspirational Thirukkural quotes on back.',
    features: JSON.stringify([
      '365 days individual tear-off sheets with perforated binding',
      'Daily Rasi Palan, Nalla Neram, Emakandam, and Rahu Kalam',
      'High-gloss gold foil Lakshmi & Ganesha embossed backboard',
      'Authentic Sivakasi offset printing clarity'
    ]),
    minOrderQty: 1,
    featured: true,
    sortOrder: 2
  },
  {
    slug: 'single-sheet-poster-planner-calendar',
    name: 'Single-Sheet Poster Planner Calendar',
    tamilName: 'ஒற்றை தாள் 12 மாத சுவரொட்டி காலண்டர்',
    category: 'Calendars',
    type: 'Single-Sheet Poster Planner',
    paperGsm: '170 GSM Heavy Art Card Sheet',
    size: 'A2 Large Format (16.5" x 23.4")',
    originalPrice: 150,
    price: 75,
    stock: 400,
    inStock: true,
    image: '/images/calendars/poster-wall-calendar.svg',
    description: 'Displays the complete 12 months on a single grand poster sheet. Engineered for offices, warehouses, retail shops, and factories for annual planning, project milestones, and holiday scheduling.',
    features: JSON.stringify([
      'Entire 12-month calendar at a single glance',
      'Top and bottom tin rim metal clips with hanging loop',
      'Government and Bank holidays marked in bold red',
      'Spacious date blocks for handwritten notes & planning'
    ]),
    minOrderQty: 1,
    featured: true,
    sortOrder: 3
  },
  {
    slug: 'desk-tabletop-tent-calendar',
    name: 'Desk & Tabletop Tent Calendar',
    tamilName: 'மேஜை / டெஸ்க் டென்ட் காலண்டர்',
    category: 'Calendars',
    type: 'Desk & Tabletop',
    paperGsm: '300 GSM Heavy Art Card Stand',
    size: '8.5" x 5.5" Horizontal Landscape',
    originalPrice: 220,
    price: 110,
    stock: 200,
    inStock: true,
    image: '/images/calendars/desk-tent-calendar.svg',
    description: 'Compact tabletop format explicitly designed to stand firm on home workstations, office desks, and reception counters. Features note sections for monthly goals and corporate branding.',
    features: JSON.stringify([
      '300 GSM rigid triangular tent stand that never droops',
      'Double wire-o top spiral binding for smooth 12-month page flipping',
      'Glanceable scheduling with monthly memo and goals tracker',
      'Corporate bulk custom printing with company logo available'
    ]),
    minOrderQty: 1,
    featured: false,
    sortOrder: 4
  }
];

async function main() {
  console.log('Updating Calendar Products in Neon PostgreSQL (removing 2026)...');
  
  // Clean up any old slugs with 2026
  await prisma.calendarProduct.deleteMany({
    where: {
      slug: {
        contains: '2026'
      }
    }
  });

  for (const cal of defaultCalendars) {
    await prisma.calendarProduct.upsert({
      where: { slug: cal.slug },
      update: cal,
      create: cal
    });
    console.log(`✓ Seeded: ${cal.name}`);
  }
  console.log('Finished syncing calendars successfully without 2026!');
}

main()
  .catch((e) => {
    console.error('Error seeding calendars:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
