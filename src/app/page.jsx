'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FileDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Calendar,
  Printer
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG } from '@/lib/constants';
import FireworksBurstCanvas from '@/components/effects/FireworksBurstCanvas';
import FestiveBackgroundPattern from '@/components/effects/FestiveBackgroundPattern';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { settings, whatsappUrl, whatsappDisplay, secondaryPhoneDisplay, cleanSecPhone } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  // Moving Banner Slides within the Hero Banner (Blue, Gold, Black, White theme)
  const heroSlides = [
    {
      id: 1,
      badge: 'FESTIVAL SPECIAL',
      title: 'Mega Combo Value Packs!',
      subtitle: 'Flat 80% OFF • 50 to 62 Fireworks Items in 1 Grand Pack',
      image: '/images/alltype.jpeg',
      linkText: 'Explore Combos',
      linkUrl: '/combo-offers',
      color: 'from-amber-400 to-yellow-500'
    },
    {
      id: 2,
      badge: 'DIRECT FACTORY RATE',
      title: '139+ Authentic Sivakasi Crackers',
      subtitle: '100% CSIR-NEERI & PESO Green Certified Fireworks',
      image: '/images/banner.jpeg',
      linkText: 'Shop Catalog',
      linkUrl: '/shop',
      color: 'from-sky-500 to-blue-700'
    },
    {
      id: 3,
      badge: 'FAST DISPATCH',
      title: 'Rapid Bulk Order Spreadsheet',
      subtitle: 'Swift keypad entry for families, marriages & communities',
      image: '/images/sakkaram.jpeg',
      linkText: 'Quick Order Now',
      linkUrl: '/quick-order',
      color: 'from-blue-600 to-sky-700'
    },
    {
      id: 4,
      badge: 'DIRECT FACTORY',
      title: 'Sivakasi Premium Calendars',
      subtitle: 'Tear-Off Daily Slips, Spiral Wall & Poster Planners',
      image: '/images/calendars/daily-slip-calendar.jpg',
      linkText: 'View Calendars',
      linkUrl: '/calendars',
      color: 'from-emerald-500 to-teal-700'
    }
  ];

  // Auto-rotate hero slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/shop?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Authentic Sivakasi Pyrotechnic Watermark & Atmospheric Glow */}
      <FestiveBackgroundPattern theme="blue" />

      {/* 1. SEAMLESS TOP FESTIVAL HEADER WRAPPER (Zero gaps, Mobile-Optimized Flush Display) */}
      <div className="w-full relative z-10">
        {/* FESTIVE TICKER BANNER (Continuous Infinite Right-to-Left Loop with Spacing Before Photo) */}
        <div className="w-full bg-gradient-to-r from-slate-950 via-[#0a2540] to-slate-950 text-white text-xs py-2.5 px-3 overflow-hidden border-b border-sky-500/30 shadow-md mb-3 sm:mb-4 marquee-container">
          <div className="flex items-center overflow-hidden select-none">
            {/* Continuous Track 1 */}
            <div className="animate-marquee-track flex items-center gap-6 pr-6 font-bold tracking-wide">
              <span className="flex items-center gap-1.5 text-amber-300">
                உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள்! 🪔✨
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-white">
                சிவகாசி ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் • நேரடி தொழிற்சாலை தள்ளுபடி 80%
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-amber-300">
                💥 100% Genuine PESO Certified Green Crackers • Safe All-India Transport
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-white">
                🎁 Mega Combo Packs Available • Save up to ₹19,900!
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள்! 🪔✨
              </span>
              <span className="text-sky-300/60">•</span>
            </div>

            {/* Continuous Track 2 (Seamless Infinite Looping Clone) */}
            <div className="animate-marquee-track flex items-center gap-6 pr-6 font-bold tracking-wide" aria-hidden="true">
              <span className="flex items-center gap-1.5 text-amber-300">
                உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள்! 🪔✨
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-white">
                சிவகாசி ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் • நேரடி தொழிற்சாலை தள்ளுபடி 80%
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-amber-300">
                💥 100% Genuine PESO Certified Green Crackers • Safe All-India Transport
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="text-white">
                🎁 Mega Combo Packs Available • Save up to ₹19,900!
              </span>
              <span className="text-sky-300/60">•</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள்! 🪔✨
              </span>
              <span className="text-sky-300/60">•</span>
            </div>
          </div>
        </div>

        {/* RESPONSIVE FESTIVAL PROMOTIONAL SHOWCASE BANNER (Edge-to-Edge with Mobile Portrait Optimization) */}
        <div className="w-full relative overflow-hidden bg-[#030a17] border-b-2 border-amber-500/50 shadow-2xl">
          <picture className="w-full block">
            {/* Desktop & Tablet Screen: Landscape Panoramic Banner */}
            <source 
              media="(min-width: 640px)" 
              srcSet="/images/home-festival-banner.jpg" 
            />
            {/* Mobile Smartphones: Dedicated 3:4 Vertical High-Impact Portrait Banner */}
            <img 
              src="/images/home-festival-banner-mobile.jpg" 
              alt="Shree Rajeshwari Crackers - 80% Off Festival Celebration"
              className="w-full h-auto object-cover block shadow-2xl"
            />
          </picture>
        </div>
      </div>

      {/* MAIN CONTENT SECTIONS */}
      <div className="space-y-12 sm:space-y-16">


      {/* 2. FESTIVE HERO SECTION WITH SKY BLUE ATMOSPHERE & BURSTING SKY CRACKERS (From Screenshot 4) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#051329] via-[#092548] to-[#0284c7] text-white py-12 md:py-20 px-4 sm:px-6 shadow-2xl">
        {/* Subtle Background Cracker Image Silhouette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 filter brightness-90 contrast-125 pointer-events-none transition-transform duration-1000 mix-blend-overlay"
          style={{ backgroundImage: `url('/images/banner.jpeg')` }}
        />
        
        {/* Light Blue Atmosphere & Radial Glow Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.30)_0%,rgba(14,116,144,0.18)_45%,rgba(5,19,41,0.85)_100%)] pointer-events-none" />

        {/* Dynamic Light Blue Horizon Beam */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-sky-400/25 blur-3xl rounded-full pointer-events-none" />

        {/* REAL-TIME BURSTING SKY CRACKERS (HTML5 Canvas Particles & Rockets) */}
        <FireworksBurstCanvas />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column: Headline, Search Box & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Gold 100% Satisfaction Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/60 text-amber-300 text-xs font-black shadow-lg backdrop-blur-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span>100% Satisfaction Guaranteed • Direct Sivakasi Outlet</span>
              </div>

              {/* Blue, Golden, Black & White Headline (Refined per User Request) */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] drop-shadow-xl">
                  <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Quality Crackers &amp;</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-black drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]">
                    Genuine Price
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-bold text-sky-100 tracking-wide drop-shadow">
                  {settings.shop_name} • தரமான பட்டாசுகள் குறைந்த விலையில்!
                </p>
              </div>

              <p className="text-xs sm:text-base text-slate-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
                Authentic Sivakasi direct factory outlet. Premium aerial repeating shots, sparkling fountains, sound crackers, and curated celebration combo packs at a <strong className="text-amber-300 font-black underline decoration-amber-400/60 underline-offset-4">Flat 80% Mega Discount</strong>.
              </p>

              {/* SEARCH BOX FOR CRACKERS (Crisp White & Golden Border) */}
              <form 
                onSubmit={handleHeroSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 bg-white rounded-full p-1.5 sm:p-2 shadow-2xl flex items-center border-2 border-amber-400 focus-within:ring-4 focus-within:ring-sky-400/40 transition-all"
              >
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search for crackers (e.g. kuruvi, 12 shot, flower pot)..."
                  className="flex-1 px-4 py-2 text-xs sm:text-sm text-slate-900 rounded-full focus:outline-none placeholder-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-sky-600 via-blue-700 to-sky-800 hover:from-sky-500 hover:to-blue-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 border border-sky-400/30"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>

              {/* ACTION BUTTONS (Golden "Order Now!" & Blue "Combo Offers") */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                {/* 1. Golden Order Now Button */}
                <Link
                  href="/quick-order"
                  onClick={triggerConfetti}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/30 active:scale-95 transition-all flex items-center gap-2 border border-white/50"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Order Now!</span>
                </Link>

                {/* 2. Royal Blue Combo Offers Button */}
                <Link
                  href="/combo-offers"
                  className="px-5 py-3.5 rounded-full bg-sky-600/90 hover:bg-sky-500 text-white font-black text-sm shadow-xl shadow-sky-600/30 border-2 border-amber-400 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Combo Offers 🔥</span>
                </Link>

                {/* 3. WhatsApp Direct Connect */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-colors border border-emerald-400/40"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: {whatsappDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Hero Column: MOVING SLIDER BANNER (Blue, Golden, Black & White) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden bg-slate-950/85 border-2 border-amber-400 shadow-2xl shadow-sky-950/60 backdrop-blur-md p-3 group">
                {/* Moving Banner Slide Item */}
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={heroSlides[activeSlide].image}
                    alt={heroSlides[activeSlide].title}
                    className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md shadow-md">
                    {heroSlides[activeSlide].badge}
                  </div>

                  {/* Bottom Text & Button */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <h3 className="text-lg sm:text-xl font-black leading-tight text-white drop-shadow-md">
                      {heroSlides[activeSlide].title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1 font-medium">
                      {heroSlides[activeSlide].subtitle}
                    </p>
                    <Link
                      href={heroSlides[activeSlide].linkUrl}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-blue-700 to-sky-800 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-md transition-transform active:scale-95 border border-amber-400/50"
                    >
                      <span>{heroSlides[activeSlide].linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </Link>
                  </div>

                  {/* Prev / Next Slider Arrows (Golden & White) */}
                  <button
                    onClick={() => setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-400 border border-amber-400/40 flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-md"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-400 border border-amber-400/40 flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-md"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Slider Indicator Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-3">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === idx ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400/50' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE THREE CATEGORY BANNER CARDS */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Daylight Crackers
                </h3>
                <p className="text-xs font-bold text-sky-800">
                  பகலில் வெடிக்கும் பட்டாசுகள்
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sparklers, Ground Chakkars, Flower Pots, Single Sound, Bijili & Wedding Garlands.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-sky-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-600">52+ Varieties</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </Link>

          {/* Card 2: Nightlight Crackers -> Redirects to /shop?category=Nightlight */}
          <Link
            href="/shop?category=Nightlight"
            className="group relative rounded-3xl overflow-hidden glass-card border border-sky-200/80 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Moon className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  Night Sky Spectacular
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Nightlight Crackers
                </h3>
                <p className="text-xs font-bold text-sky-800">
                  இரவில் வெடிக்கும் வாணவேடிக்கைகள்
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aerial Repeating Sky Shots (7 to 240 Shots), Colour Fountains, Fancy Pipe Outs & Night Marvels.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-sky-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-600">80+ Varieties</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </Link>

          {/* Card 3: Combo Offers & Gift Boxes -> Redirects to /combo-offers */}
          <Link
            href="/combo-offers"
            className="group relative rounded-3xl overflow-hidden glass-card border border-rose-200 p-6 flex flex-col justify-between hover:shadow-2xl transition-all bg-gradient-to-br from-rose-50/40 via-white to-amber-50/40"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Gift className="w-8 h-8 text-rose-600 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                  Family All-In-One Packs
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Combo Offers & Boxes
                </h3>
                <p className="text-xs font-bold text-rose-800">
                  ஸ்பெஷல் மெகா காம்போ ஆஃபர்கள்
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ₹3,000 & ₹5,000 Mega Saver Bundles packed with 50 to 62 hand-picked family favorite fireworks.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-rose-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-600">Save up to 80%</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 group-hover:translate-x-1 transition-transform">
                <span>View Combo Packs</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </Link>

          {/* Card 4: Sivakasi Calendars -> Redirects to /calendars */}
          <Link
            href="/calendars"
            className="group relative rounded-3xl overflow-hidden glass-card border border-emerald-300/80 p-6 flex flex-col justify-between hover:shadow-2xl transition-all bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  Direct Press Quality
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Sivakasi Calendars
                </h3>
                <p className="text-xs font-bold text-emerald-800">
                  தினசரி &amp; மாத காலண்டர்கள்
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Daily Tear-Off Slips, 12-Month Spiral Wall &amp; Single-Sheet Poster Planners on 130-300 GSM art paper.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-700">Combined Cart</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>View Calendars</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. FEATURED BESTSELLERS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-full">
              Sivakasi Top Bestsellers
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Popular Celebration Crackers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline"
          >
            <span>Explore All 139 Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => {
              const qty = getItemQuantity(product.id);
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl glass-card overflow-hidden border border-sky-100/80 p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={product.image || '/images/illustration-diwali-crackers.avif'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        80% OFF
                      </span>
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                        #{product.sNo}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-sky-700 transition-colors">
                        {product.name}
                      </h4>
                      {product.tamilName && (
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {product.tamilName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-sky-100/70 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 line-through mr-1">
                          ₹{product.originalPrice}
                        </span>
                        <strong className="text-base font-black text-slate-900">
                          ₹{product.price}
                        </strong>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {product.unit}
                      </span>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-sky-100 shadow-sm text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-sky-950 px-2">{qty}</span>
                        <button
                          onClick={() => updateQuantity(product.id, qty + 1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-sky-100 shadow-sm text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. VISITING CARD & FACTORY PLEDGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xl bg-gradient-to-r from-sky-50/50 via-white to-amber-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFICIAL FACTORY CERTIFIED</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Direct Sivakasi Factory Advantage
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {settings.shop_name} guarantees 100% genuine pyrotechnics directly dispatched from our Sivakasi premises. We ensure safety-tested fuses, water-resistant packaging, and clear price transparency.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
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
                  <span>Download Visiting Card</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl max-w-xs w-full bg-slate-950 p-1.5">
                <img
                  src="/images/visiting-card.jpg"
                  alt="Visiting Card"
                  className="w-full h-auto rounded-xl object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Ready For Celebrations?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Connect Directly with {settings.shop_name}
            </h2>
            <p className="text-xs sm:text-sm text-sky-200">
              Have questions about customized marriage series, corporate gifting boxes, or urgent Sivakasi dispatch? Chat with us instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
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
              href="/combo-offers"
              className="px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Gift className="w-4 h-4 text-red-600" />
              <span>Combo Offers 🔥</span>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
