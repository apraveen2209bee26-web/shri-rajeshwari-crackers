'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Moon, 
  Gift, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Award, 
  Truck, 
  ShoppingBag, 
  Plus, 
  Minus,
  Percent,
  Zap,
  Phone,
  FileDown
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { settings, whatsappUrl, whatsappDisplay, secondaryPhoneDisplay, cleanSecPhone } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        if (data.success && data.products) {
          setFeaturedProducts(data.products.slice(0, 8));
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const triggerConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Soft Decorative festive glow rings */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-300/70 text-amber-900 text-xs font-black shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>DIWALI CELEBRATION SALE • DIRECT FROM SIVAKASI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Light Up Your Festivals With{' '}
                <span className="bg-gradient-to-r from-sky-700 via-sky-600 to-amber-500 bg-clip-text text-transparent">
                  {STORE_CONFIG.name}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {STORE_CONFIG.tamilName} • Direct factory manufacturing outlet at {STORE_CONFIG.address}. Enjoy verified green crackers, aerial multi-shots, dazzling fountains & curated gift boxes with a <strong className="text-sky-900 font-extrabold">Flat 80% Mega Discount</strong>.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/shop"
                  onClick={triggerConfetti}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 hover:from-sky-700 hover:to-indigo-900 text-white font-extrabold text-sm shadow-xl shadow-sky-600/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Cracker Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/quick-order"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-sky-950 font-bold text-sm shadow-md border border-sky-200/80 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Quick Order (Spreadsheet)</span>
                </Link>

                <Link
                  href="/price-list"
                  className="px-4 py-3.5 rounded-xl text-slate-700 hover:text-sky-800 hover:bg-sky-100/50 font-semibold text-sm transition-all flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4 text-sky-600" />
                  <span>Price List</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sky-100 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-sky-900">80% OFF</p>
                  <p className="text-[11px] text-slate-500 font-medium">Flat Mega Savings</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-amber-600">139+</p>
                  <p className="text-[11px] text-slate-500 font-medium">Available Crackers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">100%</p>
                  <p className="text-[11px] text-slate-500 font-medium">Safe & Green PESO</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden glass-card p-3 shadow-2xl border-2 border-white">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src="/images/banner.jpeg"
                    alt="Shri Rajeshwari Crackers Diwali Celebration Sivakasi"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  {/* Floating 80% Off Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-sky-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow-lg flex items-center gap-1 animate-sparkle-float">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>80% MEGA DISCOUNT</span>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                      Authentic Sivakasi Pyrotechnics
                    </span>
                    <h3 className="text-lg font-black leading-tight">
                      Grand Festive Collections
                    </h3>
                    <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                      Sparklers, Rockets, Multi-Shots, Ground Chakkars & Luxury Gift Hampers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE CATEGORY BANNER CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full">
            Explore By Celebration Time
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Featured Celebration Categories
          </h2>
          <p className="text-sm text-slate-600">
            Choose your festive vibe — vibrant daytime sounds, breathtaking night sky bursts, or all-in-one family gift hampers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Daylight Crackers -> Redirects to /shop?category=Daylight */}
          <Link
            href="/shop?category=Daylight"
            className="group relative rounded-3xl overflow-hidden glass-card border border-sky-200/80 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Sun className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  Daytime Spark & Sound
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-amber-600 transition-colors">
                  Daylight Crackers
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Electric & Color Sparklers, Ground Chakkars, Bijili loose crackers, Marriage Garlands & One Sound Kuruvies.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>View Daylight Catalog (52+ Items)</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-200/20 rounded-full blur-2xl group-hover:bg-amber-300/30 transition-colors -z-0" />
          </Link>

          {/* Card 2: Nightlight Crackers -> Redirects to /shop?category=Nightlight */}
          <Link
            href="/shop?category=Nightlight"
            className="group relative rounded-3xl overflow-hidden glass-card border border-indigo-200/80 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Moon className="w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  Sky Illuminations
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
                  Nightlight Crackers
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Multi-colour 7 to 240 Shots, Flower Pots, Peacock Fountains, Aerial Rockets, Bombs & Mega Sky Shows.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>View Nightlight Catalog (80+ Items)</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-indigo-200/20 rounded-full blur-2xl group-hover:bg-indigo-300/30 transition-colors -z-0" />
          </Link>

          {/* Card 3: Gift Boxes -> Redirects to /shop (NO filters, displays complete catalog) */}
          <Link
            href="/shop"
            className="group relative rounded-3xl overflow-hidden glass-card border border-sky-300/80 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Gift className="w-8 h-8 text-sky-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                  Complete Catalog & Combos
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-sky-600 transition-colors">
                  Gift Boxes
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Family Celebration Hampers from 20 Items to 60 Items VIP Deluxe Combos. Plus browse all 139 crackers in one place!
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>View Complete Catalog (All 139 Items)</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-sky-200/20 rounded-full blur-2xl group-hover:bg-sky-300/30 transition-colors -z-0" />
          </Link>
        </div>
      </section>

      {/* 3. BESTSELLER FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/60 px-3 py-1 rounded-full">
              Crowd Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top Diwali Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 hover:underline"
          >
            <span>View All 139 Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => {
              const qty = getItemQuantity(product.id);
              return (
                <div
                  key={product.id}
                  className="glass-card rounded-2xl overflow-hidden p-3 flex flex-col justify-between group"
                >
                  {/* Photo & Badges */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={product.image || '/images/illustration-diwali-crackers.avif'}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      80% OFF
                    </div>
                    <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {product.unit}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-bold text-sky-700 tracking-wide uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.tamilName && (
                      <p className="text-[11px] text-slate-500 truncate">{product.tamilName}</p>
                    )}

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-sky-900">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold ${product.inStock && product.stock > 0 ? (product.stock < 20 ? 'text-amber-600' : 'text-emerald-700') : 'text-rose-600'}`}>
                        {product.inStock && product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Add To Cart / Counter */}
                  <div>
                    {!product.inStock || product.stock <= 0 ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between border-2 border-sky-500 rounded-xl bg-sky-50 p-1">
                        <button
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-7 h-7 rounded-lg bg-white shadow-xs text-sky-800 flex items-center justify-center hover:bg-sky-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-sky-950 px-2">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, qty + 1)}
                          className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. OFFICIAL VISITING CARD & SIVAKASI HEADQUARTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-amber-50 via-sky-50 to-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200/80 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visiting card image container */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/60 transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/images/visiting-card.jpg"
                  alt="Shri Rajeshwari Crackers Official Visiting Card"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <span>24/7 SIVAKASI DIRECT</span>
                </div>
              </div>
            </div>

            {/* Details beside visiting card */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                <span>ஸ்ரீ முருகன் துணை • OFFICIAL VISITING CARD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {STORE_CONFIG.name}
                <span className="block text-sky-800 text-lg sm:text-xl font-tamil mt-1 font-bold">
                  {STORE_CONFIG.tamilName}
                </span>
              </h2>
              <p className="text-sm font-semibold text-amber-950 bg-amber-100/60 p-3 rounded-xl border border-amber-300/60 font-tamil leading-relaxed">
                எங்களிடம் அனைத்து வித பட்டாசுகளும் தரமானதாகவும் விலை குறைவாகவும் கிடைக்கும்
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <strong className="text-slate-900">📍 முகவரி / Address:</strong>
                  <span>{STORE_CONFIG.address}</span>
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <strong className="text-slate-900">☎️ 24/7 தொடர்புக்கு / Call:</strong>
                  <a href={`tel:${cleanSecPhone}`} className="font-bold text-sky-800 hover:underline">{secondaryPhoneDisplay}</a>
                  <span>/</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-sky-800 hover:underline">{whatsappDisplay}</a>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Order on WhatsApp ({whatsappDisplay})</span>
                </a>
                <a
                  href="/images/visiting-card.jpg"
                  download="Shri_Rajeshwari_Crackers_Card.jpg"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-sky-600" />
                  <span>Download Card</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE SHRI RAJESHWARI CRACKERS (SIVAKASI DIRECT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-sky-200/70 relative overflow-hidden">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Sivakasi Factory Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Thousands Trust {STORE_CONFIG.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We eliminate middlemen, wholesalers, and retail markups so you receive authentic festival fireworks safely packed directly from our Sivakasi manufacturing center at {STORE_CONFIG.address}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-white">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Flat 80% Mega Discount</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct manufacturing prices on 100% of our catalog without hidden charges.
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">PESO Green Certified</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Made with approved eco-friendly formulations ensuring safe smoke levels.
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-white">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">All-India Safe Transit</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Robust 5-ply waterproof corrugated carton packaging for zero transit damage.
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Direct WhatsApp Orders</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero payment gateway hassle. Verify packing, dispatch & billing via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAST WHATSAPP CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs font-black text-amber-400 tracking-widest uppercase">
              Need Bulk Or Custom Packs?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Connect Directly with {settings.shop_name}
            </h2>
            <p className="text-xs sm:text-sm text-sky-200 max-w-xl">
              Have questions about customized marriage series, corporate gifting boxes, or urgent Sivakasi dispatch? Chat with us instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {whatsappDisplay}</span>
            </a>
            <Link
              href="/quick-order"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Quick Order Form</span>
            </Link>
          </div>

          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
