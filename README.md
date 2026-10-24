# 💥 SACHIN PYROTECH - Modern E-Commerce Platform

> **"Light Up the Celebration"** • Authentic Sivakasi Fireworks Direct Factory Outlet • **Flat 80% Mega Discount**  
> Direct Phone & WhatsApp Order Desk: **+91 9361849171**

A state-of-the-art, high-performance, multi-platform e-commerce web application optimized for Laptops, Tablets, and Mobile. Built using **Next.js (App Router)**, **Tailwind CSS**, and **Prisma ORM** (configured for local SQLite zero-config running and permanent free-tier deployment on **Vercel/Netlify** + **Neon/Supabase PostgreSQL**).

---

## 🌟 Key Features

### 1. Modern Festive Design & UI/UX Architecture
- **Curated Color Palette**: Base theme of light blue (`#E3F2FD`, `#B3E5FC`) fading seamlessly into crisp white gradients (`#FFFFFF`), accented with metallic gold (`#F59E0B`, `#D97706`), soft amber, and midnight blue highlights.
- **Glassmorphism Panels**: Blur-backed floating navigation, translucent product cards with interactive hover states.
- **Particle Sparkler & Fireworks Animation**: CSS sparkler particles on hover and celebration confetti triggers.
- **Skeleton Loaders & Lazy-Loading**: Optimized loading skeletons for fast perceived load times.

### 2. Public Pages & Dynamic Navigation Flow
1. **Home Page (`/`)**:
   - Hero banner with festive headline, countdown badges, and Sivakasi direct pricing pledge.
   - **Three Prominent Category Cards** (inspired by sparkstarcrackers.com & skmsparkhub.in):
     * **"Daylight Crackers"**: Redirects to `/shop?category=Daylight` with the Daylight filter pre-applied.
     * **"Nightlight Crackers"**: Redirects to `/shop?category=Nightlight` with the Nightlight filter pre-applied.
     * **"Gift Boxes"**: Redirects to `/shop` with NO filters applied (displays the complete catalog).
   - Top Bestsellers showcase with interactive counter widgets.
   - Factory advantage breakdown (80% direct discount, green PESO certification, all-India dispatch).
2. **Shop Catalog Page (`/shop`)**:
   - Top/side filter accordions:
     * Macro Category: All, Daylight Crackers, Nightlight Crackers, Gift Boxes.
     * Subcategories: One Sound, Sparklers, Ground Chakkar, Flower Pots, Bombs, Paper Bombs, Rockets, Marriage Series, Deluxe Crackers, Twinkling Star, Fountains, Fancy Pipe Out, Night Marvels, Multi Colour Shots, Mega Sky Show, Loose Crackers, Candle & Matches, Gift Boxes.
     * Price range slider, Discount filter, and In-Stock toggle.
     * Dual-language search (English and Tamil names, e.g. "Kuruvi" or "குருவி").
     * Product cards with photo, English & Tamil name, unit badge, MRP strikethrough, 80% off net price, stock status, and interactive Add to Cart stepper.
3. **Quick Order Spreadsheet (`/quick-order`)**:
   - Tabular spreadsheet matrix organized sequentially by category.
   - Rapid keypad input or stepper buttons (`-` `qty` `+`).
   - Sticky category jump bar and persistent bottom calculation tray (Total Items, Total MRP, 80% Mega Savings, and Net Payable).
4. **Safety Tips Page (`/safety-tips`)**:
   - Interactive Do's and Don'ts accordions.
   - Custom SVG safety iconography matching the light blue theme.
   - Emergency helpline contacts (Fire 101, Ambulance 108, Police 112).
5. **Print-Friendly Price List (`/price-list`)**:
   - Dynamic table pulling all 139 products live from the database.
   - Print / Save as PDF button formatted with `@media print` clean invoice styling.
6. **About Us Page (`/about`)**:
   - The Sachin Pyrotech heritage, Sivakasi craftsmanship, PESO green cracker formulations, and transparent 80% discount model.

### 3. Shopping Cart & WhatsApp Checkout (Zero Payment Gateway)
- **Slide-out Cart Drawer**:
  * Itemized breakdown with thumbnails, units, quantities, and individual subtotals.
  * Real-time savings calculations (Total MRP vs. 80% Discounted Net Total).
- **Persistent Floating Cart Button**:
  * Persistent button at bottom-right corner across Shop and Quick Order pages displaying live item count and net amount.
- **Multi-Step Checkout Form**:
  * Captures Customer Name, WhatsApp Number, Delivery Address, City, Pincode, Preferred Delivery Date, and Special Notes.
