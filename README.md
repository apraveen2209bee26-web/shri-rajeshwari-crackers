# 💥 SRI RAJESHWARI CRACKERS (ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ்) - Modern E-Commerce Platform

> **"Light Up Your Celebrations with Sivakasi's Finest Fireworks"** • Authentic Sivakasi Direct Factory Outlet • **Flat 80% Mega Discount**  
> Direct Phone & WhatsApp Order Desk: **+91 9361849171** / **+91 8610260462**  
> Store Address: **12/291/1 Rathnapuri Nagar, Sivakasi - 626123**  
> Live Production URL: **[https://sri-rajeshwari-crackers.vercel.app](https://sri-rajeshwari-crackers.vercel.app)**

A state-of-the-art, high-performance, multi-platform e-commerce web application optimized for Laptops, Tablets, and Mobile. Built using **Next.js (App Router)**, **Tailwind CSS**, and **Prisma ORM** connected to a **Serverless Cloud PostgreSQL (Neon on AWS)**, deployed on **Vercel Hobby Tier** with zero hosting and database costs (100% Free Forever).

---

## 🌟 Key Features

### 1. Modern Festive Design & UI/UX Architecture
- **Curated Color Palette**: Festive sky blue (`#0284C7`), cyan gradients, and crisp white panels, accented with Diwali gold (`#F59E0B`, `#D97706`), emerald green, and midnight slate.
- **Glassmorphism Panels**: Blur-backed floating navigation, translucent cracker cards with interactive hover steppers.
- **Micro-Animations**: Celebration confetti, live sparkler particle effects, and animated banner notifications.
- **Optimized Caching & Speed**: Sub-100ms API response times with in-memory caching and connection pooling.

### 2. Public Pages & Dynamic Navigation Flow
1. **Home Page (`/`)**:
   - Hero banner with festive headline, countdown badges, and Sivakasi direct pricing pledge.
   - **Three Prominent Category Cards**:
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
   - The Sri Rajeshwari Crackers heritage, Sivakasi craftsmanship, PESO green cracker formulations, and transparent 80% discount model.

### 3. Shopping Cart & Direct WhatsApp Checkout
- **Slide-out Cart Drawer**:
  * Itemized breakdown with thumbnails, units, quantities, and individual subtotals.
  * Real-time savings calculations (Total MRP vs. 80% Discounted Net Total).
- **Persistent Floating Cart Button**:
  * Persistent button at bottom-right corner across Shop and Quick Order pages displaying live item count and net amount.
- **Multi-Step Checkout Form**:
  * Captures Customer Name, WhatsApp Number, Delivery Address, City, Pincode, Preferred Delivery Date, and Special Notes.
- **Automated WhatsApp Order Dispatch**:
  * Serializes cart items into a beautifully formatted WhatsApp text message with order summary, customer details, and total savings.
  * Automatically records order to database with collision-proof Order Reference (e.g., `#SR-4856-C95B8A`).
  * Decrements product inventory automatically.

### 4. Administrative Control Center (`/admin/dashboard`)
- Password-protected layout (login at `/admin/login`).
- **Default Credentials**:
  * Username: `admin`
  * Password: `rajeshwari123`
- **Product Inventory Management (CRUD)**:
  * Add new crackers with instant photo preview.
  * Real-time inline edit and stock status toggle (In Stock / Out of Stock).
  * 1-click delete with instant cache invalidation.
- **Customer WhatsApp Orders Tracking**:
  * **Search & Filter**: Real-time search by Customer Mobile Number (e.g. `9163697...`), Order Reference (`#SR-...`), Customer Name, or City.
  * **Pagination**: Clean 10 orders per page view with page numbers, Previous/Next navigation, and total order counts.
  * **CSV Export**: One-click download of all customer orders in Excel/CSV format for bookkeeping.
  * **Annual Cleanup**: Safely purge orders after festival season backup to keep database permanently clean and within the 100% free tier.
- **Dynamic WhatsApp Routing & Store Settings**:
  * Update primary WhatsApp number, secondary phone, and shop address directly from the dashboard without touching code or redeploying.

---

## ☁️ 100% Free Forever Cloud Architecture

| Component | Platform | Free Tier Specifications | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Frontend & API** | **Vercel** (Hobby) | Unlimited deploys, fast CDN, serverless execution | **₹0 (Free)** |
| **Relational Database** | **Neon PostgreSQL** (AWS) | 500 MB storage, connection pooling, high-speed queries | **₹0 (Free)** |
| **Product Media** | **Cloudinary** | 25 GB monthly media bandwidth & transformations | **₹0 (Free)** |
| **Total Cost** | | | **₹0 / Month** |

> 💡 **Storage Capacity Insight**: 139 cracker catalog items take ~1.5 MB of database storage. Each customer order record consumes ~1 KB. This means the 500 MB free tier easily supports **over 450,000+ orders** before requiring an annual CSV backup cleanup.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Database ORM**: Prisma 5.22
- **Database Engine**: Serverless PostgreSQL (Neon AWS us-east-2)
- **Deployment**: Vercel Serverless Platform
- **Version Control**: Git & GitHub
