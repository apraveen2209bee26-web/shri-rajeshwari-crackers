import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  '.env',
  '.env.example',
  'dev.ps1',
  'package.json',
  'package-lock.json',
  'README.md',
  'prisma/seed.js',
  'public/images/calendars/spiral-wall-calendar.svg',
  'scripts/generate-calendar-graphics.mjs',
  'scripts/seed-combos-branches.mjs',
  'scripts/stress-test.mjs',
  'src/app/layout.jsx',
  'src/app/page.jsx',
  'src/app/about/page.jsx',
  'src/app/admin/dashboard/page.jsx',
  'src/app/api/orders/archive/route.js',
  'src/app/api/upload/route.js',
  'src/app/calendars/page.jsx',
  'src/components/admin/BranchManager.jsx',
  'src/components/cart/FloatingWhatsAppButton.jsx',
  'src/components/effects/FestiveBackgroundPattern.jsx',
  'src/components/layout/Footer.jsx',
  'src/components/layout/Navbar.jsx',
  'src/context/CartContext.jsx',
  'src/context/SettingsContext.jsx',
  'src/lib/auth.js',
  'src/lib/constants.js'
];

const replacements = [
  // Exact phrase replacements to ensure perfect case preservation
  ['Shri Rajeshwari Crackers', 'Sri Rajeshwari Crackers'],
  ['Shree Rajeshwari Crackers', 'Sri Rajeshwari Crackers'],
  ['SHRI RAJESHWARI CRACKERS', 'SRI RAJESHWARI CRACKERS'],
  ['SHREE RAJESHWARI CRACKERS', 'SRI RAJESHWARI CRACKERS'],
  ['Shri Rajeshwari Press', 'Sri Rajeshwari Press'],
  ['Shree Rajeshwari Press', 'Sri Rajeshwari Press'],
  ['SHRI RAJESHWARI CALENDARS', 'SRI RAJESHWARI CALENDARS'],
  ['SHRI RAJESHWARI', 'SRI RAJESHWARI'],
  ['SHREE RAJESHWARI', 'SRI RAJESHWARI'],
  ['Shri Rajeshwari', 'Sri Rajeshwari'],
  ['Shree Rajeshwari', 'Sri Rajeshwari'],
  ['shri_rajeshwari', 'sri_rajeshwari'],
  ['shri-rajeshwari', 'sri-rajeshwari'],
  ['shree_rajeshwari', 'sri_rajeshwari'],
  ['shree-rajeshwari', 'sri-rajeshwari'],
  ['Shri_Rajeshwari', 'Sri_Rajeshwari'],
  ['Shree_Rajeshwari', 'Sri_Rajeshwari']
];

let totalChanges = 0;

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing file: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  // In CartContext.jsx, ensure backwards compatibility when reading localStorage:
  if (relPath === 'src/context/CartContext.jsx') {
    content = content.replace(
      "const stored = localStorage.getItem('shri_rajeshwari_cart') || localStorage.getItem('sachin_pyrotech_cart');",
      "const stored = localStorage.getItem('sri_rajeshwari_cart') || localStorage.getItem('shri_rajeshwari_cart') || localStorage.getItem('sachin_pyrotech_cart');"
    );
    content = content.replace(
      "localStorage.setItem('shri_rajeshwari_cart', JSON.stringify(cartItems));",
      "localStorage.setItem('sri_rajeshwari_cart', JSON.stringify(cartItems));"
    );
  }

  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${relPath}`);
    totalChanges++;
  } else {
    console.log(`No changes needed in: ${relPath}`);
  }
}

console.log(`Done! Updated ${totalChanges} files.`);