- **Human-Readable WhatsApp Receipt Serialization**:
  * Instead of a payment gateway, serializes the cart into a structured, human-readable WhatsApp message and redirects to:  
    `https://wa.me/919361849171?text=<ENCODED_RECEIPT_STRING>`
  * Order is simultaneously saved into the database (`Order` model) for admin tracking.

### 4. Secure Admin Dashboard (`/admin/dashboard`)
- Password-protected layout (login at `/admin/login`).
- **Default Credentials**:
  * Username: `admin`
  * Password: `sachinadmin123`
- **Full CRUD Capabilities**:
  * Create new cracker listings.
  * Edit existing products (Name, Tamil Name, Category, Timing, Unit, MRP, Net Selling Price, Stock, Image).
  * Delete products.
  * One-click In Stock / Out of Stock status toggle.
  * **Live State Synchronization**: Any change immediately updates database layers and reflects on the User Shop, Quick Order spreadsheet, and Price List view without manual system rebuilds.
  * Review customer WhatsApp order submissions.

---

## 📂 Project Architecture

```text
crackershop/
├── prisma/
│   ├── schema.prisma         # Prisma ORM schema (SQLite locally, Postgres for Cloud)
│   ├── seedData.js           # 139 Official products from Sachin Pyrotech price list
│   └── seed.js               # Database population & settings script
├── public/
│   └── images/               # Branded cracker assets, illustrations, and banners
├── src/
│   ├── app/
│   │   ├── layout.jsx        # Root Layout with CartProvider, Nav, CartDrawer, Modals
│   │   ├── globals.css       # Festive light blue gradient & glassmorphism styles
│   │   ├── page.jsx          # Home Page (3 Category cards, Hero, Bestsellers)
│   │   ├── shop/page.jsx     # Shop Catalog with sidebar filters
│   │   ├── quick-order/      # Spreadsheet bulk order layout
│   │   ├── safety-tips/      # Safety Do's and Don'ts with custom SVG icons
│   │   ├── price-list/       # Dynamic printable price table
│   │   ├── about/            # Sachin Pyrotech Sivakasi story
│   │   ├── admin/
│   │   │   ├── login/        # Admin Authentication
│   │   │   └── dashboard/    # Administrative CRUD Control Center
│   │   └── api/
│   │       ├── products/     # Products List & Create API
│   │       ├── products/[id]/# Single Product GET, PUT, DELETE API
│   │       ├── orders/       # Order tracking API
│   │       └── admin/        # Admin login/logout/session API
│   ├── components/
│   │   ├── layout/           # Navbar, Footer
│   │   └── cart/             # CartDrawer, CheckoutModal, FloatingCartButton
│   ├── context/
│   │   └── CartContext.jsx   # Global cart state with localStorage persistence
│   └── lib/
│       ├── prisma.js         # Prisma singleton with connection pooling guard
│       └── constants.js      # Store info, categories, and WhatsApp receipt serializer
├── .env.local                # Local environment configuration
├── .env.example              # Free-tier template for Vercel/Netlify deployment
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Festive theme colors & animations
└── package.json
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Seed Products
```bash
# Push schema to SQLite database and populate all 139 products
npx prisma db push
node prisma/seed.js
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ☁️ 100% Free-Tier Deployment (Vercel / Netlify + Supabase / Neon)

The application is engineered to operate completely free of cost with zero upkeep expenses:

1. **Frontend + Backend API**: Next.js App Router bundles UI and API routes into a single deployment on **Vercel Hobby Tier** or **Netlify Starter Tier** (100% free).
2. **Relational Database**:
   - Create a free project on **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)** (permanent free tier).
   - In `prisma/schema.prisma`, update provider to `postgresql`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - In your Vercel/Netlify Environment Variables, set `DATABASE_URL` with the pooled connection string (`pgbouncer=true` or pooler port 6543) to stay within free connection limits.
   - Run `npx prisma db push && node prisma/seed.js` to seed the cloud database.
3. **Environment Variables**:
   Copy the values from `.env.example` into your Vercel or Netlify project dashboard:
   - `DATABASE_URL`: Connection string to Supabase/Neon PostgreSQL.
   - `NEXT_PUBLIC_SHOP_NAME`: `SACHIN PYROTECH`
   - `NEXT_PUBLIC_SHOP_PHONE`: `9361849171`
   - `NEXT_PUBLIC_SHOP_WHATSAPP`: `9361849171`
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Your chosen secure admin password
   - `ADMIN_SESSION_SECRET`: Random 32-character string
