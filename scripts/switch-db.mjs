import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const target = process.argv[2]?.toLowerCase();

if (target !== 'postgres' && target !== 'postgresql' && target !== 'sqlite') {
  console.log(`
ℹ️  Usage: node scripts/switch-db.mjs [postgres|sqlite]

Examples:
  node scripts/switch-db.mjs postgres   # Switches prisma/schema.prisma to PostgreSQL (for Vercel/Supabase/Neon)
  node scripts/switch-db.mjs sqlite     # Switches prisma/schema.prisma to SQLite (for local development)
`);
  process.exit(1);
}

const isPostgres = target === 'postgres' || target === 'postgresql';
const sourceFile = isPostgres 
  ? path.join(rootDir, 'prisma', 'schema.postgresql.prisma') 
  : path.join(rootDir, 'prisma', 'schema.sqlite.prisma');

const targetFile = path.join(rootDir, 'prisma', 'schema.prisma');

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Source template not found: ${sourceFile}`);
  process.exit(1);
}

fs.copyFileSync(sourceFile, targetFile);

console.log(`
======================================================
✅ Switched database provider to: ${isPostgres ? 'PostgreSQL (Cloud / Supabase / Neon)' : 'SQLite (Local dev.db)'}
======================================================
Next steps:
${isPostgres ? `
1. Ensure your DATABASE_URL in .env is your PostgreSQL string (e.g. from Supabase / Neon):
   DATABASE_URL="postgresql://user:password@host/db"
2. Run Prisma push to sync database tables:
   npx prisma db push
3. Seed products to your cloud database:
   npm run prisma:seed
4. Deploy to Vercel!` : `
1. Ensure DATABASE_URL in .env is:
   DATABASE_URL="file:./dev.db"
2. Run: npx prisma generate
`}
`);
