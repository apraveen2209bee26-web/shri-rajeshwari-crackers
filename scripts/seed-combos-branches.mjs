import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sample5000Items = [
  { sNo: 1, name: '2 3/4" Kuruvi', tamilName: 'குருவி வெடி', quantity: 5, unit: '5 PKT', originalPrice: 150, price: 30 },
  { sNo: 2, name: '3 1/2" Lakshmi', tamilName: 'லட்சுமி வெடி', quantity: 2, unit: '2 PKT', originalPrice: 180, price: 36 },
  { sNo: 3, name: '4" Lakshmi', tamilName: '4" லட்சுமி', quantity: 2, unit: '2 PKT', originalPrice: 240, price: 48 },
  { sNo: 4, name: 'Flower Pots Big', tamilName: 'பெரிய பூந்தொட்டி', quantity: 1, unit: '1 BOX', originalPrice: 450, price: 90 },
  { sNo: 5, name: 'Flower Pots Special', tamilName: 'ஸ்பெஷல் பூந்தொட்டி', quantity: 1, unit: '1 BOX', originalPrice: 600, price: 120 },
  { sNo: 6, name: 'Flower Pots Asoka', tamilName: 'அசோகா பூந்தொட்டி', quantity: 1, unit: '1 BOX', originalPrice: 750, price: 150 },
  { sNo: 7, name: '5" Lakshmi Deluxe', tamilName: '5" டீலக்ஸ் லட்சுமி', quantity: 2, unit: '2 PKT', originalPrice: 320, price: 64 },
  { sNo: 8, name: 'Ground Chakkar Big', tamilName: 'தரை சக்கரம் பெரியது', quantity: 1, unit: '1 BOX', originalPrice: 380, price: 76 },
  { sNo: 9, name: 'Ground Chakkar Special', tamilName: 'ஸ்பெஷல் தரை சக்கரம்', quantity: 1, unit: '1 BOX', originalPrice: 500, price: 100 },
  { sNo: 10, name: 'Dancing Wheel', tamilName: 'டான்சிங் வீல்', quantity: 1, unit: '1 BOX', originalPrice: 420, price: 84 },
  { sNo: 11, name: 'Wire Chakkars', tamilName: 'வயர் சக்கரம்', quantity: 1, unit: '1 BOX', originalPrice: 360, price: 72 },
  { sNo: 12, name: 'Lunik Rocket', tamilName: 'லூனிக் ராக்கெட்', quantity: 1, unit: '1 BOX', originalPrice: 550, price: 110 },
  { sNo: 13, name: '45 CM Twinkling Star', tamilName: '45 CM ட்விங்க்ளிங் ஸ்டார்', quantity: 2, unit: '2 BOX', originalPrice: 440, price: 88 },
  { sNo: 14, name: '120 CM Twinkling Star', tamilName: '120 CM மெகா ட்விங்க்ளிங் ஸ்டார்', quantity: 1, unit: '1 BOX', originalPrice: 400, price: 80 },
  { sNo: 15, name: 'Colour Smoke (Daylight)', tamilName: 'வண்ணப் புகை', quantity: 1, unit: '1 BOX', originalPrice: 500, price: 100 },
  { sNo: 16, name: 'King of King Bomb', tamilName: 'கிங் ஆஃப் கிங் பாம்', quantity: 1, unit: '1 BOX', originalPrice: 650, price: 130 },
  { sNo: 17, name: 'Paper Bomb 1/4 kg', tamilName: 'பேப்பர் பாம் 1/4 கிலோ', quantity: 2, unit: '2 BOX', originalPrice: 500, price: 100 },
  { sNo: 18, name: 'Paper Bomb 1/2 kg', tamilName: 'பேப்பர் பாம் 1/2 கிலோ', quantity: 1, unit: '1 BOX', originalPrice: 450, price: 90 },
  { sNo: 19, name: "100's Red Bijili", tamilName: 'சிவப்பு பிஜிலி 100', quantity: 1, unit: '1 PKT', originalPrice: 200, price: 40 },
  { sNo: 20, name: "100's Stripped Bijili", tamilName: 'வரி பிஜிலி 100', quantity: 1, unit: '1 PKT', originalPrice: 220, price: 44 },
  { sNo: 21, name: '56 Giant', tamilName: '56 ஜெயன்ட் வெடி', quantity: 1, unit: '1 PKT', originalPrice: 350, price: 70 },
  { sNo: 22, name: '24 Deluxe', tamilName: '24 டீலக்ஸ்', quantity: 1, unit: '1 PKT', originalPrice: 280, price: 56 },
  { sNo: 23, name: '100 Wala Garland', tamilName: '100 வாலா சரவெடி', quantity: 1, unit: '1 PKT', originalPrice: 320, price: 64 },
  { sNo: 24, name: 'One K (1000 Wala Special)', tamilName: '1000 வாலா மெகா சரவெடி', quantity: 1, unit: '1 BOX', originalPrice: 1800, price: 360 },
  { sNo: 25, name: '7 CM Red Sparklers', tamilName: '7 CM சிவப்பு சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 240, price: 48 },
  { sNo: 26, name: '10 CM Green Sparklers', tamilName: '10 CM பச்சை சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 340, price: 68 },
  { sNo: 27, name: '15 CM Colour Sparklers', tamilName: '15 CM கலர் சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 420, price: 84 },
  { sNo: 28, name: '30 CM Electric Sparklers', tamilName: '30 CM எலக்ட்ரிக் சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 600, price: 120 },
  { sNo: 29, name: '50 CM Mixed Sparklers', tamilName: '50 CM மெகா சாட்டை', quantity: 1, unit: '1 BOX', originalPrice: 550, price: 110 },
  { sNo: 30, name: 'Kit Kat (Musical)', tamilName: 'கிட் கேட் சவுண்ட்', quantity: 1, unit: '1 BOX', originalPrice: 300, price: 60 },
  { sNo: 31, name: 'Colour Shower (5 in 1)', tamilName: 'கலர் ஷவர் (5 இன் 1)', quantity: 1, unit: '1 BOX', originalPrice: 700, price: 140 },
  { sNo: 32, name: 'Photo Flash', tamilName: 'போட்டோ ஃப்ளாஷ்', quantity: 1, unit: '1 BOX', originalPrice: 400, price: 80 },
  { sNo: 33, name: 'Colour Changing Bambaram', tamilName: 'கலர் பம்பரம்', quantity: 1, unit: '1 BOX', originalPrice: 450, price: 90 },
  { sNo: 34, name: 'Mini Siren', tamilName: 'மினி சைரன்', quantity: 1, unit: '1 BOX', originalPrice: 400, price: 80 },
  { sNo: 35, name: 'Magic Money (Big)', tamilName: 'மேஜிக் மணி பவுண்டன்', quantity: 1, unit: '1 BOX', originalPrice: 500, price: 100 },
  { sNo: 36, name: '1 1/4" Chotta Fancy', tamilName: 'சோட்டா ஃபேன்ஸி ஷாட்', quantity: 2, unit: '2 BOX', originalPrice: 600, price: 120 },
  { sNo: 37, name: '2" Fancy Multicolour Single', tamilName: '2" ஃபேன்ஸி கலர் ஷாட்', quantity: 1, unit: '1 BOX', originalPrice: 450, price: 90 },
  { sNo: 38, name: '2 1/2" Fancy Multicolour', tamilName: '2 1/2" மெகா ஃபேன்ஸி ஷாட்', quantity: 1, unit: '1 BOX', originalPrice: 650, price: 130 },
  { sNo: 39, name: '12 Shot Rider Aerial', tamilName: '12 ஷாட் ரைடர் ரிப்பீட்டர்', quantity: 1, unit: '1 BOX', originalPrice: 1200, price: 240 },
  { sNo: 40, name: '12 Shot Multicolour Sky', tamilName: '12 ஷாட் மல்டிகலர் வானவேடிக்கை', quantity: 1, unit: '1 BOX', originalPrice: 1400, price: 280 },
  { sNo: 41, name: '30 Shot Multicolour Extravaganza', tamilName: '30 ஷாட் மெகா ஸ்கை ஷோ', quantity: 1, unit: '1 BOX', originalPrice: 3200, price: 640 },
  { sNo: 42, name: 'Golden Rain Fountain', tamilName: 'கோல்டன் ரெயின் ஃபவுண்டன்', quantity: 1, unit: '1 BOX', originalPrice: 500, price: 100 }
];

const sample3000Items = [
  { sNo: 1, name: '2 3/4" Kuruvi', tamilName: 'குருவி வெடி', quantity: 3, unit: '3 PKT', originalPrice: 90, price: 18 },
  { sNo: 2, name: '3 1/2" Lakshmi', tamilName: 'லட்சுமி வெடி', quantity: 2, unit: '2 PKT', originalPrice: 180, price: 36 },
  { sNo: 3, name: 'Flower Pots Big', tamilName: 'பெரிய பூந்தொட்டி', quantity: 1, unit: '1 BOX', originalPrice: 450, price: 90 },
  { sNo: 4, name: 'Ground Chakkar Big', tamilName: 'தரை சக்கரம் பெரியது', quantity: 1, unit: '1 BOX', originalPrice: 380, price: 76 },
  { sNo: 5, name: 'Dancing Wheel', tamilName: 'டான்சிங் வீல்', quantity: 1, unit: '1 BOX', originalPrice: 420, price: 84 },
  { sNo: 6, name: '100 Wala Garland', tamilName: '100 வாலா சரவெடி', quantity: 1, unit: '1 PKT', originalPrice: 320, price: 64 },
  { sNo: 7, name: '10 CM Green Sparklers', tamilName: '10 CM பச்சை சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 340, price: 68 },
  { sNo: 8, name: '15 CM Colour Sparklers', tamilName: '15 CM கலர் சாட்டை', quantity: 2, unit: '2 BOX', originalPrice: 420, price: 84 },
  { sNo: 9, name: '30 CM Electric Sparklers', tamilName: '30 CM எலக்ட்ரிக் சாட்டை', quantity: 1, unit: '1 BOX', originalPrice: 300, price: 60 },
  { sNo: 10, name: 'Paper Bomb 1/4 kg', tamilName: 'பேப்பர் பாம் 1/4 கிலோ', quantity: 1, unit: '1 BOX', originalPrice: 250, price: 50 },
  { sNo: 11, name: '12 Shot Multicolour Sky', tamilName: '12 ஷாட் வானவேடிக்கை', quantity: 1, unit: '1 BOX', originalPrice: 1400, price: 280 },
  { sNo: 12, name: 'Colour Shower (5 in 1)', tamilName: 'கலர் ஷவர் (5 இன் 1)', quantity: 1, unit: '1 BOX', originalPrice: 700, price: 140 },
  { sNo: 13, name: '45 CM Twinkling Star', tamilName: '45 CM ட்விங்க்ளிங் ஸ்டார்', quantity: 1, unit: '1 BOX', originalPrice: 220, price: 44 }
];

async function seed() {
  console.log('Seeding initial Combo Offers and Branch Locations...');

  // 1. Seed Combo Offers
  await prisma.comboOffer.upsert({
    where: { slug: 'mega-saver-5000' },
    update: {
      title: '₹5,000 Mega Combo Value Pack',
      tamilTitle: 'தரமான பட்டாசுகள் குறைந்த விலையில்! (62 Items Grand Diwali Pack)',
      badge: 'MEGA SAVER',
      itemsCount: 62,
      totalMarketPrice: 24900,
      offerPrice: 5000,
      description: 'The ultimate fireworks extravaganza featuring 62 top-tier items! Includes 1000 Wala, King of King Bomb, 12 & 30 Shot Multicolours, Sky Shots, Fancy Cylinders, Giant Sparklers, and dazzling visual novelties.',
      highlights: JSON.stringify([
        '62 Premium Fireworks Items',
        '1000 Wala & King of King Bomb Included',
        'Multiple Aerial Repeating Sky Shots',
        '100% Genuine Sivakasi Green Formulations'
      ]),
      itemsJson: JSON.stringify(sample5000Items),
      active: true,
      sortOrder: 1
    },
    create: {
      slug: 'mega-saver-5000',
      title: '₹5,000 Mega Combo Value Pack',
      tamilTitle: 'தரமான பட்டாசுகள் குறைந்த விலையில்! (62 Items Grand Diwali Pack)',
      badge: 'MEGA SAVER',
      itemsCount: 62,
      totalMarketPrice: 24900,
      offerPrice: 5000,
      description: 'The ultimate fireworks extravaganza featuring 62 top-tier items! Includes 1000 Wala, King of King Bomb, 12 & 30 Shot Multicolours, Sky Shots, Fancy Cylinders, Giant Sparklers, and dazzling visual novelties.',
      highlights: JSON.stringify([
        '62 Premium Fireworks Items',
        '1000 Wala & King of King Bomb Included',
        'Multiple Aerial Repeating Sky Shots',
        '100% Genuine Sivakasi Green Formulations'
      ]),
      itemsJson: JSON.stringify(sample5000Items),
      active: true,
      sortOrder: 1
    }
  });

  await prisma.comboOffer.upsert({
    where: { slug: 'super-value-3000' },
    update: {
      title: '₹3,000 Super Value Family Pack',
      tamilTitle: 'குடும்பத்திற்கான சூப்பர் வேல்யூ தீபாவளி பேக்! (50 Items)',
      badge: 'SUPER VALUE',
      itemsCount: 50,
      totalMarketPrice: 15000,
      offerPrice: 3000,
      description: 'Carefully curated festive pack containing 50 family-favorite crackers, sparkling flower pots, ground chakkars, color sparklers, rockets, and celebratory 12-shot sky repeater.',
      highlights: JSON.stringify([
        '50 Premium Fireworks Items',
        'Sparklers, Pots, Chakkars & 12 Shots',
        'Family-Friendly 100% Safe Formulations',
        'Direct Sivakasi 80% Factory Discount'
      ]),
      itemsJson: JSON.stringify(sample3000Items),
      active: true,
      sortOrder: 2
    },
    create: {
      slug: 'super-value-3000',
      title: '₹3,000 Super Value Family Pack',
      tamilTitle: 'குடும்பத்திற்கான சூப்பர் வேல்யூ தீபாவளி பேக்! (50 Items)',
      badge: 'SUPER VALUE',
      itemsCount: 50,
      totalMarketPrice: 15000,
      offerPrice: 3000,
      description: 'Carefully curated festive pack containing 50 family-favorite crackers, sparkling flower pots, ground chakkars, color sparklers, rockets, and celebratory 12-shot sky repeater.',
      highlights: JSON.stringify([
        '50 Premium Fireworks Items',
        'Sparklers, Pots, Chakkars & 12 Shots',
        'Family-Friendly 100% Safe Formulations',
        'Direct Sivakasi 80% Factory Discount'
      ]),
      itemsJson: JSON.stringify(sample3000Items),
      active: true,
      sortOrder: 2
    }
  });

  // 2. Seed Branch Locations
  const existingBranches = await prisma.branchLocation.findMany();
  if (existingBranches.length === 0) {
    await prisma.branchLocation.create({
      data: {
        name: 'Sri Rajeshwari Crackers - Head Office & Factory Outlet',
        tamilName: 'தலைமை அலுவலகம் & நேரடி பட்டாசு விற்பனை நிலையம்',
        address: '12/291/1 Rathnapuri Nagar, Sivakasi',
        city: 'Sivakasi',
        pincode: '626123',
        phone: '9159802698',
        secondaryPhone: '6369732737',
        googleMapsUrl: 'https://maps.google.com/?q=12/291/1+Rathnapuri+Nagar+Sivakasi+Tamil+Nadu+626123',
        isMainBranch: true
      }
    });

    await prisma.branchLocation.create({
      data: {
        name: 'Sri Rajeshwari Crackers - Town Express Booking & Dispatch Depot',
        tamilName: 'சிவகாசி டவுன் எக்ஸ்பிரஸ் புக்கிங் & டெலிவரி கிளை',
        address: 'Sattur Road, Near Old Bus Stand, Sivakasi',
        city: 'Sivakasi',
        pincode: '626123',
        phone: '6369732737',
        secondaryPhone: '9159802698',
        googleMapsUrl: 'https://maps.google.com/?q=Sivakasi+Tamil+Nadu+626123',
        isMainBranch: false
      }
    });
  }

  console.log('✅ Combo Offers & Branches Seeded Successfully!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
